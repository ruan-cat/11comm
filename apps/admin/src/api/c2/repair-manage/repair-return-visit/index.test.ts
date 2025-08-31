import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryRepairReturn, queryRepairReturnComm, addRepairReturn, addRepairReturnComm } from "./index";

describe("c2/报修管理/报修回访", () => {
	it("使用 query 接口 - 获取回访单列表", async () => {
		const { execute, data } = queryRepairReturn({
			onSuccess(data) {
				console.warn("queryRepairReturn onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryRepairReturn onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022647620054",
				repair_id: "822024022794890018",
				repair_type: "102024021885971825",
				repair_name: "张三",
				tel: "18909711442",
				state: "11000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取回访单列表 (comm-)", async () => {
		const { execute, data } = queryRepairReturnComm({
			onSuccess(data) {
				console.warn("queryRepairReturnComm onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryRepairReturnComm onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022647620054",
				repair_id: "822024022794890018",
				repair_type: "102024021885971825",
				repair_name: "张三",
				tel: "18909711442",
				state: "11000",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加一条报修回访反馈数据", async () => {
		const { execute, data } = addRepairReturn({
			onSuccess(data) {
				console.warn("addRepairReturn onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addRepairReturn onError", error);
			},
		});
		await execute({
			data: {
				community_id: "2024022647620054",
				repair_id: "822025060191700286",
				visit_type: "1001",
				context: "good",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加一条报修回访反馈数据 (comm-)", async () => {
		const { execute, data } = addRepairReturnComm({
			onSuccess(data) {
				console.warn("addRepairReturnComm onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addRepairReturnComm onError", error);
			},
		});
		await execute({
			data: {
				community_id: "2024022647620054",
				repair_id: "822025060191700286",
				visit_type: "1001",
				context: "excellent service",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
