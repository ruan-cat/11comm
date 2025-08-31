import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryWaterMeter, addWaterMeter, modifyWaterMeter, deleteWaterMeter } from "./index";

describe("c4/水电抄表管理", () => {
	it("使用 query 接口 - 水电抄表分页查询", async () => {
		const { execute, data } = queryWaterMeter({
			onSuccess(data) {
				console.warn("queryWaterMeter onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryWaterMeter onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				water_id: "102025051598760067",
				meter_type: "水表",
				obj_name: "1-1-101",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加水电抄表", async () => {
		const { execute, data } = addWaterMeter({
			onSuccess(data) {
				console.warn("addWaterMeter onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addWaterMeter onError", error);
			},
		});
		await execute({
			data: {
				meter_type: "水表",
				obj_name: "1-1-101",
				pre_degrees: 100.5,
				cur_degrees: 120.3,
				pre_reading_time: "2024-01-01",
				cur_reading_time: "2024-01-31",
				remark: "正常抄表",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改水电抄表", async () => {
		const { execute, data } = modifyWaterMeter({
			onSuccess(data) {
				console.warn("modifyWaterMeter onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyWaterMeter onError", error);
			},
		});
		await execute({
			data: {
				water_id: "test_water_id",
				meter_type: "电表",
				obj_name: "1-1-101",
				pre_degrees: 200.0,
				cur_degrees: 225.5,
				pre_reading_time: "2024-01-01",
				cur_reading_time: "2024-01-31",
				remark: "修改后的抄表记录",
				create_time: "2024-01-01",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除水电抄表", async () => {
		const { execute, data } = deleteWaterMeter({
			onSuccess(data) {
				console.warn("deleteWaterMeter onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteWaterMeter onError", error);
			},
		});
		await execute({
			data: {
				water_id: "test_water_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
