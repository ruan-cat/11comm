import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface RepairsModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const REPAIRS_MODULES = [
	{
		name: "repairs-todo",
		queryKeyPrefix: "repairsTodo",
		apiUrl: "/api/property-manage/repairs-manage/repairs-todo/list",
		importModule: () => import("../repairs-todo"),
		useQuery: (mod) => (mod as typeof import("../repairs-todo")).useRepairsTodoListQuery({ status: "pending" }),
	},
	{
		name: "repairs-setting",
		queryKeyPrefix: "repairsSetting",
		apiUrl: "/api/property-manage/repairs-manage/repairs-setting/list",
		importModule: () => import("../repairs-setting"),
		useQuery: (mod) => (mod as typeof import("../repairs-setting")).useRepairsSettingListQuery({ status: "enabled" }),
	},
	{
		name: "issues",
		queryKeyPrefix: "issues",
		apiUrl: "/api/property-manage/repairs-manage/issues/list",
		importModule: () => import("../issues"),
		useQuery: (mod) => (mod as typeof import("../issues")).useIssuesListQuery({ status: "open" }),
	},
] satisfies RepairsModuleConfig[];

async function importRepairsModule(moduleConfig: RepairsModuleConfig, env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 repairs admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(REPAIRS_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importRepairsModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "false",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: moduleConfig.apiUrl,
				initialParams: expect.objectContaining({ status: expect.any(String) }),
			});
		},
	);

	test.each(REPAIRS_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importRepairsModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `/api-shadow${moduleConfig.apiUrl}`,
				initialParams: expect.objectContaining({ status: expect.any(String) }),
			});
		},
	);

	test.each(REPAIRS_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importRepairsModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "false",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `http://127.0.0.1:3102${moduleConfig.apiUrl}`,
				initialParams: expect.objectContaining({ status: expect.any(String) }),
			});
		},
	);
});
