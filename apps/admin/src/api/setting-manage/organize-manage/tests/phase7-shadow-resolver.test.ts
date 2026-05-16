import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface OrganizeManageModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const ORGANIZE_MANAGE_MODULES = [
	{
		name: "staff-info",
		queryKeyPrefix: "staffInfo",
		apiUrl: "/api/setting-manage/organize-manage/staff-info/list",
		importModule: () => import("../staff-info"),
		useQuery: (mod) => (mod as typeof import("../staff-info")).useStaffInfoListQuery({}),
	},
	{
		name: "shift-setting",
		queryKeyPrefix: "shiftSetting",
		apiUrl: "/api/setting-manage/organize-manage/shift-setting/list",
		importModule: () => import("../shift-setting"),
		useQuery: (mod) => (mod as typeof import("../shift-setting")).useShiftSettingListQuery({}),
	},
] satisfies OrganizeManageModuleConfig[];

async function importOrganizeManageModule(moduleConfig: OrganizeManageModuleConfig, env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 organize-manage admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(ORGANIZE_MANAGE_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importOrganizeManageModule(moduleConfig, {
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

	test.each(ORGANIZE_MANAGE_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importOrganizeManageModule(moduleConfig, {
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

	test.each(ORGANIZE_MANAGE_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importOrganizeManageModule(moduleConfig, {
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
