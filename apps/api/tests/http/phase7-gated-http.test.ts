import { test, describe } from "vitest";
import { expect } from "vitest";

const apiBaseUrl = process.env.PHASE7_API_BASE_URL;
const runHttpTests = process.env.RUN_PHASE7_HTTP_TESTS === "1" && Boolean(apiBaseUrl);
const describeWhenEnabled = runHttpTests ? describe : describe.skip;

describeWhenEnabled("phase7 gated apps/api http verification", () => {
	const baseUrl = apiBaseUrl as string;

	test("serves health, ready, and endpoint manifest over real HTTP", async () => {
		const health = await fetchJson(`${baseUrl}/__nitro/health`);

		expect(health.status).toBe(200);
		expect(health.body).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			status: "ok",
			checks: {
				database: {
					configured: expect.any(Boolean),
				},
			},
		});

		const ready = await fetchJson(`${baseUrl}/__nitro/ready`);

		expect([200, 503]).toContain(ready.status);
		expect(ready.body).toMatchObject({
			success: expect.any(Boolean),
			ready: expect.any(Boolean),
			checks: {
				database: {
					configured: expect.any(Boolean),
				},
			},
		});

		if (ready.status === 503) {
			expect([
				"DATABASE_CONFIG_MISSING",
				"DATABASE_CONNECTION_FAILED",
				"DATABASE_SCHEMA_MISSING",
				"DATABASE_MIGRATIONS_NOT_READY",
			]).toContain(ready.body.code);
			expect(ready.body).toMatchObject({
				success: false,
				ready: false,
				checks: {
					database: {
						configured: expect.any(Boolean),
					},
				},
			});
		}

		if (ready.status === 200 && ready.body.code === "DB_READY") {
			expect(ready.body.checks.database).toMatchObject({
				configured: true,
				connected: true,
				probeEnabled: true,
				schema: {
					requiredTablesPresent: true,
					missingTables: [],
				},
				migrations: {
					tablePresent: true,
					upToDate: true,
				},
			});
		}

		const endpoints = await fetchJson(`${baseUrl}/__nitro/endpoints`);

		expect(endpoints.status).toBe(200);
		expect(endpoints.body).toMatchObject({ success: true });
		expect(endpoints.body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					url: "/api/property-manage/expense-manage/house-charge/list",
					targetClient: "admin",
					responseContract: "JsonVO",
				}),
				expect.objectContaining({
					url: "/app/fee.listFee",
					targetClient: "app",
					responseContract: "{ code, msg, data }",
				}),
			]),
		);
	}, 30_000);

	test("serves one admin canonical and app legacy endpoints over real HTTP", async () => {
		const admin = await fetchJson(`${baseUrl}/api/property-manage/expense-manage/house-charge/list`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ pageIndex: 1, pageSize: 10 }),
		});

		expect(admin.status).toBe(200);
		expect(admin.body).toMatchObject({
			success: true,
			code: 200,
			message: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
			},
		});
		expect(admin.body).not.toHaveProperty("msg");

		const legacy = await fetchJson(`${baseUrl}/app/fee.listFee?page=1&row=1&communityId=COMM_001`);

		expect(legacy.status).toBe(200);
		expect(legacy.body).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
			},
		});
		expect(legacy.body).not.toHaveProperty("success");

		const floor = await fetchJson(`${baseUrl}/app/floor.queryFloors?page=1&row=1&communityId=COMM_001`);

		expect(floor.status).toBe(200);
		expect(floor.body).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 1,
			},
		});
		expect(floor.body).not.toHaveProperty("success");
	}, 30_000);

	test("serves Batch4 fee read-only report endpoints over real HTTP", async () => {
		for (const path of [
			"/app/feeConfig.listFeeConfigs?page=1&row=1&communityId=COMM_001",
			"/app/reportFeeMonthStatistics.queryReportFeeSummary?page=1&row=1&communityId=COMM_001",
			"/app/reportFeeMonthStatistics/queryPayFeeDetail?page=1&row=1&communityId=COMM_001",
			"/app/dataReport.queryFeeDataReport?communityId=COMM_001&reportCode=FEE_REPORT",
		]) {
			const response = await fetchJson(`${baseUrl}${path}`);

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				code: 0,
				msg: expect.any(String),
			});
			expect(response.body).not.toHaveProperty("success");
		}
	}, 30_000);

	test("serves Batch3 repair read-only legacy endpoints over real HTTP", async () => {
		const repairs = await fetchJson(`${baseUrl}/app/ownerRepair.listOwnerRepairs?page=1&row=1&communityId=COMM_001`);

		expect(repairs.status).toBe(200);
		expect(repairs.body).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				ownerRepairs: expect.any(Array),
				total: expect.any(Number),
			},
		});
		expect(repairs.body).not.toHaveProperty("success");

		const settings = await fetchJson(`${baseUrl}/app/repairSetting.listRepairSettings?page=1&row=1&publicArea=T`);

		expect(settings.status).toBe(200);
		expect(settings.body).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: expect.any(Array),
		});
		expect(settings.body).not.toHaveProperty("success");

		const states = await fetchJson(`${baseUrl}/app/dict.queryRepairStates`);

		expect(states.status).toBe(200);
		expect(states.body).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: expect.any(Array),
		});
		expect(states.body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					statusCd: "10001",
				}),
			]),
		);
		expect(states.body).not.toHaveProperty("success");
	}, 30_000);

	test("blocks high-risk app legacy mutation endpoints by default over real HTTP", async () => {
		for (const path of [
			"/app/payment.nativeQrcodePayment",
			"/app/oweFeeCallable.writeOweFeeCallable",
			"/app/fee.saveRoomCreateFee",
			"/app/ownerRepair.saveOwnerRepair",
		]) {
			const response = await fetchJson(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ communityId: "COMM_001", feeId: "FEE_001" }),
			});

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				code: 409,
				msg: expect.stringContaining("Phase7"),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
		}
	}, 30_000);
});

async function fetchJson(url: string, init?: RequestInit): Promise<{ status: number; body: any }> {
	const response = await fetch(url, init);
	return {
		status: response.status,
		body: await response.json(),
	};
}
