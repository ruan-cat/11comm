import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createAdminFeeAdapter, createLegacyFeeAdapter, getFeeRuntime } from "../../server/modules/fee";
import { createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";

import houseChargeListHandler from "../../server/routes/api/property-manage/expense-manage/house-charge/list.post";
import paymentDetailsFormListHandler from "../../server/routes/api/property-manage/report-manage/payment-details-form/list.post";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

describe("fee admin canonical adapter", () => {
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

	test("returns house-charge list with JsonVO PageDTO shape", async () => {
		const service = createFeeService(createInMemoryFeeRepository());
		const admin = createAdminFeeAdapter(service);

		const response = await admin.listHouseCharges({
			page: 1,
			pageSize: 20,
			expenseItem: "物业",
		});

		expect(response).toMatchObject({
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				pageSize: 20,
				pageIndex: 1,
				totalPages: expect.any(Number),
			},
		});
		expect(response.data.list[0]).toMatchObject({
			id: expect.any(String),
			name: expect.any(String),
			status: expect.any(String),
			createTime: expect.any(String),
			updateTime: expect.any(String),
			remark: expect.any(String),
			houseId: expect.any(String),
			expenseItem: expect.any(String),
			receivableAmount: expect.any(String),
		});
	});

	test("returns payment-details-form list with JsonVO PageDTO shape", async () => {
		const service = createFeeService(createInMemoryFeeRepository());
		const admin = createAdminFeeAdapter(service);

		const response = await admin.listPaymentDetailsForm({
			pageIndex: 1,
			pageSize: 20,
			name: "物业",
		});

		expect(response.data.list[0]).toMatchObject({
			id: expect.any(String),
			name: expect.any(String),
			status: expect.any(String),
		});
	});

	test("legacy and admin adapters resolved from fee runtime share repository state", async () => {
		const runtime = getFeeRuntime();

		const legacyResponse = await runtime.legacyAdapter.saveRoomCreateFee({
			locationObjId: "ROOM_RUNTIME_SHARED",
			configId: "CONFIG_001",
			amount: "128",
			communityId: "COMM_001",
		});
		const adminResponse = await runtime.adminAdapter.listHouseCharges({ pageIndex: 1, pageSize: 100 });

		expect(legacyResponse).toHaveProperty("code", 0);
		expect(adminResponse).toHaveProperty("success", true);
		expect(adminResponse.data.list).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					houseId: "ROOM_RUNTIME_SHARED",
					receivableAmount: "128",
				}),
			]),
		);
	});

	test("house-charge route falls back to in-memory service without database url", async () => {
		mockedReadBody.mockResolvedValue({
			pageIndex: 1,
			pageSize: 20,
			expenseItem: "物业",
		});

		const response = await houseChargeListHandler({ context: {} } as any);

		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				pageIndex: 1,
				pageSize: 20,
				totalPages: expect.any(Number),
			},
		});
	});

	test("payment-details route falls back to in-memory service without database url", async () => {
		mockedReadBody.mockResolvedValue({
			pageIndex: 1,
			pageSize: 20,
			name: "物业",
		});

		const response = await paymentDetailsFormListHandler({ context: {} } as any);

		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				pageIndex: 1,
				pageSize: 20,
				totalPages: expect.any(Number),
			},
		});
	});

	test("house-charge route returns admin failure when runtime adapter throws", async () => {
		process.env.DATABASE_URL = "postgres://example.invalid/test";
		mockedReadBody.mockResolvedValue({
			pageIndex: 1,
			pageSize: 20,
		});
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						listHouseCharges: async () => {
							throw new Error("runtime unavailable");
						},
					},
				},
			},
		});

		const response = await houseChargeListHandler(event);

		expect(response).toMatchObject({
			success: false,
			code: 500,
			data: null,
		});
		expect(event.res.status).toBe(500);
	});

	test("payment-details route returns admin failure when runtime adapter throws", async () => {
		process.env.DATABASE_URL = "postgres://example.invalid/test";
		mockedReadBody.mockResolvedValue({
			pageIndex: 1,
			pageSize: 20,
		});
		const event = createRouteEvent({
			context: {
				feeRuntime: {
					adminAdapter: {
						listPaymentDetailsForm: async () => {
							throw new Error("runtime unavailable");
						},
					},
				},
			},
		});

		const response = await paymentDetailsFormListHandler(event);

		expect(response).toMatchObject({
			success: false,
			code: 500,
			data: null,
		});
		expect(event.res.status).toBe(500);
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

function restoreEnv(name: string, value: string | undefined): void {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}
