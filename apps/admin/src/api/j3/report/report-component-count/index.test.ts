import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryComponentCountList, addComponentCount, modifyComponentCount, removeComponentCount } from ".";

describe("j3/报表/报表组件底层统计", () => {
	it("使用 query 接口 - 查询报表组件底层统计列表", async () => {
		const { execute, data } = queryComponentCountList({
			onSuccess(data) {
				console.warn("queryComponentCountList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryComponentCountList onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				componentId: "102023070480690000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加报表组件底层统计", async () => {
		const { execute, data } = addComponentCount({
			onSuccess(data) {
				console.warn("addComponentCount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addComponentCount onError", error);
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

	it("使用 body 接口 - 修改报表组件底层统计", async () => {
		const { execute, data } = modifyComponentCount({
			onSuccess(data) {
				console.warn("modifyComponentCount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyComponentCount onError", error);
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

	it("使用 query 接口 - 删除报表组件底层统计", async () => {
		const { execute, data } = removeComponentCount({
			onSuccess(data) {
				console.warn("removeComponentCount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeComponentCount onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			params: {
				footerID: "102025052043900000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
