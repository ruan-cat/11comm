import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	modifyStateToSuspend,
	queryAllRepairToDo,
	queryAllRepairType,
	queryAllStaff,
	modifyRepairToDo,
	removeRepairToDo,
	modifyStateToFinish,
} from "./repair-todo";

describe("报修待办接口测试", () => {
	it("暂停报修单", async () => {
		const { execute, data } = modifyStateToSuspend({
			onSuccess(data) {
				console.warn("暂停报修单成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_id: "822024021727861281",
				context: "我要暂停",
			},
		});

		console.warn("查看暂停报修单结果", printFormat(data.value));
	});

	it("分页查询报修待办列表", async () => {
		const { execute, data } = queryAllRepairToDo({
			onSuccess(data) {
				console.warn("分页查询报修待办列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2025052665960005",
				staff_id: "302025052626190081",
				repair_id: "822025052766720091",
				repair_name: "张三",
				tel: "13812345678",
				repair_type_name: "电梯维修",
				state: "接单",
			},
		});

		console.warn("查看报修待办分页数据", printFormat(data.value));
	});

	it("查询该小区中的所有报修类型", async () => {
		const { execute, data } = queryAllRepairType({
			onSuccess(data) {
				console.warn("查询报修类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				community_id: "2025052665960005",
			},
		});

		console.warn("查看所有报修类型数据", printFormat(data.value));
	});

	it("查询该报修类型对应的所有报修师傅", async () => {
		const { execute, data } = queryAllStaff({
			onSuccess(data) {
				console.warn("查询报修师傅成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_type: "102025052701090065",
			},
		});

		console.warn("查看报修师傅数据", printFormat(data.value));
	});

	it("改单处理报修待办", async () => {
		const { execute, data } = modifyRepairToDo({
			onSuccess(data) {
				console.warn("改单处理报修待办成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_id: "822024021727861281",
				context: "我要改单",
				staff_id: "302025052972240004",
			},
		});

		console.warn("查看改单处理报修待办结果", printFormat(data.value));
	});

	it("退单处理报修待办", async () => {
		const { execute, data } = removeRepairToDo({
			onSuccess(data) {
				console.warn("退单处理报修待办成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_id: "822024021727861281",
				context: "我要退单",
			},
		});

		console.warn("查看退单处理报修待办结果", printFormat(data.value));
	});

	it("报修待办--办结处理", async () => {
		const { execute, data } = modifyStateToFinish({
			onSuccess(data) {
				console.warn("报修待办--办结处理成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});
		await execute({
			data: {
				repair_id: "822024021727861281",
				is_material: "1",
				materials: [
					{
						res_id: "852025060109790015",
						material_name: "电池",
						material_count: 1,
						material_unit: "个",
						material_specification: "1000mAh",
						material_price: 10,
					},
				],
				context: "处理意见：我要办结",
				repair_before_photo_path: [
					"D:\\computer practice\\imgs\\repair_before_1.jpg",
					"D:\\computer practice\\imgs\\repair_before_2.jpg",
					"D:\\computer practice\\imgs\\repair_before_3.jpg",
				],
				repair_after_photo_path: [
					"D:\\computer practice\\imgs\\repair_after_1.jpg",
					"D:\\computer practice\\imgs\\repair_after_2.jpg",
					"D:\\computer practice\\imgs\\repair_after_3.jpg",
				],
				room_id: "102025052701090065",
				pay_type: "微信转账",
				total_price: "2",
			},
		});
		console.warn("报修待办--办结处理:", printFormat(data));
	});
});
