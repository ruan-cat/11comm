import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getCancelFeeList, applyCancel, auditCancel } from "./index";

describe("c5/取消费用管理", () => {
	it("使用 query 接口 - 获取取消费用列表（条件+分页）", async () => {
		const { execute, data } = getCancelFeeList({
			onSuccess(data) {
				console.warn("getCancelFeeList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getCancelFeeList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				applicant_name: "王五",
				room_number: "3-3-301",
				fee_type: "物业费",
				cancel_status: "待审核",
				apply_start_time: "2024-01-01",
				apply_end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 申请取消", async () => {
		const { execute, data } = applyCancel({
			onSuccess(data) {
				console.warn("applyCancel onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("applyCancel onError", error);
			},
		});
		await execute({
			data: {
				applicant_name: "赵六",
				applicant_phone: "13800138001",
				room_number: "4-4-401",
				fee_id: "fee_12345",
				fee_type: "停车费",
				fee_amount: 300.0,
				cancel_reason: "车位不再使用",
				apply_remark: "已搬离小区，停车位无需继续缴费",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 审核取消", async () => {
		const { execute, data } = auditCancel({
			onSuccess(data) {
				console.warn("auditCancel onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("auditCancel onError", error);
			},
		});
		await execute({
			data: {
				cancel_id: "cancel_12345",
				audit_result: "通过",
				audit_opinion: "申请理由充分，同意取消该费用",
				auditor: "审核员李经理",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
