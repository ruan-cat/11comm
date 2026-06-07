import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { InspectionService } from "./service";

export const inspectionLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-writes-batch16",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/staff.listStaffs",
		"/app/inspection.getTodayReport",
		"/app/inspection.listInspectionItemTitles",
		"/app/inspection.listInspectionTasks",
		"/app/inspection.listInspectionTaskDetails",
	],
	guardedEndpoints: ["/app/inspection.submitInspection", "/app/inspection.transferTask"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: [
		"db-backed-inspection-data",
		"inspection-write-read-back-rollback",
		"production-app-h5-inspection-network",
	],
} as const;

export function createLegacyInspectionAdapter(service: InspectionService) {
	return {
		async listStaffs(input: Record<string, unknown>) {
			return legacySuccess(await service.listStaffs({ communityId: toString(input.communityId) }), "查询成功");
		},

		async getTodayReport(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listTodayReports({
					communityId: toString(input.communityId),
					queryTime: toString(input.queryTime),
				}),
				"查询成功",
			);
		},

		async listInspectionItemTitles(input: Record<string, unknown>) {
			const itemId = toString(input.itemId);
			if (!itemId) {
				return legacyFailure("巡检项ID不能为空", 400);
			}

			return legacySuccess(
				await service.listInspectionItemTitles({
					communityId: toString(input.communityId),
					itemId,
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 100),
				}),
				"查询成功",
			);
		},

		async listInspectionTasks(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listInspectionTasks({
					canReexamine: toString(input.canReexamine),
					isToday: toNumber(input.isToday, 0),
					moreState: toString(input.moreState),
					page: toNumber(input.page, 1),
					planInsTime: toString(input.planInsTime),
					row: toNumber(input.row, 10),
				}),
				"查询成功",
			);
		},

		async listInspectionTaskDetails(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listInspectionTaskDetails({
					inspectionId: toString(input.inspectionId),
					page: toNumber(input.page, 1),
					planUserId: toString(input.planUserId),
					qrCodeTime: toString(input.qrCodeTime),
					row: toNumber(input.row, 100),
					state: toString(input.state),
					taskId: toString(input.taskId),
				}),
				"查询成功",
			);
		},

		async guardedWrite(endpoint: string, input: Record<string, unknown>) {
			void input;
			return legacyFailure(
				`Phase7 mutation guard blocked ${endpoint}; no inspection write read-back rollback evidence exists, so this endpoint stays guarded in apps/api.`,
				409,
				{ errorCode: "PHASE7_MUTATION_GUARDED" },
			);
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
