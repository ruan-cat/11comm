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

describe("c2/维修管理/工单池", () => {
	it("使用 query 接口 - 获取工单池工单详情", async () => {
		const { execute, data } = queryTaskDetailById({
			onSuccess(data) {
				console.warn("queryTaskDetailById onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryTaskDetailById onError", error);
			},
		});

		await execute({
			params: {
				repair_id: "822023080257540003",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取工单列表", async () => {
		const { execute, data } = queryTaskList({
			onSuccess(data) {
				console.warn("queryTaskList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryTaskList onError", error);
			},
		});

		await execute({
			params: {
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

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改工单", async () => {
		const { execute, data } = modifyTask({
			onSuccess(data) {
				console.warn("modifyTask onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyTask onError", error);
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

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除工单", async () => {
		const { execute, data } = removeTask({
			onSuccess(data) {
				console.warn("removeTask onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeTask onError", error);
			},
		});

		await execute({
			data: {
				repair_id: "822025053099990009",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	// TODO: 文件接口 不做导出测试
	// it("使用 query 接口 - 打印工单", async () => {
	// 	const { execute, data } = exportTaskDetail({
	// 		onSuccess(data) {
	// 			console.warn("exportTaskDetail onSuccess", printFormat(data));
	// 		},
	// 		onError(error) {
	// 			console.error("exportTaskDetail onError", error);
	// 		},
	// 	});
	// 	await execute({
	// 		params: {
	// 			repair_id: "822025053099540019",
	// 		},
	// 	});
	// 	console.warn("查看简单的 data.value ", printFormat(data.value));
	// });

	it("使用 body 接口 - 派单", async () => {
		const { execute, data } = addTaskDetail({
			onSuccess(data) {
				console.warn("addTaskDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addTaskDetail onError", error);
			},
		});

		await execute({
			data: {
				repair_id: "822025053099990009",
				staff_name: "阿姨",
				context: "好的",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
