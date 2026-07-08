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
		notCovered: ["db-backed-owner-data", "owner-write-read-back-rollback", "production-app-h5-owner-network"],
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
			"/app/ownerRepair.listStaffRepairs",
			"/app/ownerRepair.listStaffFinishRepairs",
			"/app/ownerRepair.queryOwnerRepair",
			"/app/ownerRepair.saveOwnerRepair",
			"/app/ownerRepair.updateOwnerRepair",
			"/app/ownerRepair.repairDispatch",
			"/app/ownerRepair.repairFinish",
			"/app/ownerRepair.repairEnd",
			"/app/ownerRepair.repairStart",
			"/app/ownerRepair.repairStop",
			"/app/ownerRepair.grabbingRepair",
			"/app/repair.replyRepairAppraise",
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
			"/app/ownerRepair.updateOwnerRepair": `method: "POST"`,
			"/app/ownerRepair.repairDispatch": `method: "POST"`,
			"/app/ownerRepair.repairFinish": `method: "POST"`,
			"/app/ownerRepair.repairEnd": `method: "POST"`,
			"/app/ownerRepair.repairStart": `method: "POST"`,
			"/app/ownerRepair.repairStop": `method: "POST"`,
			"/app/ownerRepair.grabbingRepair": `method: "POST"`,
			"/app/repair.replyRepairAppraise": `method: "POST"`,
			"/callComponent/ownerRepair.appraiseRepair": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/ownerRepair.listStaffRepairs": "phase7-repair-readonly",
			"/app/ownerRepair.listStaffFinishRepairs": "phase7-repair-readonly",
			"/app/dict.queryPayTypes": "phase7-repair-readonly",
			"/app/ownerRepair.getRepairStatistics": "phase7-repair-readonly",
			"/app/ownerRepair.listRepairStaffRecords": "phase7-repair-readonly",
			"/app/ownerRepair.listRepairStaffs": "phase7-repair-readonly",
			"/app/repair.listRepairTypeUsers": "phase7-repair-readonly",
			"/app/resourceStore.listResources": "phase7-repair-readonly",
		},
		cutoverStatusByUrl: {
			"/app/ownerRepair.saveOwnerRepair": "blocked-for-execution",
			"/app/ownerRepair.updateOwnerRepair": "blocked-for-execution",
			"/app/ownerRepair.repairDispatch": "blocked-for-execution",
			"/app/ownerRepair.repairFinish": "blocked-for-execution",
			"/app/ownerRepair.repairEnd": "blocked-for-execution",
			"/app/ownerRepair.repairStart": "blocked-for-execution",
			"/app/ownerRepair.repairStop": "blocked-for-execution",
			"/app/ownerRepair.grabbingRepair": "blocked-for-execution",
			"/app/repair.replyRepairAppraise": "blocked-for-execution",
			"/callComponent/ownerRepair.appraiseRepair": "blocked-for-execution",
		},
		inputImport: 'import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";',
		mergeInputUsageCount: 12,
		runtimeEventParam: "event",
		notCovered: ["db-backed-repair-statistics-data", "production-app-h5-repair-network"],
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
			"/app/couponProperty.writeOffCouponPropertyUser",
			"/app/integral.useIntegral",
			"/app/reserveOrder.listReserveGoodsConfirmOrder",
			"/app/reserveOrder.saveReserveGoodsConfirmOrder",
		],
		methodByUrl: {
			"/app/couponProperty.writeOffCouponPropertyUser": `method: "POST"`,
			"/app/integral.useIntegral": `method: "POST"`,
			"/app/reserveOrder.saveReserveGoodsConfirmOrder": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/reserveOrder.listReserveGoodsConfirmOrder": "phase7-coupon-readonly-batch28",
			"/app/couponProperty.writeOffCouponPropertyUser": "phase7-coupon-guarded-write-batch28",
			"/app/integral.useIntegral": "phase7-coupon-guarded-write-batch28",
			"/app/reserveOrder.saveReserveGoodsConfirmOrder": "phase7-coupon-guarded-write-batch28",
		},
		cutoverStatusByUrl: {
			"/app/couponProperty.writeOffCouponPropertyUser": "blocked-for-execution",
			"/app/integral.useIntegral": "blocked-for-execution",
			"/app/reserveOrder.saveReserveGoodsConfirmOrder": "blocked-for-execution",
		},
		notCovered: [
			"db-backed-coupon-data",
			"coupon-integral-reserve-write-read-back-rollback",
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
		endpoints: [
			"/app/purchase/updatePurchaseApply",
			"/app/resourceStore.listResourceStores",
			"/app/purchase/purchaseApply",
			"/app/purchase/urgentPurchaseApply",
		],
		methodByUrl: {
			"/app/resourceStore.listResourceStores": `method: "GET"`,
		},
		phaseByUrl: {
			"/app/resourceStore.listResourceStores": "phase7-purchase-readonly-batch29",
			"/app/purchase/purchaseApply": "phase7-purchase-guarded-write-batch29",
			"/app/purchase/urgentPurchaseApply": "phase7-purchase-guarded-write-batch29",
		},
		cutoverStatusByUrl: {
			"/app/resourceStore.listResourceStores": "app-shadow-allowlist",
		},
		mergeInputUsageCount: 3,
		notCovered: ["db-backed-purchase-data", "purchase-write-read-back-rollback", "production-app-h5-purchase-network"],
	},
	{
		name: "resource",
		runtimeName: "Resource",
		definitionsName: "resourceLegacyEndpointDefinitions",
		ownerModule: "resource",
		phase: "phase7-resource-readonly-batch30",
		cutoverStatus: "app-shadow-allowlist",
		responseContract: "{ success, code, message, data, timestamp }",
		readonly: true,
		endpoints: [
			"/app/resourceStore.listStorehouses",
			"/app/resourceStore.listUserStorehouses",
			"/app/resourceStoreType.listResourceStoreTypes",
			"/app/resourceStore.listAllocationStorehouseApplys",
			"/app/purchaseApply.listPurchaseApplys",
			"/app/itemRelease.listItemRelease",
			"/app/purchaseApply.listMyAuditOrders",
			"/app/itemRelease.queryUndoItemRelease",
			"/app/resourceStore.listAllocationStoreAuditOrders",
			"/app/resourceStore.listAllocationStorehouses",
			"/app/resourceStore.queryMyResourceStoreInfo",
			"/app/resourceStore.saveAllocationStorehouse",
			"/app/collection/resourceOut",
			"/app/purchase/resourceEnter",
			"/app/purchaseApply.deletePurchaseApply",
			"/app/resourceStore.allocationStoreEnter",
			"/app/resourceStore.deleteAllocationStorehouse",
			"/app/resourceStore.saveAllocationUserStorehouse",
			"/app/resourceStore.saveResourceReturn",
			"/app/resourceStore.saveResourceScrap",
			"/app/purchaseApply.auditApplyOrder",
			"/app/itemRelease.auditUndoItemRelease",
			"/app/resourceStore.auditAllocationStoreOrder",
		],
		methodByUrl: {
			"/app/resourceStore.listStorehouses": `method: "GET"`,
			"/app/resourceStore.listUserStorehouses": `method: ["GET", "POST"]`,
			"/app/resourceStoreType.listResourceStoreTypes": `method: ["GET", "POST"]`,
			"/app/resourceStore.listAllocationStorehouseApplys": `method: "GET"`,
			"/app/purchaseApply.listPurchaseApplys": `method: "GET"`,
			"/app/itemRelease.listItemRelease": `method: "GET"`,
			"/app/purchaseApply.listMyAuditOrders": `method: "GET"`,
			"/app/itemRelease.queryUndoItemRelease": `method: "GET"`,
			"/app/resourceStore.listAllocationStoreAuditOrders": `method: "GET"`,
			"/app/resourceStore.listAllocationStorehouses": `method: "GET"`,
			"/app/resourceStore.queryMyResourceStoreInfo": `method: "GET"`,
			"/app/resourceStore.saveAllocationStorehouse": `method: "POST"`,
			"/app/collection/resourceOut": `method: "POST"`,
			"/app/purchase/resourceEnter": `method: "POST"`,
			"/app/purchaseApply.deletePurchaseApply": `method: "POST"`,
			"/app/resourceStore.allocationStoreEnter": `method: "POST"`,
			"/app/resourceStore.deleteAllocationStorehouse": `method: "POST"`,
			"/app/resourceStore.saveAllocationUserStorehouse": `method: "POST"`,
			"/app/resourceStore.saveResourceReturn": `method: "POST"`,
			"/app/resourceStore.saveResourceScrap": `method: "POST"`,
			"/app/purchaseApply.auditApplyOrder": `method: "POST"`,
			"/app/itemRelease.auditUndoItemRelease": `method: "POST"`,
			"/app/resourceStore.auditAllocationStoreOrder": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/resourceStore.listUserStorehouses": "phase7-resource-readonly-batch15",
			"/app/resourceStoreType.listResourceStoreTypes": "phase7-resource-readonly-batch15",
			"/app/purchaseApply.listPurchaseApplys": "phase7-resource-readonly-batch31",
			"/app/itemRelease.listItemRelease": "phase7-resource-readonly-batch31",
			"/app/purchaseApply.listMyAuditOrders": "phase7-resource-readonly-batch31",
			"/app/itemRelease.queryUndoItemRelease": "phase7-resource-readonly-batch31",
			"/app/resourceStore.listAllocationStoreAuditOrders": "phase7-resource-readonly-batch32",
			"/app/resourceStore.listAllocationStorehouses": "phase7-resource-readonly-batch32",
			"/app/resourceStore.queryMyResourceStoreInfo": "phase7-resource-readonly-batch32",
			"/app/resourceStore.saveAllocationStorehouse": "phase7-resource-guarded-write-batch30",
			"/app/collection/resourceOut": "phase7-resource-guarded-write-batch16",
			"/app/purchase/resourceEnter": "phase7-resource-guarded-write-batch16",
			"/app/purchaseApply.deletePurchaseApply": "phase7-resource-guarded-write-batch16",
			"/app/resourceStore.allocationStoreEnter": "phase7-resource-guarded-write-batch16",
			"/app/resourceStore.deleteAllocationStorehouse": "phase7-resource-guarded-write-batch16",
			"/app/resourceStore.saveAllocationUserStorehouse": "phase7-resource-guarded-write-batch16",
			"/app/resourceStore.saveResourceReturn": "phase7-resource-guarded-write-batch16",
			"/app/resourceStore.saveResourceScrap": "phase7-resource-guarded-write-batch16",
			"/app/purchaseApply.auditApplyOrder": "phase7-resource-guarded-write-batch42",
			"/app/itemRelease.auditUndoItemRelease": "phase7-resource-guarded-write-batch42",
			"/app/resourceStore.auditAllocationStoreOrder": "phase7-resource-guarded-write-batch42",
		},
		cutoverStatusByUrl: {
			"/app/resourceStore.saveAllocationStorehouse": "blocked-for-execution",
			"/app/collection/resourceOut": "blocked-for-execution",
			"/app/purchase/resourceEnter": "blocked-for-execution",
			"/app/purchaseApply.deletePurchaseApply": "blocked-for-execution",
			"/app/resourceStore.allocationStoreEnter": "blocked-for-execution",
			"/app/resourceStore.deleteAllocationStorehouse": "blocked-for-execution",
			"/app/resourceStore.saveAllocationUserStorehouse": "blocked-for-execution",
			"/app/resourceStore.saveResourceReturn": "blocked-for-execution",
			"/app/resourceStore.saveResourceScrap": "blocked-for-execution",
			"/app/purchaseApply.auditApplyOrder": "blocked-for-execution",
			"/app/itemRelease.auditUndoItemRelease": "blocked-for-execution",
			"/app/resourceStore.auditAllocationStoreOrder": "blocked-for-execution",
		},
		notCovered: ["db-backed-resource-data", "resource-write-read-back-rollback", "production-app-h5-resource-network"],
	},
	{
		name: "parking",
		runtimeName: "Parking",
		definitionsName: "parkingLegacyEndpointDefinitions",
		ownerModule: "parking",
		phase: "phase7-parking-readonly-batch33",
		cutoverStatus: "app-shadow-allowlist",
		responseContract: "{ success, code, message, data, timestamp }",
		readonly: true,
		endpoints: [
			"/app/owner.queryOwnerCars",
			"/app/parkingArea.listParkingAreas",
			"/app/machine.listParkingAreaMachines",
			"/app/machine.getBarrierCloudVideo",
			"/app/carInout.listCarInParkingAreaCmd",
			"/app/parkingCoupon.listParkingCouponCar",
			"/app/tempCarFee.getTempCarFeeOrder",
			"/app/carInoutDetail.listCarInoutDetail",
			"/app/carInoutPayment.listCarInoutPayment",
			"/app/machine/openDoor",
			"/app/machine/closeDoor",
			"/app/machine.customCarInOutCmd",
		],
		methodByUrl: {
			"/app/owner.queryOwnerCars": `method: "GET"`,
			"/app/parkingArea.listParkingAreas": `method: "GET"`,
			"/app/machine.listParkingAreaMachines": `method: "GET"`,
			"/app/machine.getBarrierCloudVideo": `method: "GET"`,
			"/app/carInout.listCarInParkingAreaCmd": `method: "GET"`,
			"/app/parkingCoupon.listParkingCouponCar": `method: "GET"`,
			"/app/tempCarFee.getTempCarFeeOrder": `method: "GET"`,
			"/app/carInoutDetail.listCarInoutDetail": `method: "GET"`,
			"/app/carInoutPayment.listCarInoutPayment": `method: "GET"`,
			"/app/machine/openDoor": `method: "POST"`,
			"/app/machine/closeDoor": `method: "POST"`,
			"/app/machine.customCarInOutCmd": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/carInout.listCarInParkingAreaCmd": "phase7-parking-readonly-batch34",
			"/app/parkingCoupon.listParkingCouponCar": "phase7-parking-readonly-batch34",
			"/app/tempCarFee.getTempCarFeeOrder": "phase7-parking-readonly-batch34",
			"/app/carInoutDetail.listCarInoutDetail": "phase7-parking-readonly-batch35",
			"/app/carInoutPayment.listCarInoutPayment": "phase7-parking-readonly-batch35",
			"/app/machine.getBarrierCloudVideo": "phase7-parking-readonly-batch36",
			"/app/machine/openDoor": "phase7-parking-guarded-write-batch37",
			"/app/machine/closeDoor": "phase7-parking-guarded-write-batch37",
			"/app/machine.customCarInOutCmd": "phase7-parking-guarded-write-batch37",
		},
		cutoverStatusByUrl: {
			"/app/machine/openDoor": "blocked-for-execution",
			"/app/machine/closeDoor": "blocked-for-execution",
			"/app/machine.customCarInOutCmd": "blocked-for-execution",
		},
		runtimeEventParam: "event",
		notCovered: ["db-backed-parking-data", "parking-write-read-back-rollback", "production-app-h5-parking-network"],
	},
	{
		name: "property-application",
		runtimeName: "PropertyApplication",
		definitionsName: "propertyApplicationLegacyEndpointDefinitions",
		ownerModule: "property-application",
		phase: "phase7-property-application-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/feeDiscount/queryFeeDiscount",
			"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
			"/app/applyRoomDiscount/queryApplyRoomDiscount",
			"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord",
			"/app/applyRoomDiscount/updateApplyRoomDiscount",
			"/app/applyRoomDiscount/updateReviewApplyRoomDiscount",
			"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord",
			"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord",
		],
		methodByUrl: {
			"/app/applyRoomDiscount/updateApplyRoomDiscount": `method: "POST"`,
			"/app/applyRoomDiscount/updateReviewApplyRoomDiscount": `method: "POST"`,
			"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord": `method: "POST"`,
			"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/applyRoomDiscount/updateApplyRoomDiscount": "phase7-property-application-guarded-write",
			"/app/applyRoomDiscount/updateReviewApplyRoomDiscount": "phase7-property-application-guarded-write",
			"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord": "phase7-property-application-guarded-write",
			"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord": "phase7-property-application-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/applyRoomDiscount/updateApplyRoomDiscount": "blocked-for-execution",
			"/app/applyRoomDiscount/updateReviewApplyRoomDiscount": "blocked-for-execution",
			"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord": "blocked-for-execution",
			"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord": "blocked-for-execution",
		},
		inputImport: 'import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";',
		mergeInputUsageCount: 4,
		notCovered: ["db-backed-property-application-data", "property-application-write-read-back-rollback"],
	},
	{
		name: "staff",
		runtimeName: "Staff",
		definitionsName: "staffLegacyEndpointDefinitions",
		ownerModule: "staff",
		phase: "phase7-staff-readonly-batch38",
		cutoverStatus: "app-shadow-allowlist",
		responseContract: "{ success, code, message, data, timestamp }",
		readonly: true,
		endpoints: [
			"/app/staff/organizations",
			"/app/staff/online",
			"/app/staff/by-department",
			"/app/query.staff.infos",
			"/app/staff/search",
			"/app/staff/update-online-status",
			"/app/staff/add",
			"/app/staff/STAFF_001",
		],
		methodByUrl: {
			"/app/staff/organizations": `method: "GET"`,
			"/app/staff/online": `method: "GET"`,
			"/app/staff/update-online-status": `method: "POST"`,
			"/app/staff/add": `method: "POST"`,
			"/app/staff/STAFF_001": `method: "GET"`,
		},
		phaseByUrl: {
			"/app/query.staff.infos": "phase7-staff-readonly-batch39",
			"/app/staff/search": "phase7-staff-readonly-batch39",
			"/app/staff/update-online-status": "phase7-staff-guarded-write-batch40",
			"/app/staff/add": "phase7-staff-guarded-write-batch40",
			"/app/staff/STAFF_001": "phase7-staff-detail-sample-batch41",
		},
		cutoverStatusByUrl: {
			"/app/staff/update-online-status": "blocked-for-execution",
			"/app/staff/add": "blocked-for-execution",
		},
		notCovered: [
			"/app/staff/:staffId",
			"dynamic-route-not-supported-by-exact-string-registry",
			"db-backed-staff-data",
			"production-app-h5-staff-network",
		],
	},
	{
		name: "oa-workflow",
		runtimeName: "OaWorkflow",
		definitionsName: "oaWorkflowLegacyEndpointDefinitions",
		ownerModule: "oa-workflow",
		phase: "phase7-oa-workflow-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/oa/workflow/query",
			"/app/oa/workflow/form/query",
			"/app/oa/workflow/form/data/query",
			"/app/oa/workflow/task/undo/query",
			"/app/oa/workflow/task/his/query",
			"/app/oa/workflow/user/query",
			"/app/oa/workflow/image/run",
			"/app/oa/workflow/task/next",
			"/app/oa/workflow/undo/next-deal-user",
			"/app/oa/workflow/form/save",
			"/app/oa/workflow/form/update",
			"/app/oa/workflow/audit",
			"/app/oa/workflow/undo/audit",
		],
		methodByUrl: {
			"/app/oa/workflow/form/save": `method: "POST"`,
			"/app/oa/workflow/form/update": `method: "POST"`,
			"/app/oa/workflow/audit": `method: "POST"`,
			"/app/oa/workflow/undo/audit": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/oa/workflow/form/save": "phase7-oa-workflow-guarded-write",
			"/app/oa/workflow/form/update": "phase7-oa-workflow-guarded-write",
			"/app/oa/workflow/audit": "phase7-oa-workflow-guarded-write",
			"/app/oa/workflow/undo/audit": "phase7-oa-workflow-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/oa/workflow/form/save": "blocked-for-execution",
			"/app/oa/workflow/form/update": "blocked-for-execution",
			"/app/oa/workflow/audit": "blocked-for-execution",
			"/app/oa/workflow/undo/audit": "blocked-for-execution",
		},
		inputImport: 'import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";',
		mergeInputUsageCount: 9,
		notCovered: ["db-backed-oa-workflow-data", "production-app-h5-oa-workflow-network"],
	},
	{
		name: "renovation",
		runtimeName: "Renovation",
		definitionsName: "renovationLegacyEndpointDefinitions",
		ownerModule: "renovation",
		phase: "phase7-renovation-readonly",
		cutoverStatus: "app-shadow-allowlist",
		readonly: true,
		endpoints: [
			"/app/roomRenovation/queryRoomRenovation",
			"/app/roomRenovation/queryRoomRenovationRecord",
			"/app/roomRenovation/queryRoomRenovationRecordDetail",
			"/app/roomRenovation/updateRoomToExamine",
			"/app/roomRenovation/saveRoomRenovationDetail",
			"/app/roomRenovation/updateRoomRenovationState",
			"/app/roomRenovation/updateRoomDecorationRecord",
			"/app/roomRenovation/deleteRoomRenovationRecord",
		],
		methodByUrl: {
			"/app/roomRenovation/updateRoomToExamine": `method: "POST"`,
			"/app/roomRenovation/saveRoomRenovationDetail": `method: "POST"`,
			"/app/roomRenovation/updateRoomRenovationState": `method: "POST"`,
			"/app/roomRenovation/updateRoomDecorationRecord": `method: "POST"`,
			"/app/roomRenovation/deleteRoomRenovationRecord": `method: "POST"`,
		},
		phaseByUrl: {
			"/app/roomRenovation/updateRoomToExamine": "phase7-renovation-guarded-write",
			"/app/roomRenovation/saveRoomRenovationDetail": "phase7-renovation-guarded-write",
			"/app/roomRenovation/updateRoomRenovationState": "phase7-renovation-guarded-write",
			"/app/roomRenovation/updateRoomDecorationRecord": "phase7-renovation-guarded-write",
			"/app/roomRenovation/deleteRoomRenovationRecord": "phase7-renovation-guarded-write",
		},
		cutoverStatusByUrl: {
			"/app/roomRenovation/updateRoomToExamine": "blocked-for-execution",
			"/app/roomRenovation/saveRoomRenovationDetail": "blocked-for-execution",
			"/app/roomRenovation/updateRoomRenovationState": "blocked-for-execution",
			"/app/roomRenovation/updateRoomDecorationRecord": "blocked-for-execution",
			"/app/roomRenovation/deleteRoomRenovationRecord": "blocked-for-execution",
		},
		inputImport: 'import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";',
		mergeInputUsageCount: 3,
		notCovered: ["db-backed-renovation-data", "renovation-write-read-back-rollback"],
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
				const expectedMethod =
					methodByUrl?.[url] === `method: "POST"`
						? "POST"
						: methodByUrl?.[url] === `method: "GET"`
							? "GET"
							: readonly
								? ["GET", "POST"]
								: "POST";

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
