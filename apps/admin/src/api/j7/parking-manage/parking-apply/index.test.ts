import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addApply, modifyApply, getParkingApplyList, removeApply, reviewApplication } from "./index";

describe("j7/停车管理/车位申请", () => {
	it("使用 body 接口 - 添加申请", async () => {
		const { execute, data } = addApply({
			onSuccess(data) {
				console.warn("addApply onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addApply onError", error);
			},
		});
		await execute({
			data: {
				applyPersonId: "7720240221837074000",
				applyPersonLink: "13345674567",
				applyPersonName: "成龙",
				carBrand: "大众",
				carColor: "红色",
				carNum: "黑AR7970",
				carType: "9901",
				communityId: "2023052267100146",
				endTime: "2025-01-17 11:55:00",
				startTime: "2024-02-22 11:25:00",
				remark: "审核意见：可以通过",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 修改申请", async () => {
		const { execute, data } = modifyApply({
			onSuccess(data) {
				console.warn("modifyApply onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("modifyApply onError", error);
			},
		});
		await execute({
			data: {
				applyId: "102024022231540420",
				carBrand: "大众（已修改）",
				carColor: "蓝色",
				carNum: "黑AR7970",
				carType: "9901",
				endTime: "2025-12-31 23:59:59",
				startTime: "2024-02-22 11:25:00",
				remark: "修改后的申请信息",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取申请列表（分页+条件）", async () => {
		const { execute, data } = getParkingApplyList({
			onSuccess(data) {
				console.warn("getParkingApplyList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getParkingApplyList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				applyPersonName: "成龙",
				carBrand: "宝马",
				id: "102024022231540412",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 删除申请", async () => {
		const { execute, data } = removeApply({
			onSuccess(data) {
				console.warn("removeApply onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("removeApply onError", error);
			},
		});
		await execute({
			params: {
				applyId: "102024022231540420",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 审核申请", async () => {
		const { execute, data } = reviewApplication({
			onSuccess(data) {
				console.warn("reviewApplication onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("reviewApplication onError", error);
			},
		});
		await execute({
			data: {
				applyId: "102021101844540050",
				configId: "922022011217560000",
				feeId: "102022012476870450",
				psId: "792022010572851000",
				remark: "审核意见：可以通过",
				state: "2002",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
