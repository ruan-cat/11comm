import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	queryOwnerAccountDetailList,
	queryOwnerAccountList,
	addOwnerDetail,
	undoOwnerDetail,
	getOwnerNameByPhone,
} from ".";

describe("c2/房屋管理/业主账户", () => {
	it("使用 queryOwnerAccountDetailList 接口 - 获取业主账户明细列表", async () => {
		const { execute, data } = queryOwnerAccountDetailList({
			onSuccess(data) {
				console.warn("获取业主账户明细列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取业主账户明细列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				acct_id: "312025051870320017",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryOwnerAccountList 接口 - 获取业主账户列表", async () => {
		const { execute, data } = queryOwnerAccountList({
			onSuccess(data) {
				console.warn("获取业主账户列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取业主账户列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022647620054",
				name: "孙悟空",
				id_card: "111111111111111111",
				link: "13111011002",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 addOwnerDetail 接口 - 业主账户预存", async () => {
		const { execute, data } = addOwnerDetail({
			onSuccess(data) {
				console.warn("业主账户预存成功", printFormat(data));
			},
			onError(error) {
				console.warn("业主账户预存失败", printFormat(error));
			},
		});

		await execute({
			data: {
				link: "13111011002",
				owner_name: "张三",
				receivable_amount: 1000,
				prime_rate: "1",
				obj_type: "6006",
				remark: "预存测试",
				community_id: "2024022647620054",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 undoOwnerDetail 接口 - 撤销预存", async () => {
		const { execute, data } = undoOwnerDetail({
			onSuccess(data) {
				console.warn("撤销预存成功", printFormat(data));
			},
			onError(error) {
				console.warn("撤销预存失败", printFormat(error));
			},
		});

		await execute({
			data: {
				pre_detail_id: "12240897944722739200",
				remark: "撤销原因测试",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 getOwnerNameByPhone 接口 - 根据手机号获取业主名称", async () => {
		const { execute, data } = getOwnerNameByPhone({
			onSuccess(data) {
				console.warn("根据手机号获取业主名称成功", printFormat(data));
			},
			onError(error) {
				console.warn("根据手机号获取业主名称失败", printFormat(error));
			},
		});

		await execute({
			params: {
				link: "13111011002",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
