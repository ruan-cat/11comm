import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { VisitService } from "./service";

export const visitLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-audit-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/visit.getVisit", "/app/visit.getVisitDetail"],
	guardedEndpoints: ["/app/visit.auditVisit"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["visit-audit-read-back-rollback"],
} as const;

export function createLegacyVisitAdapter(service: VisitService) {
	return {
		async listVisits(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const state = toString(input.state);
			const visitId = toString(input.visitId);

			return legacySuccess(await service.listVisits({ page, row, state, visitId }), "query success");
		},

		async getVisitDetail(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 1);
			const visitId = toString(input.visitId) || "";

			return legacySuccess(await service.getVisitDetail({ page, row, visitId }), "query success");
		},

		async auditVisit(input: Record<string, unknown>) {
			const decision = await service.getWriteGuardDecision("/app/visit.auditVisit", input);
			return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
		},
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
