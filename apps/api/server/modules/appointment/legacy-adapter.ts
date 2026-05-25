import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { AppointmentService } from "./service";

export const appointmentLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/communitySpace.listCommunitySpaceConfirmOrder"],
	guardedEndpoints: ["/app/communitySpace.saveCommunitySpaceConfirmOrder"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-appointment-data", "appointment-confirm-write-read-back-rollback"],
} as const;

export function createLegacyAppointmentAdapter(service: AppointmentService) {
	return {
		async listCommunitySpaceConfirmOrders(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const communityId = toString(input.communityId);
			const timeId = toString(input.timeId);

			return legacySuccess(await service.listAppointmentOrders({ page, row, communityId, timeId }), "query success");
		},

		async saveCommunitySpaceConfirmOrder(input: Record<string, unknown>) {
			const decision = await service.getConfirmGuardDecision(input);
			return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
		},
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? Math.min(result, 100) : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}
