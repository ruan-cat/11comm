import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface ExpenseManageSliceModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const EXPENSE_MANAGE_SLICE_A_MODULES = [
	{
		name: "cancel-fee",
		queryKeyPrefix: "cancel-fee",
		apiUrl: "/api/property-manage/expense-manage/cancel-fee/list",
		importModule: () => import("../cancel-fee"),
		useQuery: (mod) => (mod as typeof import("../cancel-fee")).useCancelFeeListQuery({}),
	},
	{
		name: "contracte-charge",
		queryKeyPrefix: "contracteCharge",
		apiUrl: "/api/property-manage/expense-manage/contracte-charge/list",
		importModule: () => import("../contracte-charge"),
		useQuery: (mod) => (mod as typeof import("../contracte-charge")).useContracteChargeListQuery({}),
	},
	{
		name: "discount-apply",
		queryKeyPrefix: "discountApply",
		apiUrl: "/api/property-manage/expense-manage/discount-apply/list",
		importModule: () => import("../discount-apply"),
		useQuery: (mod) => (mod as typeof import("../discount-apply")).useDiscountApplyListQuery({}),
	},
] satisfies ExpenseManageSliceModuleConfig[];

async function importExpenseManageSliceModule(
	moduleConfig: ExpenseManageSliceModuleConfig,
	env: Record<string, string>,
) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 property-manage expense-manage slice a admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(EXPENSE_MANAGE_SLICE_A_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importExpenseManageSliceModule(moduleConfig, {
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

	test.each(EXPENSE_MANAGE_SLICE_A_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importExpenseManageSliceModule(moduleConfig, {
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

	test.each(EXPENSE_MANAGE_SLICE_A_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importExpenseManageSliceModule(moduleConfig, {
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
