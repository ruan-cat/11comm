import { describe, expect, test } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addDiscount, modifyDiscount, deleteDiscount, queryDiscount } from "./index";

describe("c4/折扣管理", () => {
	test("使用 body 接口 - 添加折扣", async () => {
		let hasError = false;
		const { execute, data } = addDiscount({
			onSuccess(data) {
				console.warn("addDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("addDiscount onError", error);
			},
		});
		await execute({
			data: {
				discount_name: "新年优惠",
				discount_type: "百分比折扣",
				rule_id: "RULE_001",
				discount_desc: "春节期间物业费8折优惠",
				spec_name: ["适用时间", "适用对象"],
				spec_value: ["2024年1月-2月", "全体业主"],
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 body 接口 - 修改折扣", async () => {
		let hasError = false;
		const { execute, data } = modifyDiscount({
			onSuccess(data) {
				console.warn("modifyDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("modifyDiscount onError", error);
			},
		});
		await execute({
			data: {
				discount_id: "test_discount_id",
				rule_id: "RULE_002",
				discount_name: "修改后的优惠名称",
				discount_type: "固定金额折扣",
				discount_desc: "修改后的优惠说明",
				spec_name: ["适用时间"],
				spec_value: ["2024年全年"],
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 body 接口 - 删除折扣", async () => {
		let hasError = false;
		const { execute, data } = deleteDiscount({
			onSuccess(data) {
				console.warn("deleteDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("deleteDiscount onError", error);
			},
		});
		await execute({
			data: {
				discount_id: "test_discount_id",
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	test("使用 query 接口 - 查询折扣", async () => {
		let hasError = false;
		const { execute, data } = queryDiscount({
			onSuccess(data) {
				console.warn("queryDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				hasError = true;
				console.error("queryDiscount onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				discount_id: "test_discount_id",
				discount_name: "新年优惠",
				discount_type: "百分比折扣",
			},
		});
		expect(hasError).toBe(false);
		expect(data.value).toBeDefined();
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
