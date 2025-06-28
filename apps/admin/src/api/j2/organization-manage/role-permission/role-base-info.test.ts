import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addRole, deleteRole, queryAllRole, updateRole } from "./role-base-info";

describe("角色基础信息接口测试", () => {
	it("添加角色", async () => {
		const { execute, data } = addRole({
			onSuccess(data) {
				console.warn("添加角色成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				name: "管理员角色",
				description: "保洁部门人员",
				seq: "1",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("添加角色（最小数据）", async () => {
		const { execute, data } = addRole({
			onSuccess(data) {
				console.warn("添加角色成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				name: "测试角色",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("删除角色", async () => {
		const { execute, data } = deleteRole({
			onSuccess(data) {
				console.warn("删除角色成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				pg_id: "6002025051438010007",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("获取角色列表", async () => {
		const { execute, data } = queryAllRole({
			onSuccess(data) {
				console.warn("获取角色列表成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("修改角色", async () => {
		const { execute, data } = updateRole({
			onSuccess(data) {
				console.warn("修改角色成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
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
