import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addInspectPoint,
	modifyInspectPoint,
	queryInspectPointList,
	deleteInspectPoint,
	querySelectableInspectPointList,
} from ".";

describe("j8/巡检点", () => {
	it("使用 addInspectPoint 接口 - 添加巡检点", async () => {
		const { execute, data } = addInspectPoint({
			onSuccess(data) {
				console.warn("添加巡检点成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加巡检点失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2024012252790005",
				inspectionName: "消防栓检查点",
				itemId: "102024022168537630",
				pointObjId: "obj001",
				pointObjName: "1号楼东侧",
				pointObjType: "2002",
				nfcCode: "NFC001",
				remark: "重要消防设施",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectPoint 接口 - 修改巡检点信息", async () => {
		const { execute, data } = modifyInspectPoint({
			onSuccess(data) {
				console.warn("修改巡检点信息成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检点信息失败", printFormat(error));
			},
		});

		await execute({
			data: {
				inspectionId: "132025051426620000",
				inspectionName: "库房安全检查点",
				itemName: "电气设备",
				nfcCode: "NFC002",
				pointObjName: "地下室库房",
				pointType: "设备巡检",
				remark: "定期检查电气安全",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectPointList 接口 - 获取巡检点列表", async () => {
		const { execute, data } = queryInspectPointList({
			onSuccess(data) {
				console.warn("获取巡检点列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检点列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				inspectionName: "消防",
				pointTypeName: "环境巡检",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectPoint 接口 - 删除巡检点", async () => {
		const { execute, data } = deleteInspectPoint({
			onSuccess(data) {
				console.warn("删除巡检点成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检点失败", printFormat(error));
			},
		});

		await execute({
			params: {
				inspectionId: "132025051426620000",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 querySelectableInspectPointList 接口 - 获取可选巡检点列表", async () => {
		const { execute, data } = querySelectableInspectPointList({
			onSuccess(data) {
				console.warn("获取可选巡检点列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取可选巡检点列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				inspectionName: "库房",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
