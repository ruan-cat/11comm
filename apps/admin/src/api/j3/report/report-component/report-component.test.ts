import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryReportComponentList,
	queryComponentConditionList,
	deleteComponentCondition,
	deleteReportComponent,
	modifyReportComponent,
	addComponentCondition,
} from "./report-component";

describe("报表组件接口测试", () => {
	it("获取报表组件列表", async () => {
		const { execute, data } = queryReportComponentList({
			onSuccess(data) {
				console.warn("获取报表组件列表成功", printFormat(data));
			},
			onError(error) {
				console.error("获取报表组件列表失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用条件查询报表组件列表", async () => {
		const { execute, data } = queryReportComponentList({
			onSuccess(data) {
				console.warn("条件查询报表组件列表成功", printFormat(data));
			},
			onError(error) {
				console.error("条件查询报表组件列表失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				componentId: "102023070480690007",
				componentType: "1001",
				name: "房屋入驻报表",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("获取条件列表", async () => {
		const { execute, data } = queryComponentConditionList({
			onSuccess(data) {
				console.warn("获取条件列表成功", printFormat(data));
			},
			onError(error) {
				console.error("获取条件列表失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				componentId: "102023070480690007",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("删除条件", async () => {
		const conditionId = "102021111302592100";
		const { execute, data } = deleteComponentCondition(conditionId, {
			onSuccess(data) {
				console.warn("删除条件成功", printFormat(data));
			},
			onError(error) {
				console.error("删除条件失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute();

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("删除报表组件", async () => {
		const { execute, data } = deleteReportComponent({
			onSuccess(data) {
				console.warn("删除报表组件成功", printFormat(data));
			},
			onError(error) {
				console.error("删除报表组件失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				componentId: "102023070480690000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("修改报表组件", async () => {
		const { execute, data } = modifyReportComponent({
			onSuccess(data) {
				console.warn("修改报表组件成功", printFormat(data));
			},
			onError(error) {
				console.error("修改报表组件失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				componentGroup: "C",
				componentId: "102023070480690000",
				componentType: "1001",
				name: "房屋入驻报表",
				queryModel: "1",
				statusCd: "0",
				componentSql: "SELECT * FROM house_report WHERE status = 'occupied'",
				remark: "无",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("添加条件", async () => {
		const { execute, data } = addComponentCondition({
			onSuccess(data) {
				console.warn("添加条件成功", printFormat(data));
			},
			onError(error) {
				console.error("添加条件失败:", error);
			},
		});

		await execute({
			data: {
				componentId: "102023070480690000",
				holdpace: "请填写开始时间YYYY-MM-DD格式",
				name: "开始时间",
				param: "startTime",
				seq: 1,
				type: "text",
				remark: "阿巴啊吧啊吧",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
