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
		"/api/property-manage/report-manage/payment-details-form/list",
		"phase2-fee-payment-report",
		"fee",
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
