import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryAllPhoneRepair, addPhoneRepair, modifyPhoneRepair, removePhoneRepair } from "./index";

describe("c2/报修管理/电话报修", () => {
	it("使用 query 接口 - 获取电话报修列表", async () => {
		const { execute, data } = queryAllPhoneRepair({
			onSuccess(data) {
				console.warn("queryAllPhoneRepair onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAllPhoneRepair onError", error);
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2025052665960005",
				repair_id: "822025052766720091",
				repair_name: "王电话",
				repair_type: "电梯维修",
				tel: "13812345678",
				state: "待处理",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加电话报修", async () => {
		const { execute, data } = addPhoneRepair({
			onSuccess(data) {
				console.warn("addPhoneRepair onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addPhoneRepair onError", error);
			},
		});

		await execute({
			data: {
				community_id: "2025052665960005",
				repair_obj_type: "001",
				repair_obj_name: "梅苑小区1号楼1单元101室",
				repair_type: "水电维修",
				repair_name: "陈女士",
				tel: "13987654321",
				appointment_time: "2025-01-15 14:30:00",
				context: "厨房水龙头漏水，需要紧急维修处理",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改电话报修", async () => {
		const { execute, data } = modifyPhoneRepair({
			onSuccess(data) {
				console.warn("modifyPhoneRepair onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyPhoneRepair onError", error);
			},
		});

		await execute({
			data: {
				repair_id: "822024021727861281",
				repair_type: "电梯维修",
				repair_name: "李先生",
				tel: "13811112222",
				appointment_time: "2025-01-16 09:00:00",
				context: "电梯按钮失灵，已联系业主确认维修时间",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除电话报修", async () => {
		const { execute, data } = removePhoneRepair({
			onSuccess(data) {
				console.warn("removePhoneRepair onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removePhoneRepair onError", error);
			},
		});

		await execute({
			data: ["822024021727861281", "822024021727861282"],
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
