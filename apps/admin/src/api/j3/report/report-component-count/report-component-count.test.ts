import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addComponentCount, queryComponentCountList, modifyComponentCount } from "./report-component-count";

describe("报表组件底层统计接口测试", () => {
	it("查询报表组件底层统计列表", async () => {
		const { execute, data } = queryComponentCountList({
			onSuccess(data) {
				console.warn("查询报表组件底层统计列表成功", printFormat(data));
			},
			onError(error) {
				console.error("查询报表组件底层统计列表失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				componentId: "102023070480690000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("添加报表组件底层统计", async () => {
		const { execute, data } = addComponentCount({
			onSuccess(data) {
				console.warn("添加报表组件底层统计成功", printFormat(data));
			},
			onError(error) {
				console.error("添加报表组件底层统计失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				componentId: "102023070480690000",
				name: "报表统计测试-1",
				queryModel: "1",
				footerDescription: "这是一个测试...",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("修改报表组件底层统计", async () => {
		const { execute, data } = modifyComponentCount({
			onSuccess(data) {
				console.warn("修改报表组件底层统计成功", printFormat(data));
			},
			onError(error) {
				console.error("修改报表组件底层统计失败:", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				componentId: "102023070480690000",
				footerId: "102025052043900000",
				name: "报表统计测试-1（已更新）",
				queryModel: "1",
				footerDescription: "这是一个测试...（已更新）",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
