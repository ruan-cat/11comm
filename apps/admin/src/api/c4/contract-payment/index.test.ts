import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryContractPayment,
	addContractPayment,
	modifyContractPayment,
	removeContractPayment,
	chargeContractPayment,
	queryContractPaymentRecord,
	queryContractPaymentRecordDetail,
} from "./index";

describe("c4/合同费用管理", () => {
	it("使用 query 接口 - 获取合同费用列表", async () => {
		const { execute, data } = queryContractPayment({
			onSuccess(data) {
				console.warn("queryContractPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryContractPayment onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				payer_obj_id: "test_contract_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 创建合同费用", async () => {
		const { execute, data } = addContractPayment({
			onSuccess(data) {
				console.warn("addContractPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addContractPayment onError", error);
			},
		});
		await execute({
			data: {
				payer_obj_id: "test_contract_id",
				fee_name: "物业管理费",
				fee_flag: "PROPERTY",
				fee_type_cd: "MONTHLY",
				additional_amount: 1200.0,
				create_time: "2024-01-01",
				start_time: "2024-01-01",
				end_time: "2024-12-31",
				square_price: 2.5,
				state: "有效",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 更改合同费用", async () => {
		const { execute, data } = modifyContractPayment({
			onSuccess(data) {
				console.warn("modifyContractPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyContractPayment onError", error);
			},
		});
		await execute({
			data: {
				fee_id: "test_fee_id",
				start_time: "2024-02-01",
				end_time: "2024-12-31",
				create_time: "2024-01-15",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 取消合同费用", async () => {
		const { execute, data } = removeContractPayment({
			onSuccess(data) {
				console.warn("removeContractPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeContractPayment onError", error);
			},
		});
		await execute({
			data: {
				fee_id: "test_fee_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 缴纳合同费用", async () => {
		const { execute, data } = chargeContractPayment({
			onSuccess(data) {
				console.warn("chargeContractPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("chargeContractPayment onError", error);
			},
		});
		await execute({
			data: {
				feeid: "test_fee_id",
				chargecycle: "月付",
				remark: "正常缴费",
				receivable: "1200.00",
				chargeway: "银行转账",
				received: "1200.00",
				cashier: "收银员张三",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 合同缴费记录分页查询", async () => {
		const { execute, data } = queryContractPaymentRecord({
			onSuccess(data) {
				console.warn("queryContractPaymentRecord onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryContractPaymentRecord onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				payer_obj_id: "test_contract_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取合同费用记录详情", async () => {
		const { execute, data } = queryContractPaymentRecordDetail({
			onSuccess(data) {
				console.warn("queryContractPaymentRecordDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryContractPaymentRecordDetail onError", error);
			},
		});
		await execute({
			params: {
				id: "test_record_id",
				"cost-id": "test_cost_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
