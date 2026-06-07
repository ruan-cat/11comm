import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

import { runtimeEndpointDefinitions, runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

const moduleRoot = fileURLToPath(new URL("../../server/modules/", import.meta.url));
const sharedRuntimeRoot = fileURLToPath(new URL("../../server/shared/runtime/", import.meta.url));

interface AppLegacyModuleFixture {
	name: string;
	runtimeName: string;
	definitionsName: string;
	ownerModule: string;
	phase: string;
	cutoverStatus: string;
	responseContract?: string;
	readonly: boolean;
	endpoints: readonly string[];
	notCovered: readonly string[];
	methodByUrl?: Record<string, string>;
	phaseByUrl?: Record<string, string>;
	cutoverStatusByUrl?: Record<string, string>;
	inputImport?: string;
	mergeInputUsageCount?: number;
	runtimeEventParam?: string;
}

const appLegacyModules: readonly AppLegacyModuleFixture[] = [
	{
		name: "activity",
		runtimeName: "Activity",
		definitionsName: "activityLegacyEndpointDefinitions",
		ownerModule: "activity",
		phase: "phase7-activity-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/activities.listActivitiess",
			"/app/activities.likeActivity",
			"/app/activities.increaseView",
			"/app/activities.updateStatus",
			"/app/activities.updateLike",
			"/app/activities.updateCollect",
			"/app/activities.saveActivities",
			"/app/activities.updateActivities",
			"/app/activities.deleteActivities",
		],
		methodByUrl: {
			"/app/activities.likeActivity": `method: "POST"`,
			"/app/activities.increaseView": `method: "POST"`,
			"/app/activities.updateStatus": `method: "POST"`,
			"/app/activities.updateLike": `method: "POST"`,
			"/app/activities.updateCollect": `method: "POST"`,
			"/app/activities.saveActivities": `method: "POST"`,
			"/app/activities.updateActivities": `method: "POST"`,
			"/app/activities.deleteActivities": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/activities.likeActivity": "phase7-activity-guarded-write-batch17",
			"/app/activities.increaseView": "phase7-activity-guarded-write-batch17",
			"/app/activities.updateStatus": "phase7-activity-guarded-write-batch17",
			"/app/activities.updateLike": "phase7-activity-guarded-write-batch24",
			"/app/activities.updateCollect": "phase7-activity-guarded-write-batch24",
			"/app/activities.saveActivities": "phase7-activity-guarded-write-batch25",
			"/app/activities.updateActivities": "phase7-activity-guarded-write-batch25",
			"/app/activities.deleteActivities": "phase7-activity-guarded-write-batch25",
		},
		cutoverStatusByUrl: {
			"/app/activities.likeActivity": "blocked-for-execution",
			"/app/activities.increaseView": "blocked-for-execution",
			"/app/activities.updateStatus": "blocked-for-execution",
			"/app/activities.updateLike": "blocked-for-execution",
			"/app/activities.updateCollect": "blocked-for-execution",
			"/app/activities.saveActivities": "blocked-for-execution",
			"/app/activities.updateActivities": "blocked-for-execution",
			"/app/activities.deleteActivities": "blocked-for-execution",
		},
		notCovered: [
			"db-backed-activity-data",
			"activity-write-read-back-rollback",
			"activity-residual-check",
			"activity-guard-restored",
			"production-app-h5-activity-network",
		],
	},
	{
		name: "appointment",
		runtimeName: "Appointment",
		definitionsName: "appointmentLegacyEndpointDefinitions",
		ownerModule: "appointment",
		phase: "phase7-appointment-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/communitySpace.listCommunitySpaceConfirmOrder",
			"/app/communitySpace.saveCommunitySpaceConfirmOrder",
		],
		methodByUrl: {
			"/app/communitySpace.saveCommunitySpaceConfirmOrder": `method: "POST"`,
		},
		cutoverStatusByUrl: {
			"/app/communitySpace.saveCommunitySpaceConfirmOrder": "blocked-for-execution",
		},
		phaseByUrl: {
			"/app/communitySpace.saveCommunitySpaceConfirmOrder": "phase7-appointment-guarded-write",
		},
		notCovered: ["db-backed-appointment-data", "appointment-confirm-write-read-back-rollback"],
	},
	{
		name: "complaint",
		runtimeName: "Complaint",
		definitionsName: "complaintLegacyEndpointDefinitions",
		ownerModule: "complaint",
		phase: "phase7-complaint-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/auditUser.listAuditComplaints",
			"/app/auditUser.listAuditHistoryComplaints",
			"/app/complaint.listComplaintEvent",
			"/app/complaintAppraise.listComplaintAppraise",
			"/app/complaint",
			"/app/complaint.auditComplaint",
			"/app/complaintAppraise.replyComplaintAppraise",
		],
		methodByUrl: {
			"/app/complaint": `method: "POST"`,
			"/app/complaint.auditComplaint": `method: "POST"`,
			"/app/complaintAppraise.replyComplaintAppraise": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/complaint": "phase7-complaint-guarded-write",
			"/app/complaint.auditComplaint": "phase7-complaint-guarded-write",
			"/app/complaintAppraise.replyComplaintAppraise": "phase7-complaint-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/complaint": "blocked-for-execution",
			"/app/complaint.auditComplaint": "blocked-for-execution",
			"/app/complaintAppraise.replyComplaintAppraise": "blocked-for-execution",
		},
		notCovered: ["db-backed-complaint-data", "complaint-write-read-back-rollback"],
	},
	{
		name: "contact",
		runtimeName: "Contact",
		definitionsName: "contactLegacyEndpointDefinitions",
		ownerModule: "contact",
		phase: "phase7-contact-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/contact.listContacts",
			"/app/contact.getContactDetail",
			"/app/contact.getContactsByDepartment",
			"/app/contact.searchContacts",
			"/app/contact.getDepartments",
			"/app/contact.getFavoriteContacts",
			"/app/contact.getEmergencyContacts",
			"/app/contact.updateOnlineStatus",
		],
		methodByUrl: {
			"/app/contact.updateOnlineStatus": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/contact.updateOnlineStatus": "phase7-contact-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/contact.updateOnlineStatus": "blocked-for-execution",
		},
		notCovered: [
			"db-backed-contact-data",
			"contact-update-online-status-read-back-rollback",
			"natural-app-h5-contact-page-network",
		],
	},
	{
		name: "room-unit",
		runtimeName: "RoomUnit",
		definitionsName: "roomUnitLegacyEndpointDefinitions",
		ownerModule: "room-unit",
		phase: "phase7-room-unit-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/room.queryRooms",
			"/app/room.queryRoomDetail",
			"/app/unit.queryUnits",
			"/app/unit.queryUnitDetail",
		],
		notCovered: ["db-backed-room-unit-data", "real-room-unit-primary-keys", "shadow-off-fallback"],
	},
	{
		name: "owner",
		runtimeName: "Owner",
		definitionsName: "ownerLegacyEndpointDefinitions",
		ownerModule: "owner",
		phase: "phase7-owner-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/owner.queryOwnerAndMembers",
			"/app/owner.saveRoomOwner",
			"/app/owner.editOwner",
			"/app/owner.deleteOwner",
		],
		methodByUrl: {
			"/app/owner.saveRoomOwner": `method: "POST"`,
			"/app/owner.editOwner": `method: "POST"`,
			"/app/owner.deleteOwner": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/owner.saveRoomOwner": "phase7-owner-guarded-write",
			"/app/owner.editOwner": "phase7-owner-guarded-write",
			"/app/owner.deleteOwner": "phase7-owner-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/owner.saveRoomOwner": "blocked-for-execution",
			"/app/owner.editOwner": "blocked-for-execution",
			"/app/owner.deleteOwner": "blocked-for-execution",
		},
		notCovered: [
			"db-backed-owner-data",
			"owner-write-read-back-rollback",
			"production-app-h5-owner-network",
			"/app/owner.queryOwnerCars",
		],
	},
	{
		name: "fee",
		runtimeName: "Fee",
		definitionsName: "feeLegacyEndpointDefinitions",
		ownerModule: "fee",
		phase: "phase2-fee-payment-report",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/fee.listFee",
			"/app/fee.queryFeeDetail",
			"/app/feeApi/listOweFees",
			"/app/oweFeeCallable.listOweFeeCallable",
			"/app/feeConfig.listFeeConfigs",
			"/app/reportFeeMonthStatistics.queryReportFeeSummary",
			"/app/reportFeeMonthStatistics/queryPayFeeDetail",
			"/app/reportFeeMonthStatistics.queryReportFeeDetailRoom",
			"/app/dataReport.queryFeeDataReport",
			"/app/iot/listChargeMachineBmoImpl",
			"/app/iot/listChargeMachineOrderBmoImpl",
			"/app/iot/listChargeMachinePortBmoImpl",
			"/app/machine/listMachineRecords",
			"/app/payment.nativeQrcodePayment",
			"/app/oweFeeCallable.writeOweFeeCallable",
			"/app/fee.saveRoomCreateFee",
		],
		methodByUrl: {
			"/app/payment.nativeQrcodePayment": `method: "POST"`,
			"/app/oweFeeCallable.writeOweFeeCallable": `method: "POST"`,
			"/app/fee.saveRoomCreateFee": `method: "POST"`,
		},
		cutoverStatusByUrl: {
			"/app/payment.nativeQrcodePayment": "blocked-for-execution",
			"/app/oweFeeCallable.writeOweFeeCallable": "blocked-for-execution",
			"/app/fee.saveRoomCreateFee": "blocked-for-execution",
		},
		phaseByUrl: {
			"/app/iot/listChargeMachineBmoImpl": "phase7-fee-charge-machine-readonly",
			"/app/iot/listChargeMachineOrderBmoImpl": "phase7-fee-charge-machine-readonly",
			"/app/iot/listChargeMachinePortBmoImpl": "phase7-fee-charge-machine-readonly",
			"/app/machine/listMachineRecords": "phase7-fee-machine-record-readonly",
		},
		inputImport: 'import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";',
		mergeInputUsageCount: 13,
		runtimeEventParam: "event",
		notCovered: [
			"db-backed-charge-machine-data",
			"db-backed-machine-record-data",
			"fee-write-read-back-rollback",
			"production-app-h5-fee-network",
		],
	},
	{
		name: "profile",
		runtimeName: "Profile",
		definitionsName: "profileLegacyEndpointDefinitions",
		ownerModule: "profile",
		phase: "phase7-profile-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/profile.getUserProfile",
			"/app/profile.listCommunities",
			"/app/profile.listAttendanceRecords",
			"/app/profile.changeCommunity",
			"/app/profile.changePassword",
		],
		methodByUrl: {
			"/app/profile.changeCommunity": `method: "POST"`,
			"/app/profile.changePassword": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/profile.changeCommunity": "phase7-profile-guarded-write",
			"/app/profile.changePassword": "phase7-profile-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/profile.changeCommunity": "blocked-for-execution",
			"/app/profile.changePassword": "blocked-for-execution",
		},
		notCovered: ["db-backed-profile-data", "profile-write-read-back-rollback", "production-app-h5-profile-network"],
	},
	{
		name: "repair",
		runtimeName: "Repair",
		definitionsName: "repairLegacyEndpointDefinitions",
		ownerModule: "repair",
		phase: "phase4a-repair-minimal",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/ownerRepair.listOwnerRepairs",
			"/app/ownerRepair.queryOwnerRepair",
			"/app/ownerRepair.saveOwnerRepair",
			"/app/repairSetting.listRepairSettings",
			"/app/dict.queryRepairStates",
			"/app/dict.queryPayTypes",
			"/app/ownerRepair.getRepairStatistics",
			"/app/ownerRepair.listRepairStaffRecords",
			"/app/ownerRepair.listRepairStaffs",
			"/app/repair.listRepairTypeUsers",
			"/app/resourceStore.listResources",
			"/callComponent/core/list",
			"/callComponent/ownerRepair.appraiseRepair",
		],
		methodByUrl: {
			"/app/ownerRepair.saveOwnerRepair": `method: "POST"`,
			"/callComponent/ownerRepair.appraiseRepair": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/dict.queryPayTypes": "phase7-repair-readonly",
			"/app/ownerRepair.getRepairStatistics": "phase7-repair-readonly",
			"/app/ownerRepair.listRepairStaffRecords": "phase7-repair-readonly",
			"/app/ownerRepair.listRepairStaffs": "phase7-repair-readonly",
			"/app/repair.listRepairTypeUsers": "phase7-repair-readonly",
			"/app/resourceStore.listResources": "phase7-repair-readonly",
		},
		cutoverStatusByUrl: {
			"/app/ownerRepair.saveOwnerRepair": "blocked-for-execution",
			"/callComponent/ownerRepair.appraiseRepair": "blocked-for-execution",
		},
		inputImport: 'import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";',
		mergeInputUsageCount: 10,
		runtimeEventParam: "event",
		notCovered: [
			"/app/ownerRepair.updateOwnerRepair",
			"/app/ownerRepair.repairDispatch",
			"/app/ownerRepair.repairFinish",
			"/app/ownerRepair.repairEnd",
			"/app/ownerRepair.repairStart",
			"/app/ownerRepair.repairStop",
			"/app/ownerRepair.grabbingRepair",
			"/app/repair.replyRepairAppraise",
			"db-backed-repair-statistics-data",
			"production-app-h5-repair-network",
		],
	},
	{
		name: "coupon",
		runtimeName: "Coupon",
		definitionsName: "couponLegacyEndpointDefinitions",
		ownerModule: "coupon",
		phase: "phase7-coupon-readonly-batch22",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/couponProperty.listCouponPropertyUserDetail",
			"/app/integral.listIntegralSetting",
			"/app/integral.listIntegralUserDetail",
		],
		notCovered: [
			"/app/couponProperty.writeOffCouponPropertyUser",
			"/app/integral.useIntegral",
			"/app/reserveOrder.listReserveGoodsConfirmOrder",
			"/app/reserveOrder.saveReserveGoodsConfirmOrder",
			"db-backed-coupon-data",
			"coupon-integral-write-read-back-rollback",
			"reserve-order-readonly-and-write",
			"production-app-h5-coupon-integral-network",
		],
	},
	{
		name: "maintenance",
		runtimeName: "Maintenance",
		definitionsName: "maintenanceLegacyEndpointDefinitions",
		ownerModule: "maintenance",
		phase: "phase7-maintenance-readonly-batch23",
		cutoverStatus: "app-shadow-allowlist",
		responseContract: "{ success, code, message, data, timestamp }",
		readonly: true,
		endpoints: [
			"/app/maintenance.listMaintenanceTasks",
			"/app/maintenance.queryMaintenanceTask",
			"/app/maintenance.listMaintenanceTaskDetails",
			"/app/maintenance.startMaintenanceTask",
			"/app/maintenance.completeMaintenanceTask",
			"/app/maintenance.submitMaintenanceSingle",
			"/app/maintenance.transferMaintenanceTask",
		],
		methodByUrl: {
			"/app/maintenance.startMaintenanceTask": `method: "POST"`,
			"/app/maintenance.completeMaintenanceTask": `method: "POST"`,
			"/app/maintenance.submitMaintenanceSingle": `method: "POST"`,
			"/app/maintenance.transferMaintenanceTask": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/maintenance.startMaintenanceTask": "phase7-maintenance-guarded-write-batch27",
			"/app/maintenance.completeMaintenanceTask": "phase7-maintenance-guarded-write-batch27",
			"/app/maintenance.submitMaintenanceSingle": "phase7-maintenance-guarded-write-batch27",
			"/app/maintenance.transferMaintenanceTask": "phase7-maintenance-guarded-write-batch27",
		},
		cutoverStatusByUrl: {
			"/app/maintenance.startMaintenanceTask": "blocked-for-execution",
			"/app/maintenance.completeMaintenanceTask": "blocked-for-execution",
			"/app/maintenance.submitMaintenanceSingle": "blocked-for-execution",
			"/app/maintenance.transferMaintenanceTask": "blocked-for-execution",
		},
		notCovered: [
			"db-backed-maintenance-data",
			"maintenance-write-read-back-rollback",
			"production-app-h5-maintenance-network",
		],
	},
	{
		name: "inspection",
		runtimeName: "Inspection",
		definitionsName: "inspectionLegacyEndpointDefinitions",
		ownerModule: "inspection",
		phase: "phase7-inspection-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/staff.listStaffs",
			"/app/inspection.getTodayReport",
			"/app/inspection.listInspectionItemTitles",
			"/app/inspection.listInspectionTasks",
			"/app/inspection.listInspectionTaskDetails",
			"/app/inspection.submitInspection",
			"/app/inspection.transferTask",
		],
		methodByUrl: {
			"/app/inspection.submitInspection": `method: "POST"`,
			"/app/inspection.transferTask": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/inspection.submitInspection": "phase7-inspection-guarded-write-batch16",
			"/app/inspection.transferTask": "phase7-inspection-guarded-write-batch16",
		},
		cutoverStatusByUrl: {
			"/app/inspection.submitInspection": "blocked-for-execution",
			"/app/inspection.transferTask": "blocked-for-execution",
		},
		notCovered: [
			"db-backed-inspection-data",
			"inspection-write-read-back-rollback",
			"production-app-h5-inspection-network",
		],
	},
	{
		name: "meter",
		runtimeName: "Meter",
		definitionsName: "meterLegacyEndpointDefinitions",
		ownerModule: "meter",
		phase: "phase7-meter-readonly-batch13",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/meter.queryFeeTypes",
			"/app/meter.queryFeeTypesItems",
			"/app/meter.listMeterType",
			"/app/meter.listMeterWaters",
			"/app/meter.queryPreMeterWater",
			"/app/meter.listFloorShareReading",
			"/app/meter.listFloorShareMeter",
			"/app/meter.saveMeterWater",
			"/app/meter.saveFloorShareReading",
			"/app/meter.auditFloorShareReading",
		],
		methodByUrl: {
			"/app/meter.saveMeterWater": `method: "POST"`,
			"/app/meter.saveFloorShareReading": `method: "POST"`,
			"/app/meter.auditFloorShareReading": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/meter.saveMeterWater": "phase7-meter-guarded-write-batch14",
			"/app/meter.saveFloorShareReading": "phase7-meter-guarded-write-batch14",
			"/app/meter.auditFloorShareReading": "phase7-meter-guarded-write-batch14",
		},
		cutoverStatusByUrl: {
			"/app/meter.saveMeterWater": "blocked-for-execution",
			"/app/meter.saveFloorShareReading": "blocked-for-execution",
			"/app/meter.auditFloorShareReading": "blocked-for-execution",
		},
		notCovered: ["db-backed-meter-data", "meter-write-read-back-rollback", "production-app-h5-meter-network"],
	},
	{
		name: "purchase",
		runtimeName: "Purchase",
		definitionsName: "purchaseLegacyEndpointDefinitions",
		ownerModule: "purchase",
		phase: "phase7-purchase-guarded-write",
		cutoverStatus: "blocked-for-execution",
		readonly: false,
		endpoints: ["/app/purchase/updatePurchaseApply"],
		notCovered: [],
	},
	{
		name: "property-application",
		runtimeName: "PropertyApplication",
		definitionsName: "propertyApplicationLegacyEndpointDefinitions",
		ownerModule: "property-application",
		phase: "phase7-property-application-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: ["/app/feeDiscount/queryFeeDiscount", "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail"],
		notCovered: [
			"/app/applyRoomDiscount/queryApplyRoomDiscount",
			"/app/applyRoomDiscount/updateApplyRoomDiscount",
			"/app/applyRoomDiscount/updateReviewApplyRoomDiscount",
			"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord",
			"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord",
			"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord",
			"db-backed-property-application-data",
			"property-application-write-read-back-rollback",
		],
	},
	{
		name: "item-release",
		runtimeName: "ItemRelease",
		definitionsName: "itemReleaseLegacyEndpointDefinitions",
		ownerModule: "item-release",
		phase: "phase7-item-release-readonly-batch20",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/itemRelease.getItemRelease",
			"/app/itemRelease.getItemReleaseRes",
			"/app/itemRelease.queryOaWorkflowUser",
			"/app/itemRelease.queryUndoItemReleaseV2",
			"/app/itemRelease.queryFinishItemReleaseV2",
			"/app/itemRelease.auditItemRelease",
		],
		methodByUrl: {
			"/app/itemRelease.auditItemRelease": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/itemRelease.auditItemRelease": "phase7-item-release-guarded-write-batch21",
		},
		cutoverStatusByUrl: {
			"/app/itemRelease.auditItemRelease": "blocked-for-execution",
		},
		notCovered: ["db-backed-item-release-data", "item-release-write-read-back-rollback"],
	},
	{
		name: "video",
		runtimeName: "Video",
		definitionsName: "videoLegacyEndpointDefinitions",
		ownerModule: "video",
		phase: "phase7-video-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: ["/app/video.listMonitorArea", "/app/video.listStaffMonitorMachine", "/app/video.getPlayVideoUrl"],
		notCovered: ["real-camera-platform", "db-backed-video-data", "video-stream-control"],
	},
	{
		name: "visit",
		runtimeName: "Visit",
		definitionsName: "visitLegacyEndpointDefinitions",
		ownerModule: "visit",
		phase: "phase7-visit-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: ["/app/visit.getVisit", "/app/visit.getVisitDetail", "/app/visit.auditVisit"],
		methodByUrl: {
			"/app/visit.auditVisit": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/visit.auditVisit": "phase7-visit-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/visit.auditVisit": "blocked-for-execution",
		},
		notCovered: ["visit-audit-read-back-rollback"],
	},
	{
		name: "work-order",
		runtimeName: "WorkOrder",
		definitionsName: "workOrderLegacyEndpointDefinitions",
		ownerModule: "work-order",
		phase: "phase7-work-order-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/workorder/todo/list",
			"/app/workorder/detail",
			"/app/workorder/copy/list",
			"/app/workorder/task/list",
			"/app/workorder/task/items",
			"/app/workorder/create",
			"/app/workorder/update",
			"/app/workorder/start",
			"/app/workorder/complete",
			"/app/workorder/audit",
			"/app/workorder/cancel",
			"/app/workorder/copy/finish",
		],
		methodByUrl: {
			"/app/workorder/create": `method: "POST"`,
			"/app/workorder/update": `method: "POST"`,
			"/app/workorder/start": `method: "POST"`,
			"/app/workorder/complete": `method: "POST"`,
			"/app/workorder/audit": `method: "POST"`,
			"/app/workorder/cancel": `method: "POST"`,
			"/app/workorder/copy/finish": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/workorder/create": "phase7-work-order-guarded-write",
			"/app/workorder/update": "phase7-work-order-guarded-write",
			"/app/workorder/start": "phase7-work-order-guarded-write",
			"/app/workorder/complete": "phase7-work-order-guarded-write",
			"/app/workorder/audit": "phase7-work-order-guarded-write",
			"/app/workorder/cancel": "phase7-work-order-guarded-write",
			"/app/workorder/copy/finish": "phase7-work-order-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/workorder/create": "blocked-for-execution",
			"/app/workorder/update": "blocked-for-execution",
			"/app/workorder/start": "blocked-for-execution",
			"/app/workorder/complete": "blocked-for-execution",
			"/app/workorder/audit": "blocked-for-execution",
			"/app/workorder/cancel": "blocked-for-execution",
			"/app/workorder/copy/finish": "blocked-for-execution",
		},
		notCovered: [
			"work-order-write-read-back-rollback",
			"production-app-h5-work-order-network",
			"db-ready-work-order-write-path",
		],
	},
] as const;

const requiredFiles = [
	"types.ts",
	"repository.ts",
	"service.ts",
	"runtime.ts",
	"legacy-adapter.ts",
	"legacy-endpoints.ts",
	"index.ts",
] as const;

describe("app legacy module layering", () => {
	test.each(appLegacyModules)("%s has the same module files as migrated app legacy modules", ({ name }) => {
		for (const file of requiredFiles) {
			expect(existsSync(join(moduleRoot, name, file)), `${name}/${file} should exist`).toBe(true);
		}
	});

	test.each(appLegacyModules)("%s endpoint handlers resolve adapters through runtime", ({ name, runtimeName }) => {
		const endpointSource = readFileSync(join(moduleRoot, name, "legacy-endpoints.ts"), "utf8");

		expect(endpointSource).toContain(`get${runtimeName}Runtime(event).legacyAdapter`);
		expect(endpointSource).not.toMatch(/const\s+legacyAdapter\s*=\s*createLegacy/);
		expect(endpointSource).not.toMatch(/from\s+["']\.\/legacy-adapter["']/);
		expect(endpointSource).not.toMatch(/from\s+["']\.\/service["']/);
		expect(endpointSource).not.toMatch(/from\s+["']\.\/repository["']/);
	});

	test.each(appLegacyModules)("%s endpoint definitions keep registration and input merge shape", (module) => {
		const endpointSource = readFileSync(join(moduleRoot, module.name, "legacy-endpoints.ts"), "utf8");
		const inputHelperSource = readFileSync(join(sharedRuntimeRoot, "legacy-endpoint-input.ts"), "utf8");

		expect(endpointSource).toContain(`export const ${module.definitionsName}: EndpointDefinition[] = [`);
		expect(endpointSource).toContain(
			module.inputImport ?? 'import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";',
		);
		for (const url of module.endpoints) {
			const expectedMethod =
				module.methodByUrl?.[url] ?? (module.readonly ? `method: ["GET", "POST"]` : `method: "POST"`);
			expect(endpointSource).toContain(`url: "${url}"`);
			expect(endpointSource).toContain(expectedMethod);
		}
		expect(
			endpointSource.match(/method:/g),
			`${module.name} should declare one method field per endpoint`,
		).toHaveLength(module.endpoints.length);
		expect(endpointSource.match(/mergeInput\(query, body\)/g)).toHaveLength(
			module.mergeInputUsageCount ?? module.endpoints.length,
		);
		expect(inputHelperSource).toContain(
			"export function mergeInput(query: unknown, body: unknown): Record<string, unknown>",
		);
		expect(inputHelperSource).toContain("...asRecord(query)");
		expect(inputHelperSource).toContain("...asRecord(body)");
		expect(inputHelperSource).toContain("export function asRecord(value: unknown): Record<string, unknown>");
		expect(inputHelperSource).toContain("Array.isArray(value)");
	});

	test.each(appLegacyModules)(
		"%s runtime wires repository, service, and legacy adapter once",
		({ name, runtimeName, runtimeEventParam }) => {
			const runtimeSource = readFileSync(join(moduleRoot, name, "runtime.ts"), "utf8");
			const eventParam = runtimeEventParam ?? "_event";

			expect(runtimeSource).toContain(`import { createLegacy${runtimeName}Adapter } from "./legacy-adapter";`);
			expect(runtimeSource).toContain(`export interface ${runtimeName}Runtime`);
			expect(runtimeSource).toContain(`repository: ${runtimeName}Repository;`);
			expect(runtimeSource).toContain(`service: ${runtimeName}Service;`);
			expect(runtimeSource).toContain(`legacyAdapter: ReturnType<typeof createLegacy${runtimeName}Adapter>;`);
			expect(runtimeSource).toContain(
				`const fallbackRuntime = create${runtimeName}Runtime(create${runtimeName}Repository());`,
			);
			expect(runtimeSource).toContain(
				`export function get${runtimeName}Runtime(${eventParam}?: H3Event): ${runtimeName}Runtime`,
			);
			expect(runtimeSource).toContain(`legacyAdapter: createLegacy${runtimeName}Adapter(service)`);
		},
	);

	test.each(appLegacyModules)("%s legacy adapter receives service injection", ({ name, runtimeName }) => {
		const adapterSource = readFileSync(join(moduleRoot, name, "legacy-adapter.ts"), "utf8");

		expect(adapterSource).toContain(`import type { ${runtimeName}Service } from "./service";`);
		expect(adapterSource).toContain(`createLegacy${runtimeName}Adapter(service: ${runtimeName}Service)`);
	});

	test.each(appLegacyModules)(
		"%s runtime definitions and manifest match the app legacy contract",
		({
			ownerModule,
			phase,
			cutoverStatus,
			responseContract,
			readonly,
			endpoints,
			methodByUrl,
			phaseByUrl,
			cutoverStatusByUrl,
		}) => {
			for (const url of endpoints) {
				const definition = runtimeEndpointDefinitions.find((item) => item.url === url);
				const manifest = runtimeEndpointManifest.find((item) => item.url === url && item.ownerModule === ownerModule);
				const expectedMethod = methodByUrl?.[url] === `method: "POST"` ? "POST" : readonly ? ["GET", "POST"] : "POST";

				expect(definition, `${url} should be registered in runtimeEndpointDefinitions`).toMatchObject({
					url,
					method: expectedMethod,
					handler: expect.any(Function),
				});
				expect(manifest, `${url} should be registered in runtimeEndpointManifest`).toMatchObject({
					url,
					method: expectedMethod,
					phase: phaseByUrl?.[url] ?? phase,
					ownerModule,
					targetClient: "app",
					routeKind: "app-legacy",
					responseContract: responseContract ?? "{ code, msg, data }",
					cutoverStatus: cutoverStatusByUrl?.[url] ?? cutoverStatus,
				});
			}
		},
	);

	test.each(appLegacyModules)(
		"%s does not register endpoints outside the readonly or guarded scope",
		({ ownerModule, endpoints, notCovered }) => {
			const registeredUrls = runtimeEndpointManifest
				.filter((item) => item.targetClient === "app" && item.ownerModule === ownerModule)
				.map((item) => item.url)
				.sort();

			expect(registeredUrls).toEqual([...endpoints].sort());
			for (const url of notCovered) {
				expect(runtimeEndpointManifest.some((item) => item.url === url)).toBe(false);
			}
		},
	);
});

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
