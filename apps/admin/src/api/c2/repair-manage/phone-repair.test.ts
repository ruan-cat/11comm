import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryAllPhoneRepair, addPhoneRepair, modifyPhoneRepair, removePhoneRepair } from "./phone-repair";

describe("电话报修接口测试", () => {
	it("分页查询报修列表", async () => {
		const { execute, data } = queryAllPhoneRepair({
			onSuccess(data) {
				console.warn("分页查询报修列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				repair_id: "",
				repair_name: "张三",
				repair_type: "水管维修",
				tel: "13800138000",
				status_cd: "",
			},
		});

		console.warn("查看电话报修分页数据", printFormat(data.value));
	});

	it("新增报修", async () => {
		const { execute, data } = addPhoneRepair({
			onSuccess(data) {
				console.warn("新增报修成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_obj_type: "001",
				building: "1号楼",
				unit: "2单元",
				house: "101",
				repair_type: "水管维修",
				repair_name: "李四",
				tel: "13800138001",
				appointment_time: "2024-06-01 10:00:00",
				context: "厨房水管漏水，需要维修。",
			},
		});

		console.warn("查看新增报修结果", printFormat(data.value));
	});

	it("修改报修", async () => {
		const { execute, data } = modifyPhoneRepair({
			onSuccess(data) {
				console.warn("修改报修成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_obj_type: "001",
				building: "1号楼",
				unit: "2单元",
				house: "101",
				repair_type: "水管维修",
				repair_name: "李四",
				tel: "13800138001",
				appointment_time: "2024-06-01 10:00:00",
				context: "厨房水管漏水，需要维修。",
				repair_id: "202406010001",
			},
		});

		console.warn("查看修改报修结果", printFormat(data.value));
	});

	it("删除报修", async () => {
		const { execute, data } = removePhoneRepair({
			onSuccess(data) {
				console.warn("删除报修成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: ["repair_id_1", "repair_id_2"],
		});

		console.warn("查看删除报修结果", printFormat(data.value));
	});
});
