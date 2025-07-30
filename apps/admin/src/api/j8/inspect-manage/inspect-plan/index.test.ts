import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addInspectPlan,
	modifyInspectPlan,
	modifyInspectPlanState,
	queryInspectPlanDetail,
	queryInspectPlanList,
	deleteInspectPlan,
} from ".";

describe("j8/巡检计划", () => {
	it("使用 addInspectPlan 接口 - 添加巡检计划", async () => {
		const { execute, data } = addInspectPlan({
			onSuccess(data) {
				console.warn("添加巡检计划成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加巡检计划失败", printFormat(error));
			},
		});

		await execute({
			data: {
				beforeTime: "30",
				canReexamine: "2000",
				communityId: "123456",
				createUserId: "1001",
				createUserName: "管理员",
				endDate: "2025-12-31",
				endTime: "18:00",
				inspectionDay: "1",
				inspectionMonth: "1",
				inspectionPlanName: "消防安全巡检计划",
				inspectionPlanPeriod: "月",
				inspectionRouteId: "route001",
				inspectionWorkday: "1",
				signType: "现场拍照（默认定位）",
				staffId: "staff001",
				staffName: "张三",
				startDate: "2025-01-01",
				startTime: "09:00",
				state: "启用",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectPlan 接口 - 修改巡检计划", async () => {
		const { execute, data } = modifyInspectPlan({
			onSuccess(data) {
				console.warn("修改巡检计划成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改巡检计划失败", printFormat(error));
			},
		});

		await execute({
			data: {
				inspectionPlanId: "plan001",
				beforeTime: "15",
				canReexamine: "1000",
				communityId: "123456",
				createUserId: "1001",
				createUserName: "管理员",
				endDate: "2025-12-31",
				endTime: "17:00",
				inspectionDay: "1",
				inspectionMonth: "1",
				inspectionPlanName: "环境卫生巡检计划",
				inspectionPlanPeriod: "周",
				inspectionRouteId: "route002",
				inspectionWorkday: "1",
				signType: "现场拍照（默认定位）",
				staffId: "staff002",
				staffName: "李四",
				startDate: "2025-01-01",
				startTime: "08:30",
				state: "启用",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyInspectPlanState 接口 - 停用巡检计划", async () => {
		const { execute, data } = modifyInspectPlanState({
			onSuccess(data) {
				console.warn("停用巡检计划成功", printFormat(data));
			},
			onError(error) {
				console.warn("停用巡检计划失败", printFormat(error));
			},
		});

		await execute({
			params: {
				inspectionPlanId: "plan001",
				state: "停用",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectPlanDetail 接口 - 获取巡检计划详情", async () => {
		const { execute, data } = queryInspectPlanDetail({
			onSuccess(data) {
				console.warn("获取巡检计划详情成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检计划详情失败", printFormat(error));
			},
		});

		await execute({
			params: {
				planId: "plan001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryInspectPlanList 接口 - 获取巡检计划列表", async () => {
		const { execute, data } = queryInspectPlanList({
			onSuccess(data) {
				console.warn("获取巡检计划列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取巡检计划列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				inspectionPlanName: "消防",
				state: "启用",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteInspectPlan 接口 - 删除巡检计划", async () => {
		const { execute, data } = deleteInspectPlan({
			onSuccess(data) {
				console.warn("删除巡检计划成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除巡检计划失败", printFormat(error));
			},
		});

		await execute({
			params: {
				inspectionPlanId: "plan001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
