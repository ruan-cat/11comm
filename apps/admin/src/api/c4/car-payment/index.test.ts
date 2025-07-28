import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryCarPayment,
	addCarPayment,
	modifyCarPayment,
	removeCarPayment,
	payCarPayment,
	queryVehicleFeeDetail,
	queryPaymentRecords,
	queryPaymentDetailedRecord,
	queryModificationRecords,
} from "./index";

describe("c4/车辆费用管理", () => {
	it("使用 query 接口 - 获取车辆费用", async () => {
		const { execute, data } = queryCarPayment({
			onSuccess(data) {
				console.warn("queryCarPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryCarPayment onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				payer_obj_id: "test_payer_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 创建车辆费用", async () => {
		const { execute, data } = addCarPayment({
			onSuccess(data) {
				console.warn("addCarPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addCarPayment onError", error);
			},
		});
		await execute({
			data: {
				car_name: "京A12345",
				fee_type: "停车费",
				fee_name: "月度停车费",
				fee_flag: "PARKING",
				create_time: "2024-01-01",
				amount: 200.0,
				pay_type: "月付",
				pay_cycle: "月",
				start_time: "2024-01-01",
				end_time: "2024-01-31",
				payer_obj_id: "test_payer_id",
				owner_name: "张三",
				payer_obj_name: "1-101",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 变更车辆费用", async () => {
		const { execute, data } = modifyCarPayment({
			onSuccess(data) {
				console.warn("modifyCarPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyCarPayment onError", error);
			},
		});
		await execute({
			data: {
				fee_id: "test_fee_id",
				car_name: "京A12345",
				fee_type: "停车费",
				fee_name: "月度停车费（修改）",
				amount: 250.0,
				start_time: "2024-01-01",
				end_time: "2024-01-31",
				text: "费用已调整",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除车辆费用", async () => {
		const { execute, data } = removeCarPayment({
			onSuccess(data) {
				console.warn("removeCarPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeCarPayment onError", error);
			},
		});
		await execute({
			data: {
				fee_id: "test_fee_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 缴纳车辆费用", async () => {
		const { execute, data } = payCarPayment({
			onSuccess(data) {
				console.warn("payCarPayment onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("payCarPayment onError", error);
			},
		});
		await execute({
			data: {
				fee_id: "test_fee_id",
				act_pay: 250.0,
				pay_way: "现金",
				status: "已缴费",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取车辆费用详情", async () => {
		const { execute, data } = queryVehicleFeeDetail({
			onSuccess(data) {
				console.warn("queryVehicleFeeDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryVehicleFeeDetail onError", error);
			},
		});
		await execute({
			params: {
				fee_id: "902025052512670021",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取缴费记录", async () => {
		const { execute, data } = queryPaymentRecords({
			onSuccess(data) {
				console.warn("queryPaymentRecords onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryPaymentRecords onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				fee_name: "parking fee",
				value: "value",
				creat_time: "2025-05-04 00:00:00",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取缴费明细记录", async () => {
		const { execute, data } = queryPaymentDetailedRecord({
			onSuccess(data) {
				console.warn("queryPaymentDetailedRecord onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryPaymentDetailedRecord onError", error);
			},
		});
		await execute({
			params: {
				detail_id: "902025052512670021",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取费用修改记录", async () => {
		const { execute, data } = queryModificationRecords({
			onSuccess(data) {
				console.warn("queryModificationRecords onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryModificationRecords onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				fee_name: "parking fee",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
