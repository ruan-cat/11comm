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

	test("runtime endpoint definitions include only allowed Phase2, Phase4A, and Phase7 legacy endpoints", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/app/fee.listFee")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/payment.nativeQrcodePayment")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/reportFeeMonthStatistics.queryReportFeeSummary")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listOwnerRepairs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/repairSetting.listRepairSettings")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/dict.queryRepairStates")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/todo/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/detail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/copy/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/task/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/task/items")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/visit.getVisit")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/visit.getVisitDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/profile.getUserProfile")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/profile.listCommunities")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/profile.listAttendanceRecords")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/video.listMonitorArea")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/video.listStaffMonitorMachine")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/video.getPlayVideoUrl")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/notice.listNotices")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.listActivitiess")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/purchase/updatePurchaseApply")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairDispatch")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/create")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/copy/finish")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/visit.auditVisit")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/profile.changeCommunity")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/profile.changePassword")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/resourceStore.listResources")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.saveActivities")).toBeUndefined();
	});
});
