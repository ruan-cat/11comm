import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryReportGroupList,
	queryReportGroupNameList,
	addReportGroup,
	modifyReportGroup,
	deleteReportGroup,
} from "./index";

describe("j3/报表组管理", () => {
	it("使用 queryReportGroupList 接口 - 获取报表组列表（条件+分页）", async () => {
		const { execute, data } = queryReportGroupList({
			onSuccess(data) {
				console.warn("queryReportGroupList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryReportGroupList onError", error);
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

	it("使用 queryReportGroupList 接口 - 条件查询报表组列表", async () => {
		const { execute, data } = queryReportGroupList({
			onSuccess(data) {
				console.warn("queryReportGroupList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryReportGroupList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				name: "报修报表",
				groupId: "102021111007300001",
				url: "/#/pages/property/custom.html",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 queryReportGroupNameList 接口 - 获取报表组名称列表", async () => {
		const { execute, data } = queryReportGroupNameList({
			onSuccess(data) {
				console.warn("queryReportGroupNameList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryReportGroupNameList onError", error);
			},
		});
		await execute();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 addReportGroup 接口 - 添加报表组", async () => {
		const { execute, data } = addReportGroup({
			onSuccess(data) {
				console.warn("addReportGroup onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addReportGroup onError", error);
			},
		});
		await execute({
			data: {
				name: "报修报表",
				remark: "报修报表相关的统计数据",
				url: "/#/pages/property/custom.html",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 modifyReportGroup 接口 - 修改报表组", async () => {
		const { execute, data } = modifyReportGroup({
			onSuccess(data) {
				console.warn("modifyReportGroup onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyReportGroup onError", error);
			},
		});
		await execute({
			data: {
				groupId: "102021111007300000",
				name: "报修报表(已更新)",
				remark: "报修报表相关的统计数据(已更新)",
				url: "/#/pages/property/custom.html",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 deleteReportGroup 接口 - 删除报表组", async () => {
		const { execute, data } = deleteReportGroup({
			onSuccess(data) {
				console.warn("deleteReportGroup onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteReportGroup onError", error);
			},
		});
		await execute({
			params: {
				groupId: "102021111007300000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
