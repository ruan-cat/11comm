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
} from "./index";

describe("c2/报修管理/报修待办", () => {
	it("使用 body 接口 - 报修管理-报修待办-暂停", async () => {
		const { execute, data } = modifyStateToSuspend({
			onSuccess(data) {
				console.warn("modifyStateToSuspend onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyStateToSuspend onError", error);
			},
		});

		await execute({
			data: {
				repair_id: "822024021727861281",
				context: "系统维护需要暂停该报修单处理",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 报修待办--分页查询获取待办列表", async () => {
		const { execute, data } = queryAllRepairToDo({
			onSuccess(data) {
				console.warn("queryAllRepairToDo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAllRepairToDo onError", error);
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2025052665960005",
				staff_id: "302025052626190081",
				repair_id: "822025052766720091",
				repair_name: "李维修",
				tel: "13812345678",
				repair_type_name: "电梯维修",
				state: "接单",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 查询该小区中的所有报修类型", async () => {
		const { execute, data } = queryAllRepairType({
			onSuccess(data) {
				console.warn("queryAllRepairType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAllRepairType onError", error);
			},
		});

		await execute({
			params: {
				community_id: "2025052665960005",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 查询该报修类型对应的所有报修师傅", async () => {
		const { execute, data } = queryAllStaff({
			onSuccess(data) {
				console.warn("queryAllStaff onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAllStaff onError", error);
			},
		});

		await execute({
			params: {
				repair_type: "102025052701090065",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 报修待办--改单处理", async () => {
		const { execute, data } = modifyRepairToDo({
			onSuccess(data) {
				console.warn("modifyRepairToDo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyRepairToDo onError", error);
			},
		});

		await execute({
			data: {
				repair_id: "822024021727861281",
				context: "根据实际情况调整维修师傅安排",
				staff_id: "302025052972240004",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 报修待办--退单处理", async () => {
		const { execute, data } = removeRepairToDo({
			onSuccess(data) {
				console.warn("removeRepairToDo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeRepairToDo onError", error);
			},
		});

		await execute({
			data: {
				repair_id: "822024021727861281",
				context: "业主取消报修申请，进行退单处理",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 报修待办--办结处理", async () => {
		const { execute, data } = modifyStateToFinish({
			onSuccess(data) {
				console.warn("modifyStateToFinish onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyStateToFinish onError", error);
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
				context: "维修完成，设备恢复正常运行，业主满意",
				repair_before_photo_path: [
					"/upload/repair/before/repair_before_1.jpg",
					"/upload/repair/before/repair_before_2.jpg",
					"/upload/repair/before/repair_before_3.jpg",
				],
				repair_after_photo_path: [
					"/upload/repair/after/repair_after_1.jpg",
					"/upload/repair/after/repair_after_2.jpg",
					"/upload/repair/after/repair_after_3.jpg",
				],
				room_id: "102025052701090065",
				pay_type: "微信转账",
				total_price: "120.00",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
