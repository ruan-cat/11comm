import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryTaskDetailById,
	queryTaskList,
	modifyTask,
	removeTask,
	exportTaskDetail,
	addTaskDetail,
} from "./work-order-pool";

describe("工单池工单接口测试", () => {
	it("获取工单池工单详情", async () => {
		const { execute, data } = queryTaskDetailById({
			onSuccess(data) {
				console.warn("获取工单池工单详情成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_id: "822023080257540003",
			},
		});

		console.warn("查看工单池工单详情数据", printFormat(data.value));
	});

	it("获取工单列表", async () => {
		const { execute, data } = queryTaskList({
			onSuccess(data) {
				console.warn("获取工单列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2023052267100146",
				repair_id: "822025053099990009",
				repair_name: "赵子龙",
				tel: "15262352623",
				repair_type: "测试打印类型",
				repair_setting_type: "100",
				repair_obj_name: "HC演示小区3",
				maintenance_type: "1001",
				start_time: "2025-05-30 15:10:52",
				end_time: "2025-05-30 15:11:20",
			},
		});

		console.warn("查看工单列表分页数据", printFormat(data.value));
	});

	it("修改工单", async () => {
		const { execute, data } = modifyTask({
			onSuccess(data) {
				console.warn("修改工单成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				community_id: "2023052267100146",
				repair_id: "822025053099990009",
				repair_type: "测试打印类型",
				repair_name: "赵子龙",
				tel: "15262352623",
				appointment_time: "2025-05-30 15:10:52",
				context: "快处理",
			},
		});

		console.warn("查看修改工单结果", printFormat(data.value));
	});

	it("删除工单", async () => {
		const { execute, data } = removeTask({
			onSuccess(data) {
				console.warn("删除工单成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_id: "822025053099990009",
			},
		});

		console.warn("查看删除工单结果", printFormat(data.value));
	});

	it("打印工单", async () => {
		const { execute, data } = exportTaskDetail({
			onSuccess(data) {
				console.warn("打印工单成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_id: "822025053099540019",
			},
		});

		console.warn("查看打印工单结果", printFormat(data.value));
	});

	it("派单", async () => {
		const { execute, data } = addTaskDetail({
			onSuccess(data) {
				console.warn("派单成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_id: "822025053099990009",
				staff_name: "阿姨",
				context: "好的",
			},
		});

		console.warn("查看派单结果", printFormat(data.value));
	});
});
