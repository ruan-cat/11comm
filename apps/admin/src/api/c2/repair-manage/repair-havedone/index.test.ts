import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryAllRepairHavedone, queryAllRepairHavedoneComm } from "./index";

describe("报修已办接口测试", () => {
	it("获取报修已办单列表", async () => {
		const { execute, data } = queryAllRepairHavedone({
			onSuccess(data) {
				console.warn("获取报修已办单列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
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
		console.warn("获取报修已办单列表:", printFormat(data));
	});

	it("获取报修已办单列表 (comm-)", async () => {
		const { execute, data } = queryAllRepairHavedoneComm({
			onSuccess(data) {
				console.warn("获取报修已办单列表 (comm-) 成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
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
		console.warn("获取报修已办单列表 (comm-):", printFormat(data));
	});
});
