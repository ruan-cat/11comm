import { describe, it } from "vitest";
import {
	dashboardConsoleAppraise,
	dashboardConsoleBusinessCommunity,
	dashboardConsoleComplaintStats,
	dashboardConsoleRegisterStats,
	dashboardConsoleRepairStats,
} from "./console";

// 简单的格式化函数，如果项目中有printFormat可以直接导入
const printFormat = (data: any) => JSON.stringify(data, null, 2);

describe("控制台接口测试套件", () => {
	it("测试业主反馈接口", async () => {
		const { execute, data } = dashboardConsoleAppraise({
			onSuccess(data) {
				console.warn("业主反馈 onSuccess", printFormat(data));
			},
			onError(error) {
				console.warn("业主反馈 onError", printFormat(error));
			},
		});

		// 执行获取业主反馈操作 - 无参数GET请求
		await execute();

		console.warn("业主反馈接口测试结果", {
			functionName: "dashboardConsoleAppraise",
			testDescription: "获取所有业主反馈信息列表",
			result: printFormat(data.value),
		});
	});

	it("测试小区信息接口", async () => {
		const { execute, data } = dashboardConsoleBusinessCommunity({
			onSuccess(data) {
				console.warn("小区信息 onSuccess", printFormat(data));
			},
			onError(error) {
				console.warn("小区信息 onError", printFormat(error));
			},
		});

		// 执行获取小区信息操作 - 无参数GET请求
		await execute();

		console.warn("小区信息接口测试结果", {
			functionName: "dashboardConsoleBusinessCommunity",
			testDescription: "获取所有小区信息列表",
			result: printFormat(data.value),
		});
	});

	it("测试投诉统计接口", async () => {
		const { execute, data } = dashboardConsoleComplaintStats({
			onSuccess(data) {
				console.warn("投诉统计 onSuccess", printFormat(data));
			},
			onError(error) {
				console.warn("投诉统计 onError", printFormat(error));
			},
		});

		// 执行获取投诉统计操作 - 无参数GET请求
		await execute();

		console.warn("投诉统计接口测试结果", {
			functionName: "dashboardConsoleComplaintStats",
			testDescription: "获取所有投诉统计信息列表",
			result: printFormat(data.value),
		});
	});

	it("测试住户注册统计接口", async () => {
		const { execute, data } = dashboardConsoleRegisterStats({
			onSuccess(data) {
				console.warn("住户注册统计 onSuccess", printFormat(data));
			},
			onError(error) {
				console.warn("住户注册统计 onError", printFormat(error));
			},
		});

		// 执行获取住户注册统计操作 - 无参数GET请求
		await execute();

		console.warn("住户注册统计接口测试结果", {
			functionName: "dashboardConsoleRegisterStats",
			testDescription: "获取所有住户注册统计信息列表",
			result: printFormat(data.value),
		});
	});

	it("测试报修统计接口", async () => {
		const { execute, data } = dashboardConsoleRepairStats({
			onSuccess(data) {
				console.warn("报修统计 onSuccess", printFormat(data));
			},
			onError(error) {
				console.warn("报修统计 onError", printFormat(error));
			},
		});

		// 执行获取报修统计操作 - 无参数GET请求
		await execute();

		console.warn("报修统计接口测试结果", {
			functionName: "dashboardConsoleRepairStats",
			testDescription: "获取所有报修统计信息列表",
			result: printFormat(data.value),
		});
	});
});
