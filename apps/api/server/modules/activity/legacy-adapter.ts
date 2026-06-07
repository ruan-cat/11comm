import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { ActivityService } from "./service";
import type { ActivityStatus } from "./types";

export const activityLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write-batch25",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/activities.listActivitiess"],
	guardedEndpoints: [
		"/app/activities.likeActivity",
		"/app/activities.increaseView",
		"/app/activities.updateStatus",
		"/app/activities.updateLike",
		"/app/activities.updateCollect",
		"/app/activities.saveActivities",
		"/app/activities.updateActivities",
		"/app/activities.deleteActivities",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: [
		"db-backed-activity-data",
		"activity-write-read-back-rollback",
		"activity-residual-check",
		"activity-guard-restored",
		"production-app-h5-activity-network",
	],
} as const;

export function createLegacyActivityAdapter(service: ActivityService) {
	return {
		async listActivities(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 15);
			const activitiesId = toString(input.activitiesId);
			const communityId = toString(input.communityId);
			const status = toActivityStatus(input.status);
			const keyword = toString(input.keyword);

			return legacySuccess(
				await service.listActivities({ page, row, activitiesId, communityId, status, keyword }),
				"query success",
			);
		},

		async guardedWrite(endpoint: string, input: Record<string, unknown>) {
			void input;
			return legacyFailure(
				`Phase7 mutation guard blocked ${endpoint}; no activity write read-back rollback evidence exists, so this endpoint stays guarded in apps/api.`,
				409,
				{ errorCode: "PHASE7_MUTATION_GUARDED" },
			);
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

function toActivityStatus(value: unknown): ActivityStatus | undefined {
	const status = toString(value);
	if (status === "UPCOMING" || status === "ONGOING" || status === "COMPLETED" || status === "CANCELLED") {
		return status;
	}

	return undefined;
}
