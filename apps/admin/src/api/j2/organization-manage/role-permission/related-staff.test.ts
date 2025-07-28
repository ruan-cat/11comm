import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryRelatedStaffList, addRelatedStaff, removeRelatedStaff } from "./related-staff";

describe("j2/组织管理/角色权限/员工关联", () => {
	it("使用 query 接口 - 获取已关联员工列表（条件+分页）", async () => {
		const { execute, data } = queryRelatedStaffList({
			onSuccess(data) {
				console.warn("queryRelatedStaffList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryRelatedStaffList onError", error);
			},
		});
		await execute({
			params: {
				name: "张三",
				pageIndex: 1,
				pageSize: 10,
				pgId: "role_001",
				statusCd: "A",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	// 警告 接口文档有问题 无法使用
	// it("使用 body 接口 - 新增关联", async () => {
	// 	const { execute, data } = addRelatedStaff({
	// 		onSuccess(data) {
	// 			console.warn("addRelatedStaff onSuccess", printFormat(data));
	// 		},
	// 		onError(error) {
	// 			console.error("addRelatedStaff onError", error);
	// 		},
	// 	});
	// 	await execute({
	// 		data: "staff_001",
	// 	});
	// 	console.warn("查看简单的 data.value ", printFormat(data.value));
	// });

	// 警告 接口文档有问题 无法使用
	// it("使用 body 接口 - 删除关联", async () => {
	// 	const { execute, data } = removeRelatedStaff({
	// 		onSuccess(data) {
	// 			console.warn("removeRelatedStaff onSuccess", printFormat(data));
	// 		},
	// 		onError(error) {
	// 			console.error("removeRelatedStaff onError", error);
	// 		},
	// 	});
	// 	await execute({
	// 		data: "staff_001",
	// 	});
	// 	console.warn("查看简单的 data.value ", printFormat(data.value));
	// });
});
