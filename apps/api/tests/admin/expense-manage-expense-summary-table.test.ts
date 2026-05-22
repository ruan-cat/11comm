import { describe, expect, test, vi } from "vitest";

import { createAdminFeeAdapter } from "../../server/modules/fee/admin-adapter";
import { createDbFeeRepository } from "../../server/modules/fee/repository";

import expenseSummaryTableListHandler from "../../server/routes/api/property-manage/expense-manage/expense-summary-table/list.post";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

describe("expense-manage expense-summary-table endpoint", () => {
	test("route passes request body filters to the expense summary adapter and returns PageDTO", async () => {
		const calls: Record<string, unknown>[] = [];
		process.env.DATABASE_URL = "postgres://example.invalid/expense-summary-table";
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						listExpenseSummaryTables: async (input: Record<string, unknown>) => {
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
			time: " 2026-04 ",
			expenseItemId: " item-1 ",
			expenseItemName: " Property Fee ",
			status: " enabled ",
		});

		const response = await expenseSummaryTableListHandler(event);

		expect(calls).toEqual([
			{
				page: 3,
				pageIndex: 4,
				pageSize: 9,
				time: "2026-04",
				expenseItemId: "item-1",
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

	test("expense adapter uses the expense semantic service method instead of report summary tables", async () => {
		const calls: string[] = [];
		const service = {
			listExpenseSummaryTables: vi.fn(async () => {
				calls.push("expense");
				return {
					list: [
						{
							id: "ex-1",
							time: "2026-04",
							expenseItemId: "item-1",
							expenseItemName: "Property Fee",
							receivableAmount: "1200.50",
							actualAmount: "800.25",
							status: "enabled",
							remark: "expense row",
							createTime: "2026-04-01 08:00:00",
							updateTime: "2026-04-02 09:30:00",
						},
					],
					total: 1,
				};
			}),
			listReportExpenseSummaryTables: vi.fn(async () => {
				calls.push("report");
				return { list: [], total: 0 };
			}),
		};
		const admin = createAdminFeeAdapter(service as any);

		const response = await admin.listExpenseSummaryTables({
			page: 2,
			pageIndex: 3,
			pageSize: 7,
			time: "2026-04",
			expenseItemId: "item-1",
			expenseItemName: "Property Fee",
			status: "enabled",
		});

		expect(calls).toEqual(["expense"]);
		expect(service.listExpenseSummaryTables).toHaveBeenCalledWith({
			pageIndex: 2,
			pageSize: 7,
			time: "2026-04",
			expenseItemId: "item-1",
			expenseItemName: "Property Fee",
			status: "enabled",
		});
		expect(service.listReportExpenseSummaryTables).not.toHaveBeenCalled();
		expect(response.data).toMatchObject({
			total: 1,
			pageIndex: 2,
			pageSize: 7,
			totalPages: 1,
			list: [{ id: "ex-1", expenseItemName: "Property Fee", receivableAmount: "1200.50" }],
		});
	});

	test("repository maps exExpenseSummaryTables rows to expense page fields and filters expense table fields", async () => {
		const db = createRowsDb({
			total: 1,
			rows: [
				{
					id: "ex-row-1",
					time: "2026-04",
					expenseItemId: "item-1",
					expenseItemName: "Property Fee",
					receivableAmount: "1200.50",
					actualAmount: "800.25",
					status: "enabled",
					remark: "expense semantic row",
					createTime: "2026-04-01 08:00:00",
					updateTime: "2026-04-02 09:30:00",
				},
			],
		});
		const repository = createDbFeeRepository(db as any);

		const result = await repository.listExpenseSummaryTables({
			pageIndex: 1,
			pageSize: 20,
			time: "2026-04",
			expenseItemId: "item-1",
			expenseItemName: "Property Fee",
			status: "enabled",
		});

		expect(result).toEqual({
			total: 1,
			list: [
				{
					id: "ex-row-1",
					time: "2026-04",
					expenseItemId: "item-1",
					expenseItemName: "Property Fee",
					receivableAmount: "1200.50",
					actualAmount: "800.25",
					status: "enabled",
					remark: "expense semantic row",
					createTime: "2026-04-01 08:00:00",
					updateTime: "2026-04-02 09:30:00",
				},
			],
		});

		const renderedWhere = db.whereCalls.map(collectSqlText).join("\n");
		expect(renderedWhere).toContain("time");
		expect(renderedWhere).toContain("expense_item_name");
		expect(renderedWhere).toContain("expense_item_id");
		expect(renderedWhere).toContain("status");
		expect(db.fromTables.join("\n")).toContain("ex_expense_summary_tables");
		expect(db.fromTables.join("\n")).not.toContain("rpt_expense_summaries");
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
