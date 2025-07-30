import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { addInspectProjectOption, modifyInspectProjectOption, deleteInspectProjectOption } from ".";

describe("j8/巡检项目选项管理", () => {
	it("使用 addInspectProjectOption 接口 - 添加巡检项目选项", async () => {
		const { execute, data } = addInspectProjectOption({
			onSuccess(data) {
				console.warn("添加巡检项目选项成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加巡检项目选项失败", printFormat(error));
			},
		});

		await execute({
			data: {
				projectId: "123456",
				optionName: "测试选项",
				optionValue: "测试值",
				optionType: "single",
				sort: 1,
				status: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectProjectOption 接口 - 修改巡检项目选项", async () => {
		const { execute, data } = modifyInspectProjectOption({
			onSuccess(data) {
				console.warn("修改巡检项目选项成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检项目选项失败", printFormat(error));
			},
		});

		await execute({
			data: {
				id: "123456",
				optionName: "修改后的选项",
				optionValue: "修改后的值",
				sort: 2,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectProjectOption 接口 - 删除巡检项目选项", async () => {
		const { execute, data } = deleteInspectProjectOption({
			onSuccess(data) {
				console.warn("删除巡检项目选项成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检项目选项失败", printFormat(error));
			},
		});

		await execute({
			params: {
				id: "123456",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
