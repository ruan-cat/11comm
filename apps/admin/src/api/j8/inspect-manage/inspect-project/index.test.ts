import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addInspectProject,
	modifyInspectProject,
	deleteInspectProject,
	queryInspectProjectList,
	queryInspectProjectNameList,
	addInspectQuestion,
	modifyInspectQuestion,
	deleteInspectQuestion,
	queryInspectQuestionList,
} from ".";

describe("j8/巡检项目", () => {
	// 巡检项目相关接口测试
	it("使用 addInspectProject 接口 - 添加巡检项目", async () => {
		const { execute, data } = addInspectProject({
			onSuccess(data) {
				console.warn("添加巡检项目成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加巡检项目失败", printFormat(error));
			},
		});

		await execute({
			data: {
				projectName: "消防安全巡检",
				projectCode: "FIRE_SAFETY",
				projectDesc: "消防安全巡检项目",
				projectType: "安全检查",
				status: "1",
				sort: 1,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectProject 接口 - 修改巡检项目", async () => {
		const { execute, data } = modifyInspectProject({
			onSuccess(data) {
				console.warn("修改巡检项目成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检项目失败", printFormat(error));
			},
		});

		await execute({
			data: {
				id: "123456",
				projectName: "电梯安全巡检",
				projectDesc: "电梯安全巡检项目",
				sort: 2,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectProject 接口 - 删除巡检项目", async () => {
		const { execute, data } = deleteInspectProject({
			onSuccess(data) {
				console.warn("删除巡检项目成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检项目失败", printFormat(error));
			},
		});

		await execute({
			params: {
				id: "123456",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectProjectList 接口 - 获取巡检项目列表", async () => {
		const { execute, data } = queryInspectProjectList({
			onSuccess(data) {
				console.warn("获取巡检项目列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检项目列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				projectName: "消防",
				status: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectProjectNameList 接口 - 获取巡检项目名称列表", async () => {
		const { execute, data } = queryInspectProjectNameList({
			onSuccess(data) {
				console.warn("获取巡检项目名称列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检项目名称列表失败", printFormat(error));
			},
		});

		await execute({
			params: {},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	// 巡检题目相关接口测试
	it("使用 addInspectQuestion 接口 - 增加巡检题目", async () => {
		const { execute, data } = addInspectQuestion({
			onSuccess(data) {
				console.warn("增加巡检题目成功", printFormat(data));
			},
			onError(error) {
				console.warn("增加巡检题目失败", printFormat(error));
			},
		});

		await execute({
			data: {
				projectId: "123456",
				questionName: "消防栓水压检查",
				questionType: "单选题",
				questionContent: "消防栓水压是否正常？",
				required: true,
				sort: 1,
				status: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectQuestion 接口 - 修改巡检题目", async () => {
		const { execute, data } = modifyInspectQuestion({
			onSuccess(data) {
				console.warn("修改巡检题目成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检题目失败", printFormat(error));
			},
		});

		await execute({
			data: {
				id: "789012",
				questionName: "消防设备检查",
				questionContent: "消防设备运行状态是否正常？",
				required: false,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectQuestion 接口 - 删除巡检题目", async () => {
		const { execute, data } = deleteInspectQuestion({
			onSuccess(data) {
				console.warn("删除巡检题目成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检题目失败", printFormat(error));
			},
		});

		await execute({
			params: {
				id: "789012",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectQuestionList 接口 - 获取巡检题目列表", async () => {
		const { execute, data } = queryInspectQuestionList({
			onSuccess(data) {
				console.warn("获取巡检题目列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检题目列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				projectId: "123456",
				questionName: "消防",
				status: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
