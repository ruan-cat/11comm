import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addMenuGroup, deleteMenuGroup, listMenuGroup, listMenuGroupName, updateMenuGroup } from "./menu-group";

describe("j1/菜单管理/菜单组", () => {
	it("使用 body 接口 - 添加菜单组", async () => {
		const { execute, data } = addMenuGroup({
			onSuccess(data) {
				console.warn("addMenuGroup onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addMenuGroup onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				icon: "fa fa-th-large",
				name: "小区",
				seq: 1,
				description: "小区管理",
				groupType: "P_WEB",
				label: "TOP",
				storeType: "800900000003",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 path 接口 - 删除菜单组", async () => {
		const { execute, data } = deleteMenuGroup({
			onSuccess(data) {
				console.warn("deleteMenuGroup onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteMenuGroup onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		const gid = "800201904001";
		await execute({
			url: `/j1-manumana/menu-group/delete-menu-group/${gid}`,
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取菜单组列表", async () => {
		const { execute, data } = listMenuGroup({
			onSuccess(data) {
				console.warn("listMenuGroup onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("listMenuGroup onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				gid: "800201904004",
				name: "小区",
				storeType: "800900000003",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 path 接口 - 获取菜单组名称列表", async () => {
		const { execute, data } = listMenuGroupName({
			onSuccess(data) {
				console.warn("listMenuGroupName onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("listMenuGroupName onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		const storeType = "800900000003";
		await execute({
			url: `/j1-manumana/menu-group/list-menu-group-name/${storeType}`,
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改菜单组", async () => {
		const { execute, data } = updateMenuGroup({
			onSuccess(data) {
				console.warn("updateMenuGroup onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateMenuGroup onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				gid: "800201904004",
				icon: "fa fa-th-large",
				name: "修改后的小区",
				seq: 2,
				description: "修改后的小区管理",
				groupType: "P_WEB",
				label: "HOT",
				storeType: "800900000003",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
