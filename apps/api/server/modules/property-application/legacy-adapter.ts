import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { PropertyApplicationService } from "./service";

export const propertyApplicationLegacyAdapterEvidence = {
	scope: "phase7-property-application-readonly-and-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/feeDiscount/queryFeeDiscount",
		"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
		"/app/applyRoomDiscount/queryApplyRoomDiscount",
		"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord",
	],
	guardedEndpoints: [
		"/app/applyRoomDiscount/updateApplyRoomDiscount",
		"/app/applyRoomDiscount/updateReviewApplyRoomDiscount",
		"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord",
		"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-property-application-data", "property-application-write-read-back-rollback"],
} as const;

export function createLegacyPropertyApplicationAdapter(service: PropertyApplicationService) {
	return {
		async queryFeeDiscount(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listFeeDiscounts({
					discountType: toString(input.discountType) ?? "3003",
					communityId: toString(input.communityId) ?? "COMM_001",
				}),
				"查询费用折扣成功",
			);
		},

		async queryApplyRoomDiscountRecordDetail(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listApplicationRecordDetails({
					ardrId: toString(input.ardrId),
					communityId: toString(input.communityId),
				}),
				"查询跟踪记录详情成功",
			);
		},

		async queryApplyRoomDiscount(input: Record<string, unknown>) {
			const ardId = toString(input.ardId);
			if (ardId) {
				const applyRoom = await service.getApplicationById(ardId);
				if (!applyRoom) {
					return legacyFailure("申请不存在", 404);
				}

				return legacySuccess(
					{
						list: [applyRoom],
						total: 1,
						page: toNumber(input.page, 1),
						pageSize: 1,
						hasMore: false,
					},
					"查询申请详情成功",
				);
			}

			return legacySuccess(
				await service.getApplicationList({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					communityId: toString(input.communityId) ?? "",
					roomName: toString(input.roomName),
					state: toString(input.state),
				}),
				"查询申请列表成功",
			);
		},

		async queryApplyRoomDiscountRecord(input: Record<string, unknown>) {
			return legacySuccess(
				await service.getRecordList({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					communityId: toString(input.communityId) ?? "",
					applicationId: toString(input.applicationId),
					roomId: toString(input.roomId),
					roomName: toString(input.roomName),
				}),
				"查询跟踪记录列表成功",
			);
		},

		async guardedWrite(endpoint: string, _input: Record<string, unknown>) {
			return legacyMutationGuarded(endpoint);
		},
	};
}

function legacyMutationGuarded(action: string) {
	return legacyFailure(
		`Phase7 mutation guard blocked ${action}; property-application writes stay guarded until write read-back rollback evidence is designed.`,
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
