import { feeLegacyEndpointDefinitions } from "../../modules/fee/legacy-endpoints";
import { floorLegacyEndpointDefinitions } from "../../modules/floor/legacy-endpoints";
import { noticeLegacyEndpointDefinitions } from "../../modules/notice/legacy-endpoints";
import { profileLegacyEndpointDefinitions } from "../../modules/profile/legacy-endpoints";
import { purchaseLegacyEndpointDefinitions } from "../../modules/purchase/legacy-endpoints";
import { repairLegacyEndpointDefinitions } from "../../modules/repair/legacy-endpoints";
import { videoLegacyEndpointDefinitions } from "../../modules/video/legacy-endpoints";
import { visitLegacyEndpointDefinitions } from "../../modules/visit/legacy-endpoints";
import { workOrderLegacyEndpointDefinitions } from "../../modules/work-order/legacy-endpoints";
import type { EndpointDefinition } from "./endpoint-registry";

type EndpointManifestTargetClient = "admin" | "app";
type EndpointManifestRouteKind = "admin-canonical" | "app-legacy";
type EndpointManifestResponseContract = "JsonVO" | "{ code, msg, data }";
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
	"/app/purchase/updatePurchaseApply",
]);

const phase7RepairReadonlyAppShadowUrls = new Set([
	"/app/ownerRepair.listOwnerRepairs",
	"/app/ownerRepair.queryOwnerRepair",
	"/app/repairSetting.listRepairSettings",
	"/app/dict.queryRepairStates",
]);

const runtimeEndpointEntries = [
	...feeLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase2-fee-payment-report",
		ownerModule: "fee",
		cutoverStatus: getFeeLegacyCutoverStatus(definition),
	})),
	...repairLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase4a-repair-minimal",
		ownerModule: "repair",
		cutoverStatus: getRepairLegacyCutoverStatus(definition),
	})),
	...floorLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-batch2-floor",
		ownerModule: "floor",
		cutoverStatus: getFloorLegacyCutoverStatus(definition),
	})),
	...workOrderLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-work-order-readonly",
		ownerModule: "work-order",
		cutoverStatus: getWorkOrderLegacyCutoverStatus(definition),
	})),
	...visitLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-visit-readonly",
		ownerModule: "visit",
		cutoverStatus: getVisitLegacyCutoverStatus(definition),
	})),
	...profileLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase7-profile-readonly",
		ownerModule: "profile",
		cutoverStatus: getProfileLegacyCutoverStatus(definition),
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
		responseContract: "{ code, msg, data }" as const,
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

function getFeeLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
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

function getFloorLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getWorkOrderLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getVisitLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getProfileLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getVideoLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getNoticeLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	void definition;
	return "app-shadow-allowlist";
}

function getPurchaseLegacyCutoverStatus(definition: EndpointDefinition): EndpointManifestCutoverStatus {
	if (phase7BlockedAppLegacyMutationUrls.has(definition.url)) {
		return "blocked-for-execution";
	}

	return "not-in-app-shadow-allowlist";
}
