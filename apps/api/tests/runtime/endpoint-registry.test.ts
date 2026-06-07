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
		expect(findEndpointDefinition(registry, "GET", "/app/dict.queryPayTypes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/dict.queryPayTypes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.getRepairStatistics")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.getRepairStatistics")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listRepairStaffRecords")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.listRepairStaffRecords")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listRepairStaffs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.listRepairStaffs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/repair.listRepairTypeUsers")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/repair.listRepairTypeUsers")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/resourceStore.listResources")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/resourceStore.listResources")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/staff.listStaffs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/staff.listStaffs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/inspection.getTodayReport")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/inspection.getTodayReport")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/inspection.listInspectionItemTitles")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/inspection.listInspectionItemTitles")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/inspection.listInspectionTasks")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/inspection.listInspectionTasks")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/inspection.listInspectionTaskDetails")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/inspection.listInspectionTaskDetails")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/inspection.submitInspection")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/inspection.submitInspection")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/inspection.transferTask")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/inspection.transferTask")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.queryFeeTypes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.queryFeeTypes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.queryFeeTypesItems")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.queryFeeTypesItems")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.listMeterType")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.listMeterType")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.listMeterWaters")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.listMeterWaters")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.queryPreMeterWater")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.queryPreMeterWater")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.listFloorShareReading")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.listFloorShareReading")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.listFloorShareMeter")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.listFloorShareMeter")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.saveMeterWater")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.saveFloorShareReading")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/meter.auditFloorShareReading")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.saveMeterWater")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.saveFloorShareReading")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/meter.auditFloorShareReading")).toBeUndefined();
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
		expect(findEndpointDefinition(registry, "POST", "/app/activities.listActivitiess")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/communitySpace.listCommunitySpaceConfirmOrder")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/communitySpace.listCommunitySpaceConfirmOrder")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/communitySpace.saveCommunitySpaceConfirmOrder")).toBeTruthy();
		expect(
			findEndpointDefinition(registry, "GET", "/app/communitySpace.saveCommunitySpaceConfirmOrder"),
		).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/auditUser.listAuditComplaints")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/auditUser.listAuditHistoryComplaints")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/complaint.listComplaintEvent")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/complaintAppraise.listComplaintAppraise")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/complaint")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/complaint.auditComplaint")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/complaintAppraise.replyComplaintAppraise")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/complaint")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/contact.listContacts")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/contact.getContactDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/contact.getContactsByDepartment")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/contact.searchContacts")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/contact.getDepartments")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/contact.getFavoriteContacts")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/contact.getEmergencyContacts")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/contact.updateOnlineStatus")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/contact.updateOnlineStatus")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/room.queryRooms")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/room.queryRoomDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/unit.queryUnits")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/unit.queryUnitDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/owner.queryOwnerAndMembers")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/owner.queryOwnerAndMembers")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/owner.saveRoomOwner")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/owner.editOwner")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/owner.deleteOwner")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/owner.saveRoomOwner")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/owner.editOwner")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/owner.deleteOwner")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/feeDiscount/queryFeeDiscount")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/feeDiscount/queryFeeDiscount")).toBeTruthy();
		expect(
			findEndpointDefinition(registry, "GET", "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail"),
		).toBeTruthy();
		expect(
			findEndpointDefinition(registry, "POST", "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail"),
		).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.getItemRelease")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.getItemRelease")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.getItemReleaseRes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.getItemReleaseRes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.queryOaWorkflowUser")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.queryOaWorkflowUser")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.queryUndoItemReleaseV2")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.queryUndoItemReleaseV2")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.queryFinishItemReleaseV2")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.queryFinishItemReleaseV2")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.auditItemRelease")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.auditItemRelease")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/applyRoomDiscount/queryApplyRoomDiscount")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/applyRoomDiscount/updateApplyRoomDiscount")).toBeUndefined();
		expect(
			findEndpointDefinition(registry, "POST", "/app/applyRoomDiscount/updateReviewApplyRoomDiscount"),
		).toBeUndefined();
		expect(
			findEndpointDefinition(registry, "GET", "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord"),
		).toBeUndefined();
		expect(
			findEndpointDefinition(registry, "POST", "/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord"),
		).toBeUndefined();
		expect(
			findEndpointDefinition(registry, "POST", "/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord"),
		).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/purchase/updatePurchaseApply")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/resourceStore.listResourceStores")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/resourceStore.listResourceStores")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/purchase/purchaseApply")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/purchase/purchaseApply")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/purchase/urgentPurchaseApply")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/purchase/urgentPurchaseApply")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/couponProperty.listCouponPropertyUserDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/couponProperty.listCouponPropertyUserDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/integral.listIntegralSetting")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/integral.listIntegralSetting")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/integral.listIntegralUserDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/integral.listIntegralUserDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/couponProperty.writeOffCouponPropertyUser")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/couponProperty.writeOffCouponPropertyUser")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/integral.useIntegral")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/integral.useIntegral")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/maintenance.listMaintenanceTasks")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/maintenance.listMaintenanceTasks")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/maintenance.queryMaintenanceTask")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/maintenance.queryMaintenanceTask")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/maintenance.listMaintenanceTaskDetails")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/maintenance.listMaintenanceTaskDetails")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/maintenance.startMaintenanceTask")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/maintenance.completeMaintenanceTask")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/maintenance.submitMaintenanceSingle")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/maintenance.transferMaintenanceTask")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/maintenance.startMaintenanceTask")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/maintenance.completeMaintenanceTask")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/maintenance.submitMaintenanceSingle")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/maintenance.transferMaintenanceTask")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/reserveOrder.listReserveGoodsConfirmOrder")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/reserveOrder.listReserveGoodsConfirmOrder")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/reserveOrder.saveReserveGoodsConfirmOrder")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/reserveOrder.saveReserveGoodsConfirmOrder")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairDispatch")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.updateOwnerRepair")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairFinish")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairEnd")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairStart")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairStop")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.grabbingRepair")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/repair.replyRepairAppraise")).toBeUndefined();
		for (const url of [
			"/app/workorder/create",
			"/app/workorder/update",
			"/app/workorder/start",
			"/app/workorder/complete",
			"/app/workorder/audit",
			"/app/workorder/cancel",
			"/app/workorder/copy/finish",
		]) {
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
		}
		expect(findEndpointDefinition(registry, "POST", "/app/visit.auditVisit")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/visit.auditVisit")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/profile.changeCommunity")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/profile.changePassword")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/profile.changeCommunity")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/profile.changePassword")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineBmoImpl")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/iot/listChargeMachineBmoImpl")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineOrderBmoImpl")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/iot/listChargeMachineOrderBmoImpl")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachinePortBmoImpl")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/iot/listChargeMachinePortBmoImpl")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/machine/listMachineRecords")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/machine/openDoor")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.likeActivity")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.increaseView")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.updateStatus")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.updateLike")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.updateCollect")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.saveActivities")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.updateActivities")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/activities.deleteActivities")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.likeActivity")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.increaseView")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.updateStatus")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.updateLike")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.updateCollect")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.saveActivities")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.updateActivities")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/activities.deleteActivities")).toBeUndefined();
	});
});
