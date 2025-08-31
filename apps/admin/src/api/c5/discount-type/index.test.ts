import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	getDiscountTypeNameList,
	getDiscountTypeList,
	addDiscountType,
	modifyDiscountType,
	deleteDiscountType,
} from "./index";

describe("c5/优惠类型管理", () => {
	it("使用 query 接口 - 获取优惠类型名称列表", async () => {
		const { execute, data } = getDiscountTypeNameList({
			onSuccess(data) {
				console.warn("getDiscountTypeNameList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getDiscountTypeNameList onError", error);
			},
		});
		await execute({
			params: {},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取优惠类型列表（条件 + 分页）", async () => {
		const { execute, data } = getDiscountTypeList({
			onSuccess(data) {
				console.warn("getDiscountTypeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getDiscountTypeList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				discount_type_name: "物业费优惠",
				discount_type_code: "PROPERTY_DISCOUNT",
				status: "启用",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加优惠类型", async () => {
		const { execute, data } = addDiscountType({
			onSuccess(data) {
				console.warn("addDiscountType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addDiscountType onError", error);
			},
		});
		await execute({
			data: {
				discount_type_name: "新年优惠",
				discount_type_code: "NEW_YEAR_DISCOUNT",
				discount_desc: "春节期间物业费优惠",
				discount_rate: 0.8,
				discount_amount: 100.0,
				discount_type: "百分比折扣",
				status: "启用",
				remark: "节日特惠活动",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改优惠类型", async () => {
		const { execute, data } = modifyDiscountType({
			onSuccess(data) {
				console.warn("modifyDiscountType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyDiscountType onError", error);
			},
		});
		await execute({
			data: {
				discount_type_id: "test_discount_type_id",
				discount_type_name: "修改后的优惠类型",
				discount_type_code: "MODIFIED_DISCOUNT",
				discount_desc: "修改后的优惠描述",
				discount_rate: 0.9,
				discount_amount: 50.0,
				discount_type: "固定金额折扣",
				status: "启用",
				remark: "已修改的优惠类型",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除优惠类型", async () => {
		const { execute, data } = deleteDiscountType({
			onSuccess(data) {
				console.warn("deleteDiscountType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteDiscountType onError", error);
			},
		});
		await execute({
			data: {
				discount_type_id: "test_discount_type_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
