import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { ItemReleaseService } from "./service";
import type { LegacyPaginationResponse } from "./types";

export const itemReleaseLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write-batch21",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/itemRelease.getItemRelease",
		"/app/itemRelease.getItemReleaseRes",
		"/app/itemRelease.queryOaWorkflowUser",
		"/app/itemRelease.queryUndoItemReleaseV2",
		"/app/itemRelease.queryFinishItemReleaseV2",
	],
	guardedEndpoints: ["/app/itemRelease.auditItemRelease"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-item-release-data", "item-release-write-read-back-rollback"],
} as const;

export function createLegacyItemReleaseAdapter(service: ItemReleaseService) {
	return {
		async getItemRelease(input: Record<string, unknown>) {
			const irId = toString(input.irId) ?? "";
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 1);

			return legacySuccess(createPaginationResponse(await service.getItemRelease({ irId }), page, row), "查询成功");
		},

		async getItemReleaseRes(input: Record<string, unknown>) {
			const irId = toString(input.irId) ?? "";
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 20);

			return legacySuccess(
				createPaginationResponse(await service.getItemReleaseRes({ irId }), page, row),
				"鏌ヨ鎴愬姛",
			);
		},

		async queryOaWorkflowUser(input: Record<string, unknown>) {
			const id = toString(input.id) ?? "";
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 20);

			return legacySuccess(
				createPaginationResponse(await service.queryOaWorkflowUser({ id }), page, row),
				"鏌ヨ鎴愬姛",
			);
		},

		async queryUndoItemRelease(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return legacySuccess(
				createPaginationResponse(await service.queryUndoItemRelease({ page, row }), page, row),
				"查询成功",
			);
		},

		async queryFinishItemRelease(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return legacySuccess(
				createPaginationResponse(await service.queryFinishItemRelease({ page, row }), page, row),
				"查询成功",
			);
		},

		async guardedWrite(endpoint: string, input: Record<string, unknown>) {
			void input;
			return legacyFailure(
				`Phase7 mutation guard blocked ${endpoint}; no item-release audit write read-back rollback evidence exists, so this endpoint stays guarded in apps/api.`,
				409,
				{ errorCode: "PHASE7_MUTATION_GUARDED" },
			);
		},
	};
}

function createPaginationResponse<T>(data: T[], page = 1, pageSize = 1): LegacyPaginationResponse<T> {
	const start = (page - 1) * pageSize;
	const end = start + pageSize;

	return {
		list: data.slice(start, end),
		total: data.length,
		page,
		pageSize,
		hasMore: end < data.length,
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
