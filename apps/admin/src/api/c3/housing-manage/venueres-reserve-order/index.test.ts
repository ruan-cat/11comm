import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryOrderList, removeOrder } from "./index";

describe("c3/场地预约单管理", () => {
	it("使用 query 接口 - 获取预约订单列表（条件+分页）", async () => {
		const { execute, data } = queryOrderList({
			onSuccess(data) {
				console.warn("queryOrderList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryOrderList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "2024022692080516",
				spaceId: "102025051649290124",
				state: "S",
				personName: "张三",
				personTel: "12345678910",
				appointmentTime: "2025-05-21 23:59:59",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 取消预约", async () => {
		const { execute, data } = removeOrder({
			onSuccess(data) {
				console.warn("removeOrder onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeOrder onError", error);
			},
		});
		await execute({
			data: {
				cspId: "202501260001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
