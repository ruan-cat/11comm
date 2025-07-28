import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getPaymentAuditList, getPaymentAuditDetail, getPaymentHistoryList, batchAudit, auditFee } from "./index";

describe("c5/缴费审核管理", () => {
	it("使用 query 接口 - 获取缴费审核列表", async () => {
		const { execute, data } = getPaymentAuditList({
			onSuccess(data) {
				console.warn("getPaymentAuditList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getPaymentAuditList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				owner_name: "冯十一",
				room_number: "9-9-901",
				payment_type: "物业费",
				audit_status: "待审核",
				payment_start_time: "2024-01-01",
				payment_end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取缴费审核详情", async () => {
		const { execute, data } = getPaymentAuditDetail({
			onSuccess(data) {
				console.warn("getPaymentAuditDetail onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getPaymentAuditDetail onError", error);
			},
		});
		await execute({
			params: {
				payment_audit_id: "audit_12345",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 query 接口 - 获取缴费历史列表", async () => {
		const { execute, data } = getPaymentHistoryList({
			onSuccess(data) {
				console.warn("getPaymentHistoryList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getPaymentHistoryList onError", error);
			},
		});
		await execute({
			params: {
				pageIndex: 1,
				pageSize: 10,
				owner_name: "陈十二",
				room_number: "10-10-1001",
				payment_type: "停车费",
				start_time: "2024-01-01",
				end_time: "2024-12-31",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 批量审核", async () => {
		const { execute, data } = batchAudit({
			onSuccess(data) {
				console.warn("batchAudit onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("batchAudit onError", error);
			},
		});
		await execute({
			data: {
				audit_ids: ["audit_001", "audit_002", "audit_003"],
				audit_result: "通过",
				audit_opinion: "批量审核通过，缴费凭证真实有效",
				auditor: "审核主管张总",
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});

	it("使用 body 接口 - 审核费用", async () => {
		const { execute, data } = auditFee({
			onSuccess(data) {
				console.warn("auditFee onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("auditFee onError", error);
			},
		});
		await execute({
			data: {
				payment_audit_id: "audit_54321",
				audit_result: "通过",
				audit_opinion: "缴费凭证完整，金额正确",
				auditor: "财务审核员王会计",
				adjusted_amount: 1200.0,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
