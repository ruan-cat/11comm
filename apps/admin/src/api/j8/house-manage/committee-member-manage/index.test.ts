import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { queryCommitteeDetail, queryCommitteeList } from ".";

describe("j8/业委会成员管理", () => {
	it("使用 queryCommitteeDetail 接口 - 获取业委会详情", async () => {
		const { execute, data } = queryCommitteeDetail({
			onSuccess(data) {
				console.warn("获取业委会详情成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取业委会详情失败", printFormat(error));
			},
		});

		await execute({
			url: "/j8-housemgt/committee/query-detail/123",
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryCommitteeList 接口 - 获取业委会列表", async () => {
		const { execute, data } = queryCommitteeList({
			onSuccess(data) {
				console.warn("获取业委会列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取业委会列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				state: "1000",
				name: "张三",
				link: "18909711425",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
