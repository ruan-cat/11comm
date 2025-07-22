import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	getMenuPrivilegeTree,
	addPrivilege,
	deletePrivilege,
	modifyPrivilege,
	queryPrivilegeCondition,
} from "./meun-item";

describe("j1/菜单管理/菜单项", () => {
	it("使用 query 接口 - 获取菜单名称树", async () => {
		const { execute, data } = getMenuPrivilegeTree({
			onSuccess(data) {
				console.warn("getMenuPrivilegeTree onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getMenuPrivilegeTree onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加权限", async () => {
		const { execute, data } = addPrivilege({
			onSuccess(data) {
				console.warn("addPrivilege onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addPrivilege onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				mid: "102022022695140001",
				name: "查看权限",
				type: "VIEW",
				storeType: "800900000000",
				description: "查看菜单内容的权限",
				status: "ACTIVE",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除权限", async () => {
		const { execute, data } = deletePrivilege({
			onSuccess(data) {
				console.warn("deletePrivilege onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deletePrivilege onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				privId: "502024012543970001",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改权限", async () => {
		const { execute, data } = modifyPrivilege({
			onSuccess(data) {
				console.warn("modifyPrivilege onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyPrivilege onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				privId: "502024012543970001",
				name: "修改后的查看权限",
				type: "VIEW",
				mid: "102022022695140001",
				storeType: "800900000000",
				description: "修改后的查看菜单内容权限",
				status: "ACTIVE",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 权限查询（条件与分页）", async () => {
		const { execute, data } = queryPrivilegeCondition({
			onSuccess(data) {
				console.warn("queryPrivilegeCondition onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryPrivilegeCondition onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				mid: "102022022695140001",
				pageIndex: 1,
				pageSize: 10,
				name: "查看",
				storeType: "800900000000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
