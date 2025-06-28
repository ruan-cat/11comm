import { describe, it } from "vitest";
import {
	sysManagerActiveUserStatus,
	sysManagerCheckUsername,
	sysManagerLockUserStatus,
	sysManagerModifyUserDetail,
} from "./modify";

describe("用户管理接口实现", () => {
	it("编辑用户详情接口", async () => {
		const { execute, data } = sysManagerModifyUserDetail({
			onSuccess(data) {
				console.log("编辑用户详情接口 onSuccess", data);
			},
		});
		await execute({
			data: {
				id: "123",
				username: "test_user",
				realName: "测试用户",
				phone: "13800138000",
				email: "test@example.com",
				status: 1,
				remark: "测试备注",
				deptId: "dept_123",
				roleIds: ["role_1", "role_2"],
			},
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("锁定用户状态接口", async () => {
		const { execute, data } = sysManagerLockUserStatus({
			onSuccess(data) {
				console.log("锁定用户状态接口 onSuccess", data);
			},
		});
		await execute({
			data: {
				id: "123",
				locked: true,
			},
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("激活用户状态接口", async () => {
		const { execute, data } = sysManagerActiveUserStatus({
			onSuccess(data) {
				console.log("激活用户状态接口 onSuccess", data);
			},
		});
		await execute({
			data: {
				userId: "123",
			},
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("查询重复账号接口", async () => {
		const { execute, data } = sysManagerCheckUsername({
			onSuccess(data) {
				console.log("查询重复账号接口 onSuccess", data);
			},
		});
		await execute({
			url: `/sys-manager/user/username/test_user`,
		});
		console.log("查看简单的 data.value ", data.value);
	});
});
