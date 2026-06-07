import { describe, expect, test } from "vitest";

import {
	contractTypeListAdminAdapterEvidence,
	createAdminContractAdapter,
} from "../../server/modules/contract/admin-adapter";
import { createInMemoryContractRepository } from "../../server/modules/contract/repository";
import { createContractService } from "../../server/modules/contract/service";
import { createAdminFeeAdapter } from "../../server/modules/fee/admin-adapter";
import { createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";
import { activityLegacyAdapterEvidence } from "../../server/modules/activity/legacy-adapter";
import { appointmentLegacyAdapterEvidence } from "../../server/modules/appointment/legacy-adapter";
import { complaintLegacyAdapterEvidence } from "../../server/modules/complaint/legacy-adapter";
import { contactLegacyAdapterEvidence } from "../../server/modules/contact/legacy-adapter";
import { couponLegacyAdapterEvidence } from "../../server/modules/coupon/legacy-adapter";
import { feeLegacyAdapterEvidence } from "../../server/modules/fee/legacy-adapter";
import { inspectionLegacyAdapterEvidence } from "../../server/modules/inspection/legacy-adapter";
import { itemReleaseLegacyAdapterEvidence } from "../../server/modules/item-release/legacy-adapter";
import { maintenanceLegacyAdapterEvidence } from "../../server/modules/maintenance/legacy-adapter";
import { meterLegacyAdapterEvidence } from "../../server/modules/meter/legacy-adapter";
import { noticeLegacyAdapterEvidence } from "../../server/modules/notice/legacy-adapter";
import { ownerLegacyAdapterEvidence } from "../../server/modules/owner/legacy-adapter";
import { profileLegacyAdapterEvidence } from "../../server/modules/profile/legacy-adapter";
import { propertyApplicationLegacyAdapterEvidence } from "../../server/modules/property-application/legacy-adapter";
import { purchaseLegacyGuardEvidence } from "../../server/modules/purchase/legacy-adapter";
import { repairLegacyAdapterEvidence } from "../../server/modules/repair/legacy-adapter";
import { roomUnitLegacyAdapterEvidence } from "../../server/modules/room-unit/legacy-adapter";
import { videoLegacyAdapterEvidence } from "../../server/modules/video/legacy-adapter";
import { visitLegacyAdapterEvidence } from "../../server/modules/visit/legacy-adapter";
import { workOrderLegacyAdapterEvidence } from "../../server/modules/work-order/legacy-adapter";
import { createEndpointRegistry, dispatchEndpoint } from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions, runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

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
			ownerModule: "fee",
			phase: "phase2-fee-payment-report",
			cutoverStatus: "available-in-apps-api-not-caller-verified",
		});
		for (const url of expenseManageAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "fee",
				phase: "phase7-expense-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of reportManageAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "fee-report",
				phase: "phase7-report-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of contractManageCoveredAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "contract",
				phase: "phase7-contract-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of [...contractManageChangeCrudEndpoints, ...contractManageDraftContractCrudEndpoints]) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "contract",
				phase: "phase7-contract-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of devConfigManageCenterEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "dev",
				phase: "phase7-dev-config-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of devConfigManageDictionaryEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "dev",
				phase: "phase7-dev-config-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of devConfigManageItemEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "dev",
				phase: "phase7-dev-config-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of devConfigManageTypeEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "dev",
				phase: "phase7-dev-config-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemChangePasswordEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemConfigEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemCommunityConfigurationEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemInitializeCellEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingSystemRegisterProtocolEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-system-manage-admin-crud",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const endpoint of settingOrganizeEdgeEndpoints) {
			expectManifestEntry(endpoint.url, {
				method: endpoint.method,
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "setting",
				phase: "phase7-setting-organize-manage-admin-edge",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of [
			"/api/property-manage/repairs-manage/repairs-todo/list",
			"/api/property-manage/repairs-manage/repairs-setting/list",
			"/api/property-manage/repairs-manage/issues/list",
			"/api/property-manage/repairs-manage/repairs-have-done/list",
			"/api/property-manage/repairs-manage/return-visit/list",
			"/api/property-manage/repairs-manage/phone-report-repairs/list",
			"/api/property-manage/repairs-manage/mandatory-return-issue/list",
		]) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "repair",
				phase: "phase4a-repair-minimal",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of operationTeamAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "operation",
				phase: "phase7-operation-team-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of patrolAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "patrol",
				phase: "phase7-patrol-parking-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of parkingAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "parking",
				phase: "phase7-patrol-parking-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of communityManageAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "community",
				phase: "phase7-community-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}
		for (const url of housePropertyManageAdminListEndpoints) {
			expectManifestEntry(url, {
				targetClient: "admin",
				routeKind: "admin-canonical",
				responseContract: "JsonVO",
				ownerModule: "house-property",
				phase: "phase7-house-property-manage-admin-list",
				cutoverStatus: "available-in-apps-api-not-caller-verified",
			});
		}

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
		for (const url of [
			"/app/iot/listChargeMachineBmoImpl",
			"/app/iot/listChargeMachineOrderBmoImpl",
			"/app/iot/listChargeMachinePortBmoImpl",
		]) {
			expectManifestEntry(url, {
				method: ["GET", "POST"],
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "fee",
				phase: "phase7-fee-charge-machine-readonly",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
		expectManifestEntry("/app/workorder/todo/list", {
			method: ["GET", "POST"],
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "work-order",
			phase: "phase7-work-order-readonly",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/workorder/detail", {
			method: ["GET", "POST"],
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "work-order",
			phase: "phase7-work-order-readonly",
			cutoverStatus: "app-shadow-allowlist",
		});
		for (const url of ["/app/workorder/copy/list", "/app/workorder/task/list", "/app/workorder/task/items"]) {
			expectManifestEntry(url, {
				method: ["GET", "POST"],
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "work-order",
				phase: "phase7-work-order-readonly",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
		for (const url of [
			"/app/workorder/create",
			"/app/workorder/update",
			"/app/workorder/start",
			"/app/workorder/complete",
			"/app/workorder/audit",
			"/app/workorder/cancel",
			"/app/workorder/copy/finish",
		]) {
			expectManifestEntry(url, {
				method: "POST",
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "work-order",
				phase: "phase7-work-order-guarded-write",
				cutoverStatus: "blocked-for-execution",
			});
		}
		for (const url of ["/app/visit.getVisit", "/app/visit.getVisitDetail"]) {
			expectManifestEntry(url, {
				method: ["GET", "POST"],
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "visit",
				phase: "phase7-visit-readonly",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
		expectManifestEntry("/app/visit.auditVisit", {
			method: "POST",
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "visit",
			phase: "phase7-visit-guarded-write",
			cutoverStatus: "blocked-for-execution",
		});
		for (const url of [
			"/app/profile.getUserProfile",
			"/app/profile.listCommunities",
			"/app/profile.listAttendanceRecords",
		]) {
			expectManifestEntry(url, {
				method: ["GET", "POST"],
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "profile",
				phase: "phase7-profile-readonly",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
		for (const url of [
			"/app/video.listMonitorArea",
			"/app/video.listStaffMonitorMachine",
			"/app/video.getPlayVideoUrl",
		]) {
			expectManifestEntry(url, {
				method: ["GET", "POST"],
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "video",
				phase: "phase7-video-readonly",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
		expectManifestEntry("/app/notice.listNotices", {
			method: ["GET", "POST"],
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "notice",
			phase: "phase7-notice-readonly",
			cutoverStatus: "app-shadow-allowlist",
		});
		for (const url of [
			"/app/itemRelease.getItemRelease",
			"/app/itemRelease.getItemReleaseRes",
			"/app/itemRelease.queryOaWorkflowUser",
			"/app/itemRelease.queryUndoItemReleaseV2",
			"/app/itemRelease.queryFinishItemReleaseV2",
		]) {
			expectManifestEntry(url, {
				method: ["GET", "POST"],
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "item-release",
				phase: "phase7-item-release-readonly-batch20",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
		expectManifestEntry("/app/activities.listActivitiess", {
			method: ["GET", "POST"],
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "activity",
			phase: "phase7-activity-readonly",
			cutoverStatus: "app-shadow-allowlist",
		});
		for (const url of [
			"/app/activities.likeActivity",
			"/app/activities.increaseView",
			"/app/activities.updateStatus",
		]) {
			expectManifestEntry(url, {
				method: "POST",
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "activity",
				phase: "phase7-activity-guarded-write-batch17",
				cutoverStatus: "blocked-for-execution",
			});
		}
		for (const url of ["/app/activities.updateLike", "/app/activities.updateCollect"]) {
			expectManifestEntry(url, {
				method: "POST",
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "activity",
				phase: "phase7-activity-guarded-write-batch24",
				cutoverStatus: "blocked-for-execution",
			});
		}
		for (const url of [
			"/app/activities.saveActivities",
			"/app/activities.updateActivities",
			"/app/activities.deleteActivities",
		]) {
			expectManifestEntry(url, {
				method: "POST",
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "activity",
				phase: "phase7-activity-guarded-write-batch25",
				cutoverStatus: "blocked-for-execution",
			});
		}
		expectManifestEntry("/app/communitySpace.listCommunitySpaceConfirmOrder", {
			method: ["GET", "POST"],
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "appointment",
			phase: "phase7-appointment-readonly",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/communitySpace.saveCommunitySpaceConfirmOrder", {
			method: "POST",
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "appointment",
			phase: "phase7-appointment-guarded-write",
			cutoverStatus: "blocked-for-execution",
		});
		expectManifestEntry("/app/owner.queryOwnerAndMembers", {
			method: ["GET", "POST"],
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "owner",
			phase: "phase7-owner-readonly",
			cutoverStatus: "app-shadow-allowlist",
		});
		for (const url of ["/app/owner.saveRoomOwner", "/app/owner.editOwner", "/app/owner.deleteOwner"]) {
			expectManifestEntry(url, {
				method: "POST",
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				ownerModule: "owner",
				phase: "phase7-owner-guarded-write",
				cutoverStatus: "blocked-for-execution",
			});
		}
		expectManifestEntry("/app/purchase/updatePurchaseApply", {
			method: "POST",
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			ownerModule: "purchase",
			phase: "phase7-purchase-guarded-write",
			cutoverStatus: "blocked-for-execution",
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

	test("contract-manage covered admin adapters return JsonVO instead of app legacy envelope", async () => {
		const admin = createAdminContractAdapter(createContractService(createInMemoryContractRepository()));

		for (const response of [
			await admin.listArchive({ pageIndex: 1, pageSize: 20 }),
			await admin.listAttachment({ pageIndex: 1, pageSize: 20 }),
			await admin.listClause({ pageIndex: 1, pageSize: 20 }),
			await admin.listChange({ pageIndex: 1, pageSize: 20 }),
			await admin.listDraftContract({ pageIndex: 1, pageSize: 20 }),
			await admin.listExpire({ pageIndex: 1, pageSize: 20 }),
			await admin.listFirstParty({ pageIndex: 1, pageSize: 20 }),
			await admin.listPrint({ pageIndex: 1, pageSize: 20 }),
			await admin.listReview({ pageIndex: 1, pageSize: 20 }),
			await admin.listSecondParty({ pageIndex: 1, pageSize: 20 }),
			await admin.listTemplate({ pageIndex: 1, pageSize: 20 }),
			await admin.listContractType({ pageIndex: 1, pageSize: 20 }),
		]) {
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
		}
	});

	test("contract type list adapter exposes Phase7 evidence without widening scope", () => {
		expect(contractTypeListAdminAdapterEvidence).toMatchObject({
			endpoint: "/api/property-manage/contract-manage/type/list",
			responseContract: "JsonVO<PageDTO>",
			dataSourceStatus: "drizzle-ctTypes-when-database-configured-empty-fallback-without-database",
			scope: "admin-ordinary-list-only",
		});
		expect(contractTypeListAdminAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining(["contract-manage-CUD", "contract-manage-detail", "contract-manage-upload", "R2"]),
		);
	});

	test("contract-manage change and draft-contract CRUD adapters return JsonVO", async () => {
		const admin = createAdminContractAdapter(createContractService(createInMemoryContractRepository()));

		for (const response of [
			await admin.createChange({ contractId: "CONTRACT_001", changeType: "amount" }),
			await admin.updateChange({ id: "CHANGE_001", changeReason: "price adjusted" }),
			await admin.deleteChange({ id: "CHANGE_001" }),
			await admin.createDraftContract({ contractName: "Draft contract", contractNumber: "DRAFT_001" }),
			await admin.updateDraftContract({ id: "CONTRACT_DRAFT_001", contractName: "Draft contract v2" }),
			await admin.deleteDraftContract({ id: "CONTRACT_DRAFT_001" }),
		]) {
			expect(response).toMatchObject({
				success: true,
				code: 200,
				message: expect.any(String),
			});
			expect(response).not.toHaveProperty("msg");
		}
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

	test("fee charge-machine readonly app legacy endpoints return the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/iot/listChargeMachineBmoImpl",
				query: { page: 1, row: 10, communityId: "COMM_001", machineNameLike: "1" },
				expectedItem: { machineId: "MACHINE_001" },
			},
			{
				path: "/app/iot/listChargeMachineOrderBmoImpl",
				query: { page: 1, row: 10, communityId: "UNKNOWN_COMMUNITY", machineId: "MACHINE_001" },
				expectedItem: { orderId: "CHARGE_ORDER_001" },
			},
			{
				path: "/app/iot/listChargeMachinePortBmoImpl",
				query: { page: 1, row: 10, communityId: "COMM_001", machineId: "MACHINE_001" },
				expectedItem: { portId: "PORT_001" },
			},
			{
				path: "/app/machine/listMachineRecords",
				query: { page: 1, row: 10, communityId: "UNKNOWN_COMMUNITY" },
				expectedItem: { logId: "OPEN_LOG_001" },
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: {
					list: expect.arrayContaining([expect.objectContaining(request.expectedItem)]),
				},
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("fee charge-machine adapter evidence stays scoped to deterministic readonly exact handlers", () => {
		expect(feeLegacyAdapterEvidence).toMatchObject({
			scope: "fee-payment-report-plus-charge-machine-and-machine-record-readonly-and-guarded-write",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: expect.arrayContaining([
				"/app/iot/listChargeMachineBmoImpl",
				"/app/iot/listChargeMachineOrderBmoImpl",
				"/app/iot/listChargeMachinePortBmoImpl",
				"/app/machine/listMachineRecords",
			]),
			guardedEndpoints: [
				"/app/payment.nativeQrcodePayment",
				"/app/oweFeeCallable.writeOweFeeCallable",
				"/app/fee.saveRoomCreateFee",
			],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(feeLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"db-backed-charge-machine-data",
				"db-backed-machine-record-data",
				"production-app-h5-fee-network",
			]),
		);
		expect(feeLegacyAdapterEvidence.notCovered).not.toContain("/app/machine/listMachineRecords");
		expect(feeLegacyAdapterEvidence).not.toMatchObject({
			dataSourceStatus: expect.stringContaining("DB_READY"),
		});
	});

	test("floor batch2 app legacy endpoint returns the old code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/floor.queryFloors",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 5,
				hasMore: true,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("room-unit readonly app legacy endpoints return the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/room.queryRooms",
				query: { page: 1, row: 1, communityId: "COMM_001", unitId: "U_COMM_001_001_01" },
			},
			{
				path: "/app/unit.queryUnits",
				query: { page: 1, row: 1, communityId: "COMM_001", floorId: "F_COMM_001_001" },
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
					page: 1,
					pageSize: 1,
				},
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}

		for (const request of [
			{
				path: "/app/room.queryRoomDetail",
				query: { roomId: "R_COMM_001_001_01_01" },
				field: "roomId",
			},
			{
				path: "/app/unit.queryUnitDetail",
				query: { unitId: "U_COMM_001_001_01" },
				field: "unitId",
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expect.objectContaining({
					[request.field]: expect.any(String),
				}),
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("room-unit adapter evidence stays scoped to synthetic readonly compatibility data", () => {
		expect(roomUnitLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-pilot",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/room.queryRooms",
				"/app/room.queryRoomDetail",
				"/app/unit.queryUnits",
				"/app/unit.queryUnitDetail",
			],
			syntheticIdPolicy: "F_/U_/R_ compatibility seed identifiers only",
		});
		expect(roomUnitLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining(["db-backed-room-unit-data", "real-room-unit-primary-keys", "shadow-off-fallback"]),
		);
	});

	test("owner app legacy endpoints return readonly envelope and guarded write responses", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const list = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/owner.queryOwnerAndMembers",
			query: { page: 1, row: 1, communityId: "COMM_001" },
		});

		expect(list).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 1,
			},
		});
		expect(list).not.toHaveProperty("success");
		expect(list).not.toHaveProperty("message");
		expect(list).not.toHaveProperty("timestamp");

		for (const request of [
			{ path: "/app/owner.saveRoomOwner", body: { communityId: "COMM_001", name: "测试", link: "13900000000" } },
			{ path: "/app/owner.editOwner", body: { communityId: "COMM_001", memberId: "MEM_0003", name: "测试" } },
			{ path: "/app/owner.deleteOwner", body: { communityId: "COMM_001", memberId: "MEM_0003" } },
		]) {
			const guarded = await dispatchEndpoint(registry, {
				method: "POST",
				path: request.path,
				body: request.body,
			});

			expect(guarded).toMatchObject({
				code: 409,
				msg: expect.stringContaining(request.path.replace("/app/", "")),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(guarded).not.toHaveProperty("success");
			expect(guarded).not.toHaveProperty("message");
		}
	});

	test("owner adapter evidence separates readonly query from guarded writes", () => {
		expect(ownerLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-write",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: ["/app/owner.queryOwnerAndMembers"],
			guardedEndpoints: ["/app/owner.saveRoomOwner", "/app/owner.editOwner", "/app/owner.deleteOwner"],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(ownerLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"db-backed-owner-data",
				"owner-write-read-back-rollback",
				"production-app-h5-owner-network",
				"/app/owner.queryOwnerCars",
			]),
		);
	});

	test("work-order readonly app legacy endpoint returns the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/workorder/todo/list",
				query: { page: 1, row: 1, communityId: "COMM_001" },
			},
			{
				path: "/app/workorder/copy/list",
				query: { page: 1, row: 1, communityId: "COMM_001" },
			},
			{
				path: "/app/workorder/task/list",
				query: { page: 1, row: 1, workId: "WO_001" },
			},
			{
				path: "/app/workorder/task/items",
				query: { page: 1, row: 1, workId: "WO_001" },
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
					page: 1,
					pageSize: 1,
				},
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		}
	});

	test("work-order guarded write endpoints return the mutation guard envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{ path: "/app/workorder/create", action: "create" },
			{ path: "/app/workorder/update", action: "update" },
			{ path: "/app/workorder/start", action: "start" },
			{ path: "/app/workorder/complete", action: "complete" },
			{ path: "/app/workorder/audit", action: "audit" },
			{ path: "/app/workorder/cancel", action: "cancel" },
			{ path: "/app/workorder/copy/finish", action: "copy/finish" },
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path: request.path,
				body: { workId: "WO_001" },
			});

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining(request.action),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		}
	});

	test("work-order adapter evidence separates readonly handlers from guarded writes", () => {
		expect(workOrderLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-write",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/workorder/todo/list",
				"/app/workorder/detail",
				"/app/workorder/copy/list",
				"/app/workorder/task/list",
				"/app/workorder/task/items",
			],
			guardedEndpoints: [
				"/app/workorder/create",
				"/app/workorder/update",
				"/app/workorder/start",
				"/app/workorder/complete",
				"/app/workorder/audit",
				"/app/workorder/cancel",
				"/app/workorder/copy/finish",
			],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(workOrderLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"work-order-write-read-back-rollback",
				"production-app-h5-work-order-network",
				"db-ready-work-order-write-path",
			]),
		);
		expect(workOrderLegacyAdapterEvidence.notCovered).not.toContain("/app/workorder/create");
		expect(workOrderLegacyAdapterEvidence.notCovered).not.toContain("/app/workorder/copy/finish");
	});

	test("visit readonly app legacy endpoint returns the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/visit.getVisit",
				query: { page: 1, row: 1, communityId: "COMM_001" },
			},
			{
				path: "/app/visit.getVisitDetail",
				query: { page: 1, row: 1, visitId: "VISIT_00001", communityId: "COMM_001" },
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
					page: 1,
					pageSize: 1,
				},
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		}
	});

	test("visit audit endpoint returns a guarded mutation envelope without write execution", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/visit.auditVisit",
			body: { visitId: "VISIT_00001", taskId: "TASK_V_0001", state: "1" },
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("visit.auditVisit"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("visit adapter evidence separates readonly handlers from guarded audit write", () => {
		expect(visitLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-audit-write",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: ["/app/visit.getVisit", "/app/visit.getVisitDetail"],
			guardedEndpoints: ["/app/visit.auditVisit"],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(visitLegacyAdapterEvidence.notCovered).toEqual(expect.arrayContaining(["visit-audit-read-back-rollback"]));
	});

	test("profile readonly app legacy endpoint returns the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/profile.getUserProfile",
				query: {},
			},
			{
				path: "/app/profile.listCommunities",
				query: { keyword: "Sun" },
			},
			{
				path: "/app/profile.listAttendanceRecords",
				query: { month: "2026-03", staffId: "STAFF_001" },
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expect.anything(),
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		}
	});

	test("profile readonly adapter evidence stays scoped to exact read handlers", () => {
		expect(profileLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-plus-guarded-write-handler-pilot",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: ["/app/profile.getUserProfile", "/app/profile.listCommunities", "/app/profile.listAttendanceRecords"],
			guardedEndpoints: ["/app/profile.changeCommunity", "/app/profile.changePassword"],
			notCovered: ["profile-write-read-back-rollback", "production-app-h5-profile-network"],
		});
	});

	test("video readonly app legacy endpoint returns the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/video.listMonitorArea",
				query: { page: 1, row: 2, communityId: "COMM_001" },
			},
			{
				path: "/app/video.listStaffMonitorMachine",
				query: { page: 1, row: 2, maId: "AREA_001", communityId: "COMM_001" },
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
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
		}

		const play = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/video.getPlayVideoUrl",
			query: { machineId: "MACHINE_0001", communityId: "COMM_001" },
		});
		expect(play).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				url: expect.stringContaining("flower.mp4"),
			},
		});
		expect(play).not.toHaveProperty("success");
	});

	test("video readonly adapter evidence stays scoped to exact read handlers", () => {
		expect(videoLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-pilot",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready-no-real-camera",
			responseContract: "{ code, msg, data }",
			endpoints: ["/app/video.listMonitorArea", "/app/video.listStaffMonitorMachine", "/app/video.getPlayVideoUrl"],
		});
		expect(videoLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining(["real-camera-platform", "db-backed-video-data", "video-stream-control"]),
		);
	});

	test("notice readonly app legacy endpoint returns the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/notice.listNotices",
			query: { page: 1, row: 1, communityId: "COMM_001", noticeTypeCd: "1001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				notices: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				row: 1,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("notice readonly adapter evidence stays scoped to exact read handlers", () => {
		expect(noticeLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-pilot",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: ["/app/notice.listNotices"],
		});
		expect(noticeLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining(["db-backed-notice-data", "notice-write-or-delete"]),
		);
	});

	test("property-application readonly app legacy endpoints return the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/feeDiscount/queryFeeDiscount",
				query: { discountType: "3003", communityId: "COMM_001" },
			},
			{
				path: "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
				query: { ardrId: "ARDR_001" },
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expect.any(Array),
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("property-application readonly adapter evidence stays scoped to exact read handlers", () => {
		expect(propertyApplicationLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-pilot",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/feeDiscount/queryFeeDiscount",
				"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
			],
		});
		expect(propertyApplicationLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"/app/applyRoomDiscount/queryApplyRoomDiscount",
				"/app/applyRoomDiscount/updateApplyRoomDiscount",
				"/app/applyRoomDiscount/updateReviewApplyRoomDiscount",
				"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord",
				"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord",
				"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord",
				"db-backed-property-application-data",
				"property-application-write-read-back-rollback",
			]),
		);
	});

	test("coupon readonly app legacy endpoints return the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/couponProperty.listCouponPropertyUserDetail",
				query: { page: 1, row: 1, couponQrcode: "CPN100000", communityId: "IGNORED" },
				data: {
					list: [expect.objectContaining({ couponQrcode: "CPN100000" })],
					total: 1,
					page: 1,
					pageSize: 1,
					hasMore: false,
				},
			},
			{
				path: "/app/integral.listIntegralSetting",
				query: { communityId: "IGNORED" },
				data: [expect.objectContaining({ settingId: "IS_001", onceMaxIntegral: 200 })],
			},
			{
				path: "/app/integral.listIntegralUserDetail",
				query: { page: 1, row: 1, ownerTel: "13800000001", communityId: "IGNORED" },
				data: {
					list: [expect.objectContaining({ ownerTel: "13800000001" })],
					total: 1,
					page: 1,
					pageSize: 1,
					hasMore: false,
				},
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: request.data,
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("coupon readonly adapter evidence stays scoped to three exact read handlers", () => {
		expect(couponLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-batch22",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/couponProperty.listCouponPropertyUserDetail",
				"/app/integral.listIntegralSetting",
				"/app/integral.listIntegralUserDetail",
			],
		});
		expect(couponLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"/app/couponProperty.writeOffCouponPropertyUser",
				"/app/integral.useIntegral",
				"/app/reserveOrder.listReserveGoodsConfirmOrder",
				"/app/reserveOrder.saveReserveGoodsConfirmOrder",
				"db-backed-coupon-data",
				"coupon-integral-write-read-back-rollback",
				"reserve-order-readonly-and-write",
				"production-app-h5-coupon-integral-network",
			]),
		);
	});

	test("maintenance readonly app legacy endpoints keep the legacy maintenance envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				path: "/app/maintenance.listMaintenanceTasks",
				query: { communityId: "COMM_001", status: "10001", page: 1, row: 2 },
				data: expect.objectContaining({
					list: [expect.objectContaining({ communityId: "COMM_001", status: "10001" })],
					total: expect.any(Number),
					page: 1,
					pageSize: 2,
				}),
			},
			{
				path: "/app/maintenance.queryMaintenanceTask",
				query: { taskId: "MT_001" },
				data: expect.objectContaining({ task: expect.objectContaining({ taskId: "MT_001" }) }),
			},
			{
				path: "/app/maintenance.listMaintenanceTaskDetails",
				query: { taskId: "MT_001" },
				data: expect.objectContaining({
					items: expect.arrayContaining([
						expect.objectContaining({ taskId: "MT_001", taskDetailId: expect.any(String) }),
					]),
				}),
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				success: true,
				code: "0",
				message: expect.any(String),
				data: request.data,
				timestamp: expect.any(Number),
			});
			expect(response).not.toHaveProperty("msg");
		}
	});

	test("maintenance adapter evidence stays scoped to readonly exact handlers and excluded write paths", () => {
		expect(maintenanceLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-batch23",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ success, code, message, data, timestamp }",
			endpoints: [
				"/app/maintenance.listMaintenanceTasks",
				"/app/maintenance.queryMaintenanceTask",
				"/app/maintenance.listMaintenanceTaskDetails",
			],
			excludedWriteEndpoints: [
				"/app/maintenance.startMaintenanceTask",
				"/app/maintenance.completeMaintenanceTask",
				"/app/maintenance.submitMaintenanceSingle",
				"/app/maintenance.transferMaintenanceTask",
			],
		});
		expect(maintenanceLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"/app/maintenance.startMaintenanceTask",
				"/app/maintenance.completeMaintenanceTask",
				"/app/maintenance.submitMaintenanceSingle",
				"/app/maintenance.transferMaintenanceTask",
				"db-backed-maintenance-data",
				"production-app-h5-maintenance-network",
			]),
		);
	});

	test("item-release readonly app legacy endpoint returns the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/itemRelease.getItemRelease",
			query: { irId: "IR_00001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [expect.objectContaining({ irId: "IR_00001" })],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("item-release adapter evidence covers batch21 readonly exact handlers and guarded audit", () => {
		expect(itemReleaseLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-write-batch21",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/itemRelease.getItemRelease",
				"/app/itemRelease.getItemReleaseRes",
				"/app/itemRelease.queryOaWorkflowUser",
				"/app/itemRelease.queryUndoItemReleaseV2",
				"/app/itemRelease.queryFinishItemReleaseV2",
			],
			guardedEndpoints: ["/app/itemRelease.auditItemRelease"],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(itemReleaseLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining(["db-backed-item-release-data", "item-release-write-read-back-rollback"]),
		);
		expect(itemReleaseLegacyAdapterEvidence.notCovered).not.toContain("/app/itemRelease.auditItemRelease");
		expect(itemReleaseLegacyAdapterEvidence.notCovered).not.toContain("/app/itemRelease.queryUndoItemReleaseV2");
		expect(itemReleaseLegacyAdapterEvidence.notCovered).not.toContain("/app/itemRelease.queryFinishItemReleaseV2");
	});

	test("activity readonly app legacy endpoint returns the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/activities.listActivitiess",
			query: { page: 1, row: 1, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				activitiess: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				row: 1,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("activity adapter evidence separates readonly list from guarded writes through batch25", () => {
		expect(activityLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-write-batch25",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: ["/app/activities.listActivitiess"],
			guardedEndpoints: [
				"/app/activities.likeActivity",
				"/app/activities.increaseView",
				"/app/activities.updateStatus",
				"/app/activities.updateLike",
				"/app/activities.updateCollect",
				"/app/activities.saveActivities",
				"/app/activities.updateActivities",
				"/app/activities.deleteActivities",
			],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(activityLegacyAdapterEvidence.notCovered).toEqual(expect.arrayContaining(["db-backed-activity-data"]));
		expect(activityLegacyAdapterEvidence.notCovered).not.toContain("/app/activities.likeActivity");
		expect(activityLegacyAdapterEvidence.notCovered).not.toContain("/app/activities.increaseView");
		expect(activityLegacyAdapterEvidence.notCovered).not.toContain("/app/activities.updateStatus");
		expect(activityLegacyAdapterEvidence.notCovered).not.toContain("/app/activities.updateLike");
		expect(activityLegacyAdapterEvidence.notCovered).not.toContain("/app/activities.updateCollect");
		expect(activityLegacyAdapterEvidence.notCovered).not.toContain("/app/activities.saveActivities");
		expect(activityLegacyAdapterEvidence.notCovered).not.toContain("/app/activities.updateActivities");
		expect(activityLegacyAdapterEvidence.notCovered).not.toContain("/app/activities.deleteActivities");
	});

	test("activity guarded write endpoints through batch25 return the mutation guard envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const [path, action] of [
			["/app/activities.likeActivity", "activities.likeActivity"],
			["/app/activities.increaseView", "activities.increaseView"],
			["/app/activities.updateStatus", "activities.updateStatus"],
			["/app/activities.updateLike", "activities.updateLike"],
			["/app/activities.updateCollect", "activities.updateCollect"],
			["/app/activities.saveActivities", "activities.saveActivities"],
			["/app/activities.updateActivities", "activities.updateActivities"],
			["/app/activities.deleteActivities", "activities.deleteActivities"],
		] as const) {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path,
				body: { activitiesId: "ACT_001", title: "Blocked activity mutation" },
			});

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining(action),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("appointment app legacy endpoints return list envelope and guarded write response", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const list = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/communitySpace.listCommunitySpaceConfirmOrder",
			query: { page: 1, row: 1, communityId: "COMM_001" },
		});

		expect(list).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 1,
			},
		});
		expect(list).not.toHaveProperty("success");
		expect(list).not.toHaveProperty("message");

		const save = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/communitySpace.saveCommunitySpaceConfirmOrder",
			body: { timeId: "HEXIAO_100002", communityId: "COMM_001" },
		});

		expect(save).toMatchObject({
			code: 409,
			msg: expect.stringContaining("communitySpace.saveCommunitySpaceConfirmOrder"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("appointment adapter evidence separates readonly list from guarded write", () => {
		expect(appointmentLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-write",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: ["/app/communitySpace.listCommunitySpaceConfirmOrder"],
			guardedEndpoints: ["/app/communitySpace.saveCommunitySpaceConfirmOrder"],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(appointmentLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining(["db-backed-appointment-data", "appointment-confirm-write-read-back-rollback"]),
		);
	});

	test("complaint app legacy endpoints return readonly envelopes and guarded write responses", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{ path: "/app/auditUser.listAuditComplaints", query: { page: 1, row: 1 } },
			{ path: "/app/auditUser.listAuditHistoryComplaints", query: { page: 1, row: 1 } },
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expect.any(Object),
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		}

		const save = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/complaint",
			body: { typeCd: "809001", complaintName: "测试投诉人", tel: "13800138000", roomId: "ROOM_001", context: "测试" },
		});

		expect(save).toMatchObject({
			code: 409,
			msg: expect.stringContaining("complaint"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("complaint adapter evidence separates readonly handlers from guarded writes", () => {
		expect(complaintLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-write",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/auditUser.listAuditComplaints",
				"/app/auditUser.listAuditHistoryComplaints",
				"/app/complaint.listComplaintEvent",
				"/app/complaintAppraise.listComplaintAppraise",
			],
			guardedEndpoints: [
				"/app/complaint",
				"/app/complaint.auditComplaint",
				"/app/complaintAppraise.replyComplaintAppraise",
			],
		});
		expect(complaintLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining(["db-backed-complaint-data", "complaint-write-read-back-rollback"]),
		);
	});

	test("contact app legacy endpoints return readonly envelopes and guarded write response", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{ path: "/app/contact.listContacts", query: { page: 1, row: 1 } },
			{ path: "/app/contact.getDepartments", query: {} },
			{ path: "/app/contact.getEmergencyContacts", query: {} },
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expect.any(Object),
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}

		const guarded = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/contact.updateOnlineStatus",
			body: { contactId: "CON_001", isOnline: false },
		});

		expect(guarded).toMatchObject({
			code: 409,
			msg: expect.stringContaining("contact.updateOnlineStatus"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("contact adapter evidence separates readonly handlers from guarded online status update", () => {
		expect(contactLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-write",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/contact.listContacts",
				"/app/contact.getContactDetail",
				"/app/contact.getContactsByDepartment",
				"/app/contact.searchContacts",
				"/app/contact.getDepartments",
				"/app/contact.getFavoriteContacts",
				"/app/contact.getEmergencyContacts",
			],
			guardedEndpoints: ["/app/contact.updateOnlineStatus"],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(contactLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"db-backed-contact-data",
				"contact-update-online-status-read-back-rollback",
				"natural-app-h5-contact-page-network",
			]),
		);
	});

	test("purchase client-only write gap is guarded without write evidence", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/purchase/updatePurchaseApply",
			body: { applyId: "PA_001", communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("Phase7"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("purchase guard evidence declares no-go write status", () => {
		expect(purchaseLegacyGuardEvidence).toMatchObject({
			scope: "client-only-gap-write-guard",
			dataSourceStatus: "no-exact-legacy-server-source",
			endpoint: "/app/purchase/updatePurchaseApply",
			defaultBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
	});

	test("manifest marks repair readonly DB-wired endpoints as app shadow allowlisted", () => {
		expectManifestEntry("/app/ownerRepair.listOwnerRepairs", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/ownerRepair.queryOwnerRepair", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/repairSetting.listRepairSettings", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/dict.queryRepairStates", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		for (const url of [
			"/app/dict.queryPayTypes",
			"/app/ownerRepair.getRepairStatistics",
			"/app/ownerRepair.listRepairStaffRecords",
			"/app/ownerRepair.listRepairStaffs",
			"/app/repair.listRepairTypeUsers",
			"/app/resourceStore.listResources",
		]) {
			expectManifestEntry(url, {
				targetClient: "app",
				routeKind: "app-legacy",
				responseContract: "{ code, msg, data }",
				phase: "phase7-repair-readonly",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
		for (const url of [
			"/app/staff.listStaffs",
			"/app/inspection.getTodayReport",
			"/app/inspection.listInspectionItemTitles",
			"/app/inspection.listInspectionTasks",
			"/app/inspection.listInspectionTaskDetails",
		]) {
			expectManifestEntry(url, {
				targetClient: "app",
				routeKind: "app-legacy",
				ownerModule: "inspection",
				responseContract: "{ code, msg, data }",
				phase: "phase7-inspection-readonly",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
		for (const url of ["/app/inspection.submitInspection", "/app/inspection.transferTask"]) {
			expectManifestEntry(url, {
				targetClient: "app",
				routeKind: "app-legacy",
				ownerModule: "inspection",
				responseContract: "{ code, msg, data }",
				phase: "phase7-inspection-guarded-write-batch16",
				cutoverStatus: "blocked-for-execution",
			});
		}
		for (const url of [
			"/app/meter.queryFeeTypes",
			"/app/meter.queryFeeTypesItems",
			"/app/meter.listMeterType",
			"/app/meter.listMeterWaters",
			"/app/meter.queryPreMeterWater",
			"/app/meter.listFloorShareReading",
			"/app/meter.listFloorShareMeter",
		]) {
			expectManifestEntry(url, {
				targetClient: "app",
				routeKind: "app-legacy",
				ownerModule: "meter",
				responseContract: "{ code, msg, data }",
				phase: "phase7-meter-readonly-batch13",
				cutoverStatus: "app-shadow-allowlist",
			});
		}
	});

	test("repair readonly app legacy endpoints return the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{ path: "/app/dict.queryPayTypes", query: {} },
			{ path: "/app/ownerRepair.getRepairStatistics", query: { ignored: "yes" } },
			{ path: "/app/ownerRepair.listRepairStaffRecords", query: { repairId: "REPAIR_001" } },
			{ path: "/app/ownerRepair.listRepairStaffs", query: { repairType: "1001" } },
			{ path: "/app/repair.listRepairTypeUsers", query: { repairType: "1001" } },
			{ path: "/app/resourceStore.listResources", query: { rstId: "RST_001_01" } },
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expect.anything(),
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("repair adapter evidence separates readonly handlers from blocked write actions", () => {
		expect(repairLegacyAdapterEvidence).toMatchObject({
			scope: "phase4a-minimal-plus-phase7-readonly-and-guarded-write",
			dataSourceStatus: "deterministic-compat-seed-db-read-fallback-mixed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/ownerRepair.listOwnerRepairs",
				"/app/ownerRepair.queryOwnerRepair",
				"/app/repairSetting.listRepairSettings",
				"/app/dict.queryRepairStates",
				"/callComponent/core/list",
				"/app/dict.queryPayTypes",
				"/app/ownerRepair.getRepairStatistics",
				"/app/ownerRepair.listRepairStaffRecords",
				"/app/ownerRepair.listRepairStaffs",
				"/app/repair.listRepairTypeUsers",
				"/app/resourceStore.listResources",
			],
			guardedEndpoints: ["/app/ownerRepair.saveOwnerRepair", "/callComponent/ownerRepair.appraiseRepair"],
		});
		expect(repairLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
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
			]),
		);
	});

	test("inspection readonly app legacy endpoints return the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{ path: "/app/staff.listStaffs", query: { communityId: "COMM_001" } },
			{ path: "/app/inspection.getTodayReport", query: { communityId: "COMM_001", queryTime: "2026-06-06" } },
			{ path: "/app/inspection.listInspectionItemTitles", query: { itemId: "ITEM_001", page: 1, row: 2 } },
			{ path: "/app/inspection.listInspectionTasks", query: { page: 1, row: 2, moreState: "20200405" } },
			{ path: "/app/inspection.listInspectionTaskDetails", query: { taskId: "TASK_001", state: "20200406" } },
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: expect.anything(),
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("inspection guarded submit endpoint returns a blocked mutation response", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/inspection.submitInspection",
			body: {
				taskId: "TASK_001",
				taskDetailId: "DETAIL_TASK_001_001",
				description: "巡检完成",
				photos: ["https://example.test/inspection-a.png"],
			},
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("inspection.submitInspection"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("inspection guarded transfer endpoint returns a blocked mutation response", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/inspection.transferTask",
			body: {
				taskId: "TASK_001",
				staffName: "王巡检",
			},
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("inspection.transferTask"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("inspection adapter evidence separates readonly handlers from guarded write actions", () => {
		expect(inspectionLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-writes-batch16",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/staff.listStaffs",
				"/app/inspection.getTodayReport",
				"/app/inspection.listInspectionItemTitles",
				"/app/inspection.listInspectionTasks",
				"/app/inspection.listInspectionTaskDetails",
			],
			guardedEndpoints: ["/app/inspection.submitInspection", "/app/inspection.transferTask"],
			defaultWriteBehavior: "blocked-for-execution",
			writeVerification: "no-read-back-or-rollback-evidence",
		});
		expect(inspectionLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"db-backed-inspection-data",
				"inspection-write-read-back-rollback",
				"production-app-h5-inspection-network",
			]),
		);
		expect(inspectionLegacyAdapterEvidence.notCovered).not.toContain("/app/inspection.transferTask");
	});

	test("meter readonly app legacy endpoints return the unified code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{ path: "/app/meter.queryFeeTypes", query: {} },
			{ path: "/app/meter.queryFeeTypesItems", query: { feeTypeCd: "888800010015" } },
			{ path: "/app/meter.listMeterType", query: {} },
			{ path: "/app/meter.listMeterWaters", query: { page: 1, row: 2, roomNum: "1-" } },
			{ path: "/app/meter.queryPreMeterWater", query: { objId: "ROOM_0001", meterType: "1010" } },
			{ path: "/app/meter.listFloorShareReading", query: { page: 1, row: 2 } },
			{ path: "/app/meter.listFloorShareMeter", query: { page: 1, row: 1, fsmId: "FSM_0002" } },
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path: request.path,
				query: request.query,
			});

			expect(response).toMatchObject({
				code: 0,
				msg: "查询成功",
				data: expect.anything(),
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("meter adapter evidence separates readonly handlers from guarded write paths", () => {
		expect(meterLegacyAdapterEvidence).toMatchObject({
			scope: "readonly-exact-handler-plus-guarded-write-batch14",
			dataSourceStatus: "deterministic-compat-seed-no-db-ready",
			responseContract: "{ code, msg, data }",
			endpoints: [
				"/app/meter.queryFeeTypes",
				"/app/meter.queryFeeTypesItems",
				"/app/meter.listMeterType",
				"/app/meter.listMeterWaters",
				"/app/meter.queryPreMeterWater",
				"/app/meter.listFloorShareReading",
				"/app/meter.listFloorShareMeter",
			],
			guardedEndpoints: [
				"/app/meter.saveMeterWater",
				"/app/meter.saveFloorShareReading",
				"/app/meter.auditFloorShareReading",
			],
			defaultWriteBehavior: "blocked-for-execution",
		});
		expect(meterLegacyAdapterEvidence.notCovered).toEqual(
			expect.arrayContaining([
				"db-backed-meter-data",
				"meter-write-read-back-rollback",
				"production-app-h5-meter-network",
			]),
		);
		expect(meterLegacyAdapterEvidence.notCovered).not.toContain("/app/meter.saveMeterWater");
		expect(meterLegacyAdapterEvidence.notCovered).not.toContain("/app/meter.saveFloorShareReading");
		expect(meterLegacyAdapterEvidence.notCovered).not.toContain("/app/meter.auditFloorShareReading");
	});

	test("meter guarded write endpoints return the mutation guard envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const [path, action] of [
			["/app/meter.saveMeterWater", "meter.saveMeterWater"],
			["/app/meter.saveFloorShareReading", "meter.saveFloorShareReading"],
			["/app/meter.auditFloorShareReading", "meter.auditFloorShareReading"],
		] as const) {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path,
				body: { objId: "ROOM_0001", meterType: "1010", readingId: "FSR_0001" },
			});

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining(action),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("manifest does not claim uncut or unavailable endpoints are cut over", () => {
		expectManifestEntry("/app/ownerRepair.saveOwnerRepair", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "blocked-for-execution",
		});
		expectManifestEntry("/callComponent/core/list", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/callComponent/ownerRepair.appraiseRepair", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "blocked-for-execution",
		});
		expectManifestEntry("/app/floor.queryFloors", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});
		expectManifestEntry("/app/floor.queryFloorDetail", {
			targetClient: "app",
			routeKind: "app-legacy",
			responseContract: "{ code, msg, data }",
			cutoverStatus: "app-shadow-allowlist",
		});

		const urls = runtimeEndpointManifest.map((item) => item.url);
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/create");
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/update");
		expect(urls).not.toContain("/api/property-manage/expense-manage/house-charge/delete");
		expect(urls).toContain("/app/visit.auditVisit");
		expect(urls).toContain("/app/profile.changeCommunity");
		expect(urls).toContain("/app/profile.changePassword");
		expect(urls).toContain("/app/meter.saveMeterWater");
		expect(urls).toContain("/app/meter.saveFloorShareReading");
		expect(urls).toContain("/app/meter.auditFloorShareReading");
		expect(urls).toContain("/app/activities.likeActivity");
		expect(urls).toContain("/app/activities.increaseView");
		expect(urls).toContain("/app/activities.updateStatus");
		expect(urls).toContain("/app/activities.updateLike");
		expect(urls).toContain("/app/activities.updateCollect");
		expect(urls).toContain("/app/activities.saveActivities");
		expect(urls).toContain("/app/activities.updateActivities");
		expect(urls).toContain("/app/activities.deleteActivities");
	});

	test("manifest marks high-risk app legacy mutation actions as blocked for execution", () => {
		for (const url of [
			"/app/payment.nativeQrcodePayment",
			"/app/oweFeeCallable.writeOweFeeCallable",
			"/app/fee.saveRoomCreateFee",
			"/app/ownerRepair.saveOwnerRepair",
			"/callComponent/ownerRepair.appraiseRepair",
			"/app/purchase/updatePurchaseApply",
			"/app/owner.saveRoomOwner",
			"/app/owner.editOwner",
			"/app/owner.deleteOwner",
			"/app/profile.changeCommunity",
			"/app/profile.changePassword",
			"/app/visit.auditVisit",
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
