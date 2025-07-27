import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addDictType, deleteDictType, updateDictType, queryDictTypeList, queryDictTypeNameList } from "./index";

describe("j2/配置管理/字典类型", () => {
	it("使用 body 接口 - 添加字典类型", async () => {
		const { execute, data } = addDictType({
			onSuccess(data) {
				console.warn("addDictType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addDictType onError", error);
			},
		});
		await execute({
			data: {
				specName: "员工岗位",
				statusCd: "0",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除字典类型", async () => {
		const { execute, data } = deleteDictType({
			onSuccess(data) {
				console.warn("deleteDictType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteDictType onError", error);
			},
		});
		await execute({
			params: {
				id: "4",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改字典类型", async () => {
		const { execute, data } = updateDictType({
			onSuccess(data) {
				console.warn("updateDictType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateDictType onError", error);
			},
		});
		await execute({
			data: {
				specId: "4",
				specName: "员工岗位",
				statusCd: "0",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 查询字典类型列表(条件+分页)", async () => {
		const { execute, data } = queryDictTypeList({
			onSuccess(data) {
				console.warn("queryDictTypeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryDictTypeList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				specName: "员工岗位",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 查询字典类型名称列表", async () => {
		const { execute, data } = queryDictTypeNameList({
			onSuccess(data) {
				console.warn("queryDictTypeNameList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryDictTypeNameList onError", error);
			},
		});
		await execute({
			data: {},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
