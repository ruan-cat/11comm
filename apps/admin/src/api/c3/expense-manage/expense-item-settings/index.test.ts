import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryChargeItemList,
	queryFeeItemList,
	queryFeeItemLog,
	addFeeItem,
	modifyFeeItem,
	deleteFeeItem,
	queryDiscountList,
	addDiscount,
	deleteDiscount,
	getFeeItemInfo,
} from "./index";

describe("c3/费用项设置管理", () => {
	it("使用 query 接口 - 获取费用项名称列表", async () => {
		const { execute, data } = queryChargeItemList({
			onSuccess(data) {
				console.warn("queryChargeItemList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryChargeItemList onError", error);
			},
		});
		await execute({
			params: {
				community_id: "922025052064590009",
				feeType: "888800010012",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取费用项列表", async () => {
		const { execute, data } = queryFeeItemList({
			onSuccess(data) {
				console.warn("queryFeeItemList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryFeeItemList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "922025052064590009",
				fee_type_cd: "888800010012",
				feeId: "922025052064590009",
				chargeItem: "物业费",
				fee_flag: "2006012",
				payment_cd: "1200",
				deduct_from: "1",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取费用项修改记录", async () => {
		const { execute, data } = queryFeeItemLog({
			onSuccess(data) {
				console.warn("queryFeeItemLog onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryFeeItemLog onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				config_id: "d934050a8bb373e8f8eed0bf7507ec17",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加费用项", async () => {
		const { execute, data } = addFeeItem({
			onSuccess(data) {
				console.warn("addFeeItem onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addFeeItem onError", error);
			},
		});
		await execute({
			data: {
				fee_type_cd: "888800010012",
				fee_flag: "2006012",
				payment_cycle: "1",
				fee_name: "物业费",
				payment_cd: "1200",
				prepayment_period: "1",
				start_time: "2024-03-20",
				end_time: "2024-12-31",
				units: "元/月",
				deduct_from: "1",
				pay_online: "1",
				scale: "1",
				decimal_place: 2,
				computing_formula: "面积*单价",
				square_price: "3.5",
				additional_amount: "0",
				community_id: "922025052064590009",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改费用项", async () => {
		const { execute, data } = modifyFeeItem({
			onSuccess(data) {
				console.warn("modifyFeeItem onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyFeeItem onError", error);
			},
		});
		await execute({
			data: {
				fee_type_cd: "888800010012",
				fee_flag: "2006012",
				payment_cycle: "1",
				fee_name: "修改后的物业费",
				payment_cd: "1200",
				prepayment_period: "1",
				start_time: "2024-03-20",
				end_time: "2024-12-31",
				units: "元/月",
				deduct_from: "1",
				pay_online: "1",
				scale: "1",
				decimal_place: 2,
				computing_formula: "面积*单价",
				square_price: "4.0",
				additional_amount: "0",
				community_id: "922025052064590009",
				config_id: "d934050a8bb373e8f8eed0bf7507ec17",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除费用项", async () => {
		const { execute, data } = deleteFeeItem({
			onSuccess(data) {
				console.warn("deleteFeeItem onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteFeeItem onError", error);
			},
		});
		await execute({
			data: {
				config_id: "d934050a8bb373e8f8eed0bf7507ec17",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取折扣信息", async () => {
		const { execute, data } = queryDiscountList({
			onSuccess(data) {
				console.warn("queryDiscountList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryDiscountList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				discount_name: "testBewater",
				discount_rule: "test",
				discount_type: "weiyue",
				start_time: "2024.1",
				end_time: "2025.2",
				discount_end_time: "2025.3",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加折扣", async () => {
		const { execute, data } = addDiscount({
			onSuccess(data) {
				console.warn("addDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addDiscount onError", error);
			},
		});
		await execute({
			data: {
				discount_type: "weiyue",
				discount_name: "testBewater",
				start_time: "2024.1",
				end_time: "2025.2",
				discount_end_time: "2025.3",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除折扣", async () => {
		const { execute, data } = deleteDiscount({
			onSuccess(data) {
				console.warn("deleteDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteDiscount onError", error);
			},
		});
		await execute({
			data: {
				discount_id: "d934050a8bb373e8f8eed0bf7507ec17",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 获取费用项基础信息", async () => {
		const { execute, data } = getFeeItemInfo({
			onSuccess(data) {
				console.warn("getFeeItemInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getFeeItemInfo onError", error);
			},
		});
		await execute({
			data: {
				fee_id: "922025052064590009",
				fee_type: "888800010012",
				fee_project: "物业费",
				fee_flag: "2006012",
				urge_type: "1",
				pay_type: "1200",
				pay_cycle: "1",
				valid_time: "2024-03-20",
				pay_formula: "面积*单价",
				pay_price: "3.5",
				pay_extra: "0",
				account_deduction: "1",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
