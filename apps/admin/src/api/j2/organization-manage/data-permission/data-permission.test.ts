import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addDataPermission,
	updateDataPermission,
	queryDataPermissionList,
	deleteDataPermission,
} from "./data-permission";

describe("j2/组织管理/数据权限", () => {
	it("使用 body 接口 - 添加数据权限", async () => {
		const { execute, data } = addDataPermission({
			onSuccess(data) {
				console.warn("addDataPermission onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addDataPermission onError", error);
			},
		});

		await execute({
			data: {
				name: "测试数据权限",
				description: "用于测试的数据权限",
				scope: "test_scope",
				seq: 1,
				status: 1,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改数据权限", async () => {
		const { execute, data } = updateDataPermission({
			onSuccess(data) {
				console.warn("updateDataPermission onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateDataPermission onError", error);
			},
		});

		await execute({
			data: {
				id: "6002025051438010001",
				name: "修改后的数据权限",
				description: "修改后的权限描述",
				scope: "updated_scope",
				seq: 2,
				status: 1,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取数据权限列表（条件+分页）", async () => {
		const { execute, data } = queryDataPermissionList({
			onSuccess(data) {
				console.warn("queryDataPermissionList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryDataPermissionList onError", error);
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				name: "测试",
				status: 1,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除数据权限", async () => {
		const { execute, data } = deleteDataPermission({
			onSuccess(data) {
				console.warn("deleteDataPermission onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteDataPermission onError", error);
			},
		});

		await execute({
			params: {
				id: "6002025051438010001",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
