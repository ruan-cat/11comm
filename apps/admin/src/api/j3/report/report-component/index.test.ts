import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryReportComponentList,
	addReportComponent,
	queryComponentConditionList,
	deleteComponentCondition,
	deleteReportComponent,
	modifyReportComponent,
	addComponentCondition,
	modifyComponentCondition,
} from "./index";

describe("j3/报表组件管理", () => {
	it("使用 query 接口 - 获取报表组件列表", async () => {
		const { execute, data } = queryReportComponentList({
			onSuccess(data) {
				console.warn("queryReportComponentList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryReportComponentList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 条件查询报表组件列表", async () => {
		const { execute, data } = queryReportComponentList({
			onSuccess(data) {
				console.warn("queryReportComponentList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryReportComponentList onError", error);
			},
		});
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

	it("使用 body 接口 - 添加报表组件", async () => {
		const { execute, data } = addReportComponent({
			onSuccess(data) {
				console.warn("addReportComponent onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addReportComponent onError", error);
			},
		});
		await execute({
			data: {
				componentGroup: "C",
				componentType: "1001",
				name: "房屋入驻报表",
				queryModel: "1",
				statusCd: "0",
				componentSql: "SELECT * FROM house_report WHERE status = 'occupied'",
				remark: "房屋入驻统计报表",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取条件列表", async () => {
		const { execute, data } = queryComponentConditionList({
			onSuccess(data) {
				console.warn("queryComponentConditionList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryComponentConditionList onError", error);
			},
		});
		await execute({
			params: {
				componentId: "102023070480690007",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 path 接口 - 删除条件", async () => {
		const conditionId = "102021111302592100";
		const { execute, data } = deleteComponentCondition(conditionId, {
			onSuccess(data) {
				console.warn("deleteComponentCondition onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteComponentCondition onError", error);
			},
		});
		await execute();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除报表组件", async () => {
		const { execute, data } = deleteReportComponent({
			onSuccess(data) {
				console.warn("deleteReportComponent onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteReportComponent onError", error);
			},
		});
		await execute({
			data: {
				componentId: "102023070480690000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改报表组件", async () => {
		const { execute, data } = modifyReportComponent({
			onSuccess(data) {
				console.warn("modifyReportComponent onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyReportComponent onError", error);
			},
		});
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

	it("使用 body 接口 - 添加条件", async () => {
		const { execute, data } = addComponentCondition({
			onSuccess(data) {
				console.warn("addComponentCondition onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addComponentCondition onError", error);
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

	it("使用 body 接口 - 修改条件", async () => {
		const { execute, data } = modifyComponentCondition({
			onSuccess(data) {
				console.warn("modifyComponentCondition onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyComponentCondition onError", error);
			},
		});
		await execute({
			data: {
				componentId: "102023070480690000",
				conditionId: "102021111302592100",
				holdpace: "请输入开始时间YYYY-MM-DD格式",
				name: "开始时间",
				param: "startTime",
				seq: 1,
				type: "date",
				remark: "用于筛选特定用户的数据",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
