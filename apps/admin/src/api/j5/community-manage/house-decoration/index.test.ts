import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";

import {
	addRenovationRecord,
	deleteRenovationRecord,
	queryRenovationRecordDetail,
	queryRenovationRecordList,
	addRenovation,
	deleteRenovation,
	modifyRenovation,
	completeRenovation,
	auditRenovation,
	queryRenovationList,
} from ".";

describe("j5/房屋装修", () => {
	it("使用 addRenovationRecord 接口 - 添加跟进记录", async () => {
		const { execute, data } = addRenovationRecord({
			onSuccess(data) {
				console.warn("添加跟进记录成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加跟进记录失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2023052267100146",
				isViolation: "true",
				renovationId: "172024021839912160",
				roomId: "752024010438310000",
				roomName: "1-1-1002",
				state: "3000",
				remark: "请准备XX材料至物业处填报",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteRenovationRecord 接口 - 删除跟进记录", async () => {
		const { execute, data } = deleteRenovationRecord({
			onSuccess(data) {
				console.warn("删除跟进记录成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除跟进记录失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				recordId: "172025051967580002",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryRenovationRecordDetail 接口 - 查看跟进记录详情", async () => {
		const { execute, data } = queryRenovationRecordDetail({
			onSuccess(data) {
				console.warn("查看跟进记录详情成功", printFormat(data));
			},
			onError(error) {
				console.warn("查看跟进记录详情失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				pageIndex: 1,
				pageSize: 10,
				recordId: "172024021547940360",
				roomId: "752024010438310020",
				roomName: "1-1-1002",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryRenovationRecordList 接口 - 获取跟进记录列表（条件+分页）", async () => {
		const { execute, data } = queryRenovationRecordList({
			onSuccess(data) {
				console.warn("获取跟进记录列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取跟进记录列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				pageIndex: 1,
				pageSize: 10,
				renovationId: "172024021592960348",
				roomId: "752024010438310020",
				roomName: "1-1-1002",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 addRenovation 接口 - 添加装修", async () => {
		const { execute, data } = addRenovation({
			onSuccess(data) {
				console.warn("添加装修成功", printFormat(data));
			},
			onError(error) {
				console.warn("添加装修失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2023052267100146",
				endTime: "2021-12-19 23:59:59",
				personMain: "汤米谢尔比",
				personMainTel: "18999999999",
				personName: "朽木玲子",
				personTel: "12333333333",
				rId: "172021092826300030",
				remark: "这是备注",
				renovationCompany: "chd装修大队",
				roomId: "752021012579820000",
				roomName: "1-1-1021",
				startTime: "2021-05-17 00:00:00",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 deleteRenovation 接口 - 删除装修", async () => {
		const { execute, data } = deleteRenovation({
			onSuccess(data) {
				console.warn("删除装修成功", printFormat(data));
			},
			onError(error) {
				console.warn("删除装修失败", printFormat(error));
			},
		});

		await execute({
			params: {
				rId: "172021092826300030",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 modifyRenovation 接口 - 修改装修", async () => {
		const { execute, data } = modifyRenovation({
			onSuccess(data) {
				console.warn("修改装修成功", printFormat(data));
			},
			onError(error) {
				console.warn("修改装修失败", printFormat(error));
			},
		});

		await execute({
			data: {
				communityId: "2023052267100146",
				createTime: "2021-06-03 13:17:39",
				endTime: "2021-12-19 23:59:59",
				isPostpone: "否",
				isViolation: "是",
				personMain: "汤米谢尔比",
				personMainTel: "18999999999",
				personName: "朽木玲子",
				personTel: "12333333333",
				postponeTime: "2021-11-30",
				rId: "172021092826300030",
				remark: "这是备注",
				renovationCompany: "chd装修大队",
				roomId: "752021012579820000",
				roomName: "1-1-1021",
				startTime: "2021-05-17 00:00:00",
				state: "待审核",
				violationDesc: "这是违规说明",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 completeRenovation 接口 - 完成装修", async () => {
		const { execute, data } = completeRenovation({
			onSuccess(data) {
				console.warn("完成装修成功", printFormat(data));
			},
			onError(error) {
				console.warn("完成装修失败", printFormat(error));
			},
		});

		await execute({
			params: {
				rId: "172021092826300030",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 auditRenovation 接口 - 审核装修", async () => {
		const { execute, data } = auditRenovation({
			onSuccess(data) {
				console.warn("审核装修成功", printFormat(data));
			},
			onError(error) {
				console.warn("审核装修失败", printFormat(error));
			},
		});

		await execute({
			params: {
				rId: "172021092826300030",
				state: "审核通过",
				examineRemark: "审核备注",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});

	it("使用 queryRenovationList 接口 - 获取装修列表(条件+分页)", async () => {
		const { execute, data } = queryRenovationList({
			onSuccess(data) {
				console.warn("获取装修列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("获取装修列表失败", printFormat(error));
			},
		});

		await execute({
			params: {
				communityId: "2023052267100146",
				pageIndex: 1,
				pageSize: 10,
				endTime: "2021-12-19 23:59:59",
				isPostpone: "N",
				personName: "朽木玲子",
				personTel: "12333333333",
				postponeTime: "2021-12-19",
				renovationTime: "2021-05-17 00:00:00",
				roomName: "1-1-1021",
				startTime: "2021-05-17 00:00:00",
				state: "待审核",
				violationDesc: "这是违规说明",
			},
		});

		console.warn("查看简单的 data.value", printFormat(data.value));
	});
});
