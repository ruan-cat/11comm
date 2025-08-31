import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addSpace,
	modifySpace,
	removeSpace,
	querySpaceList,
	querySpaceTime,
	modifySpaceTime,
	queryVenueList,
	addVenue,
	modifyVenue,
	deleteVenue,
} from "./index";

describe("c3/场地管理", () => {
	it("使用 body 接口 - 添加场地", async () => {
		const { execute, data } = addSpace({
			onSuccess(data) {
				console.warn("addSpace onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addSpace onError", error);
			},
		});
		await execute({
			data: {
				name: "测试场地",
				feeMoney: 100,
				adminName: "张三",
				tel: "13800138000",
				state: "1",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改场地", async () => {
		const { execute, data } = modifySpace({
			onSuccess(data) {
				console.warn("modifySpace onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifySpace onError", error);
			},
		});
		await execute({
			data: {
				spaceId: "123",
				name: "修改后的场地",
				feeMoney: 200,
				adminName: "李四",
				tel: "13900139000",
				state: "1",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除场地", async () => {
		const { execute, data } = removeSpace({
			onSuccess(data) {
				console.warn("removeSpace onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeSpace onError", error);
			},
		});
		await execute({
			data: ["123", "456"],
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取场地列表", async () => {
		const { execute, data } = querySpaceList({
			onSuccess(data) {
				console.warn("querySpaceList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("querySpaceList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				space_id: "102025052134500010",
				name: "食堂",
				state: "1001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取场地开放时间", async () => {
		const { execute, data } = querySpaceTime({
			onSuccess(data) {
				console.warn("querySpaceTime onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("querySpaceTime onError", error);
			},
		});
		await execute({
			params: {
				space_id: "102025052134500010",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改场地开放时间", async () => {
		const { execute, data } = modifySpaceTime({
			onSuccess(data) {
				console.warn("modifySpaceTime onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifySpaceTime onError", error);
			},
		});
		await execute({
			data: {
				space_id: "102025052134500010",
				hours: 9,
				is_open: "1",
				time_id: "123",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取场馆列表", async () => {
		const { execute, data } = queryVenueList({
			onSuccess(data) {
				console.warn("queryVenueList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryVenueList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				name: "篮球场",
				id: "d934050a8bb373e8f8eed0bf7507ec17",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 新增场馆", async () => {
		const { execute, data } = addVenue({
			onSuccess(data) {
				console.warn("addVenue onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addVenue onError", error);
			},
		});
		await execute({
			data: {
				name: "篮球场",
				remark: "室内篮球场",
				startTime: "08:00",
				endTime: "22:00",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改场馆", async () => {
		const { execute, data } = modifyVenue({
			onSuccess(data) {
				console.warn("modifyVenue onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyVenue onError", error);
			},
		});
		await execute({
			data: {
				name: "修改后的篮球场",
				remark: "室外篮球场",
				startTime: "06:00",
				endTime: "23:00",
				venueId: "123",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除场馆", async () => {
		const { execute, data } = deleteVenue({
			onSuccess(data) {
				console.warn("deleteVenue onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteVenue onError", error);
			},
		});
		await execute({
			data: ["123", "456"],
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
