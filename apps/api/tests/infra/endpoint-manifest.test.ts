import { test, describe } from "vitest";
import { expect } from "vitest";

import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";
import endpointsHandler from "../../server/routes/__nitro/endpoints.get";

describe("phase3 endpoint manifest", () => {
	test("only contains Phase2 fee payment report endpoints", () => {
		const urls = runtimeEndpointManifest.map((item) => item.url);

		expect(urls).toContain("/app/fee.listFee");
		expect(urls).toContain("/app/payment.nativeQrcodePayment");
		expect(urls).toContain("/app/reportFeeMonthStatistics.queryReportFeeSummary");
		expect(urls).not.toContain("/app/ownerRepair.listOwnerRepairs");
		expect(urls).not.toContain("/app/resourceStore.listResourceStores");
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
			]),
		});
	});
});
