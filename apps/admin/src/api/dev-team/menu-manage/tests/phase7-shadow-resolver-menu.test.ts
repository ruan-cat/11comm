import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface MenuCacheModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const MENU_CACHE_MODULES = [
	{
		name: "menu-catalog",
		queryKeyPrefix: "menuCatalog",
		apiUrl: "/api/dev-team/menu-manage/catalog/list",
		importModule: () => import("../catalog"),
		useQuery: (mod) => (mod as typeof import("../catalog")).useMenuCatalogListQuery({}),
	},
	{
		name: "menu-group",
		queryKeyPrefix: "menuGroup",
		apiUrl: "/api/dev-team/menu-manage/group/list",
		importModule: () => import("../group"),
		useQuery: (mod) => (mod as typeof import("../group")).useMenuGroupListQuery({}),
	},
	{
		name: "menu-item",
		queryKeyPrefix: "menuItem",
		apiUrl: "/api/dev-team/menu-manage/item/list",
		importModule: () => import("../item"),
		useQuery: (mod) => (mod as typeof import("../item")).useMenuItemListQuery({}),
	},
	{
		name: "refresh-cache",
		queryKeyPrefix: "devTeam:cacheManage:refreshCache:list",
		apiUrl: "/api/dev-team/cache-manage/refresh-cache/list",
		importModule: () => import("../../cache-manage/refresh-cache"),
		useQuery: (mod) => (mod as typeof import("../../cache-manage/refresh-cache")).useRefreshCacheListQuery({}),
	},
] satisfies MenuCacheModuleConfig[];

async function importMenuCacheModule(moduleConfig: MenuCacheModuleConfig, env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 dev-team menu-manage + cache-manage admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(MENU_CACHE_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importMenuCacheModule(moduleConfig, {
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

	test.each(MENU_CACHE_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importMenuCacheModule(moduleConfig, {
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

	test.each(MENU_CACHE_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importMenuCacheModule(moduleConfig, {
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
