import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryAllOwnerAccountDetail, queryAllOwnerAccountList, addOwnerDetail, undoOwnerDetail } from "./owner-account";

describe("业主账户明细接口测试", () => {
	it("分页查询业主账户明细", async () => {
		const { execute, data } = queryAllOwnerAccountDetail({
			onSuccess(data) {
				console.warn("分页查询业主账户明细成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				acct_id: "312025051870320017",
			},
		});

		console.warn("查看分页数据", printFormat(data.value));
	});

	it("分页查询业主账户列表", async () => {
		const { execute, data } = queryAllOwnerAccountList({
			onSuccess(data) {
				console.warn("分页查询业主账户列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				name: "孙悟空",
				id_card: "111111111111111111",
				link: "13111011002",
				community_id: "2024022647620054",
			},
		});

		console.warn("查看账户列表分页数据", printFormat(data.value));
	});

	it("业主账户预存", async () => {
		const { execute, data } = addOwnerDetail({
			onSuccess(data) {
				console.warn("业主账户预存成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
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

		console.warn("查看预存结果", printFormat(data.value));
	});

	it("撤销预存", async () => {
		const { execute, data } = undoOwnerDetail({
			onSuccess(data) {
				console.warn("撤销预存成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				pre_detail_id: "12240897944722739200",
				remark: "撤销原因测试",
			},
		});

		console.warn("查看撤销预存结果", printFormat(data.value));
	});
});
