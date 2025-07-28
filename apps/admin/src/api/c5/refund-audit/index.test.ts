import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import {
	getRefundAuditList,
	getRefundAuditDetail,
	getRefundHistoryList,
	applyRefund,
	auditRefund,
	exportRefundAudit,
} from "./index";

describe("c5/退费审核管理", () => {
	it("使用 query 接口 - 获取退费审核列表", async () => {
		const { execute, data } = getRefundAuditList({
			onSuccess(data) {
				console.warn("getRefundAuditList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getRefundAuditList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				applicant_name: "张三",
				room_number: "1-1-101",
				refund_type: "物业费退费",
				audit_status: "待审核",
				apply_start_time: "2024-01-01",
				apply_end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取退费审核详情", async () => {
		const { execute, data } = getRefundAuditDetail({
			onSuccess(data) {
				console.warn("getRefundAuditDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getRefundAuditDetail onError", error);
			},
		});
		await execute({
			params: {
				refund_id: "test_refund_id",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取退费历史列表", async () => {
		const { execute, data } = getRefundHistoryList({
			onSuccess(data) {
				console.warn("getRefundHistoryList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getRefundHistoryList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				applicant_name: "李四",
				room_number: "2-2-201",
				refund_type: "停车费退费",
				start_time: "2024-01-01",
				end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 申请退费", async () => {
		const { execute, data } = applyRefund({
			onSuccess(data) {
				console.warn("applyRefund onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("applyRefund onError", error);
			},
		});
		await execute({
			data: {
				applicant_name: "王五",
				applicant_phone: "13800138000",
				room_number: "3-3-301",
				refund_type: "物业费退费",
				refund_amount: 1200.0,
				refund_reason: "房屋空置期间费用退费",
				fee_items: "物业管理费",
				refund_period: "2024年1月-3月",
				apply_remark: "房屋装修期间空置",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 审核退费", async () => {
		const { execute, data } = auditRefund({
			onSuccess(data) {
				console.warn("auditRefund onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("auditRefund onError", error);
			},
		});
		await execute({
			data: {
				refund_id: "test_refund_id",
				audit_result: "通过",
				audit_opinion: "符合退费条件，同意退费",
				auditor: "审核员张三",
				actual_refund_amount: 1000.0,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 导出退费审核", async () => {
		const { execute, data } = exportRefundAudit({
			onSuccess(data) {
				console.warn("exportRefundAudit onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("exportRefundAudit onError", error);
			},
		});
		await execute({
			params: {
				applicant_name: "张三",
				room_number: "1-1-101",
				refund_type: "物业费退费",
				audit_status: "已通过",
				apply_start_time: "2024-01-01",
				apply_end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
