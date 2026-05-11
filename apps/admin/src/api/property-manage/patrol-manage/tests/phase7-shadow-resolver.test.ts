import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface PatrolModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const PATROL_MODULES = [
	{
		name: "task",
		queryKeyPrefix: "task",
		apiUrl: "/api/property-manage/patrol-manage/task/list",
		importModule: () => import("../task"),
		useQuery: (mod) => (mod as typeof import("../task")).useTaskListQuery({}),
	},
	{
		name: "detail",
		queryKeyPrefix: "detail",
		apiUrl: "/api/property-manage/patrol-manage/detail/list",
		importModule: () => import("../detail"),
		useQuery: (mod) => (mod as typeof import("../detail")).useDetailListQuery({}),
	},
	{
		name: "point",
		queryKeyPrefix: "point",
		apiUrl: "/api/property-manage/patrol-manage/point/list",
		importModule: () => import("../point"),
		useQuery: (mod) => (mod as typeof import("../point")).usePointListQuery({}),
	},
	{
		name: "plan",
		queryKeyPrefix: "plan",
		apiUrl: "/api/property-manage/patrol-manage/plan/list",
		importModule: () => import("../plan"),
		useQuery: (mod) => (mod as typeof import("../plan")).usePlanListQuery({}),
	},
	{
		name: "path",
		queryKeyPrefix: "path",
		apiUrl: "/api/property-manage/patrol-manage/path/list",
		importModule: () => import("../path"),
		useQuery: (mod) => (mod as typeof import("../path")).usePathListQuery({}),
	},
	{
		name: "item",
		queryKeyPrefix: "item",
		apiUrl: "/api/property-manage/patrol-manage/item/list",
		importModule: () => import("../item"),
		useQuery: (mod) => (mod as typeof import("../item")).useItemListQuery({}),
	},
] satisfies PatrolModuleConfig[];

async function importPatrolModule(moduleConfig: PatrolModuleConfig, env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 patrol admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(PATROL_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importPatrolModule(moduleConfig, {
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

	test.each(PATROL_MODULES)("resolves $name list query through the shadow proxy when enabled", async (moduleConfig) => {
		const mod = await importPatrolModule(moduleConfig, {
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
	});

	test.each(PATROL_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importPatrolModule(moduleConfig, {
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
