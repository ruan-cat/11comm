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

const EXPENSE_MANAGE_SLICE_C_MODULES = [
	{
		name: "meter-reading-type",
		queryKeyPrefix: "meterReadingType",
		apiUrl: "/api/property-manage/expense-manage/meter-reading-type/list",
		importModule: () => import("../meter-reading-type"),
		useQuery: (mod) => (mod as typeof import("../meter-reading-type")).useMeterReadingTypeListQuery({}),
	},
	{
		name: "overdue-payment-information",
		queryKeyPrefix: "overduePaymentInformation",
		apiUrl: "/api/property-manage/expense-manage/overdue-payment-information/list",
		importModule: () => import("../overdue-payment-information"),
		useQuery: (mod) =>
			(mod as typeof import("../overdue-payment-information")).useOverduePaymentInformationListQuery({}),
	},
	{
		name: "payment-review",
		queryKeyPrefix: "paymentReview",
		apiUrl: "/api/property-manage/expense-manage/payment-review/list",
		importModule: () => import("../payment-review"),
		useQuery: (mod) => (mod as typeof import("../payment-review")).usePaymentReviewListQuery({}),
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

describe("phase7 property-manage expense-manage slice c admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(EXPENSE_MANAGE_SLICE_C_MODULES)(
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

	test.each(EXPENSE_MANAGE_SLICE_C_MODULES)(
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

	test.each(EXPENSE_MANAGE_SLICE_C_MODULES)(
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
