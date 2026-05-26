import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

const API_URL = "/api/property-manage/report-manage/expense-summary-table/list";
const EXPENSE_MANAGE_ALIAS_SEGMENT = "/expense-manage/";

/** 确认费用汇总表使用 report-manage 正式业务路径，避免回退到旧 expense-manage 别名。 */
function expectReportExpenseSummaryTableApiUrl(apiUrl: string) {
	expect(apiUrl).toContain("/report-manage/expense-summary-table/");
	expect(apiUrl).not.toContain(EXPENSE_MANAGE_ALIAS_SEGMENT);
}

type ExpenseSummaryTableApiModule = typeof import("../index");

/** 每次导入前重置模块缓存和环境变量，确保 URL resolver 使用当前用例的 shadow 配置。 */
async function importExpenseSummaryTableApi(env: Record<string, string>): Promise<ExpenseSummaryTableApiModule> {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return import("../index");
}

describe("report expense-summary-table admin api", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test("keeps list query on legacy relative api path when shadow is disabled", async () => {
		const { useExpenseSummaryTableListQuery } = await importExpenseSummaryTableApi({
			VITE_11COMM_API_SHADOW_ENABLE: "false",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useExpenseSummaryTableListQuery({ expenseItemName: "物业费" });

		/** shadow 关闭时必须保留后台旧相对路径，同时继续使用 report-manage 正式路径。 */
		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "expenseSummaryTable",
			apiUrl: API_URL,
			initialParams: { expenseItemName: "物业费" },
		});
		expectReportExpenseSummaryTableApiUrl(mocks.useListQuery.mock.calls[0]?.[0].apiUrl);
	});

	test("resolves list query through the shadow proxy when enabled", async () => {
		const { useExpenseSummaryTableListQuery } = await importExpenseSummaryTableApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useExpenseSummaryTableListQuery({ expenseItemName: "物业费" });

		/** shadow 开启且走代理时，列表 URL 只追加代理前缀，业务路径仍不能退回 expense-manage。 */
		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "expenseSummaryTable",
			apiUrl: `/api-shadow${API_URL}`,
			initialParams: { expenseItemName: "物业费" },
		});
		expectReportExpenseSummaryTableApiUrl(mocks.useListQuery.mock.calls[0]?.[0].apiUrl);
	});

	test("resolves list query through the direct apps/api base when enabled", async () => {
		const { useExpenseSummaryTableListQuery } = await importExpenseSummaryTableApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useExpenseSummaryTableListQuery({ expenseItemName: "物业费" });

		/** shadow 开启且不走代理时，列表 URL 必须拼接独立 apps/api base 并保留正式路径。 */
		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "expenseSummaryTable",
			apiUrl: `http://127.0.0.1:3102${API_URL}`,
			initialParams: { expenseItemName: "物业费" },
		});
		expectReportExpenseSummaryTableApiUrl(mocks.useListQuery.mock.calls[0]?.[0].apiUrl);
	});
});
