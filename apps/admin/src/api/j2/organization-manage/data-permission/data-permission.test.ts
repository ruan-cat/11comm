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
				code: "111111",
				communityId: "123456",
				name: "测试数据权限",
				remark: "测试",
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
				code: "111111",
				communityId: "123456",
				dpId: "11111111111",
				name: "测试数据权限",
				remark: "测试",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 path 接口 - 获取数据权限列表（条件+分页）", async () => {
		const { execute, data } = queryDataPermissionList({
			onSuccess(data) {
				console.warn("queryDataPermissionList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryDataPermissionList onError", error);
			},
		});

		await execute({
			url: "/j2-orgmanager/data/dataPrivilege/123456",
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 path 接口 - 删除数据权限", async () => {
		const { execute, data } = deleteDataPermission({
			onSuccess(data) {
				console.warn("deleteDataPermission onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteDataPermission onError", error);
			},
		});

		await execute({
			url: "/j2-orgmanager/data/delete/11111111111",
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
