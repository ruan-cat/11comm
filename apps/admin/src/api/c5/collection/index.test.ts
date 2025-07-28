import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getCollectionList, registerCollection, addCollection, deleteCollection, exportCollection } from "./index";

describe("c5/催缴管理", () => {
	it("使用 query 接口 - 获取催缴列表(条件+分页)", async () => {
		const { execute, data } = getCollectionList({
			onSuccess(data) {
				console.warn("getCollectionList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getCollectionList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				owner_name: "孙七",
				room_number: "5-5-501",
				collection_type: "电话催缴",
				collection_status: "已催缴",
				collection_start_time: "2024-01-01",
				collection_end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 催缴登记", async () => {
		const { execute, data } = registerCollection({
			onSuccess(data) {
				console.warn("registerCollection onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("registerCollection onError", error);
			},
		});
		await execute({
			data: {
				owner_name: "周八",
				owner_phone: "13800138002",
				room_number: "6-6-601",
				arrears_amount: 1500.0,
				collection_type: "电话催缴",
				collection_method: "电话通知",
				collection_content: "提醒缴纳2024年第一季度物业费",
				collection_remark: "业主表示本周内缴费",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 新增催缴", async () => {
		const { execute, data } = addCollection({
			onSuccess(data) {
				console.warn("addCollection onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addCollection onError", error);
			},
		});
		await execute({
			data: {
				owner_name: "吴九",
				owner_phone: "13800138003",
				room_number: "7-7-701",
				arrears_items: "物业费,停车费",
				arrears_amount: 2200.0,
				collection_method: "上门催缴",
				collection_content: "上门通知缴纳欠费",
				expected_payment_time: "2024-12-31",
				collection_remark: "需要安排上门时间",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除催缴", async () => {
		const { execute, data } = deleteCollection({
			onSuccess(data) {
				console.warn("deleteCollection onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteCollection onError", error);
			},
		});
		await execute({
			data: {
				collection_id: "collection_12345",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 导出催缴", async () => {
		const { execute, data } = exportCollection({
			onSuccess(data) {
				console.warn("exportCollection onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("exportCollection onError", error);
			},
		});
		await execute({
			params: {
				owner_name: "郑十",
				room_number: "8-8-801",
				collection_type: "短信催缴",
				collection_status: "待催缴",
				collection_start_time: "2024-01-01",
				collection_end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
