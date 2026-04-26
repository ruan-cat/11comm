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

import { getHouseChargeDetail, useHouseChargeListQuery } from "../index";

describe("house-charge admin api", () => {
	test("keeps list query on the house-charge list endpoint", () => {
		useHouseChargeListQuery({ status: "enabled" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "houseCharge",
			apiUrl: "/api/property-manage/expense-manage/house-charge/list",
			initialParams: { status: "enabled" },
		});
	});

	test("posts detail payload to the house-charge detail endpoint", async () => {
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "HOUSE_CHARGE_001" } });

		await getHouseChargeDetail({ id: "HOUSE_CHARGE_001" });

		expect(mocks.httpPost).toHaveBeenCalledWith("/api/property-manage/expense-manage/house-charge/detail", {
			data: { id: "HOUSE_CHARGE_001" },
		});
	});
});
