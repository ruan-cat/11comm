import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryAllMeterReadingType,
	addMeterReadingType,
	updateMeterReadingType,
	removeMeterReadingType,
} from "./meter-reading-type";

describe("抄表类型接口测试", () => {
	it("分页查询抄表类型", async () => {
		const { execute, data } = queryAllMeterReadingType({
			onSuccess(data) {
				console.warn("分页查询抄表类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", printFormat(error));
			},
		});

		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022647620054",
			},
		});

		console.warn("查看分页数据", printFormat(data.value));
	});

	it("新增抄表类型", async () => {
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

	it("修改抄表类型", async () => {
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

	it("删除抄表类型", async () => {
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
