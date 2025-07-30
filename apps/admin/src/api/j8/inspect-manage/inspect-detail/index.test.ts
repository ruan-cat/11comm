import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { queryInspectDetailList } from ".";

describe("j8/巡检明细", () => {
	it("使用 queryInspectDetailList 接口 - 获取巡检明细列表", async () => {
		const { execute, data } = queryInspectDetailList({
			onSuccess(data) {
				console.warn("获取巡检明细列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检明细列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				planUserName: "张三",
				pointStartTime: "2024-01-11 00:00:00",
				pointEndTime: "2024-01-11 23:59:59",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
