import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryStaff, addStaff, removeStaff } from "./related-staff";

describe("j2/组织管理/数据权限/员工关联", () => {
	it("使用 query 接口 - 获取关联员工列表（条件+分页）", async () => {
		const { execute, data } = queryStaff({
			onSuccess(data) {
				console.warn("queryStaff onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryStaff onError", error);
			},
		});

		await execute({
			params: {
				dpId: "102022092831060007",
				pageIndex: "1",
				pageSize: 10,
				staffName: "张三",
				tel: "13800000000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 新增关联员工", async () => {
		const { execute, data } = addStaff({
			onSuccess(data) {
				console.warn("addStaff onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addStaff onError", error);
			},
		});

		await execute({
			data: {
				dpId: "102022092831060000",
				staffIds: ["102023031146610001", "102023031146610002"],
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 path 接口 - 删除关联员工", async () => {
		const { execute, data } = removeStaff({
			onSuccess(data) {
				console.warn("removeStaff onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeStaff onError", error);
			},
		});

		await execute({
			url: "/orgmanager/dataprivilege/staff/102023031146610004",
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
