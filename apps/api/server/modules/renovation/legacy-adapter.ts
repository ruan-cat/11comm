import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { RenovationService } from "./service";

export const renovationLegacyAdapterEvidence = {
	scope: "phase7-renovation-readonly-and-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/roomRenovation/queryRoomRenovation",
		"/app/roomRenovation/queryRoomRenovationRecord",
		"/app/roomRenovation/queryRoomRenovationRecordDetail",
	],
	guardedEndpoints: [
		"/app/roomRenovation/updateRoomToExamine",
		"/app/roomRenovation/saveRoomRenovationDetail",
		"/app/roomRenovation/updateRoomRenovationState",
		"/app/roomRenovation/updateRoomDecorationRecord",
		"/app/roomRenovation/deleteRoomRenovationRecord",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-renovation-data", "renovation-write-read-back-rollback"],
} as const;

export function createLegacyRenovationAdapter(service: RenovationService) {
	return {
		async queryRoomRenovation(input: Record<string, unknown>) {
			return legacySuccess(
				await service.queryRenovations({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					communityId: toString(input.communityId) ?? "COMM_001",
					roomName: toString(input.roomName),
					state: toString(input.state),
				}),
				"查询装修申请列表成功",
			);
		},

		async queryRoomRenovationRecord(input: Record<string, unknown>) {
			const rId = toString(input.rId);
			if (!rId) {
				return legacyFailure("rId 不能为空", 400);
			}

			return legacySuccess(
				await service.queryRecords({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					communityId: toString(input.communityId) ?? "",
					rId,
					roomName: toString(input.roomName),
					roomId: toString(input.roomId),
				}),
				"查询装修记录列表成功",
			);
		},

		async queryRoomRenovationRecordDetail(input: Record<string, unknown>) {
			const recordId = toString(input.recordId);
			if (!recordId) {
				return legacyFailure("recordId 不能为空", 400);
			}

			return legacySuccess(await service.getRecordMedia(recordId), "查询装修记录详情成功");
		},

		async guardedWrite(endpoint: string, _input: Record<string, unknown>) {
			return legacyMutationGuarded(endpoint);
		},
	};
}

function legacyMutationGuarded(action: string) {
	return legacyFailure(
		`Phase7 mutation guard blocked ${action}; renovation writes stay guarded until write read-back rollback evidence is designed.`,
		409,
		{ errorCode: "PHASE7_MUTATION_GUARDED" },
	);
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
