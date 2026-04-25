import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
	normalizeEndpointMethod,
} from "../../server/shared/runtime/endpoint-registry";
import { legacyFailure, legacySuccess, adminFailure, adminSuccess } from "../../server/shared/runtime/response-builder";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("endpoint registry runtime", () => {
	test("normalizes method matching and dispatches registered endpoints", async () => {
		const registry = createEndpointRegistry([
			{
				url: "/app/fee.listFee",
				method: ["GET", "POST"],
				handler: (input) => legacySuccess({ path: input.path, method: input.method }, "ok"),
			},
		]);

		expect(normalizeEndpointMethod("get")).toBe("GET");
		expect(findEndpointDefinition(registry, "get", "/app/fee.listFee")).toBeTruthy();
		expect(findEndpointDefinition(registry, "DELETE", "/app/fee.listFee")).toBeUndefined();

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/missing",
			}),
		).rejects.toMatchObject({ statusCode: 404 });

		await expect(
			dispatchEndpoint(registry, {
				method: "post",
				path: "/app/fee.listFee",
			}),
		).resolves.toMatchObject({ code: 0, msg: "ok", data: { method: "POST" } });
	});

	test("builds legacy and admin response shapes", () => {
		expect(legacySuccess({ id: "FEE_001" }, "查询成功")).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: { id: "FEE_001" },
		});
		expect(legacyFailure("失败", 500)).toMatchObject({ code: 500, msg: "失败" });
		expect(adminSuccess({ list: [] })).toMatchObject({
			success: true,
			code: 200,
			message: "查询成功",
			data: { list: [] },
		});
		expect(adminFailure("查询失败", "boom")).toMatchObject({
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: "boom",
		});
	});

	test("runtime endpoint definitions only include Phase2 allowed legacy endpoints", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/app/fee.listFee")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/payment.nativeQrcodePayment")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/reportFeeMonthStatistics.queryReportFeeSummary")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords")).toBeUndefined();
	});
});
