import { describe, it } from "vitest";
import { printFormat } from "@/utils/print";
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
	it("使用 deleteAssociatedPersonnel 接口 - 删除排班关联的人员", () => {
		const { execute, data } = deleteAssociatedPersonnel({
			onError: (error) => console.warn("deleteAssociatedPersonnel 接口请求失败:", error),
		});

		execute({
			data: {
				associatedId: "test-associated-id",
			},
		});

		console.warn("deleteAssociatedPersonnel 接口响应数据:", printFormat(data));
	});

	it("使用 deleteSchedule 接口 - 删除指定的排班设置", () => {
		const { execute, data } = deleteSchedule({
			onError: (error) => console.warn("deleteSchedule 接口请求失败:", error),
		});

		execute({
			url: "/j4-orgmanager/scheduling/delete/123",
		});

		console.warn("deleteSchedule 接口响应数据:", printFormat(data));
	});

	it("使用 queryScheduleList 接口 - 获取排班设置列表", () => {
		const { execute, data } = queryScheduleList({
			onError: (error) => console.warn("queryScheduleList 接口请求失败:", error),
		});

		execute({
			params: {
				name: "早班",
				pageIndex: 1,
				pageSize: 10,
				state: "1001",
			},
		});

		console.warn("queryScheduleList 接口响应数据:", printFormat(data));
	});

	it("使用 getScheduleNameList 接口 - 获取所有排班设置的名称列表", () => {
		const { execute, data } = getScheduleNameList({
			onError: (error) => console.warn("getScheduleNameList 接口请求失败:", error),
		});

		execute({
			params: {},
		});

		console.warn("getScheduleNameList 接口响应数据:", printFormat(data));
	});

	it("使用 addAssociatedPersonnel 接口 - 为排班设置添加关联的员工", () => {
		const { execute, data } = addAssociatedPersonnel({
			onError: (error) => console.warn("addAssociatedPersonnel 接口请求失败:", error),
		});

		execute({
			data: {
				createTime: "2024-01-01 12:00:00",
				scheduleId: "test-schedule-id",
				staffId: "test-staff-id",
				staffName: "张三",
				statusCd: 1,
				storeId: "test-store-id",
			},
		});

		console.warn("addAssociatedPersonnel 接口响应数据:", printFormat(data));
	});

	it("使用 addSchedule 接口 - 创建新的排班设置", () => {
		const { execute, data } = addSchedule({
			onError: (error) => console.warn("addSchedule 接口请求失败:", error),
		});

		execute({
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

		console.warn("addSchedule 接口响应数据:", printFormat(data));
	});

	it("使用 getScheduleDetail 接口 - 获取指定排班设置的详细信息", () => {
		const { execute, data } = getScheduleDetail({
			onError: (error) => console.warn("getScheduleDetail 接口请求失败:", error),
		});

		execute({
			params: {
				scheduleId: "test-schedule-id",
			},
		});

		console.warn("getScheduleDetail 接口响应数据:", printFormat(data));
	});

	it("使用 getAssociatedPersonnelList 接口 - 获取排班设置关联的人员列表", () => {
		const { execute, data } = getAssociatedPersonnelList({
			onError: (error) => console.warn("getAssociatedPersonnelList 接口请求失败:", error),
		});

		execute({
			params: {
				scheduleId: "test-schedule-id",
				pageIndex: 1,
				pageSize: 10,
				staffName: "张三",
			},
		});

		console.warn("getAssociatedPersonnelList 接口响应数据:", printFormat(data));
	});

	it("使用 toggleScheduleStatus 接口 - 启用或停用指定的排班设置", () => {
		const { execute, data } = toggleScheduleStatus({
			onError: (error) => console.warn("toggleScheduleStatus 接口请求失败:", error),
		});

		execute({
			url: "/j4-orgmanager/scheduling/status/123",
		});

		console.warn("toggleScheduleStatus 接口响应数据:", printFormat(data));
	});

	it("使用 modifySchedule 接口 - 修改排班设置信息", () => {
		const { execute, data } = modifySchedule({
			onError: (error) => console.warn("modifySchedule 接口请求失败:", error),
		});

		execute({
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

		console.warn("modifySchedule 接口响应数据:", printFormat(data));
	});
});
