import { describe, it } from "vitest";
import { sysManagerAddUser, sysManagerDeleteUser, sysManagerQueryDepartmentAll, sysManagerResetPassword } from "./user";

describe("用户管理接口实现", () => {
	it("添加用户接口", async () => {
		const { execute, data } = sysManagerAddUser({
			onSuccess(data) {
				console.log("添加用户接口 onSuccess", data);
			},
		});
		await execute({
			data: {
				departmentIds: ["dept_001", "dept_002"],
				password: "123456",
				roleIds: ["role_001", "role_002"],
				username: "test_user",
				email: "test@example.com",
				mobilePhone: "13800138000",
				officePhone: "0571-88888888",
				realname: "测试用户",
				userType: "1",
			},
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("删除用户接口", async () => {
		const { execute, data } = sysManagerDeleteUser({
			onSuccess(data) {
				console.log("删除用户接口 onSuccess", data);
			},
		});
		await execute({
			url: "/sys-manager/123", // 替换为实际的用户ID
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("重置用户密码接口", async () => {
		const { execute, data } = sysManagerResetPassword({
			onSuccess(data) {
				console.log("重置用户密码接口 onSuccess", data);
			},
		});
		await execute({
			data: {
				userId: "402880879551861f019551c075a7000d", // 示例用户ID
				newPassword: "newPassword123", // 新密码
			},
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("获取组织名称树接口", async () => {
		const { execute, data } = sysManagerQueryDepartmentAll({
			onSuccess(data) {
				console.log("获取组织名称树接口 onSuccess", data);
			},
		});
		await execute();
		console.log("查看简单的 data.value ", data.value);
	});
});
