import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addEmployee,
	deleteEmployee,
	getEmployeeScheduleInfo,
	getEmployeeList,
	modifyEmployee,
	getEmployeeBaseInfo,
	getEmployeeOrgPermissionInfo,
	resetEmployeePassword,
} from "./index";

describe("j4/员工信息管理", () => {
	it("使用 addEmployee 接口 - 添加新的员工信息", async () => {
		const { execute, data } = addEmployee({
			onSuccess(data) {
				console.warn("addEmployee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addEmployee onError", error);
			},
		});
		await execute({
			params: {
				address: "测试地址",
				associatedOrg: "测试组织",
				email: "test@example.com",
				job: "测试岗位",
				name: "测试员工",
				sex: "男",
				tel: "13800138000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 deleteEmployee 接口 - 删除指定员工", async () => {
		const { execute, data } = deleteEmployee({
			onSuccess(data) {
				console.warn("deleteEmployee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteEmployee onError", error);
			},
		});
		await execute({
			params: {
				userId: "test-user-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getEmployeeScheduleInfo 接口 - 获取指定员工的排班信息", async () => {
		const { execute, data } = getEmployeeScheduleInfo({
			onSuccess(data) {
				console.warn("getEmployeeScheduleInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getEmployeeScheduleInfo onError", error);
			},
		});
		await execute({
			params: {
				userID: "test-user-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getEmployeeList 接口 - 获取员工列表", async () => {
		const { execute, data } = getEmployeeList({
			onSuccess(data) {
				console.warn("getEmployeeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getEmployeeList onError", error);
			},
		});
		await execute({
			params: {
				name: "测试",
				orgId: "test-org-id",
				pageIndex: 1,
				pageSize: 10,
				tel: "138",
				userID: "test-user",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 modifyEmployee 接口 - 修改员工信息", async () => {
		const { execute, data } = modifyEmployee({
			onSuccess(data) {
				console.warn("modifyEmployee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyEmployee onError", error);
			},
		});
		await execute({
			data: {
				userID: "test-user-id",
				address: "修改后地址",
				associatedOrg: "修改后组织",
				email: "modified@example.com",
				job: "修改后岗位",
				name: "修改后姓名",
				sex: "女",
				tel: "13900139000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getEmployeeBaseInfo 接口 - 获取指定员工的基础信息", async () => {
		const { execute, data } = getEmployeeBaseInfo({
			onSuccess(data) {
				console.warn("getEmployeeBaseInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getEmployeeBaseInfo onError", error);
			},
		});
		await execute({
			params: {
				userID: "test-user-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getEmployeeOrgPermissionInfo 接口 - 获取指定员工的组织权限信息", async () => {
		const { execute, data } = getEmployeeOrgPermissionInfo({
			onSuccess(data) {
				console.warn("getEmployeeOrgPermissionInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getEmployeeOrgPermissionInfo onError", error);
			},
		});
		await execute({
			params: {
				userID: "test-user-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 resetEmployeePassword 接口 - 重置指定员工的密码", async () => {
		const { execute, data } = resetEmployeePassword({
			onSuccess(data) {
				console.warn("resetEmployeePassword onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("resetEmployeePassword onError", error);
			},
		});
		await execute({
			data: {
				userID: "test-user-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
