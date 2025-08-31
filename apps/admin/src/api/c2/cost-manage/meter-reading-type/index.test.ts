import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryAllMeterReadingType, addMeterReadingType, updateMeterReadingType, removeMeterReadingType } from ".";

describe("c2/抄表类型", () => {
	it("使用 queryAllMeterReadingType 接口 - 抄表类型分页查询", async () => {
		const { execute, data } = queryAllMeterReadingType({
			onSuccess(data) {
				console.warn("分页查询抄表类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022647620054",
			},
		});

		console.warn("查看分页数据", printFormat(data.value));
	});

	it("使用 addMeterReadingType 接口 - 新增抄表类型", async () => {
		const { execute, data } = addMeterReadingType({
			onSuccess(data) {
				console.warn("新增抄表类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", printFormat(error));
			},
		});

		await execute({
			data: {
				type_name: "测试抄表类型",
				remark: "这是一个测试抄表类型",
				community_id: "2024022647620054",
			},
		});

		console.warn("查看新增结果", printFormat(data.value));
	});

	it("使用 updateMeterReadingType 接口 - 修改抄表类型", async () => {
		const { execute, data } = updateMeterReadingType({
			onSuccess(data) {
				console.warn("修改抄表类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", printFormat(error));
			},
		});

		await execute({
			data: {
				type_name: "修改后的抄表类型",
				remark: "这是修改后的抄表类型说明",
				type_id: "12241958387776098304",
			},
		});

		console.warn("查看修改结果", printFormat(data.value));
	});

	it("使用 removeMeterReadingType 接口 - 删除抄表类型", async () => {
		const { execute, data } = removeMeterReadingType({
			onSuccess(data) {
				console.warn("删除抄表类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", printFormat(error));
			},
		});

		await execute({
			data: {
				type_id: "12241958387776098304",
			},
		});

		console.warn("查看删除结果", printFormat(data.value));
	});
});
