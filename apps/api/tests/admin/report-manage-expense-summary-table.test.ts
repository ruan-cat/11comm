import { describe, expect, test, vi } from "vitest";

import { createAdminFeeAdapter } from "../../server/modules/fee/admin-adapter";
import { createDbFeeRepository, createInMemoryFeeRepository } from "../../server/modules/fee/repository";

import reportExpenseSummaryTableListHandler from "../../server/routes/api/property-manage/report-manage/expense-summary-table/list.post";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

describe("report-manage expense-summary-table endpoint", () => {
	test("route passes request body filters to the report expense-summary adapter and returns PageDTO", async () => {
		const calls: Record<string, unknown>[] = [];
		process.env.DATABASE_URL = "postgres://example.invalid/report-expense-summary-table";
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						listReportExpenseSummaryTables: async (input: Record<string, unknown>) => {
							calls.push(input);
							return {
								success: true,
								code: 200,
								message: "query success",
								data: {
									list: [],
									total: 0,
									pageIndex: input.pageIndex,
									pageSize: input.pageSize,
									totalPages: 0,
								},
							};
						},
					},
				},
			},
		});

		mockedReadBody.mockResolvedValueOnce({
			page: 3,
			pageIndex: 4,
			pageSize: 9,
			houseNumberContractName: " A-101 ",
			ownerName: " Alice ",
			ownerPhone: " 138 ",
			time: " 2026-04 ",
			expenseItemName: " Property Fee ",
			status: " enabled ",
		});

		const response = await reportExpenseSummaryTableListHandler(event);

		expect(calls).toEqual([
			{
				page: 3,
				pageIndex: 4,
				pageSize: 9,
				houseNumberContractName: "A-101",
				ownerName: "Alice",
				ownerPhone: "138",
				time: "2026-04",
				expenseItemName: "Property Fee",
				status: "enabled",
			},
		]);
		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: {
				list: [],
				total: 0,
				pageIndex: 4,
				pageSize: 9,
				totalPages: 0,
			},
		});
	});

	test("report adapter uses the report semantic service method instead of expense-manage summary tables", async () => {
		const calls: string[] = [];
		const service = {
			listReportExpenseSummaryTables: vi.fn(async () => {
				calls.push("report");
				return {
					list: [
						{
							id: "rpt-1",
							community: "",
							houseNumberContractName: "A-101",
							ownerName: "",
							ownerPhone: "",
							feeItem: "Property Fee",
							totalHouseholds: "",
							chargedHouseholds: "",
							arrearsHouseholds: "",
							arrears: "400.25",
							actualPayment: "800.25",
							currentReceivable: "1200.50",
							currentActualReceipt: "800.25",
							householdChargeRate: "",
							chargeRate: "66.66%",
							clearanceRate: "66.66%",
							statisticsTime: "2026-04-01",
							remark: "report row",
							createTime: "2026-04-01 08:00:00",
							updateTime: "2026-04-02 09:30:00",
						},
					],
					total: 1,
				};
			}),
			listExpenseSummaryTables: vi.fn(async () => {
				calls.push("expense");
				return { list: [], total: 0 };
			}),
		};
		const admin = createAdminFeeAdapter(service as any);

		const response = await admin.listReportExpenseSummaryTables({
			page: 2,
			pageIndex: 3,
			pageSize: 7,
			houseNumberContractName: "A-101",
			ownerName: "Alice",
			ownerPhone: "138",
			time: "2026-04",
			expenseItemName: "Property Fee",
			status: "enabled",
		});

		expect(calls).toEqual(["report"]);
		expect(service.listReportExpenseSummaryTables).toHaveBeenCalledWith({
			pageIndex: 2,
			pageSize: 7,
			houseNumberContractName: "A-101",
			ownerName: "Alice",
			ownerPhone: "138",
			time: "2026-04",
			expenseItemName: "Property Fee",
			status: "enabled",
		});
		expect(service.listExpenseSummaryTables).not.toHaveBeenCalled();
		expect(response.data).toMatchObject({
			total: 1,
			pageIndex: 2,
			pageSize: 7,
			totalPages: 1,
			list: [{ id: "rpt-1", feeItem: "Property Fee", currentReceivable: "1200.50" }],
		});
	});

	test("repository maps rptExpenseSummaries rows to report page fields and filters report table fields", async () => {
		const db = createRowsDb({
			total: 1,
			rows: [
				{
					id: "rpt-row-1",
					communityId: "community-1",
					periodStart: "2026-04-01",
					periodEnd: "2026-04-30",
					expenseType: "Property Fee",
					receivableTotal: "1200.50",
					receivedTotal: "800.25",
					outstandingTotal: "400.25",
					building: "A-101",
					expenseItem: "",
					remark: "report semantic row",
					createTime: "2026-04-01 08:00:00",
					updateTime: "2026-04-02 09:30:00",
				},
			],
		});
		const repository = createDbFeeRepository(db as any);

		const result = await repository.listReportExpenseSummaryTables({
			pageIndex: 1,
			pageSize: 20,
			houseNumberContractName: "A-101",
			time: "2026-04",
			expenseItemName: "Property Fee",
			status: "enabled",
		});

		expect(result).toEqual({
			total: 1,
			list: [
				{
					id: "rpt-row-1",
					community: "community-1",
					houseNumberContractName: "A-101",
					ownerName: "",
					ownerPhone: "",
					feeItem: "Property Fee",
					totalHouseholds: "",
					chargedHouseholds: "",
					arrearsHouseholds: "",
					arrears: "400.25",
					actualPayment: "800.25",
					currentReceivable: "1200.50",
					currentActualReceipt: "800.25",
					householdChargeRate: "",
					chargeRate: "66.66%",
					clearanceRate: "66.66%",
					statisticsTime: "2026-04-01",
					remark: "report semantic row",
					createTime: "2026-04-01 08:00:00",
					updateTime: "2026-04-02 09:30:00",
				},
			],
		});

		const renderedWhere = db.whereCalls.map(collectSqlText).join("\n");
		expect(renderedWhere).toContain("period_start");
		expect(renderedWhere).toContain("building");
		expect(renderedWhere).toContain("expense_item");
		expect(renderedWhere).toContain("expense_type");
		expect(renderedWhere).toContain("receivable_total");
		expect(db.fromTables.join("\n")).toContain("rpt_expense_summaries");
		expect(db.fromTables.join("\n")).not.toContain("ex_expense_summary_tables");
	});

	test("in-memory report summary stays independent from expense-manage summary data", async () => {
		const repository = createInMemoryFeeRepository({
			expenseSummaryTables: [
				{
					id: "ex-row-1",
					time: "2026-04",
					expenseItemId: "ex",
					expenseItemName: "expense-manage",
					receivableAmount: "1",
					actualAmount: "1",
					status: "enabled",
					remark: "must not leak",
					createTime: "2026-04-01 00:00:00",
					updateTime: "2026-04-01 00:00:00",
				},
			],
		});

		const result = await repository.listReportExpenseSummaryTables({
			pageIndex: 1,
			pageSize: 20,
		});

		expect(result).toEqual({ list: [], total: 0, page: 1, row: 20 });
	});
});

function createRouteEvent(options: { context?: Record<string, unknown> } = {}): any {
	return {
		context: options.context ?? {},
		res: {
			headers: new Headers(),
			status: 200,
		},
	};
}

function createRowsDb(options: { total: number; rows: Record<string, unknown>[] }) {
	const db = {
		fromTables: [] as string[],
		whereCalls: [] as unknown[],
		select: vi.fn((selection?: unknown) => createRowsQuery(db, selection ? [{ total: options.total }] : options.rows)),
	};
	return db;
}

function createRowsQuery(db: { fromTables: string[]; whereCalls: unknown[] }, result: Record<string, unknown>[]) {
	const query = {
		from: vi.fn((table: unknown) => {
			db.fromTables.push(collectSqlText(table));
			return query;
		}),
		where: vi.fn((where: unknown) => {
			db.whereCalls.push(where);
			return query;
		}),
		orderBy: vi.fn(() => query),
		limit: vi.fn(() => query),
		offset: vi.fn(async () => result),
		then: (onFulfilled: (value: Record<string, unknown>[]) => unknown, onRejected?: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(onFulfilled, onRejected),
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
		const symbolChunks = Object.getOwnPropertySymbols(record)
			.map((symbol) => collectSqlText((record as Record<symbol, unknown>)[symbol]))
			.join(" ");
		return [name, queryChunks, stringChunk, symbolChunks].filter(Boolean).join(" ");
	}

	return String(value);
}
