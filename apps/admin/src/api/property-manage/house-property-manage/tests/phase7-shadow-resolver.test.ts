import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface HousePropertyManageModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const HOUSE_PROPERTY_MANAGE_MODULES = [
	{
		name: "house",
		queryKeyPrefix: "house-list",
		apiUrl: "/api/property-manage/house-property-manage/house/list",
		importModule: () => import("../house"),
		useQuery: (mod) => (mod as typeof import("../house")).useHouseListQuery({}),
	},
	{
		name: "site-management",
		queryKeyPrefix: "siteManagement",
		apiUrl: "/api/property-manage/house-property-manage/site-management/list",
		importModule: () => import("../site-management"),
		useQuery: (mod) => (mod as typeof import("../site-management")).useSiteManagementListQuery({}),
	},
	{
		name: "reserve-venue",
		queryKeyPrefix: "reserveVenue",
		apiUrl: "/api/property-manage/house-property-manage/reserve-venue/list",
		importModule: () => import("../reserve-venue"),
		useQuery: (mod) => (mod as typeof import("../reserve-venue")).useReserveVenueListQuery({}),
	},
	{
		name: "owners-committee",
		queryKeyPrefix: "ownersCommittee",
		apiUrl: "/api/property-manage/house-property-manage/owners-committee/list",
		importModule: () => import("../owners-committee"),
		useQuery: (mod) => (mod as typeof import("../owners-committee")).useOwnersCommitteeListQuery({}),
	},
	{
		name: "reserve-venue-order",
		queryKeyPrefix: "reserveVenueOrder",
		apiUrl: "/api/property-manage/house-property-manage/reserve-venue-order/list",
		importModule: () => import("../reserve-venue-order"),
		useQuery: (mod) => (mod as typeof import("../reserve-venue-order")).useReserveVenueOrderListQuery({}),
	},
	{
		name: "owner-member",
		queryKeyPrefix: "ownerMember",
		apiUrl: "/api/property-manage/house-property-manage/owner-member/list",
		importModule: () => import("../owner-member"),
		useQuery: (mod) => (mod as typeof import("../owner-member")).useOwnerMemberListQuery({}),
	},
	{
		name: "owner-account",
		queryKeyPrefix: "ownerAccount",
		apiUrl: "/api/property-manage/house-property-manage/owner-account/list",
		importModule: () => import("../owner-account"),
		useQuery: (mod) => (mod as typeof import("../owner-account")).useOwnerAccountListQuery({}),
	},
	{
		name: "owner-information",
		queryKeyPrefix: "ownerInformation",
		apiUrl: "/api/property-manage/house-property-manage/owner-information/list",
		importModule: () => import("../owner-information"),
		useQuery: (mod) => (mod as typeof import("../owner-information")).useOwnerInformationListQuery({}),
	},
	{
		name: "invoice",
		queryKeyPrefix: "invoice",
		apiUrl: "/api/property-manage/house-property-manage/invoice/list",
		importModule: () => import("../invoice"),
		useQuery: (mod) => (mod as typeof import("../invoice")).useInvoiceListQuery({}),
	},
	{
		name: "invoice-title",
		queryKeyPrefix: "invoiceTitle",
		apiUrl: "/api/property-manage/house-property-manage/invoice-title/list",
		importModule: () => import("../invoice-title"),
		useQuery: (mod) => (mod as typeof import("../invoice-title")).useInvoiceTitleListQuery({}),
	},
] satisfies HousePropertyManageModuleConfig[];

async function importHousePropertyManageModule(
	moduleConfig: HousePropertyManageModuleConfig,
	env: Record<string, string>,
) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 house-property-manage admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(HOUSE_PROPERTY_MANAGE_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importHousePropertyManageModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "false",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: moduleConfig.apiUrl,
				initialParams: {},
			});
		},
	);

	test.each(HOUSE_PROPERTY_MANAGE_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importHousePropertyManageModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `/api-shadow${moduleConfig.apiUrl}`,
				initialParams: {},
			});
		},
	);

	test.each(HOUSE_PROPERTY_MANAGE_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importHousePropertyManageModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "false",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `http://127.0.0.1:3102${moduleConfig.apiUrl}`,
				initialParams: {},
			});
		},
	);
});
