import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addInspectRoute,
	modifyInspectRoute,
	queryInspectRouteNameList,
	queryInspectRouteList,
	queryInspectRoutePointList,
	deleteInspectRoute,
} from ".";

describe("j8/巡检路线", () => {
	it("使用 addInspectRoute 接口 - 添加巡检路线", async () => {
		const { execute, data } = addInspectRoute({
			onSuccess(data) {
				console.warn("添加巡检路线成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加巡检路线失败", printFormat(error));
			},
		});

		await execute({
			data: {
				routeName: "消防安全巡检路线",
				routeDesc: "覆盖消防设施的巡检路线",
				communityId: "123456",
				status: "启用",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectRouteNameList 接口 - 获取巡检路线名称列表", async () => {
		const { execute, data } = queryInspectRouteNameList({
			onSuccess(data) {
				console.warn("获取巡检路线名称列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检路线名称列表失败", printFormat(error));
			},
		});

		await execute({
			params: {},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectRouteList 接口 - 获取巡检路线列表", async () => {
		const { execute, data } = queryInspectRouteList({
			onSuccess(data) {
				console.warn("获取巡检路线列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检路线列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				routeName: "消防",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
