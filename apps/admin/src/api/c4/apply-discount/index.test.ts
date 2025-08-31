import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	queryTrackRecordDetail,
	addTrackRecord,
	deleteTrackRecord,
	queryAllApplyDiscount,
	addApplyDiscount,
	modifyApplyDiscount,
	queryRecord,
	removeApplyDiscount,
	modifyApplyDiscountState,
} from "./index";

describe("c4/优惠申请管理", () => {
	it("使用 query 接口 - 查看跟踪记录详情", async () => {
		const { execute, data } = queryTrackRecordDetail({
			onSuccess(data) {
				console.warn("queryTrackRecordDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryTrackRecordDetail onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				ardr_id: "test_record_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加跟踪记录", async () => {
		const { execute, data } = addTrackRecord({
			onSuccess(data) {
				console.warn("addTrackRecord onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addTrackRecord onError", error);
			},
		});
		await execute({
			data: {
				ardr_id: "test_record_id",
				room_name: "1-1-101",
				create_user_name: "操作员张三",
				create_time: "2024-01-01",
				state: "正常",
				is_true: "否",
				remark: "测试跟踪记录",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除跟踪记录", async () => {
		const { execute, data } = deleteTrackRecord({
			onSuccess(data) {
				console.warn("deleteTrackRecord onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("deleteTrackRecord onError", error);
			},
		});
		await execute({
			data: {
				ardr_id: "test_record_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 优惠申请分页查询", async () => {
		const { execute, data } = queryAllApplyDiscount({
			onSuccess(data) {
				console.warn("queryAllApplyDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryAllApplyDiscount onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				room_name: "1-1-2",
				apply_type: "空置房申请",
				state: "待审核",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 添加优惠申请", async () => {
		const { execute, data } = addApplyDiscount({
			onSuccess(data) {
				console.warn("addApplyDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addApplyDiscount onError", error);
			},
		});
		await execute({
			data: {
				roomName: "1-1-101",
				applyType: "空置房申请",
				createUserName: "张三",
				createUserTel: "13800138000",
				startTime: "2024-01-01",
				endTime: "2024-12-31",
				createRemark: "房屋空置申请优惠",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 优惠申请修改", async () => {
		const { execute, data } = modifyApplyDiscount({
			onSuccess(data) {
				console.warn("modifyApplyDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyApplyDiscount onError", error);
			},
		});
		await execute({
			data: {
				ardId: "test_apply_id",
				roomName: "1-1-101",
				applyType: "空置房申请",
				createUserName: "张三",
				createUserTel: "13800138000",
				startTime: "2024-01-01",
				endTime: "2024-12-31",
				createRemark: "修改后的申请备注",
				state: "已审核",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取跟踪记录（分页）", async () => {
		const { execute, data } = queryRecord({
			onSuccess(data) {
				console.warn("queryRecord onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("queryRecord onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				ard_id: "test_apply_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 删除优惠申请", async () => {
		const { execute, data } = removeApplyDiscount({
			onSuccess(data) {
				console.warn("removeApplyDiscount onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeApplyDiscount onError", error);
			},
		});
		await execute({
			data: {
				ard_id: "test_apply_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改优惠申请状态", async () => {
		const { execute, data } = modifyApplyDiscountState({
			onSuccess(data) {
				console.warn("modifyApplyDiscountState onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyApplyDiscountState onError", error);
			},
		});
		await execute({
			data: {
				ard_id: "test_apply_id",
				state: "已通过",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
