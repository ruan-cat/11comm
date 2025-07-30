import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addInspectRoute,
	modifyInspectRoute,
	queryInspectRouteNameList,
	queryInspectRouteList,
	queryInspectRoutePointList,
	deleteInspectRoute,
} from ".";

describe("j8/巡检路线", () => {
	it("使用 addInspectRoute 接口 - 添加巡检路线", async () => {
		const { execute, data } = addInspectRoute({
			onSuccess(data) {
				console.warn("添加巡检路线成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加巡检路线失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2025041251140067",
				routeName: "黄利路",
				seq: "1",
				remark: "需要仔细巡检，早晚各一次",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectRoute 接口 - 修改巡检路线", async () => {
		const { execute, data } = modifyInspectRoute({
			onSuccess(data) {
				console.warn("修改巡检路线成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检路线失败", printFormat(error));
			},
		});

		await execute({
			data: {
				inspectionRouteId: "502024021607110700",
				routeName: "修改后的路线名",
				seq: "2",
				remark: "修改后的备注",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectRouteNameList 接口 - 获取巡检路线名称列表", async () => {
		const { execute, data } = queryInspectRouteNameList({
			onSuccess(data) {
				console.warn("获取巡检路线名称列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检路线名称列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2024022647620054",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectRouteList 接口 - 获取巡检路线列表", async () => {
		const { execute, data } = queryInspectRouteList({
			onSuccess(data) {
				console.warn("获取巡检路线列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检路线列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2024022647620054",
				pageIndex: 1,
				pageSize: 10,
				routeName: "沈工大路线",
				seq: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectRoutePointList 接口 - 获取巡检路线巡检点列表", async () => {
		const { execute, data } = queryInspectRoutePointList({
			onSuccess(data) {
				console.warn("获取巡检路线巡检点列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检路线巡检点列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2024022647620054",
				inspectionRouteId: "502024021607110704",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectRoute 接口 - 删除巡检路线", async () => {
		const { execute, data } = deleteInspectRoute({
			onSuccess(data) {
				console.warn("删除巡检路线成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检路线失败", printFormat(error));
			},
		});

		await execute({
			params: {
				inspectionRouteId: "502024021607110700",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
