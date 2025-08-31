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
} from "./index";

describe("c2/报修管理/报修设置", () => {
	it("使用 query 接口 - 获取报修设置类型列表", async () => {
		const { execute, data } = queryRepairSettingTypeList({
			onSuccess(data) {
				console.warn("queryRepairSettingTypeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryRepairSettingTypeList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "2024022154856948",
				repair_type_name: "修水管",
				repair_way: "100",
				repair_setting_type: "200",
				public_area: "F",
				return_visit_flag: "003",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取报修师傅列表（条件+分页）", async () => {
		const { execute, data } = queryAllRepairWorker({
			onSuccess(data) {
				console.warn("queryAllRepairWorker onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAllRepairWorker onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				repair_type_name: "修水管",
				community_id: "2024022154856948",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加报修设置类型", async () => {
		const { execute, data } = addRepairSettingType({
			onSuccess(data) {
				console.warn("addRepairSettingType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addRepairSettingType onError", error);
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
				remark: "新增报修设置类型说明",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加报修师傅", async () => {
		const { execute, data } = addRepairWorker({
			onSuccess(data) {
				console.warn("addRepairWorker onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addRepairWorker onError", error);
			},
		});
		await execute({
			data: {
				org_name: "华润物业",
				staff_name: "张师傅",
				repair_type_name: "修水管",
				community_id: "2024022154856948",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改报修设置类型", async () => {
		const { execute, data } = modifyRepairSettingType({
			onSuccess(data) {
				console.warn("modifyRepairSettingType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyRepairSettingType onError", error);
			},
		});
		await execute({
			data: {
				setting_id: "setting_12345",
				repair_type_name: "修水管",
				repair_setting_type: "200",
				repair_way: "200",
				public_area: "F",
				is_show: "Y",
				notify_way: "WECHAT",
				return_visit_flag: "003",
				remark: "修改报修设置类型说明",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 变更报修师傅", async () => {
		const { execute, data } = modifyRepairWorker({
			onSuccess(data) {
				console.warn("modifyRepairWorker onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyRepairWorker onError", error);
			},
		});
		await execute({
			data: {
				state: "9999",
				staff_id: "302025052791430008",
				remark: "师傅临时请假",
				community_id: "2024022154856948",
				repair_type_name: "修水管",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除报修设置类型", async () => {
		const { execute, data } = removeRepairSettingType({
			onSuccess(data) {
				console.warn("removeRepairSettingType onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeRepairSettingType onError", error);
			},
		});
		await execute({
			data: ["setting_001", "setting_002", "setting_003"],
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除报修师傅", async () => {
		const { execute, data } = removeRepairWorker({
			onSuccess(data) {
				console.warn("removeRepairWorker onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeRepairWorker onError", error);
			},
		});
		await execute({
			data: ["worker_001", "worker_002"],
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 查询符合条件的所有维修师傅的名字", async () => {
		const { execute, data } = queryAllRepairWorkerName({
			onSuccess(data) {
				console.warn("queryAllRepairWorkerName onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAllRepairWorkerName onError", error);
			},
		});
		await execute({
			params: {
				repair_id: "822024022794890018",
				community_id: "2024022154856948",
				repair_type_name: "修水管",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
