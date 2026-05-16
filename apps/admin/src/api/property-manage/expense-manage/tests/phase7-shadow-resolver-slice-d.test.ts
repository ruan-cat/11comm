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

const EXPENSE_MANAGE_SLICE_D_MODULES = [
	{
		name: "refund-review",
		queryKeyPrefix: "refundReview",
		apiUrl: "/api/property-manage/expense-manage/refund-review/list",
		importModule: () => import("../refund-review"),
		useQuery: (mod) => (mod as typeof import("../refund-review")).useRefundReviewListQuery({}),
	},
	{
		name: "reminder-for-overdue-payments",
		queryKeyPrefix: "reminderForOverduePayments",
		apiUrl: "/api/property-manage/expense-manage/reminder-for-overdue-payments/list",
		importModule: () => import("../reminder-for-overdue-payments"),
		useQuery: (mod) =>
			(mod as typeof import("../reminder-for-overdue-payments")).useReminderForOverduePaymentsListQuery({}),
	},
	{
		name: "reprint-voucher",
		queryKeyPrefix: "reprintVoucher",
		apiUrl: "/api/property-manage/expense-manage/reprint-voucher/list",
		importModule: () => import("../reprint-voucher"),
		useQuery: (mod) => (mod as typeof import("../reprint-voucher")).useReprintVoucherListQuery({}),
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

describe("phase7 property-manage expense-manage slice d admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(EXPENSE_MANAGE_SLICE_D_MODULES)(
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

	test.each(EXPENSE_MANAGE_SLICE_D_MODULES)(
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

	test.each(EXPENSE_MANAGE_SLICE_D_MODULES)(
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
