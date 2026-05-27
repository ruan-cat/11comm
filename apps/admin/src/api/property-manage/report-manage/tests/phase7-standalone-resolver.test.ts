import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface ReportManageStandaloneModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const REPORT_MANAGE_STANDALONE_MODULES = [
	{
		name: "expense-summary-table",
		queryKeyPrefix: "expenseSummaryTable",
		apiUrl: "/api/property-manage/report-manage/expense-summary-table/list",
		importModule: () => import("../expense-summary-table"),
		useQuery: (mod) => (mod as typeof import("../expense-summary-table")).useExpenseSummaryTableListQuery({}),
	},
	{
		name: "owner-payment-details",
		queryKeyPrefix: "ownerPaymentDetails",
		apiUrl: "/api/property-manage/report-manage/owner-payment-details/list",
		importModule: () => import("../owner-payment-details"),
		useQuery: (mod) => (mod as typeof import("../owner-payment-details")).useOwnerPaymentDetailsListQuery({}),
	},
	{
		name: "repair-report-form",
		queryKeyPrefix: "repairReportForm",
		apiUrl: "/api/property-manage/report-manage/repair-report-form/list",
		importModule: () => import("../repair-report-form"),
		useQuery: (mod) => (mod as typeof import("../repair-report-form")).useRepairReportFormListQuery({}),
	},
	{
		name: "repair-reports-summary-table",
		queryKeyPrefix: "repairReportsSummaryTable",
		apiUrl: "/api/property-manage/report-manage/repair-reports-summary-table/list",
		importModule: () => import("../repair-reports-summary-table"),
		useQuery: (mod) =>
			(mod as typeof import("../repair-reports-summary-table")).useRepairReportsSummaryTableListQuery({}),
	},
	{
		name: "statement-expenses",
		queryKeyPrefix: "statementExpenses",
		apiUrl: "/api/property-manage/report-manage/statement-expenses/list",
		importModule: () => import("../statement-expenses"),
		useQuery: (mod) => (mod as typeof import("../statement-expenses")).useStatementExpensesListQuery({}),
	},
	{
		name: "arrears-details-list",
		queryKeyPrefix: "arrearsDetailsList",
		apiUrl: "/api/property-manage/report-manage/arrears-details-list/list",
		importModule: () => import("../arrears-details-list"),
		useQuery: (mod) => (mod as typeof import("../arrears-details-list")).useArrearsDetailsListQuery({}),
	},
	{
		name: "data-statistics",
		queryKeyPrefix: "dataStatistics",
		apiUrl: "/api/property-manage/report-manage/data-statistics/list",
		importModule: () => import("../data-statistics"),
		useQuery: (mod) => (mod as typeof import("../data-statistics")).useDataStatisticsListQuery({}),
	},
	{
		name: "deposit-report",
		queryKeyPrefix: "depositReport",
		apiUrl: "/api/property-manage/report-manage/deposit-report/list",
		importModule: () => import("../deposit-report"),
		useQuery: (mod) => (mod as typeof import("../deposit-report")).useDepositReportListQuery({}),
	},
	{
		name: "fee-reminder",
		queryKeyPrefix: "feeReminder",
		apiUrl: "/api/property-manage/report-manage/fee-reminder/list",
		importModule: () => import("../fee-reminder"),
		useQuery: (mod) => (mod as typeof import("../fee-reminder")).useFeeReminderListQuery({}),
	},
	{
		name: "no-charge-house",
		queryKeyPrefix: "noChargeHouse",
		apiUrl: "/api/property-manage/report-manage/no-charge-house/list",
		importModule: () => import("../no-charge-house"),
		useQuery: (mod) => (mod as typeof import("../no-charge-house")).useNoChargeHouseListQuery({}),
	},
	{
		name: "outstanding-fees-analysis",
		queryKeyPrefix: "outstandingFeesAnalysis",
		apiUrl: "/api/property-manage/report-manage/outstanding-fees-analysis/list",
		importModule: () => import("../outstanding-fees-analysis"),
		useQuery: (mod) => (mod as typeof import("../outstanding-fees-analysis")).useOutstandingFeesAnalysisListQuery({}),
	},
	{
		name: "patrol-report",
		queryKeyPrefix: "patrolReport",
		apiUrl: "/api/property-manage/report-manage/patrol-report/list",
		importModule: () => import("../patrol-report"),
		useQuery: (mod) => (mod as typeof import("../patrol-report")).usePatrolReportListQuery({}),
	},
] satisfies ReportManageStandaloneModuleConfig[];

async function importReportManageStandaloneModule(
	moduleConfig: ReportManageStandaloneModuleConfig,
	env: Record<string, string>,
) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 property-manage report-manage admin api standalone resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(REPORT_MANAGE_STANDALONE_MODULES)(
		"resolves $name list query through the standalone apps/api base when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importReportManageStandaloneModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "false",
				VITE_11COMM_API_STANDALONE_ENABLE: "true",
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
