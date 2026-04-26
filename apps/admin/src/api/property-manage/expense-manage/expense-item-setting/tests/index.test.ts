import { test, describe } from "vitest";
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

import {
	createExpenseItemSetting,
	deleteExpenseItemSetting,
	getExpenseItemSettingDetail,
	updateExpenseItemSetting,
	useExpenseItemSettingListQuery,
} from "../index";

describe("expense-item-setting admin api", () => {
	test("keeps list query on the expense-item-setting list endpoint", () => {
		useExpenseItemSettingListQuery({ code: "EXPENSE_001" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "expenseItemSetting",
			apiUrl: "/api/property-manage/expense-manage/expense-item-setting/list",
			initialParams: { code: "EXPENSE_001" },
		});
	});

	test("posts detail payload to the expense-item-setting detail endpoint", async () => {
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });

		await getExpenseItemSettingDetail({ id: "EXPENSE_001" });

		expect(mocks.httpPost).toHaveBeenCalledWith("/api/property-manage/expense-manage/expense-item-setting/detail", {
			data: { id: "EXPENSE_001" },
		});
	});

	test("posts create payload to the expense-item-setting create endpoint", async () => {
		const payload = { expenseItem: "物业费", status: "启用" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });

		await createExpenseItemSetting(payload);

		expect(mocks.httpPost).toHaveBeenCalledWith("/api/property-manage/expense-manage/expense-item-setting/create", {
			data: payload,
		});
	});

	test("posts update payload to the expense-item-setting update endpoint", async () => {
		const payload = { id: "EXPENSE_001", expenseItem: "物业费" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "EXPENSE_001" } });

		await updateExpenseItemSetting(payload);

		expect(mocks.httpPost).toHaveBeenCalledWith("/api/property-manage/expense-manage/expense-item-setting/update", {
			data: payload,
		});
	});

	test("posts delete payload to the expense-item-setting delete endpoint", async () => {
		mocks.httpPost.mockResolvedValueOnce({ code: 400, data: { id: "EXPENSE_001", status: "unsupported" } });

		await deleteExpenseItemSetting({ id: "EXPENSE_001" });

		expect(mocks.httpPost).toHaveBeenCalledWith(
			"/api/property-manage/expense-manage/expense-item-setting/delete",
			{
				data: { id: "EXPENSE_001" },
			},
			expect.objectContaining({ validateStatus: expect.any(Function) }),
		);
	});
});
