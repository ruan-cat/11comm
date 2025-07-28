import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { insertParkingLot, listParkingLots, listParkingAreaName, removeParkingLot, updateParkingLot } from "./index";

describe("j7/停车管理/停车场管理", () => {
	it("使用 body 接口 - 添加停车场", async () => {
		const { execute, data } = insertParkingLot({
			onSuccess(data) {
				console.warn("insertParkingLot onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("insertParkingLot onError", error);
			},
		});
		await execute({
			data: {
				communityId: "2024012252790005",
				num: "56",
				out_num: "1",
				remark: "地下停车场",
				type: "1001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取停车场列表（条件+分页）", async () => {
		const { execute, data } = listParkingLots({
			onSuccess(data) {
				console.warn("listParkingLots onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("listParkingLots onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				num: "1",
				type_cd: "1001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 获取停车场名称列表", async () => {
		const { execute, data } = listParkingAreaName({
			onSuccess(data) {
				console.warn("listParkingAreaName onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("listParkingAreaName onError", error);
			},
		});
		await execute({
			data: {
				communityId: "2024012252790005",
				statusCd: "1",
				typeCd: "1001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除停车场", async () => {
		const { execute, data } = removeParkingLot({
			onSuccess(data) {
				console.warn("removeParkingLot onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeParkingLot onError", error);
			},
		});
		await execute({
			params: {
				paId: "102023031146610004",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改停车场", async () => {
		const { execute, data } = updateParkingLot({
			onSuccess(data) {
				console.warn("updateParkingLot onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateParkingLot onError", error);
			},
		});
		await execute({
			data: {
				num: "56",
				out_num: "1",
				pa_id: "102025051959481440",
				remark: "修改后的停车场备注",
				type: "1002",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
