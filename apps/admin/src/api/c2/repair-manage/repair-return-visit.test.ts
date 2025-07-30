import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryRepairReturn, addRepairReturn } from "./repair-return-visit";

describe("报修回访接口测试", () => {
	it("分页查询报修回访数据", async () => {
		const { execute, data } = queryRepairReturn({
			onSuccess(data) {
				console.warn("分页查询报修回访数据成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
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

		console.warn("分页查询报修回访数据:", printFormat(data.value));
	});

	it("添加报修回访反馈", async () => {
		const { execute, data } = addRepairReturn({
			onSuccess(data) {
				console.warn("添加报修回访反馈成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
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

		console.warn("添加报修回访反馈结果:", printFormat(data.value));
	});
});
