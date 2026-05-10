import { test, describe } from "vitest";
import { expect } from "vitest";

import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";
import endpointsHandler from "../../server/routes/__nitro/endpoints.get";

describe("phase7 endpoint manifest", () => {
	test("contains migrated app legacy slices without widening unrelated modules", () => {
		const urls = runtimeEndpointManifest.map((item) => item.url);

		expect(urls).toContain("/app/fee.listFee");
		expect(urls).toContain("/app/payment.nativeQrcodePayment");
		expect(urls).toContain("/app/reportFeeMonthStatistics.queryReportFeeSummary");
		expect(urls).toContain("/app/ownerRepair.listOwnerRepairs");
		expect(urls).toContain("/app/ownerRepair.queryOwnerRepair");
		expect(urls).toContain("/app/ownerRepair.saveOwnerRepair");
		expect(urls).toContain("/app/repairSetting.listRepairSettings");
		expect(urls).toContain("/app/dict.queryRepairStates");
		expect(urls).toContain("/callComponent/core/list");
		expect(urls).toContain("/callComponent/ownerRepair.appraiseRepair");
		expect(urls).toContain("/app/floor.queryFloors");
		expect(urls).toContain("/app/floor.queryFloorDetail");
		expect(urls).not.toContain("/app/ownerRepair.repairDispatch");
		expect(urls).not.toContain("/app/ownerRepair.listStaffRepairs");
		expect(urls).not.toContain("/app/resourceStore.listResourceStores");
		expect(urls).not.toContain("/app/resourceStore.listResources");
		expect(urls).not.toContain("/app/owner.queryOwnerCars");
		expect(urls).not.toContain("/app/machine/listMachineRecords");
	});

	test("exposes readonly endpoint manifest without database configuration", async () => {
		const response = await endpointsHandler({ context: {}, res: { headers: new Headers() } } as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			phase: "phase3-infra",
			data: expect.arrayContaining([
				expect.objectContaining({
					url: "/app/fee.listFee",
					ownerModule: "fee",
					phase: "phase2-fee-payment-report",
				}),
				expect.objectContaining({
					url: "/app/ownerRepair.listOwnerRepairs",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/ownerRepair.queryOwnerRepair",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/repairSetting.listRepairSettings",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/dict.queryRepairStates",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/ownerRepair.saveOwnerRepair",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/floor.queryFloors",
					method: ["GET", "POST"],
					ownerModule: "floor",
					phase: "phase7-batch2-floor",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/floor.queryFloorDetail",
					method: ["GET", "POST"],
					ownerModule: "floor",
					phase: "phase7-batch2-floor",
					cutoverStatus: "app-shadow-allowlist",
				}),
			]),
		});
	});
});
