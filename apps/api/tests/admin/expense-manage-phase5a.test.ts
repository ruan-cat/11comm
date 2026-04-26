import { describe, test } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

import { createAdminFeeAdapter } from "../../server/modules/fee/admin-adapter";
import { createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

describe("expense-manage phase5a admin routes", () => {
	const envSnapshot = {
		comm_admin_11__DATABASE_URL: process.env.comm_admin_11__DATABASE_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		NITRO_DATABASE_URL: process.env.NITRO_DATABASE_URL,
	};

	beforeEach(() => {
		delete process.env.comm_admin_11__DATABASE_URL;
		delete process.env.DATABASE_URL;
		delete process.env.NITRO_DATABASE_URL;
		mockedReadBody.mockReset();
	});

	afterEach(() => {
		restoreEnv("comm_admin_11__DATABASE_URL", envSnapshot.comm_admin_11__DATABASE_URL);
		restoreEnv("DATABASE_URL", envSnapshot.DATABASE_URL);
		restoreEnv("NITRO_DATABASE_URL", envSnapshot.NITRO_DATABASE_URL);
	});

	test("house-charge detail returns JsonVO single item shape", async () => {
		process.env.DATABASE_URL = "postgres://phase5a.test/runtime";
		mockedReadBody.mockResolvedValue({ id: "FEE_001" });
		const handler = await loadHouseChargeDetailHandler();
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						getHouseChargeDetail: async (input: Record<string, unknown>) => {
							expect(input).toMatchObject({ id: "FEE_001" });
							return adminSuccessFixture(houseChargeFixture({ id: "FEE_001" }));
						},
					},
				},
			},
		});

		const response = await handler(event);

		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: {
				id: "FEE_001",
				houseId: expect.any(String),
				expenseItem: expect.any(String),
				receivableAmount: expect.any(String),
				receivedAmount: expect.any(String),
			},
		});
	});

	test("expense-item-setting list returns JsonVO PageDTO shape", async () => {
		process.env.DATABASE_URL = "postgres://phase5a.test/runtime";
		mockedReadBody.mockResolvedValue({ pageIndex: 1, pageSize: 20, expenseItem: "Property" });
		const handler = await loadExpenseItemSettingListHandler();
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						listExpenseItemSettings: async (input: Record<string, unknown>) => {
							expect(input).toMatchObject({ pageIndex: 1, pageSize: 20, expenseItem: "Property" });
							return adminSuccessFixture({
								list: [expenseItemSettingFixture()],
								total: 1,
								pageIndex: 1,
								pageSize: 20,
								totalPages: 1,
							});
						},
					},
				},
			},
		});

		const response = await handler(event);

		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: {
				list: [expect.objectContaining({ id: "EXPENSE_ITEM_001", code: "FEE_PHASE5A" })],
				total: 1,
				pageIndex: 1,
				pageSize: 20,
				totalPages: 1,
			},
		});
		expect(response.data.list[0]).not.toHaveProperty("unit");
		expect(response.data.list[0]).not.toHaveProperty("prepaymentPeriod");
	});

	test("expense-item-setting detail returns JsonVO single item shape", async () => {
		process.env.DATABASE_URL = "postgres://phase5a.test/runtime";
		mockedReadBody.mockResolvedValue({ id: "EXPENSE_ITEM_001" });
		const handler = await loadExpenseItemSettingDetailHandler();
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						getExpenseItemSettingDetail: async (input: Record<string, unknown>) => {
							expect(input).toMatchObject({ id: "EXPENSE_ITEM_001" });
							return adminSuccessFixture(expenseItemSettingFixture());
						},
					},
				},
			},
		});

		const response = await handler(event);

		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: {
				id: "EXPENSE_ITEM_001",
				code: "FEE_PHASE5A",
				feeType: "PROPERTY",
				expenseItem: "Property fee phase5a",
				status: "enabled",
			},
		});
		expect(response.data).not.toHaveProperty("unit");
		expect(response.data).not.toHaveProperty("prepaymentPeriod");
	});

	test("expense-item-setting create validates required fields", async () => {
		mockedReadBody.mockResolvedValue({
			feeType: "PROPERTY",
			expenseItem: "",
		});
		const handler = await loadExpenseItemSettingCreateHandler();
		const event = createRouteEvent({ context: createInMemoryFeeRuntimeContext() });

		const response = await handler(event);

		expect(response).toMatchObject({
			success: false,
			data: null,
		});
		expect(response.code).not.toBe(200);
		expect(event.res.status).toBe(400);
		expect(JSON.stringify(response).toLowerCase()).toMatch(/required|missing|invalid|code|expenseitem/);
	});

	test("expense-item-setting update validates id", async () => {
		mockedReadBody.mockResolvedValue({
			code: "FEE_PHASE5A",
			feeType: "PROPERTY",
			expenseItem: "Property fee phase5a",
		});
		const handler = await loadExpenseItemSettingUpdateHandler();
		const event = createRouteEvent({ context: createInMemoryFeeRuntimeContext() });

		const response = await handler(event);

		expect(response).toMatchObject({
			success: false,
			data: null,
		});
		expect(response.code).not.toBe(200);
		expect(event.res.status).toBe(400);
		expect(JSON.stringify(response).toLowerCase()).toContain("id");
	});

	test("expense-item-setting delete follows explicit delete policy", async () => {
		mockedReadBody.mockResolvedValue({ id: "EXPENSE_ITEM_001" });
		const handler = await loadExpenseItemSettingDeleteHandler();
		const event = createRouteEvent({ context: createInMemoryFeeRuntimeContext() });

		const response = await handler(event);

		expect(isExplicitDeleteRejection(response)).toBe(true);
	});

	test("route handler returns adminFailure and status 500 when adapter throws", async () => {
		process.env.DATABASE_URL = "postgres://phase5a.test/runtime";
		mockedReadBody.mockResolvedValue({ id: "EXPENSE_ITEM_001" });
		const handler = await loadExpenseItemSettingDetailHandler();
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						getExpenseItemSettingDetail: async () => {
							throw new Error("phase5a adapter unavailable");
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
	});
});

async function loadHouseChargeDetailHandler(): Promise<RouteHandler> {
	const route = await import("../../server/routes/api/property-manage/expense-manage/house-charge/detail.post");
	return route.default as RouteHandler;
}

async function loadExpenseItemSettingListHandler(): Promise<RouteHandler> {
	const route = await import("../../server/routes/api/property-manage/expense-manage/expense-item-setting/list.post");
	return route.default as RouteHandler;
}

async function loadExpenseItemSettingDetailHandler(): Promise<RouteHandler> {
	const route = await import("../../server/routes/api/property-manage/expense-manage/expense-item-setting/detail.post");
	return route.default as RouteHandler;
}

async function loadExpenseItemSettingCreateHandler(): Promise<RouteHandler> {
	const route = await import("../../server/routes/api/property-manage/expense-manage/expense-item-setting/create.post");
	return route.default as RouteHandler;
}

async function loadExpenseItemSettingUpdateHandler(): Promise<RouteHandler> {
	const route = await import("../../server/routes/api/property-manage/expense-manage/expense-item-setting/update.post");
	return route.default as RouteHandler;
}

async function loadExpenseItemSettingDeleteHandler(): Promise<RouteHandler> {
	const route = await import("../../server/routes/api/property-manage/expense-manage/expense-item-setting/delete.post");
	return route.default as RouteHandler;
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

function createInMemoryFeeRuntimeContext(): Record<string, unknown> {
	return {
		feeRuntime: {
			adminAdapter: createAdminFeeAdapter(createFeeService(createInMemoryFeeRepository())),
		},
	};
}

function adminSuccessFixture<T>(data: T) {
	return {
		success: true,
		code: 200,
		message: "query success",
		data,
	};
}

function houseChargeFixture(overrides: Partial<Record<string, unknown>> = {}) {
	return {
		id: "FEE_001",
		name: "Property fee",
		houseId: "ROOM_001",
		expenseItem: "Property fee",
		receivableAmount: "360",
		receivedAmount: "120",
		billingPeriod: "2026-04-01 to 2026-04-30",
		status: "partial",
		billDate: "2026-04-01",
		dueDate: "2026-04-30",
		remark: "monthly",
		createTime: "2026-04-01 09:00:00",
		updateTime: "2026-04-10 10:30:00",
		...overrides,
	};
}

function expenseItemSettingFixture(overrides: Partial<Record<string, unknown>> = {}) {
	return {
		id: "EXPENSE_ITEM_001",
		code: "FEE_PHASE5A",
		feeType: "PROPERTY",
		expenseItem: "Property fee phase5a",
		expenseIdentifier: "FEE_PHASE5A",
		paymentType: "monthly",
		paymentCycle: "1",
		formula: "fixedFee",
		billingUnitPrice: "0",
		fixedFee: "128",
		accountDeduction: "enabled",
		mobilePayment: "enabled",
		roundingMode: "round",
		decimalPlaces: 2,
		status: "enabled",
		createTime: "2026-04-26 10:00:00",
		updateTime: "2026-04-26 10:00:00",
		remark: "phase5a",
		...overrides,
	};
}

function isExplicitDeleteRejection(value: unknown): boolean {
	if (!value || typeof value !== "object") {
		return false;
	}

	const record = value as Record<string, unknown>;
	const text = JSON.stringify(value).toLowerCase();
	const hasRejectedFlag =
		record.success === false ||
		record.ok === false ||
		record.allowed === false ||
		record.deleted === false ||
		record.status === "blocked" ||
		record.status === "rejected" ||
		record.status === "unsupported";
	const explainsDeletePolicy =
		text.includes("delete") ||
		text.includes("deletedat") ||
		text.includes("soft") ||
		text.includes("physical") ||
		text.includes("policy") ||
		text.includes("blocked") ||
		text.includes("unsupported");

	return hasRejectedFlag && explainsDeletePolicy;
}

function restoreEnv(name: string, value: string | undefined): void {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}

type RouteHandler = (event: any) => Promise<any>;
