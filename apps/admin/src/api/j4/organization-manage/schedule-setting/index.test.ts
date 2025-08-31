import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	deleteAssociatedPersonnel,
	deleteSchedule,
	queryScheduleList,
	getScheduleNameList,
	addAssociatedPersonnel,
	addSchedule,
	getScheduleDetail,
	getAssociatedPersonnelList,
	toggleScheduleStatus,
	modifySchedule,
} from "./index";

describe("j4/排班设置管理", () => {
	it("使用 deleteAssociatedPersonnel 接口 - 删除排班关联的人员", async () => {
		const { execute, data } = deleteAssociatedPersonnel({
			onSuccess(data) {
				console.warn("deleteAssociatedPersonnel onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteAssociatedPersonnel onError", error);
			},
		});
		await execute({
			data: {
				associatedId: "test-associated-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 deleteSchedule 接口 - 删除指定的排班设置", async () => {
		const { execute, data } = deleteSchedule({
			onSuccess(data) {
				console.warn("deleteSchedule onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteSchedule onError", error);
			},
		});
		await execute({
			url: "/j4-orgmanager/scheduling/delete/123",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 queryScheduleList 接口 - 获取排班设置列表", async () => {
		const { execute, data } = queryScheduleList({
			onSuccess(data) {
				console.warn("queryScheduleList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryScheduleList onError", error);
			},
		});
		await execute({
			params: {
				name: "早班",
				pageIndex: 1,
				pageSize: 10,
				state: "1001",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getScheduleNameList 接口 - 获取所有排班设置的名称列表", async () => {
		const { execute, data } = getScheduleNameList({
			onSuccess(data) {
				console.warn("getScheduleNameList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getScheduleNameList onError", error);
			},
		});
		await execute({
			params: {},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 addAssociatedPersonnel 接口 - 为排班设置添加关联的员工", async () => {
		const { execute, data } = addAssociatedPersonnel({
			onSuccess(data) {
				console.warn("addAssociatedPersonnel onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addAssociatedPersonnel onError", error);
			},
		});
		await execute({
			data: {
				createTime: "2024-01-01 12:00:00",
				scheduleId: "test-schedule-id",
				staffId: "test-staff-id",
				staffName: "张三",
				statusCd: 1,
				storeId: "test-store-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 addSchedule 接口 - 创建新的排班设置", async () => {
		const { execute, data } = addSchedule({
			onSuccess(data) {
				console.warn("addSchedule onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addSchedule onError", error);
			},
		});
		await execute({
			data: {
				details: [
					{
						classesId: "test-class-id",
						day: 1,
						weekFlag: 1,
						workdayType: "2001",
					},
				],
				name: "测试排班",
				scheduleCycle: "7",
				scheduleType: "1001",
				storeId: "test-store-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getScheduleDetail 接口 - 获取指定排班设置的详细信息", async () => {
		const { execute, data } = getScheduleDetail({
			onSuccess(data) {
				console.warn("getScheduleDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getScheduleDetail onError", error);
			},
		});
		await execute({
			params: {
				scheduleId: "test-schedule-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 getAssociatedPersonnelList 接口 - 获取排班设置关联的人员列表", async () => {
		const { execute, data } = getAssociatedPersonnelList({
			onSuccess(data) {
				console.warn("getAssociatedPersonnelList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getAssociatedPersonnelList onError", error);
			},
		});
		await execute({
			params: {
				scheduleId: "test-schedule-id",
				pageIndex: 1,
				pageSize: 10,
				staffName: "张三",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 toggleScheduleStatus 接口 - 启用或停用指定的排班设置", async () => {
		const { execute, data } = toggleScheduleStatus({
			onSuccess(data) {
				console.warn("toggleScheduleStatus onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("toggleScheduleStatus onError", error);
			},
		});
		await execute({
			url: "/j4-orgmanager/scheduling/status/123",
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 modifySchedule 接口 - 修改排班设置信息", async () => {
		const { execute, data } = modifySchedule({
			onSuccess(data) {
				console.warn("modifySchedule onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifySchedule onError", error);
			},
		});
		await execute({
			data: {
				scheduleId: "test-schedule-id",
				details: [
					{
						classesId: "modified-class-id",
						day: 2,
						weekFlag: 1,
						workdayType: "2001",
					},
				],
				name: "修改后排班",
				scheduleCycle: "14",
				scheduleType: "1002",
				storeId: "modified-store-id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
