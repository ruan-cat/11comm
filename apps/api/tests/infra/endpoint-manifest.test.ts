import { test, describe } from "vitest";
import { expect } from "vitest";

import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";
import endpointsHandler from "../../server/routes/__nitro/endpoints.get";

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

const contractManageCoveredAdminListEndpoints = [
	"/api/property-manage/contract-manage/archive/list",
	"/api/property-manage/contract-manage/attachment/list",
	"/api/property-manage/contract-manage/clause/list",
	"/api/property-manage/contract-manage/change/list",
	"/api/property-manage/contract-manage/draft-contract/list",
	"/api/property-manage/contract-manage/expire/list",
	"/api/property-manage/contract-manage/first-party/list",
	"/api/property-manage/contract-manage/print/list",
	"/api/property-manage/contract-manage/review/list",
	"/api/property-manage/contract-manage/second-party/list",
	"/api/property-manage/contract-manage/template/list",
	"/api/property-manage/contract-manage/type/list",
] as const;

const contractManageChangeCrudEndpoints = [
	{ url: "/api/property-manage/contract-manage/change/create", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/detail", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/update", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/delete", method: "POST" },
] as const;

const contractManageDraftContractCrudEndpoints = [
	{ url: "/api/property-manage/contract-manage/draft-contract/create", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/detail", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/update", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/delete", method: "POST" },
] as const;

const devConfigManageCenterEndpoints = [
	{ url: "/api/dev-team/config-manage/center/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/center/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/center/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/center/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/center/delete", method: "POST" },
] as const;

const devConfigManageDictionaryEndpoints = [
	{ url: "/api/dev-team/config-manage/dictionary/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/dictionary/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/dictionary/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/dictionary/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/dictionary/delete", method: "POST" },
] as const;

const devConfigManageItemEndpoints = [
	{ url: "/api/dev-team/config-manage/item/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/item/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/delete", method: "POST" },
] as const;

const devConfigManageTypeEndpoints = [
	{ url: "/api/dev-team/config-manage/type/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/type/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/type/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/type/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/type/delete", method: "POST" },
] as const;

const settingSystemChangePasswordEndpoints = [
	{ url: "/api/setting-manage/system-manage/change-password/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/delete", method: "POST" },
] as const;

const settingSystemConfigEndpoints = [
	{ url: "/api/setting-manage/system-manage/system-config/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/delete", method: "POST" },
] as const;

const settingSystemCommunityConfigurationEndpoints = [
	{ url: "/api/setting-manage/system-manage/community-configuration/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/delete", method: "POST" },
] as const;

const settingSystemInitializeCellEndpoints = [
	{ url: "/api/setting-manage/system-manage/initialize-cell/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/delete", method: "POST" },
] as const;

const settingSystemRegisterProtocolEndpoints = [
	{ url: "/api/setting-manage/system-manage/register-protocol/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/delete", method: "POST" },
] as const;

const settingOrganizeEdgeEndpoints = [
	{ url: "/api/setting-manage/organize-manage/org-info/tree", method: "POST" },
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

describe("phase7 endpoint manifest", () => {
	test("contains migrated app legacy slices without widening unrelated modules", () => {
		const urls = runtimeEndpointManifest.map((item) => item.url);

		expect(urls).toContain("/app/fee.listFee");
		expect(urls).toContain("/app/payment.nativeQrcodePayment");
		expect(urls).toContain("/app/reportFeeMonthStatistics.queryReportFeeSummary");
		expect(urls).toContain("/app/iot/listChargeMachineBmoImpl");
		expect(urls).toContain("/app/iot/listChargeMachineOrderBmoImpl");
		expect(urls).toContain("/app/iot/listChargeMachinePortBmoImpl");
		expect(urls).toContain("/app/machine/listMachineRecords");
		expect(urls).toContain("/app/ownerRepair.listOwnerRepairs");
		expect(urls).toContain("/app/ownerRepair.queryOwnerRepair");
		expect(urls).toContain("/app/ownerRepair.saveOwnerRepair");
		expect(urls).toContain("/app/repairSetting.listRepairSettings");
		expect(urls).toContain("/app/dict.queryRepairStates");
		expect(urls).toContain("/app/dict.queryPayTypes");
		expect(urls).toContain("/app/ownerRepair.getRepairStatistics");
		expect(urls).toContain("/app/ownerRepair.listRepairStaffRecords");
		expect(urls).toContain("/app/ownerRepair.listRepairStaffs");
		expect(urls).toContain("/app/repair.listRepairTypeUsers");
		expect(urls).toContain("/app/resourceStore.listResources");
		expect(urls).toContain("/app/staff.listStaffs");
		expect(urls).toContain("/app/inspection.getTodayReport");
		expect(urls).toContain("/app/inspection.listInspectionItemTitles");
		expect(urls).toContain("/app/inspection.listInspectionTasks");
		expect(urls).toContain("/app/inspection.listInspectionTaskDetails");
		expect(urls).toContain("/app/meter.queryFeeTypes");
		expect(urls).toContain("/app/meter.queryFeeTypesItems");
		expect(urls).toContain("/app/meter.listMeterType");
		expect(urls).toContain("/app/meter.listMeterWaters");
		expect(urls).toContain("/app/meter.queryPreMeterWater");
		expect(urls).toContain("/app/meter.listFloorShareReading");
		expect(urls).toContain("/app/meter.listFloorShareMeter");
		expect(urls).toContain("/callComponent/core/list");
		expect(urls).toContain("/callComponent/ownerRepair.appraiseRepair");
		expect(urls).toContain("/app/floor.queryFloors");
		expect(urls).toContain("/app/floor.queryFloorDetail");
		expect(urls).toContain("/app/workorder/todo/list");
		expect(urls).toContain("/app/workorder/detail");
		expect(urls).toContain("/app/workorder/copy/list");
		expect(urls).toContain("/app/workorder/task/list");
		expect(urls).toContain("/app/workorder/task/items");
		expect(urls).toContain("/app/workorder/create");
		expect(urls).toContain("/app/workorder/update");
		expect(urls).toContain("/app/workorder/start");
		expect(urls).toContain("/app/workorder/complete");
		expect(urls).toContain("/app/workorder/audit");
		expect(urls).toContain("/app/workorder/cancel");
		expect(urls).toContain("/app/workorder/copy/finish");
		expect(urls).toContain("/app/visit.getVisit");
		expect(urls).toContain("/app/visit.getVisitDetail");
		expect(urls).toContain("/app/visit.auditVisit");
		expect(urls).toContain("/app/profile.getUserProfile");
		expect(urls).toContain("/app/profile.listCommunities");
		expect(urls).toContain("/app/profile.listAttendanceRecords");
		expect(urls).toContain("/app/video.listMonitorArea");
		expect(urls).toContain("/app/video.listStaffMonitorMachine");
		expect(urls).toContain("/app/video.getPlayVideoUrl");
		expect(urls).toContain("/app/notice.listNotices");
		expect(urls).toContain("/app/activities.listActivitiess");
		expect(urls).toContain("/app/communitySpace.listCommunitySpaceConfirmOrder");
		expect(urls).toContain("/app/communitySpace.saveCommunitySpaceConfirmOrder");
		expect(urls).toContain("/app/auditUser.listAuditComplaints");
		expect(urls).toContain("/app/auditUser.listAuditHistoryComplaints");
		expect(urls).toContain("/app/complaint.listComplaintEvent");
		expect(urls).toContain("/app/complaintAppraise.listComplaintAppraise");
		expect(urls).toContain("/app/complaint");
		expect(urls).toContain("/app/complaint.auditComplaint");
		expect(urls).toContain("/app/complaintAppraise.replyComplaintAppraise");
		expect(urls).toContain("/app/contact.listContacts");
		expect(urls).toContain("/app/contact.getContactDetail");
		expect(urls).toContain("/app/contact.getContactsByDepartment");
		expect(urls).toContain("/app/contact.searchContacts");
		expect(urls).toContain("/app/contact.getDepartments");
		expect(urls).toContain("/app/contact.getFavoriteContacts");
		expect(urls).toContain("/app/contact.getEmergencyContacts");
		expect(urls).toContain("/app/contact.updateOnlineStatus");
		expect(urls).toContain("/app/room.queryRooms");
		expect(urls).toContain("/app/room.queryRoomDetail");
		expect(urls).toContain("/app/unit.queryUnits");
		expect(urls).toContain("/app/unit.queryUnitDetail");
		expect(urls).toContain("/app/owner.queryOwnerAndMembers");
		expect(urls).toContain("/app/owner.saveRoomOwner");
		expect(urls).toContain("/app/owner.editOwner");
		expect(urls).toContain("/app/owner.deleteOwner");
		expect(urls).toContain("/app/feeDiscount/queryFeeDiscount");
		expect(urls).toContain("/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail");
		expect(urls).toContain("/app/itemRelease.getItemRelease");
		expect(urls).toContain("/app/itemRelease.getItemReleaseRes");
		expect(urls).toContain("/app/itemRelease.queryOaWorkflowUser");
		expect(urls).toContain("/app/itemRelease.queryUndoItemReleaseV2");
		expect(urls).toContain("/app/itemRelease.queryFinishItemReleaseV2");
		expect(urls).toContain("/app/itemRelease.auditItemRelease");
		expect(urls).toContain("/app/purchase/updatePurchaseApply");
		expect(urls).toContain("/app/couponProperty.listCouponPropertyUserDetail");
		expect(urls).toContain("/app/integral.listIntegralSetting");
		expect(urls).toContain("/app/integral.listIntegralUserDetail");
		expect(urls).toContain("/app/couponProperty.writeOffCouponPropertyUser");
		expect(urls).toContain("/app/integral.useIntegral");
		expect(urls).toContain("/app/reserveOrder.listReserveGoodsConfirmOrder");
		expect(urls).toContain("/app/reserveOrder.saveReserveGoodsConfirmOrder");
		expect(urls).toContain("/app/maintenance.listMaintenanceTasks");
		expect(urls).toContain("/app/maintenance.queryMaintenanceTask");
		expect(urls).toContain("/app/maintenance.listMaintenanceTaskDetails");
		expect(urls).toContain("/app/maintenance.startMaintenanceTask");
		expect(urls).toContain("/app/maintenance.completeMaintenanceTask");
		expect(urls).toContain("/app/maintenance.submitMaintenanceSingle");
		expect(urls).toContain("/app/maintenance.transferMaintenanceTask");
		for (const url of expenseManageAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of reportManageAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of contractManageCoveredAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const endpoint of contractManageChangeCrudEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of contractManageDraftContractCrudEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of devConfigManageCenterEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of devConfigManageDictionaryEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of devConfigManageItemEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of devConfigManageTypeEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of settingSystemChangePasswordEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of settingSystemConfigEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of settingSystemCommunityConfigurationEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of settingSystemInitializeCellEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of settingSystemRegisterProtocolEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const endpoint of settingOrganizeEdgeEndpoints) {
			expect(urls).toContain(endpoint.url);
		}
		for (const url of operationTeamAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of patrolAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of parkingAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of communityManageAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		for (const url of housePropertyManageAdminListEndpoints) {
			expect(urls).toContain(url);
		}
		expect(urls).not.toContain("/app/ownerRepair.repairDispatch");
		expect(urls).not.toContain("/app/ownerRepair.updateOwnerRepair");
		expect(urls).not.toContain("/app/ownerRepair.repairFinish");
		expect(urls).not.toContain("/app/ownerRepair.repairEnd");
		expect(urls).not.toContain("/app/ownerRepair.repairStart");
		expect(urls).not.toContain("/app/ownerRepair.repairStop");
		expect(urls).not.toContain("/app/ownerRepair.grabbingRepair");
		expect(urls).not.toContain("/app/repair.replyRepairAppraise");
		expect(urls).toContain("/app/inspection.submitInspection");
		expect(urls).toContain("/app/inspection.transferTask");
		expect(urls).toContain("/app/meter.saveMeterWater");
		expect(urls).toContain("/app/meter.saveFloorShareReading");
		expect(urls).toContain("/app/meter.auditFloorShareReading");
		expect(urls).toContain("/app/profile.changeCommunity");
		expect(urls).toContain("/app/profile.changePassword");
		expect(urls).toContain("/app/activities.likeActivity");
		expect(urls).toContain("/app/activities.increaseView");
		expect(urls).toContain("/app/activities.updateStatus");
		expect(urls).toContain("/app/activities.updateLike");
		expect(urls).toContain("/app/activities.updateCollect");
		expect(urls).toContain("/app/activities.saveActivities");
		expect(urls).toContain("/app/activities.updateActivities");
		expect(urls).toContain("/app/activities.deleteActivities");
		expect(urls).not.toContain("/app/ownerRepair.listStaffRepairs");
		expect(urls).not.toContain("/app/applyRoomDiscount/queryApplyRoomDiscount");
		expect(urls).not.toContain("/app/applyRoomDiscount/updateApplyRoomDiscount");
		expect(urls).not.toContain("/app/applyRoomDiscount/updateReviewApplyRoomDiscount");
		expect(urls).not.toContain("/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord");
		expect(urls).not.toContain("/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord");
		expect(urls).not.toContain("/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord");
		expect(urls).not.toContain("/app/resourceStore.listResourceStores");
		expect(urls).not.toContain("/app/owner.queryOwnerCars");
		expect(urls).not.toContain("/app/machine/openDoor");
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
					url: "/app/iot/listChargeMachineBmoImpl",
					method: ["GET", "POST"],
					targetClient: "app",
					routeKind: "app-legacy",
					ownerModule: "fee",
					phase: "phase7-fee-charge-machine-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/iot/listChargeMachineOrderBmoImpl",
					method: ["GET", "POST"],
					targetClient: "app",
					routeKind: "app-legacy",
					ownerModule: "fee",
					phase: "phase7-fee-charge-machine-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/iot/listChargeMachinePortBmoImpl",
					method: ["GET", "POST"],
					targetClient: "app",
					routeKind: "app-legacy",
					ownerModule: "fee",
					phase: "phase7-fee-charge-machine-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/machine/listMachineRecords",
					method: ["GET", "POST"],
					targetClient: "app",
					routeKind: "app-legacy",
					ownerModule: "fee",
					phase: "phase7-fee-machine-record-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/api/property-manage/report-manage/payment-details-form/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "fee",
					phase: "phase2-fee-payment-report",
					responseContract: "JsonVO",
					cutoverStatus: "available-in-apps-api-not-caller-verified",
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
					url: "/app/dict.queryPayTypes",
					method: ["GET", "POST"],
					ownerModule: "repair",
					phase: "phase7-repair-readonly",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/ownerRepair.getRepairStatistics",
					method: ["GET", "POST"],
					ownerModule: "repair",
					phase: "phase7-repair-readonly",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/ownerRepair.listRepairStaffRecords",
					method: ["GET", "POST"],
					ownerModule: "repair",
					phase: "phase7-repair-readonly",
					cutoverStatus: "app-shadow-allowlist",
				}),
				...[
					"/app/ownerRepair.listRepairStaffs",
					"/app/repair.listRepairTypeUsers",
					"/app/resourceStore.listResources",
				].map((url) =>
					expect.objectContaining({
						url,
						method: ["GET", "POST"],
						ownerModule: "repair",
						phase: "phase7-repair-readonly",
						cutoverStatus: "app-shadow-allowlist",
					}),
				),
				...[
					"/app/staff.listStaffs",
					"/app/inspection.getTodayReport",
					"/app/inspection.listInspectionItemTitles",
					"/app/inspection.listInspectionTasks",
					"/app/inspection.listInspectionTaskDetails",
				].map((url) =>
					expect.objectContaining({
						url,
						method: ["GET", "POST"],
						targetClient: "app",
						routeKind: "app-legacy",
						ownerModule: "inspection",
						phase: "phase7-inspection-readonly",
						responseContract: "{ code, msg, data }",
						cutoverStatus: "app-shadow-allowlist",
					}),
				),
				expect.objectContaining({
					url: "/app/inspection.submitInspection",
					method: "POST",
					targetClient: "app",
					routeKind: "app-legacy",
					ownerModule: "inspection",
					phase: "phase7-inspection-guarded-write-batch16",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/inspection.transferTask",
					method: "POST",
					targetClient: "app",
					routeKind: "app-legacy",
					ownerModule: "inspection",
					phase: "phase7-inspection-guarded-write-batch16",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				...[
					"/app/meter.queryFeeTypes",
					"/app/meter.queryFeeTypesItems",
					"/app/meter.listMeterType",
					"/app/meter.listMeterWaters",
					"/app/meter.queryPreMeterWater",
					"/app/meter.listFloorShareReading",
					"/app/meter.listFloorShareMeter",
				].map((url) =>
					expect.objectContaining({
						url,
						method: ["GET", "POST"],
						targetClient: "app",
						routeKind: "app-legacy",
						ownerModule: "meter",
						phase: "phase7-meter-readonly-batch13",
						responseContract: "{ code, msg, data }",
						cutoverStatus: "app-shadow-allowlist",
					}),
				),
				...["/app/meter.saveMeterWater", "/app/meter.saveFloorShareReading", "/app/meter.auditFloorShareReading"].map(
					(url) =>
						expect.objectContaining({
							url,
							method: "POST",
							targetClient: "app",
							routeKind: "app-legacy",
							ownerModule: "meter",
							phase: "phase7-meter-guarded-write-batch14",
							responseContract: "{ code, msg, data }",
							cutoverStatus: "blocked-for-execution",
						}),
				),
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
				expect.objectContaining({
					url: "/app/workorder/todo/list",
					method: ["GET", "POST"],
					ownerModule: "work-order",
					phase: "phase7-work-order-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/workorder/detail",
					method: ["GET", "POST"],
					ownerModule: "work-order",
					phase: "phase7-work-order-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/workorder/copy/list",
					method: ["GET", "POST"],
					ownerModule: "work-order",
					phase: "phase7-work-order-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/workorder/task/list",
					method: ["GET", "POST"],
					ownerModule: "work-order",
					phase: "phase7-work-order-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/workorder/task/items",
					method: ["GET", "POST"],
					ownerModule: "work-order",
					phase: "phase7-work-order-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				...[
					"/app/workorder/create",
					"/app/workorder/update",
					"/app/workorder/start",
					"/app/workorder/complete",
					"/app/workorder/audit",
					"/app/workorder/cancel",
					"/app/workorder/copy/finish",
				].map((url) =>
					expect.objectContaining({
						url,
						method: "POST",
						ownerModule: "work-order",
						phase: "phase7-work-order-guarded-write",
						responseContract: "{ code, msg, data }",
						cutoverStatus: "blocked-for-execution",
					}),
				),
				expect.objectContaining({
					url: "/app/visit.getVisit",
					method: ["GET", "POST"],
					ownerModule: "visit",
					phase: "phase7-visit-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/visit.getVisitDetail",
					method: ["GET", "POST"],
					ownerModule: "visit",
					phase: "phase7-visit-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/visit.auditVisit",
					method: "POST",
					ownerModule: "visit",
					phase: "phase7-visit-guarded-write",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/profile.getUserProfile",
					method: ["GET", "POST"],
					ownerModule: "profile",
					phase: "phase7-profile-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/profile.listCommunities",
					method: ["GET", "POST"],
					ownerModule: "profile",
					phase: "phase7-profile-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/profile.listAttendanceRecords",
					method: ["GET", "POST"],
					ownerModule: "profile",
					phase: "phase7-profile-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/video.listMonitorArea",
					method: ["GET", "POST"],
					ownerModule: "video",
					phase: "phase7-video-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/video.listStaffMonitorMachine",
					method: ["GET", "POST"],
					ownerModule: "video",
					phase: "phase7-video-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/video.getPlayVideoUrl",
					method: ["GET", "POST"],
					ownerModule: "video",
					phase: "phase7-video-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/notice.listNotices",
					method: ["GET", "POST"],
					ownerModule: "notice",
					phase: "phase7-notice-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/activities.listActivitiess",
					method: ["GET", "POST"],
					ownerModule: "activity",
					phase: "phase7-activity-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				...["/app/activities.likeActivity", "/app/activities.increaseView", "/app/activities.updateStatus"].map((url) =>
					expect.objectContaining({
						url,
						method: "POST",
						ownerModule: "activity",
						phase: "phase7-activity-guarded-write-batch17",
						responseContract: "{ code, msg, data }",
						cutoverStatus: "blocked-for-execution",
					}),
				),
				...["/app/activities.updateLike", "/app/activities.updateCollect"].map((url) =>
					expect.objectContaining({
						url,
						method: "POST",
						ownerModule: "activity",
						phase: "phase7-activity-guarded-write-batch24",
						responseContract: "{ code, msg, data }",
						cutoverStatus: "blocked-for-execution",
					}),
				),
				...[
					"/app/activities.saveActivities",
					"/app/activities.updateActivities",
					"/app/activities.deleteActivities",
				].map((url) =>
					expect.objectContaining({
						url,
						method: "POST",
						ownerModule: "activity",
						phase: "phase7-activity-guarded-write-batch25",
						responseContract: "{ code, msg, data }",
						cutoverStatus: "blocked-for-execution",
					}),
				),
				expect.objectContaining({
					url: "/app/communitySpace.listCommunitySpaceConfirmOrder",
					method: ["GET", "POST"],
					ownerModule: "appointment",
					phase: "phase7-appointment-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/communitySpace.saveCommunitySpaceConfirmOrder",
					method: "POST",
					ownerModule: "appointment",
					phase: "phase7-appointment-guarded-write",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/room.queryRooms",
					method: ["GET", "POST"],
					ownerModule: "room-unit",
					phase: "phase7-room-unit-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/room.queryRoomDetail",
					method: ["GET", "POST"],
					ownerModule: "room-unit",
					phase: "phase7-room-unit-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/unit.queryUnits",
					method: ["GET", "POST"],
					ownerModule: "room-unit",
					phase: "phase7-room-unit-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/unit.queryUnitDetail",
					method: ["GET", "POST"],
					ownerModule: "room-unit",
					phase: "phase7-room-unit-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/owner.queryOwnerAndMembers",
					method: ["GET", "POST"],
					ownerModule: "owner",
					phase: "phase7-owner-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/owner.saveRoomOwner",
					method: "POST",
					ownerModule: "owner",
					phase: "phase7-owner-guarded-write",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/owner.editOwner",
					method: "POST",
					ownerModule: "owner",
					phase: "phase7-owner-guarded-write",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/owner.deleteOwner",
					method: "POST",
					ownerModule: "owner",
					phase: "phase7-owner-guarded-write",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/feeDiscount/queryFeeDiscount",
					method: ["GET", "POST"],
					ownerModule: "property-application",
					phase: "phase7-property-application-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
					method: ["GET", "POST"],
					ownerModule: "property-application",
					phase: "phase7-property-application-readonly",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/itemRelease.getItemRelease",
					method: ["GET", "POST"],
					ownerModule: "item-release",
					phase: "phase7-item-release-readonly-batch20",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/itemRelease.getItemReleaseRes",
					method: ["GET", "POST"],
					ownerModule: "item-release",
					phase: "phase7-item-release-readonly-batch20",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/itemRelease.queryOaWorkflowUser",
					method: ["GET", "POST"],
					ownerModule: "item-release",
					phase: "phase7-item-release-readonly-batch20",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/itemRelease.queryUndoItemReleaseV2",
					method: ["GET", "POST"],
					ownerModule: "item-release",
					phase: "phase7-item-release-readonly-batch20",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/itemRelease.queryFinishItemReleaseV2",
					method: ["GET", "POST"],
					ownerModule: "item-release",
					phase: "phase7-item-release-readonly-batch20",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				expect.objectContaining({
					url: "/app/itemRelease.auditItemRelease",
					method: "POST",
					ownerModule: "item-release",
					phase: "phase7-item-release-guarded-write-batch21",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				expect.objectContaining({
					url: "/app/purchase/updatePurchaseApply",
					method: "POST",
					ownerModule: "purchase",
					phase: "phase7-purchase-guarded-write",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "blocked-for-execution",
				}),
				...[
					"/app/couponProperty.listCouponPropertyUserDetail",
					"/app/integral.listIntegralSetting",
					"/app/integral.listIntegralUserDetail",
				].map((url) =>
					expect.objectContaining({
						url,
						method: ["GET", "POST"],
						ownerModule: "coupon",
						phase: "phase7-coupon-readonly-batch22",
						responseContract: "{ code, msg, data }",
						cutoverStatus: "app-shadow-allowlist",
					}),
				),
				expect.objectContaining({
					url: "/app/reserveOrder.listReserveGoodsConfirmOrder",
					method: ["GET", "POST"],
					ownerModule: "coupon",
					phase: "phase7-coupon-readonly-batch28",
					responseContract: "{ code, msg, data }",
					cutoverStatus: "app-shadow-allowlist",
				}),
				...[
					"/app/couponProperty.writeOffCouponPropertyUser",
					"/app/integral.useIntegral",
					"/app/reserveOrder.saveReserveGoodsConfirmOrder",
				].map((url) =>
					expect.objectContaining({
						url,
						method: "POST",
						ownerModule: "coupon",
						phase: "phase7-coupon-guarded-write-batch28",
						responseContract: "{ code, msg, data }",
						cutoverStatus: "blocked-for-execution",
					}),
				),
				...[
					"/app/maintenance.listMaintenanceTasks",
					"/app/maintenance.queryMaintenanceTask",
					"/app/maintenance.listMaintenanceTaskDetails",
				].map((url) =>
					expect.objectContaining({
						url,
						method: ["GET", "POST"],
						ownerModule: "maintenance",
						phase: "phase7-maintenance-readonly-batch23",
						responseContract: "{ success, code, message, data, timestamp }",
						cutoverStatus: "app-shadow-allowlist",
					}),
				),
				...[
					"/app/maintenance.startMaintenanceTask",
					"/app/maintenance.completeMaintenanceTask",
					"/app/maintenance.submitMaintenanceSingle",
					"/app/maintenance.transferMaintenanceTask",
				].map((url) =>
					expect.objectContaining({
						url,
						method: "POST",
						ownerModule: "maintenance",
						phase: "phase7-maintenance-guarded-write-batch27",
						responseContract: "{ success, code, message, data, timestamp }",
						cutoverStatus: "blocked-for-execution",
					}),
				),
				...expenseManageAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "fee",
						phase: "phase7-expense-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...reportManageAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "fee-report",
						phase: "phase7-report-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...contractManageCoveredAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "contract",
						phase: "phase7-contract-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...[...contractManageChangeCrudEndpoints, ...contractManageDraftContractCrudEndpoints].map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "contract",
						phase: "phase7-contract-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...devConfigManageCenterEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "dev",
						phase: "phase7-dev-config-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...devConfigManageDictionaryEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "dev",
						phase: "phase7-dev-config-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...devConfigManageItemEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "dev",
						phase: "phase7-dev-config-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...devConfigManageTypeEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "dev",
						phase: "phase7-dev-config-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...settingSystemChangePasswordEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "setting",
						phase: "phase7-setting-system-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...settingSystemConfigEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "setting",
						phase: "phase7-setting-system-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...settingSystemCommunityConfigurationEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "setting",
						phase: "phase7-setting-system-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...settingSystemInitializeCellEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "setting",
						phase: "phase7-setting-system-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...settingSystemRegisterProtocolEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "setting",
						phase: "phase7-setting-system-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...settingOrganizeEdgeEndpoints.map((endpoint) =>
					expect.objectContaining({
						url: endpoint.url,
						method: endpoint.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "setting",
						phase: "phase7-setting-organize-manage-admin-edge",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				expect.objectContaining({
					url: "/api/property-manage/repairs-manage/repairs-have-done/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
				}),
				expect.objectContaining({
					url: "/api/property-manage/repairs-manage/return-visit/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
				}),
				expect.objectContaining({
					url: "/api/property-manage/repairs-manage/phone-report-repairs/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
				}),
				expect.objectContaining({
					url: "/api/property-manage/repairs-manage/mandatory-return-issue/list",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "repair",
					phase: "phase4a-repair-minimal",
				}),
				...operationTeamAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "operation",
						phase: "phase7-operation-team-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...patrolAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "patrol",
						phase: "phase7-patrol-parking-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...parkingAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "parking",
						phase: "phase7-patrol-parking-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...communityManageAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "community",
						phase: "phase7-community-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
				...housePropertyManageAdminListEndpoints.map((url) =>
					expect.objectContaining({
						url,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "house-property",
						phase: "phase7-house-property-manage-admin-list",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				),
			]),
		});
	});
});
