import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addCommonMenu,
	queryCommonMenuList,
	queryOptionalMenuList,
	removeCommonMenu,
} from "./menu-commonmenu";

describe("j1/菜单管理/常用菜单", () => {
	it("使用 body 接口 - 添加常用菜单", async () => {
		const { execute, data } = addCommonMenu({
			onSuccess(data) {
				console.warn("addCommonMenu onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addCommonMenu onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				mid: "menu-001",
				icon: "icon-test",
				seq: "1",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取常用菜单列表（条件+分页）", async () => {
		const { execute, data } = queryCommonMenuList({
			onSuccess(data) {
				console.warn("queryCommonMenuList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryCommonMenuList onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				name: "测试菜单",
				muId: "menu-001",
				seq: 1,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取可选菜单下拉列表", async () => {
		const { execute, data } = queryOptionalMenuList({
			onSuccess(data) {
				console.warn("queryOptionalMenuList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryOptionalMenuList onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除常用菜单", async () => {
		const { execute, data } = removeCommonMenu({
			onSuccess(data) {
				console.warn("removeCommonMenu onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeCommonMenu onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				muId: "common-menu-001",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});