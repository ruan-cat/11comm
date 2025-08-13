import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getRepairDoneList, getRepairDoneListComm } from "./index";

describe("c2/报修管理/报修已办", () => {
	it("使用 query 接口 - 获取报修已办单列表", async () => {
		const { execute, data } = getRepairDoneList({
			onSuccess(data) {
				console.warn("getRepairDoneList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getRepairDoneList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022647620054",
				maintenance_type: "1001",
				repair_name: "张三",
				tel: "18909711442",
				repair_type: "102024021885971825",
				state: "1000",
				repair_id: "822024022794890018",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取报修已办单列表 (comm-前缀)", async () => {
		const { execute, data } = getRepairDoneListComm({
			onSuccess(data) {
				console.warn("getRepairDoneListComm onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getRepairDoneListComm onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022647620054",
				maintenance_type: "1002",
				repair_name: "李四",
				tel: "13800138000",
				repair_type: "102024022016205365",
				state: "1900",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取报修已办单列表（无偿服务）", async () => {
		const { execute, data } = getRepairDoneList({
			onSuccess(data) {
				console.warn("getRepairDoneList 无偿服务 onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getRepairDoneList 无偿服务 onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 5,
				community_id: "2024022647620054",
				maintenance_type: "1002",
				state: "1900",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 按工单编码搜索", async () => {
		const { execute, data } = getRepairDoneListComm({
			onSuccess(data) {
				console.warn("按工单编码搜索 onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("按工单编码搜索 onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022647620054",
				repair_id: "822024022794890018",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
