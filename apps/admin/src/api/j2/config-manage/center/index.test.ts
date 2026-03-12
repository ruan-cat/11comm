import { describe, expect, test } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addConfig, deleteConfig, queryConfigList, updateConfig } from "./index";

describe("j2/配置管理/配置中心", () => {
	test("使用 body 接口 - 添加配置", async () => {
		let hasError = false;
		const { execute, data } = addConfig({
			onSuccess(data) {
				console.warn("addConfig onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("addConfig onError", error);
			},
		});
		await execute({
			data: {
				domain: "SYSTEM_SWITCH",
				key: "SWITCH_OPEN",
				name: "系统开关",
				remark: "用于控制功能是否开启",
				value: "OFF",
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 query 接口 - 删除配置", async () => {
		let hasError = false;
		const { execute, data } = deleteConfig({
			onSuccess(data) {
				console.warn("deleteConfig onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("deleteConfig onError", error);
			},
		});
		await execute({
			params: {
				id: "444444444444",
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 query 接口 - 获取配置列表（条件+分页）", async () => {
		let hasError = false;
		const { execute, data } = queryConfigList({
			onSuccess(data) {
				console.warn("queryConfigList onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("queryConfigList onError", error);
			},
		});
		await execute({
			params: {
				domain: "环境配置",
				key: "yidong_url",
				name: "移动短信地址",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 body 接口 - 修改配置", async () => {
		let hasError = false;
		const { execute, data } = updateConfig({
			onSuccess(data) {
				console.warn("updateConfig onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("updateConfig onError", error);
			},
		});
		await execute({
			data: {
				domain: "SYSTEM_SWITCH",
				id: "444444444444",
				key: "SWITCH_OPEN",
				name: "系统开关",
				remark: "用于控制功能是否开启",
				value: "ON",
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
