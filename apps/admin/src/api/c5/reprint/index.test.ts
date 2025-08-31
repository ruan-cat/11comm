import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryReprintVoucherList, printReceipt, printTicket } from "./index";

describe("c5/补打凭据管理", () => {
	it("使用 query 接口 - 查询补打凭据列表(条件+分页)", async () => {
		const { execute, data } = queryReprintVoucherList({
			onSuccess(data) {
				console.warn("queryReprintVoucherList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryReprintVoucherList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				owner_name: "褚十三",
				room_number: "11-11-1101",
				voucher_type: "收据",
				payment_start_time: "2024-01-01",
				payment_end_time: "2024-12-31",
				voucher_status: "可补打",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 打印收据", async () => {
		const { execute, data } = printReceipt({
			onSuccess(data) {
				console.warn("printReceipt onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("printReceipt onError", error);
			},
		});
		await execute({
			data: {
				payment_record_id: "payment_12345",
				receipt_number: "SJ202412001",
				print_type: "补打收据",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 打印小票", async () => {
		const { execute, data } = printTicket({
			onSuccess(data) {
				console.warn("printTicket onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("printTicket onError", error);
			},
		});
		await execute({
			data: {
				payment_record_id: "payment_54321",
				ticket_number: "XP202412001",
				print_type: "补打小票",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
