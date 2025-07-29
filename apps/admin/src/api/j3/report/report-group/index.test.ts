import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryReportGroupList,
	queryReportGroupNameList,
	addReportGroup,
	modifyReportGroup,
	deleteReportGroup,
} from ".";

describe("报表组接口测试", () => {
	it("获取报表组列表", async () => {
		const { execute, data } = queryReportGroupList({
			onSuccess(data) {
				console.warn("获取报表组列表成功", printFormat(data));
			},
			onError(error) {},
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

	it("使用条件查询报表组列表", async () => {
		const { execute, data } = queryReportGroupList({
			onSuccess(data) {
				console.warn("条件查询报表组列表成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
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

	it("获取报表组名称列表", async () => {
		const { execute, data } = queryReportGroupNameList({
			onSuccess(data) {
				console.warn("获取报表组名称列表成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute();

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("添加报表组", async () => {
		const { execute, data } = addReportGroup({
			onSuccess(data) {
				console.warn("添加报表组成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				name: "报修报表",
				remark: "报修报表相关的统计数据",
				url: "/#/pages/property/custom.html",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("修改报表组", async () => {
		const { execute, data } = modifyReportGroup({
			onSuccess(data) {
				console.warn("修改报表组成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
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

	it("删除报表组", async () => {
		const { execute, data } = deleteReportGroup({
			onSuccess(data) {
				console.warn("删除报表组成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				groupId: "102021111007300000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
