import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { ProfileService } from "./service";

export const profileLegacyAdapterEvidence = {
	scope: "readonly-plus-guarded-write-handler-pilot",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/profile.getUserProfile", "/app/profile.listCommunities", "/app/profile.listAttendanceRecords"],
	guardedEndpoints: ["/app/profile.changeCommunity", "/app/profile.changePassword"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["profile-write-read-back-rollback", "production-app-h5-profile-network"],
} as const;

export function createLegacyProfileAdapter(service: ProfileService) {
	return {
		async getUserProfile(input: Record<string, unknown>) {
			void input;
			return legacySuccess(await service.getUserProfile(), "query success");
		},

		async listCommunities(input: Record<string, unknown>) {
			const keyword = toString(input.keyword);
			return legacySuccess(await service.listCommunities({ keyword }), "query success");
		},

		async listAttendanceRecords(input: Record<string, unknown>) {
			const month = normalizeMonth(toString(input.month));

			return legacySuccess(await service.listAttendanceRecords({ month }), "query success");
		},

		async changeCommunity(input: Record<string, unknown>) {
			return guarded(service, "/app/profile.changeCommunity", input);
		},

		async changePassword(input: Record<string, unknown>) {
			return guarded(service, "/app/profile.changePassword", input);
		},
	};
}

async function guarded(service: ProfileService, endpoint: string, input: Record<string, unknown>) {
	const decision = await service.getWriteGuardDecision(endpoint, input);
	return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
}

function normalizeMonth(value: string | undefined): string {
	if (value && /^\d{4}-\d{2}$/.test(value)) {
		return value;
	}

	return "2026-05";
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
