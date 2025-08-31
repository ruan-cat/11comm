import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	addShiftSetting,
	modifyShiftInfo,
	listShiftSetting,
	getShiftNameList,
	getShiftInfo,
	modifyShiftStatus,
	deleteShift,
} from "./index";

describe("j4/班次设置管理", () => {
	it("使用 addShiftSetting 接口 - 添加新的班次信息", async () => {
		const { execute, data } = addShiftSetting({
			onSuccess(data) {
				console.warn("addShiftSetting onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addShiftSetting onError", error);
			},
		});
		await execute({
			data: {
				name: "早班1",
				remark: "早班加点油",
				workTime: ["4:30~11:30"],
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 modifyShiftInfo 接口 - 修改班次信息", async () => {
		const { execute, data } = modifyShiftInfo({
			onSuccess(data) {
				console.warn("modifyShiftInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyShiftInfo onError", error);
			},
		});
		await execute({
			data: {
				classesId: "test-class-id",
				name: "修改后早班",
				remark: "修改后备注",
				workTime: ["5:00~12:00"],
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 listShiftSetting 接口 - 获取班次列表", async () => {
		const { execute, data } = listShiftSetting({
			onSuccess(data) {
				console.warn("listShiftSetting onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("listShiftSetting onError", error);
			},
		});
		await execute({
			params: {
				name: "早班",
				pageIndex: 1,
				pageSize: 10,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getShiftNameList 接口 - 获取所有班次的名称列表", async () => {
		const { execute, data } = getShiftNameList({
			onSuccess(data) {
				console.warn("getShiftNameList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getShiftNameList onError", error);
			},
		});
		await execute({
			params: {},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getShiftInfo 接口 - 获取指定班次的详细信息", async () => {
		const { execute, data } = getShiftInfo({
			onSuccess(data) {
				console.warn("getShiftInfo onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getShiftInfo onError", error);
			},
		});
		await execute({
			params: {
				classesId: "test-class-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 modifyShiftStatus 接口 - 修改班次的状态", async () => {
		const { execute, data } = modifyShiftStatus({
			onSuccess(data) {
				console.warn("modifyShiftStatus onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyShiftStatus onError", error);
			},
		});
		await execute({
			url: "/j4-orgmanager/shiftSetting/test-class-id",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 deleteShift 接口 - 删除指定的班次", async () => {
		const { execute, data } = deleteShift({
			onSuccess(data) {
				console.warn("deleteShift onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteShift onError", error);
			},
		});
		await execute({
			data: {
				classesId: "test-class-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
