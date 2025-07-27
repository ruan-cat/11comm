import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addDict, updateDict, queryDictList, deleteDict, queryDictNameList } from "./index";

describe("j2/配置管理/字典", () => {
	it("使用 body 接口 - 添加字典", async () => {
		const { execute, data } = addDict({
			onSuccess(data) {
				console.warn("addDict onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addDict onError", error);
			},
		});
		await execute({
			data: {
				description: "上门服务",
				name: "商务拜访",
				specId: "6",
				statusCd: "3",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改字典", async () => {
		const { execute, data } = updateDict({
			onSuccess(data) {
				console.warn("updateDict onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateDict onError", error);
			},
		});
		await execute({
			data: {
				description: "上门服务",
				id: 1,
				name: "商务拜访",
				specId: "6",
				statusCd: "3",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取字典列表(条件+分页)", async () => {
		const { execute, data } = queryDictList({
			onSuccess(data) {
				console.warn("queryDictList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryDictList onError", error);
			},
		});
		await execute({
			params: {
				name: "上门服务",
				pageIndex: 1,
				pageSize: 10,
				specId: "6",
				statusCd: "3",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除字典", async () => {
		const { execute, data } = deleteDict({
			onSuccess(data) {
				console.warn("deleteDict onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteDict onError", error);
			},
		});
		await execute({
			params: {
				id: "1",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取字典名称列表", async () => {
		const { execute, data } = queryDictNameList({
			onSuccess(data) {
				console.warn("queryDictNameList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryDictNameList onError", error);
			},
		});
		await execute({
			params: {
				name: "普通员工",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
