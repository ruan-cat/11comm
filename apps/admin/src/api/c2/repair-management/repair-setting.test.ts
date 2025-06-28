import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryRepairSettingTypeList,
	queryAllRepairWorker,
	addRepairSettingType,
	addRepairWorker,
	modifyRepairSettingType,
	modifyRepairWorker,
	removeRepairSettingType,
	removeRepairWorker,
	queryAllRepairWorkerName,
} from "./repair-setting";

describe("报修设置类型接口测试", () => {
	it("分页查询报修设置类型列表", async () => {
		const { execute, data } = queryRepairSettingTypeList({
			onSuccess(data) {
				console.warn("分页查询报修设置类型列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				repair_type_name: "修水管",
				repair_way: "100",
				repair_setting_type: "100",
				public_area: "T",
				return_visit_flag: "001",
			},
		});

		console.warn("查看报修设置类型分页数据", printFormat(data.value));
	});

	it("分页查询报修师傅列表", async () => {
		const { execute, data } = queryAllRepairWorker({
			onSuccess(data) {
				console.warn("分页查询报修师傅列表成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				repair_type_name: "修水管",
				community_id: "2024022154856948",
			},
		});

		console.warn("查看报修师傅分页数据", printFormat(data.value));
	});

	it("添加报修设置类型", async () => {
		const { execute, data } = addRepairSettingType({
			onSuccess(data) {
				console.warn("添加报修设置类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_type_name: "修水管",
				repair_setting_type: "200",
				repair_way: "200",
				public_area: "F",
				is_show: "Y",
				notify_way: "WECHAT",
				return_visit_flag: "003",
				community_id: "2024022154856948",
				remark: "说明",
			},
		});

		console.warn("查看添加结果", printFormat(data.value));
	});

	it("添加报修师傅", async () => {
		const { execute, data } = addRepairWorker({
			onSuccess(data) {
				console.warn("添加报修师傅成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				org_name: "xx物业",
				staff_name: "cjy",
				repair_type_name: "修水管",
				community_id: "2023052267100146",
			},
		});

		console.warn("查看添加报修师傅结果", printFormat(data.value));
	});

	it("修改报修设置类型", async () => {
		const { execute, data } = modifyRepairSettingType({
			onSuccess(data) {
				console.warn("修改报修设置类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_type_name: "修水管",
				repair_setting_type: "200",
				repair_way: "200",
				public_area: "F",
				is_show: "Y",
				notify_way: "WECHAT",
				return_visit_flag: "003",
				community_id: "2024022154856948",
				remark: "修改说明",
			},
		});

		console.warn("查看修改结果", printFormat(data.value));
	});

	it("变更报修师傅", async () => {
		const { execute, data } = modifyRepairWorker({
			onSuccess(data) {
				console.warn("变更报修师傅成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				state: "9999",
				staff_id: "302025052791430008",
				remark: "生病",
				community_id: "2023052267100146",
				repair_type_name: "修水管",
			},
		});

		console.warn("查看变更报修师傅结果", printFormat(data.value));
	});

	it("删除报修设置类型", async () => {
		const { execute, data } = removeRepairSettingType({
			onSuccess(data) {
				console.warn("删除报修设置类型成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: ["repair_setting_type_id_1", "repair_setting_type_id_2"],
		});

		console.warn("查看删除报修设置类型结果", printFormat(data.value));
	});

	it("删除报修师傅", async () => {
		const { execute, data } = removeRepairWorker({
			onSuccess(data) {
				console.warn("删除报修师傅成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: ["repair_worker_id_1", "repair_worker_id_2"],
		});

		console.warn("查看删除报修师傅结果", printFormat(data.value));
	});

	it("查询符合条件的所有维修师傅的名字", async () => {
		const { execute, data } = queryAllRepairWorkerName({
			onSuccess(data) {
				console.warn("查询维修师傅名字成功", printFormat(data));
			},
			onError(error) {
				console.warn("接口请求失败", error);
			},
		});

		await execute({
			data: {
				repair_type_name: "下水道堵塞",
				repair_id: "822024022794890018",
				community_id: "2024022154856948",
			},
		});

		console.warn("查看维修师傅名字数据", printFormat(data.value));
	});
});
