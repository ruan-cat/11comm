import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryForceBackList, modifyForceBack } from "./mandatory-return-order";

describe("强制回单接口测试", () => {
	it("分页查询强制回单列表", async () => {
		const { execute, data } = queryForceBackList({
			onSuccess(data) {
				console.warn("分页查询强制回单列表成功", printFormat(data));
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
				repair_type: "102024021885971825",
				repair_name: "张三",
				tel: "18909711442",
			},
		});

		console.warn("查看强制回单分页数据", printFormat(data.value));
	});

	it("强制回单操作", async () => {
		const { execute, data } = modifyForceBack({
			onSuccess(data) {
				console.warn("强制回单操作成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_id: "822024022794890018",
				maintenance_type: "1003",
				materials: [
					{
						res_id: "852025060109790015",
						material_name: "电池",
						material_count: 1,
						material_unit: "个",
						material_specification: "1000mAh",
						material_price: 10,
					},
				],
				repair_fee: "10",
				pay_type: "现金",
				context: "提交订单",
			},
		});

		console.warn("查看强制回单操作结果", printFormat(data.value));
	});
});
