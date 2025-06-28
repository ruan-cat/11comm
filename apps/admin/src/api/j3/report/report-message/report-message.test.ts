import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryReportMessageList,
	addReportMessage,
	queryComponentRelList,
	deleteComponentRel,
	deleteReportMessage,
	modifyReportMessage,
	addComponentRel,
} from "./report-message";

describe("报表信息接口测试", () => {
	it("获取报表信息列表", async () => {
		const { execute, data } = queryReportMessageList({
			onSuccess(data) {
				console.warn("获取报表信息列表成功", printFormat(data));
			},
			onError(error) {
				console.error("获取报表信息列表失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用条件查询报表信息列表", async () => {
		const { execute, data } = queryReportMessageList({
			onSuccess(data) {
				console.warn("条件查询报表信息列表成功", printFormat(data));
			},
			onError(error) {
				console.error("条件查询报表信息列表失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				customId: "1020211112807918355",
				groupId: "102021111007300001",
				title: "报修分项表",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("新增报表信息", async () => {
		const { execute, data } = addReportMessage({
			onSuccess(data) {
				console.warn("新增报表信息成功", printFormat(data));
			},
			onError(error) {
				console.error("新增报表信息失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				groupId: "102021111007300001",
				title: "月度销售报表",
				seq: 1,
				remark: "这是2021年11月的销售报表",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("修改报表信息", async () => {
		const { execute, data } = modifyReportMessage({
			onSuccess(data) {
				console.warn("修改报表信息成功", printFormat(data));
			},
			onError(error) {
				console.error("修改报表信息失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				customId: "102021111204870300",
				groupId: "102021111007300001",
				title: "月度销售报表（已更新）",
				seq: 2,
				remark: "这是2021年11月的销售报表（已更新）",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("获取关联组件列表", async () => {
		const { execute, data } = queryComponentRelList({
			onSuccess(data) {
				console.warn("获取关联组件列表成功", printFormat(data));
			},
			onError(error) {
				console.error("获取关联组件列表失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用条件查询关联组件列表", async () => {
		const { execute, data } = queryComponentRelList({
			onSuccess(data) {
				console.warn("条件查询关联组件列表成功", printFormat(data));
			},
			onError(error) {
				console.error("条件查询关联组件列表失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				customId: "1020211112807918300",
				relId: "102025051509590020",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("删除关联组件", async () => {
		const { execute, data } = deleteComponentRel({
			onSuccess(data) {
				console.warn("删除关联组件成功", printFormat(data));
			},
			onError(error) {
				console.error("删除关联组件失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				componentId: "102022040879310020",
				customId: "1020211112807918300",
				relId: "102025051509590020",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("删除报表信息", async () => {
		const { execute, data } = deleteReportMessage({
			onSuccess(data) {
				console.warn("删除报表信息成功", printFormat(data));
			},
			onError(error) {
				console.error("删除报表信息失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				customId: "1020211112807918300",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("关联组件", async () => {
		const { execute, data } = addComponentRel({
			onSuccess(data) {
				console.warn("关联组件成功", printFormat(data));
			},
			onError(error) {
				console.error("关联组件失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				componentId: "102022040879310020",
				customId: "1020211112807918300",
				seq: 1,
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
