import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryAllRepairHavedone } from "./repair-havedone";

describe("报修已办接口测试", () => {
	it("分页查询报修已办数据", async () => {
		const { execute, data } = queryAllRepairHavedone({
			onSuccess(data) {
				console.warn("分页查询报修已办数据成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				maintenance_type: "1001",
				repair_name: "张三",
				tel: "18909711442",
				repair_type: "102024021885971825",
				state: "1000",
			},
		});
		console.warn("分页查询报修已办数据:", printFormat(data));
	});
});
