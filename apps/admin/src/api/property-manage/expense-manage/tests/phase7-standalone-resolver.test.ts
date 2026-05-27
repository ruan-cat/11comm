import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface ExpenseManageStandaloneModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const API_BASE_URL = "http://127.0.0.1:3102";

const EXPENSE_MANAGE_TASK476_MODULES = [
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
	{
		name: "discount-setting",
		queryKeyPrefix: "discountSetting",
		apiUrl: "/api/property-manage/expense-manage/discount-setting/list",
		importModule: () => import("../discount-setting"),
		useQuery: (mod) => (mod as typeof import("../discount-setting")).useDiscountSettingListQuery({}),
	},
	{
		name: "discount-type",
		queryKeyPrefix: "discountType",
		apiUrl: "/api/property-manage/expense-manage/discount-type/list",
		importModule: () => import("../discount-type"),
		useQuery: (mod) => (mod as typeof import("../discount-type")).useDiscountTypeListQuery({}),
	},
	{
		name: "expense-summary-table",
		queryKeyPrefix: "expenseSummaryTable",
		apiUrl: "/api/property-manage/expense-manage/expense-summary-table/list",
		importModule: () => import("../expense-summary-table"),
		useQuery: (mod) => (mod as typeof import("../expense-summary-table")).useExpenseSummaryTableListQuery({}),
	},
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
	{
		name: "vehicle-charge",
		queryKeyPrefix: "vehicleCharge",
		apiUrl: "/api/property-manage/expense-manage/vehicle-charge/list",
		importModule: () => import("../vehicle-charge"),
		useQuery: (mod) => (mod as typeof import("../vehicle-charge")).useVehicleChargeListQuery({}),
	},
	{
		name: "water-and-electricity-meter-reading",
		queryKeyPrefix: "waterAndElectricityMeterReading",
		apiUrl: "/api/property-manage/expense-manage/water-and-electricity-meter-reading/list",
		importModule: () => import("../water-and-electricity-meter-reading"),
		useQuery: (mod) =>
			(mod as typeof import("../water-and-electricity-meter-reading")).useWaterAndElectricityMeterReadingListQuery({}),
	},
] satisfies ExpenseManageStandaloneModuleConfig[];

async function importExpenseManageStandaloneModule(moduleConfig: ExpenseManageStandaloneModuleConfig) {
	vi.unstubAllEnvs();
	vi.resetModules();

	vi.stubEnv("VITE_11COMM_API_SHADOW_ENABLE", "false");
	vi.stubEnv("VITE_11COMM_API_STANDALONE_ENABLE", "true");
	vi.stubEnv("VITE_11COMM_API_BASE_URL", API_BASE_URL);

	return moduleConfig.importModule();
}

describe("phase7 property-manage expense-manage task476 admin api standalone resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(EXPENSE_MANAGE_TASK476_MODULES)(
		"resolves $name list query through the standalone apps/api base",
		async (moduleConfig) => {
			const mod = await importExpenseManageStandaloneModule(moduleConfig);

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `${API_BASE_URL}${moduleConfig.apiUrl}`,
				initialParams: {},
			});
		},
	);
});
