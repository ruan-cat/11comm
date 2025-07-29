import { describe, it } from "vitest";
import { printFormat } from "@/utils/print";
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
	it("使用 addShiftSetting 接口 - 添加新的班次信息", () => {
		const { execute, data } = addShiftSetting({
			onError: (error) => console.warn("addShiftSetting 接口请求失败:", error),
		});

		execute({
			data: {
				name: "早班1",
				remark: "早班加点油",
				workTime: ["4:30~11:30"],
			},
		});

		console.warn("addShiftSetting 接口响应数据:", printFormat(data));
	});

	it("使用 modifyShiftInfo 接口 - 修改班次信息", () => {
		const { execute, data } = modifyShiftInfo({
			onError: (error) => console.warn("modifyShiftInfo 接口请求失败:", error),
		});

		execute({
			data: {
				classesId: "test-class-id",
				name: "修改后早班",
				remark: "修改后备注",
				workTime: ["5:00~12:00"],
			},
		});

		console.warn("modifyShiftInfo 接口响应数据:", printFormat(data));
	});

	it("使用 listShiftSetting 接口 - 获取班次列表", () => {
		const { execute, data } = listShiftSetting({
			onError: (error) => console.warn("listShiftSetting 接口请求失败:", error),
		});

		execute({
			params: {
				name: "早班",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("listShiftSetting 接口响应数据:", printFormat(data));
	});

	it("使用 getShiftNameList 接口 - 获取所有班次的名称列表", () => {
		const { execute, data } = getShiftNameList({
			onError: (error) => console.warn("getShiftNameList 接口请求失败:", error),
		});

		execute({
			params: {},
		});

		console.warn("getShiftNameList 接口响应数据:", printFormat(data));
	});

	it("使用 getShiftInfo 接口 - 获取指定班次的详细信息", () => {
		const { execute, data } = getShiftInfo({
			onError: (error) => console.warn("getShiftInfo 接口请求失败:", error),
		});

		execute({
			params: {
				classesId: "test-class-id",
			},
		});

		console.warn("getShiftInfo 接口响应数据:", printFormat(data));
	});

	it("使用 modifyShiftStatus 接口 - 修改班次的状态", () => {
		const { execute, data } = modifyShiftStatus({
			onError: (error) => console.warn("modifyShiftStatus 接口请求失败:", error),
		});

		execute({
			url: "/j4-orgmanager/shiftSetting/test-class-id",
		});

		console.warn("modifyShiftStatus 接口响应数据:", printFormat(data));
	});

	it("使用 deleteShift 接口 - 删除指定的班次", () => {
		const { execute, data } = deleteShift({
			onError: (error) => console.warn("deleteShift 接口请求失败:", error),
		});

		execute({
			data: {
				classesId: "test-class-id",
			},
		});

		console.warn("deleteShift 接口响应数据:", printFormat(data));
	});
});
