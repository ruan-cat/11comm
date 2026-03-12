import { describe, expect, test } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addConfigItem,
	queryConfigItemNameList,
	deleteConfigItem,
	queryConfigItemList,
	updateConfigItem,
} from "./index";

describe("j2/配置管理/配置项", () => {
	test("使用 body 接口 - 添加配置项", async () => {
		let hasError = false;
		const { execute, data } = addConfigItem({
			onSuccess(data) {
				console.warn("addConfigItem onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("addConfigItem onError", error);
			},
		});
		await execute({
			data: {
				domain: "OSS",
				domainName: "阿里云OSS",
				remark: "主要用于系统图片等存储使用",
				seq: 11,
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 body 接口 - 获取配置项名称列表", async () => {
		let hasError = false;
		const { execute, data } = queryConfigItemNameList({
			onSuccess(data) {
				console.warn("queryConfigItemNameList onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("queryConfigItemNameList onError", error);
			},
		});
		await execute({
			data: {},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 query 接口 - 删除配置项", async () => {
		let hasError = false;
		const { execute, data } = deleteConfigItem({
			onSuccess(data) {
				console.warn("deleteConfigItem onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("deleteConfigItem onError", error);
			},
		});
		await execute({
			params: {
				id: "102023012925250020",
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 query 接口 - 获取配置项列表（条件+分页）", async () => {
		let hasError = false;
		const { execute, data } = queryConfigItemList({
			onSuccess(data) {
				console.warn("queryConfigItemList onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("queryConfigItemList onError", error);
			},
		});
		await execute({
			params: {
				domain: "SYSTEM_SWITCH",
				domainName: "环境配置",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 body 接口 - 修改配置项", async () => {
		let hasError = false;
		const { execute, data } = updateConfigItem({
			onSuccess(data) {
				console.warn("updateConfigItem onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("updateConfigItem onError", error);
			},
		});
		await execute({
			data: {
				domain: "SYSTEM_SWITCH",
				domainName: "系统开关",
				id: "102023012925250020",
				remark: "这是一个配置项",
				seq: "1",
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
