import { test, describe } from "vitest";
import { expect } from "vitest";

const apiBaseUrl = process.env.PHASE7_API_BASE_URL;
const runHttpTests = process.env.RUN_PHASE7_HTTP_TESTS === "1" && Boolean(apiBaseUrl);
const describeWhenEnabled = runHttpTests ? describe : describe.skip;

const operationTeamAdminListEndpoints = [
	"/api/operation-team/data-manage/community-information/list",
	"/api/operation-team/data-manage/property-company/list",
	"/api/operation-team/data-manage/property-management-company/list",
	"/api/operation-team/system-manage/change-password/list",
	"/api/operation-team/system-manage/system-config/list",
	"/api/operation-team/system-manage/register-protocol/list",
	"/api/operation-team/system-manage/community-configuration/list",
	"/api/operation-team/system-manage/initialize-cell/list",
	"/api/operation-team/merchant-manage/merchant-info/list",
	"/api/operation-team/merchant-manage/merchant-admin/list",
	"/api/operation-team/report-configuration/report-info/list",
	"/api/operation-team/report-configuration/report-group/list",
	"/api/operation-team/report-configuration/report-component/list",
] as const;

const expenseManageAdminListEndpoints = [
	"/api/property-manage/expense-manage/cancel-fee/list",
	"/api/property-manage/expense-manage/contracte-charge/list",
	"/api/property-manage/expense-manage/discount-apply/list",
	"/api/property-manage/expense-manage/discount-setting/list",
	"/api/property-manage/expense-manage/discount-type/list",
	"/api/property-manage/expense-manage/expense-summary-table/list",
	"/api/property-manage/expense-manage/meter-reading-type/list",
	"/api/property-manage/expense-manage/overdue-payment-information/list",
	"/api/property-manage/expense-manage/payment-review/list",
	"/api/property-manage/expense-manage/refund-review/list",
	"/api/property-manage/expense-manage/reminder-for-overdue-payments/list",
	"/api/property-manage/expense-manage/reprint-voucher/list",
	"/api/property-manage/expense-manage/vehicle-charge/list",
	"/api/property-manage/expense-manage/water-and-electricity-meter-reading/list",
] as const;

const reportManageAdminListEndpoints = [
	"/api/property-manage/report-manage/arrears-details-list/list",
	"/api/property-manage/report-manage/data-statistics/list",
	"/api/property-manage/report-manage/deposit-report/list",
	"/api/property-manage/report-manage/expense-summary-table/list",
	"/api/property-manage/report-manage/fee-reminder/list",
	"/api/property-manage/report-manage/no-charge-house/list",
	"/api/property-manage/report-manage/outstanding-fees-analysis/list",
	"/api/property-manage/report-manage/owner-payment-details/list",
	"/api/property-manage/report-manage/patrol-report/list",
	"/api/property-manage/report-manage/repair-report-form/list",
	"/api/property-manage/report-manage/repair-reports-summary-table/list",
	"/api/property-manage/report-manage/statement-expenses/list",
] as const;

const patrolAdminListEndpoints = [
	"/api/property-manage/patrol-manage/detail/list",
	"/api/property-manage/patrol-manage/item/list",
	"/api/property-manage/patrol-manage/path/list",
	"/api/property-manage/patrol-manage/plan/list",
	"/api/property-manage/patrol-manage/point/list",
	"/api/property-manage/patrol-manage/task/list",
] as const;

const parkingAdminListEndpoints = [
	"/api/property-manage/parking-manage/carport-apply/list",
	"/api/property-manage/parking-manage/carport-info/list",
	"/api/property-manage/parking-manage/owner-vehicle/list",
	"/api/property-manage/parking-manage/parking-lot/list",
] as const;

const communityManageAdminListEndpoints = [
	"/api/property-manage/community-manage/building-space-structure-diagram/list",
	"/api/property-manage/community-manage/handing-business/list",
	"/api/property-manage/community-manage/house-decoration/list",
	"/api/property-manage/community-manage/my/list",
	"/api/property-manage/community-manage/notice/list",
	"/api/property-manage/community-manage/parking-space-structure-diagram/list",
	"/api/property-manage/community-manage/property-register/list",
] as const;

const housePropertyManageAdminListEndpoints = [
	"/api/property-manage/house-property-manage/house/list",
	"/api/property-manage/house-property-manage/invoice/list",
	"/api/property-manage/house-property-manage/invoice-title/list",
	"/api/property-manage/house-property-manage/owner-account/list",
	"/api/property-manage/house-property-manage/owner-information/list",
	"/api/property-manage/house-property-manage/owner-member/list",
	"/api/property-manage/house-property-manage/owners-committee/list",
	"/api/property-manage/house-property-manage/reserve-venue/list",
	"/api/property-manage/house-property-manage/reserve-venue-order/list",
	"/api/property-manage/house-property-manage/site-management/list",
] as const;

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

	test("serves all admin expense-manage canonical list endpoints over real HTTP", async () => {
		for (const path of expenseManageAdminListEndpoints) {
			const response = await fetchJson(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ pageIndex: 1, pageSize: 10 }),
			});

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
				},
			});
			expect(response.body).not.toHaveProperty("msg");
		}
	}, 30_000);

	test("serves all admin report-manage canonical list endpoints over real HTTP", async () => {
		for (const path of reportManageAdminListEndpoints) {
			const response = await fetchJson(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ pageIndex: 1, pageSize: 10 }),
			});

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
				},
			});
			expect(response.body).not.toHaveProperty("msg");
		}
	}, 30_000);

	test("serves all admin repair canonical list endpoints over real HTTP", async () => {
		for (const path of [
			"/api/property-manage/repairs-manage/repairs-todo/list",
			"/api/property-manage/repairs-manage/repairs-setting/list",
			"/api/property-manage/repairs-manage/issues/list",
			"/api/property-manage/repairs-manage/repairs-have-done/list",
			"/api/property-manage/repairs-manage/return-visit/list",
			"/api/property-manage/repairs-manage/phone-report-repairs/list",
			"/api/property-manage/repairs-manage/mandatory-return-issue/list",
		]) {
			const response = await fetchJson(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ pageIndex: 1, pageSize: 10 }),
			});

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
				},
			});
			expect(response.body).not.toHaveProperty("msg");
		}
	}, 30_000);

	test("serves all admin operation-team canonical list endpoints over real HTTP", async () => {
		for (const path of operationTeamAdminListEndpoints) {
			const response = await fetchJson(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ pageIndex: 1, pageSize: 10 }),
			});

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
				},
			});
			expect(response.body).not.toHaveProperty("msg");
		}
	}, 30_000);

	test("serves all admin patrol and parking canonical list endpoints over real HTTP", async () => {
		for (const path of [...patrolAdminListEndpoints, ...parkingAdminListEndpoints]) {
			const response = await fetchJson(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ pageIndex: 1, pageSize: 10 }),
			});

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
				},
			});
			expect(response.body).not.toHaveProperty("msg");
		}
	}, 30_000);

	test("serves all admin community-manage canonical list endpoints over real HTTP", async () => {
		for (const path of communityManageAdminListEndpoints) {
			const response = await fetchJson(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ pageIndex: 1, pageSize: 10 }),
			});

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
				},
			});
			expect(response.body).not.toHaveProperty("msg");
		}
	}, 30_000);

	test("serves all admin house-property-manage canonical list endpoints over real HTTP", async () => {
		for (const path of housePropertyManageAdminListEndpoints) {
			const response = await fetchJson(`${baseUrl}${path}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ pageIndex: 1, pageSize: 10 }),
			});

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
				},
			});
			expect(response.body).not.toHaveProperty("msg");
		}
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
