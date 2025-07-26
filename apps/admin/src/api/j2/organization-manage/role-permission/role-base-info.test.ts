import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addRole, deleteRole, queryAllRole, updateRole } from "./role-base-info";

describe("j2/组织管理/角色权限/角色基础信息", () => {
	it("使用 body 接口 - 添加角色", async () => {
		const { execute, data } = addRole({
			onSuccess(data) {
				console.warn("addRole onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addRole onError", error);
			},
		});

		await execute({
			data: {
				name: "管理员角色",
				description: "保洁部门人员",
				seq: "1",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加角色（最小数据）", async () => {
		const { execute, data } = addRole({
			onSuccess(data) {
				console.warn("addRole onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addRole onError", error);
			},
		});

		await execute({
			data: {
				name: "测试角色",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除角色", async () => {
		const { execute, data } = deleteRole({
			onSuccess(data) {
				console.warn("deleteRole onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteRole onError", error);
			},
		});

		await execute({
			params: {
				pg_id: "6002025051438010007",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取角色列表", async () => {
		const { execute, data } = queryAllRole({
			onSuccess(data) {
				console.warn("queryAllRole onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAllRole onError", error);
			},
		});

		await execute({
			params: {},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改角色", async () => {
		const { execute, data } = updateRole({
			onSuccess(data) {
				console.warn("updateRole onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateRole onError", error);
			},
		});

		await execute({
			data: {
				name: "管理员角色",
				pg_id: "6002025051438010000",
				description: "保洁部门人员",
				seq: "1",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
