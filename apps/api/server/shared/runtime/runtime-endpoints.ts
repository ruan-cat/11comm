import { feeLegacyEndpointDefinitions } from "../../modules/fee/legacy-endpoints";
import { floorLegacyEndpointDefinitions } from "../../modules/floor/legacy-endpoints";
import { repairLegacyEndpointDefinitions } from "../../modules/repair/legacy-endpoints";
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
): RuntimeEndpointManifestItem {
	return {
		url,
		method: "POST",
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
