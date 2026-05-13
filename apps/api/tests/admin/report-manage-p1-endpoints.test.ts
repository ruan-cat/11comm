import { describe, expect, test, vi } from "vitest";

import { createAdminFeeAdapter } from "../../server/modules/fee/admin-adapter";
import { createDbFeeRepository, createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";

import ownerPaymentDetailsListHandler from "../../server/routes/api/property-manage/report-manage/owner-payment-details/list.post";
import repairReportFormListHandler from "../../server/routes/api/property-manage/report-manage/repair-report-form/list.post";
import repairReportsSummaryTableListHandler from "../../server/routes/api/property-manage/report-manage/repair-reports-summary-table/list.post";
import statementExpensesListHandler from "../../server/routes/api/property-manage/report-manage/statement-expenses/list.post";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

describe("report-manage P1 admin endpoints", () => {
	test("returns empty fallback PageDTO shapes for the four staged report endpoints", async () => {
		const service = createFeeService(createInMemoryFeeRepository());
		const admin = createAdminFeeAdapter(service);

		const responses = await Promise.all([
			admin.listOwnerPaymentDetails({ pageIndex: 2, pageSize: 7 }),
			admin.listRepairReportForm({ pageIndex: 2, pageSize: 7 }),
			admin.listRepairReportsSummaryTable({ pageIndex: 2, pageSize: 7 }),
			admin.listStatementExpenses({ pageIndex: 2, pageSize: 7 }),
		]);

		for (const response of responses) {
			expect(response).toMatchObject({
				success: true,
				code: 200,
				message: "查询成功",
				data: {
					list: [],
					total: 0,
					pageIndex: 2,
					pageSize: 7,
					totalPages: 0,
				},
			});
		}
	});

	test("routes pass trimmed request filters to the runtime admin adapter", async () => {
		const calls: Array<{ endpoint: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						listOwnerPaymentDetails: async (input: Record<string, unknown>) => recordCall(calls, "owner", input),
						listRepairReportForm: async (input: Record<string, unknown>) => recordCall(calls, "repair", input),
						listRepairReportsSummaryTable: async (input: Record<string, unknown>) =>
							recordCall(calls, "summary", input),
						listStatementExpenses: async (input: Record<string, unknown>) => recordCall(calls, "statement", input),
					},
				},
			},
		});

		process.env.DATABASE_URL = "postgres://example.invalid/report-manage-p1";

		mockedReadBody
			.mockResolvedValueOnce({
				page: 3,
				pageSize: 9,
				houseNumberContractName: " A-101 ",
				ownerName: " 张三 ",
				ownerPhone: " 138 ",
				feeCategory: " 物业费 ",
				feeItem: " 物业服务费 ",
				community: " 一期 ",
				year: " 2026 ",
			})
			.mockResolvedValueOnce({
				pageIndex: 4,
				pageSize: 8,
				repairType: " 水电 ",
				repairStatus: " processing ",
				urgencyLevel: " urgent ",
				reporter: " 李四 ",
				reporterPhone: " 139 ",
				community: " 二期 ",
				reportTimeStart: " 2026-01-01 ",
				reportTimeEnd: " 2026-01-31 ",
				feeStatus: " paid ",
			})
			.mockResolvedValueOnce({
				pageIndex: 5,
				pageSize: 6,
				repairType: " 门禁 ",
				repairStatus: " pending ",
				urgencyLevel: " normal ",
				community: " 三期 ",
				statisticsStartTime: " 2026-02-01 ",
				statisticsEndTime: " 2026-02-28 ",
			})
			.mockResolvedValueOnce({
				pageIndex: 6,
				pageSize: 5,
				community: " 四期 ",
				houseContractName: " B-202 ",
				ownerName: " 王五 ",
				expenseType: " house ",
				expenseItem: " 停车费 ",
				expenseStatus: " unpaid ",
				paymentMethod: " cash ",
				billingPeriod: " 2026-03 ",
			});

		await ownerPaymentDetailsListHandler(event);
		await repairReportFormListHandler(event);
		await repairReportsSummaryTableListHandler(event);
		await statementExpensesListHandler(event);

		expect(calls).toEqual([
			{
				endpoint: "owner",
				input: {
					pageIndex: 3,
					pageSize: 9,
					houseNumberContractName: "A-101",
					ownerName: "张三",
					ownerPhone: "138",
					feeCategory: "物业费",
					feeItem: "物业服务费",
					community: "一期",
					year: "2026",
				},
			},
			{
				endpoint: "repair",
				input: {
					pageIndex: 4,
					pageSize: 8,
					repairType: "水电",
					repairStatus: "processing",
					urgencyLevel: "urgent",
					reporter: "李四",
					reporterPhone: "139",
					community: "二期",
					reportTimeStart: "2026-01-01",
					reportTimeEnd: "2026-01-31",
					feeStatus: "paid",
				},
			},
			{
				endpoint: "summary",
				input: {
					pageIndex: 5,
					pageSize: 6,
					repairType: "门禁",
					repairStatus: "pending",
					urgencyLevel: "normal",
					community: "三期",
					statisticsStartTime: "2026-02-01",
					statisticsEndTime: "2026-02-28",
				},
			},
			{
				endpoint: "statement",
				input: {
					pageIndex: 6,
					pageSize: 5,
					community: "四期",
					houseContractName: "B-202",
					ownerName: "王五",
					expenseType: "house",
					expenseItem: "停车费",
					expenseStatus: "unpaid",
					paymentMethod: "cash",
					billingPeriod: "2026-03",
				},
			},
		]);
	});

	test("routes return admin failure when the runtime adapter throws", async () => {
		process.env.DATABASE_URL = "postgres://example.invalid/report-manage-p1";
		mockedReadBody.mockResolvedValue({ pageIndex: 1, pageSize: 20 });

		for (const [method, handler] of [
			["listOwnerPaymentDetails", ownerPaymentDetailsListHandler],
			["listRepairReportForm", repairReportFormListHandler],
			["listRepairReportsSummaryTable", repairReportsSummaryTableListHandler],
			["listStatementExpenses", statementExpensesListHandler],
		] as const) {
			const event = createRouteEvent({
				context: {
					feeRuntime: {
						adminAdapter: {
							[method]: async () => {
								throw new Error("runtime unavailable");
							},
						},
					},
				},
			});

			const response = await handler(event);

			expect(response).toMatchObject({
				success: false,
				code: 500,
				data: null,
			});
			expect(event.res.status).toBe(500);
		}
	});

	test("statement-expenses repository connects every frontend search field to DB filtering", async () => {
		const db = createWhereCaptureDb();
		const repository = createDbFeeRepository(db as any);

		await repository.listStatementExpenses({
			pageIndex: 1,
			pageSize: 20,
			community: "一期",
			houseContractName: "A-101",
			ownerName: "张三",
			expenseType: "house",
			expenseItem: "停车费",
			expenseStatus: "unpaid",
			paymentMethod: "cash",
			billingPeriod: "2026-03",
		});

		expect(db.whereCalls).toHaveLength(2);
		expect(db.whereCalls.every((where) => where !== undefined)).toBe(true);
		const renderedWhere = db.whereCalls.map(collectSqlText).join("\n");
		for (const field of [
			"community",
			"houseContractName",
			"ownerName",
			"expenseItem",
			"expenseStatus",
			"paymentMethod",
		]) {
			expect(renderedWhere).toContain(field);
		}
		expect(renderedWhere).toContain("report_type");
		expect(renderedWhere).toContain("report_period");
	});
});

function recordCall(
	calls: Array<{ endpoint: string; input: Record<string, unknown> }>,
	endpoint: string,
	input: Record<string, unknown>,
) {
	calls.push({ endpoint, input });
	return {
		success: true,
		code: 200,
		message: "查询成功",
		data: { list: [], total: 0, pageIndex: input.pageIndex, pageSize: input.pageSize, totalPages: 0 },
	};
}

function createRouteEvent(options: { context?: Record<string, unknown> } = {}): any {
	return {
		context: options.context ?? {},
		res: {
			headers: new Headers(),
			status: 200,
		},
	};
}

function createWhereCaptureDb() {
	const db = {
		whereCalls: [] as unknown[],
		select: vi.fn(() => createQuery(db)),
	};
	return db;
}

function createQuery(db: { whereCalls: unknown[] }) {
	const query = {
		from: vi.fn(() => query),
		where: vi.fn((where: unknown) => {
			db.whereCalls.push(where);
			return query;
		}),
		orderBy: vi.fn(() => query),
		limit: vi.fn(() => query),
		offset: vi.fn(async () => []),
		then: undefined as never,
	};
	return query;
}

function collectSqlText(value: unknown): string {
	if (value === undefined || value === null) {
		return "";
	}

	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}

	if (Array.isArray(value)) {
		return value.map(collectSqlText).join(" ");
	}

	if (typeof value === "object") {
		const record = value as Record<string, unknown>;
		const name = typeof record.name === "string" ? record.name : "";
		const queryChunks = Array.isArray(record.queryChunks) ? collectSqlText(record.queryChunks) : "";
		const stringChunk = Array.isArray(record.value) ? collectSqlText(record.value) : "";
		return [name, queryChunks, stringChunk].filter(Boolean).join(" ");
	}

	return String(value);
}
