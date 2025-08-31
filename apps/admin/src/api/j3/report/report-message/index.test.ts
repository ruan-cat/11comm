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
} from "./index";

describe("j3/报表信息管理", () => {
	it("使用 queryReportMessageList 接口 - 分页查询报表信息", async () => {
		const { execute, data } = queryReportMessageList({
			onSuccess(data) {
				console.warn("queryReportMessageList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryReportMessageList onError", error);
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

	it("使用 queryReportMessageList 接口 - 条件查询报表信息列表", async () => {
		const { execute, data } = queryReportMessageList({
			onSuccess(data) {
				console.warn("queryReportMessageList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryReportMessageList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				customId: "1020211112807918355",
				groupId: "102021111007300001",
				title: "报修分项表",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 addReportMessage 接口 - 新增报表信息", async () => {
		const { execute, data } = addReportMessage({
			onSuccess(data) {
				console.warn("addReportMessage onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addReportMessage onError", error);
			},
		});
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

	it("使用 modifyReportMessage 接口 - 修改报表信息", async () => {
		const { execute, data } = modifyReportMessage({
			onSuccess(data) {
				console.warn("modifyReportMessage onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyReportMessage onError", error);
			},
		});
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

	it("使用 queryComponentRelList 接口 - 分页获取关联组件列表", async () => {
		const { execute, data } = queryComponentRelList({
			onSuccess(data) {
				console.warn("queryComponentRelList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryComponentRelList onError", error);
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

	it("使用 queryComponentRelList 接口 - 条件查询关联组件列表", async () => {
		const { execute, data } = queryComponentRelList({
			onSuccess(data) {
				console.warn("queryComponentRelList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryComponentRelList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				customId: "1020211112807918300",
				relId: "102025051509590020",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 deleteComponentRel 接口 - 删除关联组件", async () => {
		const { execute, data } = deleteComponentRel({
			onSuccess(data) {
				console.warn("deleteComponentRel onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteComponentRel onError", error);
			},
		});
		await execute({
			data: {
				componentId: "102022040879310020",
				customId: "1020211112807918300",
				relId: "102025051509590020",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 deleteReportMessage 接口 - 删除报表信息", async () => {
		const { execute, data } = deleteReportMessage({
			onSuccess(data) {
				console.warn("deleteReportMessage onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteReportMessage onError", error);
			},
		});
		await execute({
			params: {
				customId: "1020211112807918300",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 addComponentRel 接口 - 关联组件", async () => {
		const { execute, data } = addComponentRel({
			onSuccess(data) {
				console.warn("addComponentRel onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addComponentRel onError", error);
			},
		});
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
