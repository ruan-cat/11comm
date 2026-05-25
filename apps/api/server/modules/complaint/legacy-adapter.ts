import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { ComplaintService } from "./service";

export const complaintLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/auditUser.listAuditComplaints",
		"/app/auditUser.listAuditHistoryComplaints",
		"/app/complaint.listComplaintEvent",
		"/app/complaintAppraise.listComplaintAppraise",
	],
	guardedEndpoints: [
		"/app/complaint",
		"/app/complaint.auditComplaint",
		"/app/complaintAppraise.replyComplaintAppraise",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-complaint-data", "complaint-write-read-back-rollback"],
} as const;

export function createLegacyComplaintAdapter(service: ComplaintService) {
	return {
		async listAuditComplaints(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listAuditComplaints({
					page: toNumber(input.page, 1, 100),
					row: toNumber(input.row, 15, 100),
					process: toString(input.process),
				}),
				"query success",
			);
		},

		async listAuditHistoryComplaints(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listAuditHistoryComplaints({
					page: toNumber(input.page, 1, 100),
					row: toNumber(input.row, 15, 100),
					process: toString(input.process),
				}),
				"query success",
			);
		},

		async listComplaintEvent(input: Record<string, unknown>) {
			const complaintId = toString(input.complaintId);
			if (!complaintId) {
				return legacyFailure("投诉ID不能为空", 400);
			}

			return legacySuccess(
				await service.listComplaintEvent({
					complaintId,
					page: toNumber(input.page, 1, 100),
					row: toNumber(input.row, 100, 100),
				}),
				"query success",
			);
		},

		async listComplaintAppraise(input: Record<string, unknown>) {
			const complaintId = toString(input.complaintId);
			if (!complaintId) {
				return legacyFailure("投诉ID不能为空", 400);
			}

			return legacySuccess(
				await service.listComplaintAppraise({
					complaintId,
					page: toNumber(input.page, 1, 100),
					row: toNumber(input.row, 100, 100),
				}),
				"query success",
			);
		},

		async saveComplaint(input: Record<string, unknown>) {
			return createGuardedResponse("/app/complaint", input, service);
		},

		async auditComplaint(input: Record<string, unknown>) {
			return createGuardedResponse("/app/complaint.auditComplaint", input, service);
		},

		async replyComplaintAppraise(input: Record<string, unknown>) {
			return createGuardedResponse("/app/complaintAppraise.replyComplaintAppraise", input, service);
		},
	};
}

async function createGuardedResponse(endpoint: string, input: Record<string, unknown>, service: ComplaintService) {
	const decision = await service.getWriteGuardDecision(endpoint, input);
	return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
}

function toNumber(value: unknown, fallback: number, max: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? Math.min(result, max) : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}
