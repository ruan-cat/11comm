import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addGroupCatalog,
	deleteGroupCatalog,
	queryGroupCatalog,
	addMenuCatalog,
	modifyMenuCatalog,
	queryMenuCatalogPage,
	removeMenuCatalog,
} from "./manu";

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

	it("使用 body 接口 - 添加菜单目录", async () => {
		const { execute, data } = addMenuCatalog({
			onSuccess(data) {
				console.warn("addMenuCatalog onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addMenuCatalog onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				icon: "1002202206950140050",
				isShow: "Y",
				name: "分类管理",
				seq: 10,
				storeType: "800900000000",
				url: "/catagory-manage",
				privId: "1002202206950140041",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改菜单目录", async () => {
		const { execute, data } = modifyMenuCatalog({
			onSuccess(data) {
				console.warn("modifyMenuCatalog onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyMenuCatalog onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				caId: "102022022695140009",
				icon: "1002202206950140051",
				isShow: "N",
				name: "修改后的分类管理",
				seq: 20,
				storeType: "800900000000",
				url: "/modified-catagory-manage",
				privId: "1002202206950140042",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 分页查询菜单目录", async () => {
		const { execute, data } = queryMenuCatalogPage({
			onSuccess(data) {
				console.warn("queryMenuCatalogPage onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryMenuCatalogPage onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				storeType: "800900000000",
				isShow: "Y",
				name: "设置",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 path 接口 - 删除菜单目录", async () => {
		const { execute, data } = removeMenuCatalog({
			onSuccess(data) {
				console.warn("removeMenuCatalog onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeMenuCatalog onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		const id = "102022022695140008";
		await execute({
			url: `/j1-menumana/remove-menucatalog/${id}`,
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
