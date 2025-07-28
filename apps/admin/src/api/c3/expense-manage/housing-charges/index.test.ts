import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addHouseFee,
	modifyHouseFee,
	deleteHouseFee,
	payHouseFee,
	queryHouseFeeList,
	getHouseFeeDetail,
	getHouseFeeItems,
	getPaymentRecords,
} from "./index";

describe("c3/房屋收费管理", () => {
	it("使用 query 接口 - 创建房屋费用", async () => {
		const { execute, data } = addHouseFee({
			onSuccess(data) {
				console.warn("addHouseFee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addHouseFee onError", error);
			},
		});
		await execute({
			params: {
				house_id: "001-001-01",
				fee_type: "物业费",
				charge_project: "房屋管理费",
				start_time: "2025-01-12",
				end_time: "2025-01-12",
				amount: 100,
				config_id: "92202305221013595234000152",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 变更房屋费用", async () => {
		const { execute, data } = modifyHouseFee({
			onSuccess(data) {
				console.warn("modifyHouseFee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyHouseFee onError", error);
			},
		});
		await execute({
			params: {
				fee_id: "12238832129789792256",
				create_time: "2025-05-21 00:00:00",
				start_time: "2025-05-21 23:59:55",
				end_time: "2025-05-21 23:59:59",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 取消房屋费用", async () => {
		const { execute, data } = deleteHouseFee({
			onSuccess(data) {
				console.warn("deleteHouseFee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteHouseFee onError", error);
			},
		});
		await execute({
			params: {
				fee_id: "902025052181251299",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 缴纳房屋费用", async () => {
		const { execute, data } = payHouseFee({
			onSuccess(data) {
				console.warn("payHouseFee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("payHouseFee onError", error);
			},
		});
		await execute({
			params: {
				fee_id: "902025052181251299",
				cycle: 1,
				real_cycle: 101,
				pay_fee_start_time: "2025-02-21",
				pay_fee_end_time: "2025-02-21",
				amount_due: 110,
				pay_amount: 110,
				amount: 110,
				remark: "这是一条备注",
				community_id: "752023063035460053",
				flag: true,
				account_type: "752023063035460053",
				account_name: "752023063035460053",
				account_amount: 110,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取房屋费用列表", async () => {
		const { execute, data } = queryHouseFeeList({
			onSuccess(data) {
				console.warn("queryHouseFeeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryHouseFeeList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "2024022692080516",
				roomNum: "01-1-1",
				status: "2008001",
				ownerNameLike: "kid",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取房屋费用详情", async () => {
		const { execute, data } = getHouseFeeDetail({
			onSuccess(data) {
				console.warn("getHouseFeeDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getHouseFeeDetail onError", error);
			},
		});
		await execute({
			params: {
				fee_id: "902025051980230067",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取房屋费用项信息", async () => {
		const { execute, data } = getHouseFeeItems({
			onSuccess(data) {
				console.warn("getHouseFeeItems onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getHouseFeeItems onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "2024022692080516",
				roomNum: "01-1-1",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取缴纳记录", async () => {
		const { execute, data } = getPaymentRecords({
			onSuccess(data) {
				console.warn("getPaymentRecords onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getPaymentRecords onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				detail_id: "912025053026800053",
				receipt_id: "ע",
				pay_obj: "1-1-101",
				cycle: 1,
				receive_received: "ϖ????????????",
				pay_path: "ϖ????????????",
				pay_period: "ϖ????????????",
				pay_time: "2025-05-30 08:42:39",
				receive_id: "YFίҵ",
				status_cd: "0",
				opt: "Y",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
