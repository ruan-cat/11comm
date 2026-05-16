import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface CommunityManageModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const COMMUNITY_MANAGE_MODULES = [
	{
		name: "handing-business",
		queryKeyPrefix: "handing-business-list",
		apiUrl: "/api/property-manage/community-manage/handing-business/list",
		importModule: () => import("../handing-business"),
		useQuery: (mod) => (mod as typeof import("../handing-business")).useHandingBusinessListQuery({}),
	},
	{
		name: "parking-space-structure-diagram",
		queryKeyPrefix: "parkingSpaceStructureDiagram",
		apiUrl: "/api/property-manage/community-manage/parking-space-structure-diagram/list",
		importModule: () => import("../parking-space-structure-diagram"),
		useQuery: (mod) =>
			(mod as typeof import("../parking-space-structure-diagram")).useParkingSpaceStructureDiagramListQuery({}),
	},
	{
		name: "property-register",
		queryKeyPrefix: "propertyRegister",
		apiUrl: "/api/property-manage/community-manage/property-register/list",
		importModule: () => import("../property-register"),
		useQuery: (mod) => (mod as typeof import("../property-register")).usePropertyRegisterListQuery({}),
	},
	{
		name: "house-decoration",
		queryKeyPrefix: "houseDecoration",
		apiUrl: "/api/property-manage/community-manage/house-decoration/list",
		importModule: () => import("../house-decoration"),
		useQuery: (mod) => (mod as typeof import("../house-decoration")).useHouseDecorationListQuery({}),
	},
	{
		name: "my",
		queryKeyPrefix: "my",
		apiUrl: "/api/property-manage/community-manage/my/list",
		importModule: () => import("../my"),
		useQuery: (mod) => (mod as typeof import("../my")).useMyListQuery({}),
	},
	{
		name: "notice",
		queryKeyPrefix: "community-notice-list",
		apiUrl: "/api/property-manage/community-manage/notice/list",
		importModule: () => import("../notice"),
		useQuery: (mod) => (mod as typeof import("../notice")).useCommunityNoticeListQuery({}),
	},
	{
		name: "building-space-structure-diagram",
		queryKeyPrefix: "buildingSpaceStructureDiagram",
		apiUrl: "/api/property-manage/community-manage/building-space-structure-diagram/list",
		importModule: () => import("../building-space-structure-diagram"),
		useQuery: (mod) =>
			(mod as typeof import("../building-space-structure-diagram")).useBuildingSpaceStructureDiagramListQuery({}),
	},
] satisfies CommunityManageModuleConfig[];

async function importCommunityManageModule(moduleConfig: CommunityManageModuleConfig, env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 community-manage admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(COMMUNITY_MANAGE_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importCommunityManageModule(moduleConfig, {
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

	test.each(COMMUNITY_MANAGE_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importCommunityManageModule(moduleConfig, {
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

	test.each(COMMUNITY_MANAGE_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importCommunityManageModule(moduleConfig, {
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
