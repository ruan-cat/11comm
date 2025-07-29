import { describe, it } from "vitest";
import { printFormat } from "@/utils/print";
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
	it("使用 addEmployee 接口 - 添加新的员工信息", () => {
		const { execute, data } = addEmployee({
			onError: (error) => console.warn("addEmployee 接口请求失败:", error),
		});

		execute({
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

		console.warn("addEmployee 接口响应数据:", printFormat(data));
	});

	it("使用 deleteEmployee 接口 - 删除指定员工", () => {
		const { execute, data } = deleteEmployee({
			onError: (error) => console.warn("deleteEmployee 接口请求失败:", error),
		});

		execute({
			params: {
				userId: "test-user-id",
			},
		});

		console.warn("deleteEmployee 接口响应数据:", printFormat(data));
	});

	it("使用 getEmployeeScheduleInfo 接口 - 获取指定员工的排班信息", () => {
		const { execute, data } = getEmployeeScheduleInfo({
			onError: (error) => console.warn("getEmployeeScheduleInfo 接口请求失败:", error),
		});

		execute({
			params: {
				userID: "test-user-id",
			},
		});

		console.warn("getEmployeeScheduleInfo 接口响应数据:", printFormat(data));
	});

	it("使用 getEmployeeList 接口 - 获取员工列表", () => {
		const { execute, data } = getEmployeeList({
			onError: (error) => console.warn("getEmployeeList 接口请求失败:", error),
		});

		execute({
			params: {
				name: "测试",
				orgId: "test-org-id",
				pageIndex: 1,
				pageSize: 10,
				tel: "138",
				userID: "test-user",
			},
		});

		console.warn("getEmployeeList 接口响应数据:", printFormat(data));
	});

	it("使用 modifyEmployee 接口 - 修改员工信息", () => {
		const { execute, data } = modifyEmployee({
			onError: (error) => console.warn("modifyEmployee 接口请求失败:", error),
		});

		execute({
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

		console.warn("modifyEmployee 接口响应数据:", printFormat(data));
	});

	it("使用 getEmployeeBaseInfo 接口 - 获取指定员工的基础信息", () => {
		const { execute, data } = getEmployeeBaseInfo({
			onError: (error) => console.warn("getEmployeeBaseInfo 接口请求失败:", error),
		});

		execute({
			params: {
				userID: "test-user-id",
			},
		});

		console.warn("getEmployeeBaseInfo 接口响应数据:", printFormat(data));
	});

	it("使用 getEmployeeOrgPermissionInfo 接口 - 获取指定员工的组织权限信息", () => {
		const { execute, data } = getEmployeeOrgPermissionInfo({
			onError: (error) => console.warn("getEmployeeOrgPermissionInfo 接口请求失败:", error),
		});

		execute({
			params: {
				userID: "test-user-id",
			},
		});

		console.warn("getEmployeeOrgPermissionInfo 接口响应数据:", printFormat(data));
	});

	it("使用 resetEmployeePassword 接口 - 重置指定员工的密码", () => {
		const { execute, data } = resetEmployeePassword({
			onError: (error) => console.warn("resetEmployeePassword 接口请求失败:", error),
		});

		execute({
			data: {
				userID: "test-user-id",
			},
		});

		console.warn("resetEmployeePassword 接口响应数据:", printFormat(data));
	});
});
