import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { queryInspectTaskDetail, queryInspectTaskList, transferInspectTask } from ".";

describe("j8/巡检任务", () => {
	it("使用 queryInspectTaskDetail 接口 - 获取巡检任务详情", async () => {
		const { execute, data } = queryInspectTaskDetail({
			onSuccess(data) {
				console.warn("获取巡检任务详情成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检任务详情失败", printFormat(error));
			},
		});

		await execute({
			url: "/j8-patrolmgt/task/query-task-detail/5220250519674431000",
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectTaskList 接口 - 获取巡检任务列表（条件+分页）", async () => {
		const { execute, data } = queryInspectTaskList({
			onSuccess(data) {
				console.warn("获取巡检任务列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检任务列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2024022643710121",
				pageIndex: 1,
				pageSize: 10,
				actUserName: "小王",
				planId: "142024021699470706",
				planUserName: "小王",
				state: "未开始",
				planInsTime: "2025-05-18 08:05",
				planEndTime: "2025-05-18 21:15",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 transferInspectTask 接口 - 流转任务", async () => {
		const { execute, data } = transferInspectTask({
			onSuccess(data) {
				console.warn("流转任务成功", printFormat(data));
			},
			onError(error) {
				console.warn("流转任务失败", printFormat(error));
			},
		});

		await execute({
			data: {
				newUserId: "302025043082457800",
				taskId: "5220250519674431000",
				transferDesc: "原负责人请假",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
