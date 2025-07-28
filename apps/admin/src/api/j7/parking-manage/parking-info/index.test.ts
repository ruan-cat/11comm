import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	batchAddParkingSpaces,
	updateParkingInfo,
	getParkingInfoList,
	removeParkingSpace,
	saveParkingInfo,
} from "./index";

describe("j7/停车管理/车位信息", () => {
	it("使用 body 接口 - 批量添加车位", async () => {
		const { execute, data } = batchAddParkingSpaces({
			onSuccess(data) {
				console.warn("batchAddParkingSpaces onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("batchAddParkingSpaces onError", error);
			},
		});
		await execute({
			data: {
				endNumber: 9,
				numberPrefix: "A",
				paId: "102025051554120030",
				parkingType: "1",
				startNumber: 1,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改车位", async () => {
		const { execute, data } = updateParkingInfo({
			onSuccess(data) {
				console.warn("updateParkingInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("updateParkingInfo onError", error);
			},
		});
		await execute({
			data: {
				area: 25.5,
				communityId: "2024012252790005",
				num: "001",
				paId: "PA001",
				parkingType: "1",
				psId: "PS001",
				remark: "这是一个修改后的备注",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取车位列表（条件+分页）", async () => {
		const { execute, data } = getParkingInfoList({
			onSuccess(data) {
				console.warn("getParkingInfoList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getParkingInfoList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				num: "102025051554120038",
				paId: "1",
				psId: "792025052062720004",
				state: "S",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 path 接口 - 删除车位", async () => {
		const { execute, data } = removeParkingSpace({
			onSuccess(data) {
				console.warn("removeParkingSpace onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeParkingSpace onError", error);
			},
		});
		await execute({
			url: "/j7-park/park-manage/parking-info/remove/792025052062720004",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加车位", async () => {
		const { execute, data } = saveParkingInfo({
			onSuccess(data) {
				console.warn("saveParkingInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("saveParkingInfo onError", error);
			},
		});
		await execute({
			data: {
				area: 25.5,
				communityId: "2024012252790005",
				num: "002",
				paId: "PA001",
				parkingType: "1",
				psId: "PS002",
				remark: "这是一个新添加的车位",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
