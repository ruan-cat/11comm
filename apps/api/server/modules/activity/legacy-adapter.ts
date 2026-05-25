import { legacySuccess } from "../../shared/runtime/response-builder";
import type { ActivityService } from "./service";
import type { ActivityStatus } from "./types";

export const activityLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-pilot",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/activities.listActivitiess"],
	notCovered: [
		"/app/activities.saveActivities",
		"/app/activities.updateActivities",
		"/app/activities.deleteActivities",
		"/app/activities.increaseView",
		"/app/activities.likeActivity",
		"/app/activities.updateStatus",
		"/app/activities.updateLike",
		"/app/activities.updateCollect",
		"db-backed-activity-data",
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
