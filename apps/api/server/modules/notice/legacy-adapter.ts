import { legacySuccess } from "../../shared/runtime/response-builder";
import type { NoticeService } from "./service";

export const noticeLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-pilot",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/notice.listNotices"],
	notCovered: ["db-backed-notice-data", "notice-write-or-delete"],
} as const;

export function createLegacyNoticeAdapter(service: NoticeService) {
	return {
		async listNotices(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const communityId = toString(input.communityId);
			const noticeTypeCd = toString(input.noticeTypeCd);
			const noticeId = toString(input.noticeId);
			const titleLike = toString(input.titleLike);

			return legacySuccess(
				await service.listNotices({ page, row, communityId, noticeTypeCd, noticeId, titleLike }),
				"query success",
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
