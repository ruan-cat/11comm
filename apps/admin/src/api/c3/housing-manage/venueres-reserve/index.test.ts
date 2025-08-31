import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { queryVenueReservations, addVenueReservation } from "./index";

describe("c3/场地预约管理", () => {
	it("使用 query 接口 - 获取场馆场地预约列表", async () => {
		const { execute, data } = queryVenueReservations({
			onSuccess(data) {
				console.warn("queryVenueReservations onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryVenueReservations onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				appointmentTime: "2024-03-20",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加场馆场地预约", async () => {
		const { execute, data } = addVenueReservation({
			onSuccess(data) {
				console.warn("addVenueReservation onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addVenueReservation onError", error);
			},
		});
		await execute({
			data: {
				spaceId: "102025052134500010",
				venueId: "102025052134500011",
				personName: "张三",
				personTel: "13800138000",
				appointmentDate: "2024-03-20",
				appointmentTime: "14:00",
				receivableAmount: 100,
				receivedAmount: 100,
				payWay: "1",
				state: "1",
				remark: "测试预约",
				venueName: "篮球场",
				spaceName: "1号场地",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
