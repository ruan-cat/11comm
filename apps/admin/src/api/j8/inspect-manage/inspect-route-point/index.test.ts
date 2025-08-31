import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import { addInspectRoutePoint, modifyInspectRoutePoint, deleteInspectRoutePoint } from ".";

describe("j8/巡检路线巡检点", () => {
	it("使用 addInspectRoutePoint 接口 - 新增巡检路线巡检点", async () => {
		const { execute, data } = addInspectRoutePoint({
			onSuccess(data) {
				console.warn("新增巡检路线巡检点成功", printFormat(data));
			},
			onError(error) {
				console.warn("新增巡检路线巡检点失败", printFormat(error));
			},
		});

		await execute({
			data: [
				{
					inspectionId: "132025051679800030",
					inspectionRouteId: "502025052939550000",
					statusCd: "0",
				},
				{
					inspectionId: "132025051679800031",
					inspectionRouteId: "502025052939550000",
					statusCd: "0",
				},
			],
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectRoutePoint 接口 - 修改巡检路线巡检点", async () => {
		const { execute, data } = modifyInspectRoutePoint({
			onSuccess(data) {
				console.warn("修改巡检路线巡检点成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检路线巡检点失败", printFormat(error));
			},
		});

		await execute({
			data: {
				inspectionId: "132025051679800030",
				inspectionRouteId: "502025052939550000",
				pointStartTime: "06:30",
				pointEndTime: "12:30",
				sortNumber: "1",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectRoutePoint 接口 - 删除巡检路线巡检点", async () => {
		const { execute, data } = deleteInspectRoutePoint({
			onSuccess(data) {
				console.warn("删除巡检路线巡检点成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检路线巡检点失败", printFormat(error));
			},
		});

		await execute({
			params: {
				inspectionId: "132025051679800029",
				inspectionRouteId: "502025052939550002",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
