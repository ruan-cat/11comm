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
				communityId: "2024022692080516",
				itemValue: "选项A",
				seq: 0,
				titleId: "1930243903590158300",
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
				communityId: "2024022692080516",
				itemValue: "修改后的选项",
				seq: 1,
				titleId: "1930243903590158300",
				valueId: "value123",
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
			url: "/j8-patrolmgt/inspectionTitle/inspection-item-title-value/delete/value123",
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
