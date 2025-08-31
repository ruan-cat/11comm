import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addProgress,
	createRepairOrder,
	queryProgressList,
	queryRepairTypes,
	deleteProgress,
	addOwnerFeedback,
	modifyOwnerFeedback,
	queryOwnerFeedbackList,
	deleteOwnerFeedback,
} from ".";

describe("j5/业务受理", () => {
	it("使用 addProgress 接口 - 添加跟进进度", async () => {
		const { execute, data } = addProgress({
			onSuccess(data) {
				console.warn("添加跟进进度成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加跟进进度失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2023052267100146",
				content: "已修理小区劳大雕像",
				noteId: "102025051439860020",
				state: "W",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 createRepairOrder 接口 - 转报修单", async () => {
		const { execute, data } = createRepairOrder({
			onSuccess(data) {
				console.warn("转报修单成功", printFormat(data));
			},
			onError(error) {
				console.warn("转报修单失败", printFormat(error));
			},
		});

		await execute({
			data: {
				appointmentTime: "2025-05-19 11:21:07",
				communityId: "2023052267100146",
				context: "====",
				noteId: "102025051439860020",
				repairChannel: "T",
				repairName: "东北雨姐",
				repairObjId: "752024021954543000",
				repairObjName: "1-1-2",
				repairType: "102024021885971820",
				tel: "18049392222",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryProgressList 接口 - 获取跟进进度列表（条件+分页）", async () => {
		const { execute, data } = queryProgressList({
			onSuccess(data) {
				console.warn("获取跟进进度列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取跟进进度列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				noteId: "102025051439860020",
				pageIndex: 1,
				pageSize: 10,
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryRepairTypes 接口 - 查询可报修类型", async () => {
		const { execute, data } = queryRepairTypes({
			onSuccess(data) {
				console.warn("查询可报修类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("查询可报修类型失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				pageIndex: 1,
				pageSize: 10,
				publicArea: "F",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteProgress 接口 - 删除跟进进度", async () => {
		const { execute, data } = deleteProgress({
			onSuccess(data) {
				console.warn("删除跟进进度成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除跟进进度失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "102025051439860020",
				detailId: "102025051439860020",
				noteId: "102025051439860020",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 addOwnerFeedback 接口 - 添加业主反馈", async () => {
		const { execute, data } = addOwnerFeedback({
			onSuccess(data) {
				console.warn("添加业主反馈成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加业主反馈失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "102022082133420000",
				content: "W",
				link: "18909711447",
				noteType: "1",
				objId: "102022082133420000",
				objName: "张三",
				roomId: "752022082030880000",
				roomName: "D-1-1001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyOwnerFeedback 接口 - 修改业主反馈", async () => {
		const { execute, data } = modifyOwnerFeedback({
			onSuccess(data) {
				console.warn("修改业主反馈成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改业主反馈失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "102022082133420000",
				content: "W",
				link: "18909711447",
				noteId: "102022082133420000",
				noteType: "1",
				objId: "102022082133420000",
				objName: "张三",
				roomId: "752022082030880000",
				roomName: "D-1-1001",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryOwnerFeedbackList 接口 - 获取业主反馈列表（条件+分页）", async () => {
		const { execute, data } = queryOwnerFeedbackList({
			onSuccess(data) {
				console.warn("获取业主反馈列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取业主反馈列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2025041251140067",
				objId: "772022082070860017",
				pageIndex: 1,
				pageSize: 10,
				createUserName: "wuxw",
				noteType: "1",
				objName: "张杰",
				state: "W",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteOwnerFeedback 接口 - 删除业主反馈", async () => {
		const { execute, data } = deleteOwnerFeedback({
			onSuccess(data) {
				console.warn("删除业主反馈成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除业主反馈失败", printFormat(error));
			},
		});

		await execute({
			data: {
				noteId: "1928022151462490000",
				objId: "102022082133420000",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
