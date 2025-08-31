import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getArrearsList, exportArrearsList } from "./index";

describe("c5/欠费管理", () => {
	it("使用 query 接口 - 获取欠费列表(条件+分页)", async () => {
		const { execute, data } = getArrearsList({
			onSuccess(data) {
				console.warn("getArrearsList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getArrearsList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				owner_name: "张三",
				room_number: "1-1-101",
				arrears_type: "物业费",
				arrears_status: "未缴费",
				arrears_start_time: "2024-01-01",
				arrears_end_time: "2024-12-31",
				min_arrears_amount: 100.0,
				max_arrears_amount: 5000.0,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 导出欠费列表", async () => {
		const { execute, data } = exportArrearsList({
			onSuccess(data) {
				console.warn("exportArrearsList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("exportArrearsList onError", error);
			},
		});
		await execute({
			params: {
				owner_name: "李四",
				room_number: "2-2-201",
				arrears_type: "停车费",
				arrears_status: "逾期未缴",
				arrears_start_time: "2024-01-01",
				arrears_end_time: "2024-12-31",
				min_arrears_amount: 200.0,
				max_arrears_amount: 3000.0,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
