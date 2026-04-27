import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	httpPost: vi.fn(),
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

vi.mock("@/utils/http", () => ({
	http: {
		post: mocks.httpPost,
	},
}));

const API_PREFIX = "/api/property-manage/expense-manage/expense-item-setting";

type ExpenseItemSettingApiModule = typeof import("../index");

async function importExpenseItemSettingApi(env: Record<string, string>): Promise<ExpenseItemSettingApiModule> {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return import("../index");
}

describe("expense-item-setting admin api", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test("keeps all endpoints on legacy relative api paths when shadow is disabled", async () => {
		const {
			createExpenseItemSetting,
			deleteExpenseItemSetting,
			getExpenseItemSettingDetail,
			updateExpenseItemSetting,
			useExpenseItemSettingListQuery,
		} = await importExpenseItemSettingApi({
			VITE_11COMM_API_SHADOW_ENABLE: "false",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useExpenseItemSettingListQuery({ code: "EXPENSE_001" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "expenseItemSetting",
			apiUrl: `${API_PREFIX}/list`,
			initialParams: { code: "EXPENSE_001" },
		});
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await getExpenseItemSettingDetail({ id: "EXPENSE_001" });
		const createPayload = { expenseItem: "Property fee", status: "enabled" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await createExpenseItemSetting(createPayload);
		const updatePayload = { id: "EXPENSE_001", expenseItem: "Property fee" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await updateExpenseItemSetting(updatePayload);
		mocks.httpPost.mockResolvedValueOnce({ code: 400, data: { id: "EXPENSE_001", status: "unsupported" } });
		await deleteExpenseItemSetting({ id: "EXPENSE_001" });

		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, `${API_PREFIX}/detail`, {
			data: { id: "EXPENSE_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, `${API_PREFIX}/create`, {
			data: createPayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, `${API_PREFIX}/update`, {
			data: updatePayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			4,
			`${API_PREFIX}/delete`,
			{
				data: { id: "EXPENSE_001" },
			},
			expect.objectContaining({ validateStatus: expect.any(Function) }),
		);
	});

	test("resolves all endpoints through the shadow proxy when enabled", async () => {
		const {
			createExpenseItemSetting,
			deleteExpenseItemSetting,
			getExpenseItemSettingDetail,
			updateExpenseItemSetting,
			useExpenseItemSettingListQuery,
		} = await importExpenseItemSettingApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useExpenseItemSettingListQuery({ code: "EXPENSE_001" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "expenseItemSetting",
			apiUrl: `/api-shadow${API_PREFIX}/list`,
			initialParams: { code: "EXPENSE_001" },
		});
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await getExpenseItemSettingDetail({ id: "EXPENSE_001" });
		const createPayload = { expenseItem: "Property fee", status: "enabled" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await createExpenseItemSetting(createPayload);
		const updatePayload = { id: "EXPENSE_001", expenseItem: "Property fee" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await updateExpenseItemSetting(updatePayload);
		mocks.httpPost.mockResolvedValueOnce({ code: 400, data: { id: "EXPENSE_001", status: "unsupported" } });
		await deleteExpenseItemSetting({ id: "EXPENSE_001" });

		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, `/api-shadow${API_PREFIX}/detail`, {
			data: { id: "EXPENSE_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, `/api-shadow${API_PREFIX}/create`, {
			data: createPayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, `/api-shadow${API_PREFIX}/update`, {
			data: updatePayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			4,
			`/api-shadow${API_PREFIX}/delete`,
			{
				data: { id: "EXPENSE_001" },
			},
			expect.objectContaining({ validateStatus: expect.any(Function) }),
		);
	});

	test("resolves all endpoints through the direct apps/api base when enabled", async () => {
		const {
			createExpenseItemSetting,
			deleteExpenseItemSetting,
			getExpenseItemSettingDetail,
			updateExpenseItemSetting,
			useExpenseItemSettingListQuery,
		} = await importExpenseItemSettingApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useExpenseItemSettingListQuery({ code: "EXPENSE_001" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "expenseItemSetting",
			apiUrl: `http://127.0.0.1:3102${API_PREFIX}/list`,
			initialParams: { code: "EXPENSE_001" },
		});
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await getExpenseItemSettingDetail({ id: "EXPENSE_001" });
		const createPayload = { expenseItem: "Property fee", status: "enabled" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await createExpenseItemSetting(createPayload);
		const updatePayload = { id: "EXPENSE_001", expenseItem: "Property fee" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });
		await updateExpenseItemSetting(updatePayload);
		mocks.httpPost.mockResolvedValueOnce({ code: 400, data: { id: "EXPENSE_001", status: "unsupported" } });
		await deleteExpenseItemSetting({ id: "EXPENSE_001" });

		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, `http://127.0.0.1:3102${API_PREFIX}/detail`, {
			data: { id: "EXPENSE_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, `http://127.0.0.1:3102${API_PREFIX}/create`, {
			data: createPayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, `http://127.0.0.1:3102${API_PREFIX}/update`, {
			data: updatePayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			4,
			`http://127.0.0.1:3102${API_PREFIX}/delete`,
			{
				data: { id: "EXPENSE_001" },
			},
			expect.objectContaining({ validateStatus: expect.any(Function) }),
		);
	});
});
