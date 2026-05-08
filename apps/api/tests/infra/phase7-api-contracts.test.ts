import { describe, expect, test } from "vitest";

import { createAdminFeeAdapter } from "../../server/modules/fee/admin-adapter";
import { createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";
import { createEndpointRegistry, dispatchEndpoint } from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions, runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

describe("phase7 apps-api dual client contracts", () => {
	test("endpoint manifest declares first admin canonical and app legacy contracts", () => {
		expectManifestEntry("/api/property-manage/expense-manage/house-charge/list", {
			targetClient: "admin",
			routeKind: "admin-canonical",
			responseContract: "JsonVO",
			cutoverStatus: "cut-to-apps-api",
		});
		expectManifestEntry("/api/property-manage/expense-manage/expense-item-setting/list", {
			targetClient: "admin",
			routeKind: "admin-canonical",
			responseContract: "JsonVO",
			cutoverStatus: "cut-to-apps-api",
		});
		expectManifestEntry("/api/property-manage/report-manage/payment-details-form/list", {
			targetClient: "admin",
			routeKind: "admin-canonical",
			responseContract: "JsonVO",
			cutoverStatus: "available-in-apps-api-not-caller-verified",
		});

		expectManifestEntry("/app/fee.listFee", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/payment.nativeQrcodePayment", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "blocked-for-execution",
		});
		expectManifestEntry("/app/reportFeeMonthStatistics.queryReportFeeSummary", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
	});

	test("admin canonical adapter returns JsonVO instead of app legacy envelope", async () => {
		const admin = createAdminFeeAdapter(createFeeService(createInMemoryFeeRepository()));

		const response = await admin.listHouseCharges({ pageIndex: 1, pageSize: 20 });

		expect(response).toMatchObject({
			success: true,
			code: 200,
			message: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				pageIndex: 1,
				pageSize: 20,
			},
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("app legacy allowlist endpoint returns the old code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/fee.listFee",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("manifest does not claim uncut or unavailable endpoints are cut over", () => {
		expectManifestEntry("/app/ownerRepair.listOwnerRepairs", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "not-in-app-shadow-allowlist",
		});
		expectManifestEntry("/app/dict.queryRepairStates", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "not-in-app-shadow-allowlist",
		});

		const urls = runtimeEndpointManifest.map((item) => item.url);
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/create");
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/update");
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/delete");
		expect(urls).not.toContain("/callComponent/core/list");
	});

	test("manifest marks high-risk app legacy mutation actions as blocked for execution", () => {
		for (const url of [
			"/app/payment.nativeQrcodePayment",
			"/app/oweFeeCallable.writeOweFeeCallable",
			"/app/fee.saveRoomCreateFee",
		]) {
			expectManifestEntry(url, {
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				cutoverStatus: "blocked-for-execution",
			});
		}
	});
});

function expectManifestEntry(url: string, expected: Record<string, unknown>): void {
	expect(runtimeEndpointManifest).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				url,
				...expected,
			}),
		]),
	);
}
