import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addGroupCatalog, deleteGroupCatalog, queryGroupCatalog } from "./manu";

describe("j1/菜单管理/菜单目录", () => {
	it("使用 body 接口 - 添加对应菜单组", async () => {
		const { execute, data } = addGroupCatalog({
			onSuccess(data) {
				console.warn("addGroupCatalog onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addGroupCatalog onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				caId: "102022022695140000",
				gid: "802021031653410000",
				storeType: "800900000000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除对应菜单组", async () => {
		const { execute, data } = deleteGroupCatalog({
			onSuccess(data) {
				console.warn("deleteGroupCatalog onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteGroupCatalog onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				gcId: "102022022662880030",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取对应菜单组", async () => {
		const { execute, data } = queryGroupCatalog({
			onSuccess(data) {
				console.warn("queryGroupCatalog onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryGroupCatalog onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				caId: "102022022695140008",
				pageIndex: 1,
				pageSize: 10,
				storeType: "800900000000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
