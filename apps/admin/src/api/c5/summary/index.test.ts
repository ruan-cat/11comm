import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getFeeSummaryList } from "./index";

describe("c5/费用汇总管理", () => {
	it("使用 query 接口 - 获取费用汇总列表(条件+分页)", async () => {
		const { execute, data } = getFeeSummaryList({
			onSuccess(data) {
				console.warn("getFeeSummaryList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getFeeSummaryList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "community_001",
				building_number: "1号楼",
				fee_type: "物业费",
				statistics_period: "2024年度",
				statistics_start_time: "2024-01-01",
				statistics_end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
