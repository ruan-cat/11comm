import { activityLegacyEndpointDefinitions } from "../../modules/activity/legacy-endpoints";
import { appointmentLegacyEndpointDefinitions } from "../../modules/appointment/legacy-endpoints";
import { complaintLegacyEndpointDefinitions } from "../../modules/complaint/legacy-endpoints";
import { contactLegacyEndpointDefinitions } from "../../modules/contact/legacy-endpoints";
import { couponLegacyEndpointDefinitions } from "../../modules/coupon/legacy-endpoints";
import { feeLegacyEndpointDefinitions } from "../../modules/fee/legacy-endpoints";
import { floorLegacyEndpointDefinitions } from "../../modules/floor/legacy-endpoints";
import { inspectionLegacyEndpointDefinitions } from "../../modules/inspection/legacy-endpoints";
import { itemReleaseLegacyEndpointDefinitions } from "../../modules/item-release/legacy-endpoints";
import { maintenanceLegacyEndpointDefinitions } from "../../modules/maintenance/legacy-endpoints";
import { meterLegacyEndpointDefinitions } from "../../modules/meter/legacy-endpoints";
import { noticeLegacyEndpointDefinitions } from "../../modules/notice/legacy-endpoints";
import { ownerLegacyEndpointDefinitions } from "../../modules/owner/legacy-endpoints";
import { profileLegacyEndpointDefinitions } from "../../modules/profile/legacy-endpoints";
import { propertyApplicationLegacyEndpointDefinitions } from "../../modules/property-application/legacy-endpoints";
import { purchaseLegacyEndpointDefinitions } from "../../modules/purchase/legacy-endpoints";
import { repairLegacyEndpointDefinitions } from "../../modules/repair/legacy-endpoints";
import { roomUnitLegacyEndpointDefinitions } from "../../modules/room-unit/legacy-endpoints";
import { videoLegacyEndpointDefinitions } from "../../modules/video/legacy-endpoints";
import { visitLegacyEndpointDefinitions } from "../../modules/visit/legacy-endpoints";
import { workOrderLegacyEndpointDefinitions } from "../../modules/work-order/legacy-endpoints";
import type { EndpointDefinition } from "./endpoint-registry";

type EndpointManifestTargetClient = "admin" | "app";
type EndpointManifestRouteKind = "admin-canonical" | "app-legacy";
type EndpointManifestResponseContract =
	| "JsonVO"
	| "{ code, msg, data }"
	| "{ success, code, message, data, timestamp }";
type EndpointManifestCutoverStatus =
	| "app-shadow-allowlist"
	| "available-in-apps-api-not-caller-verified"
	| "blocked-for-execution"
	| "cut-to-apps-api"
	| "not-in-app-shadow-allowlist";

export interface RuntimeEndpointManifestItem {
	url: string;
	method: EndpointDefinition["method"];
	phase: string;
	ownerModule: string;
	targetClient: EndpointManifestTargetClient;
	routeKind: EndpointManifestRouteKind;
	responseContract: EndpointManifestResponseContract;
	cutoverStatus: EndpointManifestCutoverStatus;
}

const phase7BlockedAppLegacyMutationUrls = new Set([
	"/app/payment.nativeQrcodePayment",
	"/app/oweFeeCallable.writeOweFeeCallable",
	"/app/fee.saveRoomCreateFee",
	"/app/ownerRepair.saveOwnerRepair",
	"/callComponent/ownerRepair.appraiseRepair",
	"/app/communitySpace.saveCommunitySpaceConfirmOrder",
	"/app/complaint",
	"/app/complaint.auditComplaint",
	"/app/complaintAppraise.replyComplaintAppraise",
	"/app/contact.updateOnlineStatus",
	"/app/owner.saveRoomOwner",
	"/app/owner.editOwner",
	"/app/owner.deleteOwner",
	"/app/profile.changeCommunity",
	"/app/profile.changePassword",
	"/app/purchase/updatePurchaseApply",
	"/app/visit.auditVisit",
	"/app/itemRelease.auditItemRelease",
	"/app/inspection.submitInspection",
	"/app/inspection.transferTask",
	"/app/meter.saveMeterWater",
	"/app/meter.saveFloorShareReading",
	"/app/meter.auditFloorShareReading",
	"/app/activities.likeActivity",
	"/app/activities.increaseView",
	"/app/activities.updateStatus",
	"/app/activities.updateLike",
	"/app/activities.updateCollect",
	"/app/activities.saveActivities",
	"/app/activities.updateActivities",
	"/app/activities.deleteActivities",
	"/app/maintenance.startMaintenanceTask",
	"/app/maintenance.completeMaintenanceTask",
	"/app/maintenance.submitMaintenanceSingle",
	"/app/maintenance.transferMaintenanceTask",
	"/app/workorder/create",
	"/app/workorder/update",
	"/app/workorder/start",
	"/app/workorder/complete",
	"/app/workorder/audit",
	"/app/workorder/cancel",
	"/app/workorder/copy/finish",
]);

const phase7RepairReadonlyAppShadowUrls = new Set([
	"/app/ownerRepair.listOwnerRepairs",
	"/app/ownerRepair.queryOwnerRepair",
	"/app/repairSetting.listRepairSettings",
	"/app/dict.queryRepairStates",
	"/app/dict.queryPayTypes",
	"/app/ownerRepair.getRepairStatistics",
	"/app/ownerRepair.listRepairStaffRecords",
	"/app/ownerRepair.listRepairStaffs",
	"/app/repair.listRepairTypeUsers",
	"/app/resourceStore.listResources",
]);

const runtimeEndpointEntries = [
	...activityLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getActivityLegacyPhase(definition),
		ownerModule: "activity",
		cutoverStatus: getActivityLegacyCutoverStatus(definition),
	})),
	...appointmentLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getAppointmentLegacyPhase(definition),
		ownerModule: "appointment",
		cutoverStatus: getAppointmentLegacyCutoverStatus(definition),
	})),
	...complaintLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getComplaintLegacyPhase(definition),
		ownerModule: "complaint",
		cutoverStatus: getComplaintLegacyCutoverStatus(definition),
	})),
	...contactLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getContactLegacyPhase(definition),
		ownerModule: "contact",
		cutoverStatus: getContactLegacyCutoverStatus(definition),
	})),
	...couponLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-coupon-readonly-batch22",
		ownerModule: "coupon",
		cutoverStatus: "app-shadow-allowlist" as const,
	})),
	...roomUnitLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-room-unit-readonly",
		ownerModule: "room-unit",
		cutoverStatus: getRoomUnitLegacyCutoverStatus(definition),
	})),
	...ownerLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getOwnerLegacyPhase(definition),
		ownerModule: "owner",
		cutoverStatus: getOwnerLegacyCutoverStatus(definition),
	})),
	...feeLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getFeeLegacyPhase(definition),
		ownerModule: "fee",
		cutoverStatus: getFeeLegacyCutoverStatus(definition),
	})),
	...repairLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getRepairLegacyPhase(definition),
		ownerModule: "repair",
		cutoverStatus: getRepairLegacyCutoverStatus(definition),
	})),
	...inspectionLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getInspectionLegacyPhase(definition),
		ownerModule: "inspection",
		cutoverStatus: getInspectionLegacyCutoverStatus(definition),
	})),
	...meterLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getMeterLegacyPhase(definition),
		ownerModule: "meter",
		cutoverStatus: getMeterLegacyCutoverStatus(definition),
	})),
	...maintenanceLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getMaintenanceLegacyPhase(definition),
		ownerModule: "maintenance",
		cutoverStatus: getMaintenanceLegacyCutoverStatus(definition),
	})),
	...floorLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-batch2-floor",
		ownerModule: "floor",
		cutoverStatus: getFloorLegacyCutoverStatus(definition),
	})),
	...workOrderLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getWorkOrderLegacyPhase(definition),
		ownerModule: "work-order",
		cutoverStatus: getWorkOrderLegacyCutoverStatus(definition),
	})),
	...visitLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getVisitLegacyPhase(definition),
		ownerModule: "visit",
		cutoverStatus: getVisitLegacyCutoverStatus(definition),
	})),
	...profileLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getProfileLegacyPhase(definition),
		ownerModule: "profile",
		cutoverStatus: getProfileLegacyCutoverStatus(definition),
	})),
	...propertyApplicationLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-property-application-readonly",
		ownerModule: "property-application",
		cutoverStatus: "app-shadow-allowlist" as const,
	})),
	...videoLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-video-readonly",
		ownerModule: "video",
		cutoverStatus: getVideoLegacyCutoverStatus(definition),
	})),
	...noticeLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-notice-readonly",
		ownerModule: "notice",
		cutoverStatus: getNoticeLegacyCutoverStatus(definition),
	})),
	...itemReleaseLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: getItemReleaseLegacyPhase(definition),
		ownerModule: "item-release",
		cutoverStatus: getItemReleaseLegacyCutoverStatus(definition),
	})),
	...purchaseLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-purchase-guarded-write",
		ownerModule: "purchase",
		cutoverStatus: getPurchaseLegacyCutoverStatus(definition),
	})),
];

const adminCanonicalEndpointManifestEntries: RuntimeEndpointManifestItem[] = [
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/house-charge/list",
		"phase5a-expense-manage",
		"fee",
		"cut-to-apps-api",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/house-charge/detail",
		"phase5a-expense-manage",
		"fee",
		"cut-to-apps-api",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/expense-item-setting/list",
		"phase5a-expense-manage",
		"fee",
		"cut-to-apps-api",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/expense-item-setting/detail",
		"phase5a-expense-manage",
		"fee",
		"cut-to-apps-api",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/expense-item-setting/create",
		"phase5a-expense-manage",
		"fee",
		"cut-to-apps-api",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/expense-item-setting/update",
		"phase5a-expense-manage",
		"fee",
		"cut-to-apps-api",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/expense-item-setting/delete",
		"phase5a-expense-manage",
		"fee",
		"cut-to-apps-api",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/cancel-fee/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/contracte-charge/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/discount-apply/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/discount-setting/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/discount-type/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/expense-summary-table/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/meter-reading-type/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/overdue-payment-information/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/payment-review/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/refund-review/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/reminder-for-overdue-payments/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/reprint-voucher/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/vehicle-charge/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/expense-manage/water-and-electricity-meter-reading/list",
		"phase7-expense-manage-admin-list",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/center/list",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/center/create",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/center/detail",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
		"GET",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/center/update",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/center/delete",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/dictionary/list",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/dictionary/create",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/dictionary/detail",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
		"GET",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/dictionary/update",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/dictionary/delete",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/item/list",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/item/create",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/item/detail",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
		"GET",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/item/update",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/item/delete",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/type/list",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/type/create",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/type/detail",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
		"GET",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/type/update",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/dev-team/config-manage/type/delete",
		"phase7-dev-config-manage-admin-crud",
		"dev",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/change-password/list",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/change-password/create",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/change-password/update",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/change-password/delete",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/system-config/list",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/system-config/create",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/system-config/update",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/system-config/delete",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/community-configuration/list",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/community-configuration/create",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/community-configuration/update",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/community-configuration/delete",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/initialize-cell/list",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/initialize-cell/create",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/initialize-cell/update",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/initialize-cell/delete",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/register-protocol/list",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/register-protocol/create",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/register-protocol/update",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/system-manage/register-protocol/delete",
		"phase7-setting-system-manage-admin-crud",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/setting-manage/organize-manage/org-info/tree",
		"phase7-setting-organize-manage-admin-edge",
		"setting",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/payment-details-form/list",
		"phase2-fee-payment-report",
		"fee",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/arrears-details-list/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/data-statistics/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/deposit-report/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/expense-summary-table/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/fee-reminder/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/no-charge-house/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/outstanding-fees-analysis/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/owner-payment-details/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/patrol-report/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/repair-report-form/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/repair-reports-summary-table/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/report-manage/statement-expenses/list",
		"phase7-report-manage-admin-list",
		"fee-report",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/archive/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/attachment/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/clause/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/change/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/change/create",
		"phase7-contract-manage-admin-crud",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/change/detail",
		"phase7-contract-manage-admin-crud",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/change/update",
		"phase7-contract-manage-admin-crud",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/change/delete",
		"phase7-contract-manage-admin-crud",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/draft-contract/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/draft-contract/create",
		"phase7-contract-manage-admin-crud",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/draft-contract/detail",
		"phase7-contract-manage-admin-crud",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/draft-contract/update",
		"phase7-contract-manage-admin-crud",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/draft-contract/delete",
		"phase7-contract-manage-admin-crud",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/upload/init",
		"phase7-contract-manage-upload-r2",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/upload/sign-part",
		"phase7-contract-manage-upload-r2",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/upload/complete",
		"phase7-contract-manage-upload-r2",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/upload/abort",
		"phase7-contract-manage-upload-r2",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/upload/status",
		"phase7-contract-manage-upload-r2",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/expire/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/first-party/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/print/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/review/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/second-party/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/template/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/contract-manage/type/list",
		"phase7-contract-manage-admin-list",
		"contract",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/repairs-manage/repairs-todo/list",
		"phase4a-repair-minimal",
		"repair",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/repairs-manage/repairs-setting/list",
		"phase4a-repair-minimal",
		"repair",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/repairs-manage/issues/list",
		"phase4a-repair-minimal",
		"repair",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/repairs-manage/repairs-have-done/list",
		"phase4a-repair-minimal",
		"repair",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/repairs-manage/return-visit/list",
		"phase4a-repair-minimal",
		"repair",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/repairs-manage/phone-report-repairs/list",
		"phase4a-repair-minimal",
		"repair",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/repairs-manage/mandatory-return-issue/list",
		"phase4a-repair-minimal",
		"repair",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/data-manage/community-information/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/data-manage/property-company/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/data-manage/property-management-company/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/system-manage/change-password/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/system-manage/system-config/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/system-manage/register-protocol/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/system-manage/community-configuration/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/system-manage/initialize-cell/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/merchant-manage/merchant-info/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/merchant-manage/merchant-admin/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/report-configuration/report-info/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/report-configuration/report-group/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/operation-team/report-configuration/report-component/list",
		"phase7-operation-team-admin-list",
		"operation",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/patrol-manage/detail/list",
		"phase7-patrol-parking-admin-list",
		"patrol",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/patrol-manage/item/list",
		"phase7-patrol-parking-admin-list",
		"patrol",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/patrol-manage/path/list",
		"phase7-patrol-parking-admin-list",
		"patrol",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/patrol-manage/plan/list",
		"phase7-patrol-parking-admin-list",
		"patrol",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/patrol-manage/point/list",
		"phase7-patrol-parking-admin-list",
		"patrol",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/patrol-manage/task/list",
		"phase7-patrol-parking-admin-list",
		"patrol",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/parking-manage/carport-apply/list",
		"phase7-patrol-parking-admin-list",
		"parking",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/parking-manage/carport-info/list",
		"phase7-patrol-parking-admin-list",
		"parking",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/parking-manage/owner-vehicle/list",
		"phase7-patrol-parking-admin-list",
		"parking",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/parking-manage/parking-lot/list",
		"phase7-patrol-parking-admin-list",
		"parking",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/community-manage/building-space-structure-diagram/list",
		"phase7-community-manage-admin-list",
		"community",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/community-manage/handing-business/list",
		"phase7-community-manage-admin-list",
		"community",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/community-manage/house-decoration/list",
		"phase7-community-manage-admin-list",
		"community",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/community-manage/my/list",
		"phase7-community-manage-admin-list",
		"community",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/community-manage/notice/list",
		"phase7-community-manage-admin-list",
		"community",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/community-manage/parking-space-structure-diagram/list",
		"phase7-community-manage-admin-list",
		"community",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/community-manage/property-register/list",
		"phase7-community-manage-admin-list",
		"community",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/house/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/invoice/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/invoice-title/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/owner-account/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/owner-information/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/owner-member/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/owners-committee/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/reserve-venue/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/reserve-venue-order/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
	createAdminManifestEntry(
		"/api/property-manage/house-property-manage/site-management/list",
		"phase7-house-property-manage-admin-list",
		"house-property",
		"available-in-apps-api-not-caller-verified",
	),
];

export const runtimeEndpointDefinitions = runtimeEndpointEntries.map((entry) => entry.definition);

export const runtimeEndpointManifest: RuntimeEndpointManifestItem[] = [
	...runtimeEndpointEntries.map((entry) => ({
		url: entry.definition.url,
		method: entry.definition.method,
		phase: entry.phase,
		ownerModule: entry.ownerModule,
		targetClient: "app" as const,
		routeKind: "app-legacy" as const,
		responseContract: getAppLegacyResponseContract(entry.ownerModule),
		cutoverStatus: entry.cutoverStatus,
	})),
	...adminCanonicalEndpointManifestEntries,
];

function createAdminManifestEntry(
	url: string,
	phase: string,
	ownerModule: string,
	cutoverStatus: EndpointManifestCutoverStatus,
	method: EndpointDefinition["method"] = "POST",
): RuntimeEndpointManifestItem {
	return {
		url,
		method,
		phase,
		ownerModule,
		targetClient: "admin",
		routeKind: "admin-canonical",
		responseContract: "JsonVO",
		cutoverStatus,
	};
}

function getAppLegacyResponseContract(ownerModule: string): EndpointManifestResponseContract {
	if (ownerModule === "maintenance") {
		return "{ success, code, message, data, timestamp }";
	}

	return "{ code, msg, data }";
}

function getFeeLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getFeeLegacyPhase(definition: EndpointDefinition): string {
	if (definition.url === "/app/machine/listMachineRecords") {
		return "phase7-fee-machine-record-readonly";
	}

	if (definition.url.startsWith("/app/iot/listChargeMachine")) {
		return "phase7-fee-charge-machine-readonly";
	}

	return "phase2-fee-payment-report";
}

function getActivityLegacyPhase(definition: EndpointDefinition): string {
	if (definition.url === "/app/activities.updateLike" || definition.url === "/app/activities.updateCollect") {
		return "phase7-activity-guarded-write-batch24";
	}

	if (
		definition.url === "/app/activities.saveActivities" ||
		definition.url === "/app/activities.updateActivities" ||
		definition.url === "/app/activities.deleteActivities"
	) {
		return "phase7-activity-guarded-write-batch25";
	}

	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-activity-guarded-write-batch17";
	}

	return "phase7-activity-readonly";
}

function getActivityLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getAppointmentLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-appointment-guarded-write";
	}

	return "phase7-appointment-readonly";
}

function getAppointmentLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getComplaintLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-complaint-guarded-write";
	}

	return "phase7-complaint-readonly";
}

function getComplaintLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getContactLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-contact-guarded-write";
	}

	return "phase7-contact-readonly";
}

function getContactLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getRepairLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	// /callComponent/core/list is app shadow allowlisted in Phase7 batch 1.
	if (definition.url === "/callComponent/core/list") {
		return "app-shadow-allowlist";
	}

	if (phase7RepairReadonlyAppShadowUrls.has(definition.url)) {
		return "app-shadow-allowlist";
	}

	return "not-in-app-shadow-allowlist";
}

function getRepairLegacyPhase(definition: EndpointDefinition): string {
	if (phase7RepairReadonlyAppShadowUrls.has(definition.url) && definition.url !== "/app/ownerRepair.listOwnerRepairs") {
		return definition.url === "/app/ownerRepair.queryOwnerRepair" ||
			definition.url === "/app/repairSetting.listRepairSettings" ||
			definition.url === "/app/dict.queryRepairStates"
			? "phase4a-repair-minimal"
			: "phase7-repair-readonly";
	}

	return "phase4a-repair-minimal";
}

function getRoomUnitLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getOwnerLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-owner-guarded-write";
	}

	return "phase7-owner-readonly";
}

function getOwnerLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getFloorLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getInspectionLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-inspection-guarded-write-batch16";
	}

	return "phase7-inspection-readonly";
}

function getInspectionLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getMeterLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-meter-guarded-write-batch14";
	}

	return "phase7-meter-readonly-batch13";
}

function getMeterLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getMaintenanceLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-maintenance-guarded-write-batch27";
	}

	return "phase7-maintenance-readonly-batch23";
}

function getMaintenanceLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getWorkOrderLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getWorkOrderLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-work-order-guarded-write";
	}

	return "phase7-work-order-readonly";
}

function getVisitLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getVisitLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-visit-guarded-write";
	}

	return "phase7-visit-readonly";
}

function getProfileLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getProfileLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-profile-guarded-write";
	}

	return "phase7-profile-readonly";
}

function getVideoLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getNoticeLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getItemReleaseLegacyPhase(definition: EndpointDefinition): string {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "phase7-item-release-guarded-write-batch21";
	}

	return "phase7-item-release-readonly-batch20";
}

function getItemReleaseLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "app-shadow-allowlist";
}

function getPurchaseLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "not-in-app-shadow-allowlist";
}
