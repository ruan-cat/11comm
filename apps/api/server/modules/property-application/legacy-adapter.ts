import { legacySuccess } from "../../shared/runtime/response-builder";
import type { PropertyApplicationService } from "./service";

export const propertyApplicationLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-pilot",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/feeDiscount/queryFeeDiscount", "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail"],
	notCovered: [
		"/app/applyRoomDiscount/queryApplyRoomDiscount",
		"/app/applyRoomDiscount/updateApplyRoomDiscount",
		"/app/applyRoomDiscount/updateReviewApplyRoomDiscount",
		"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord",
		"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord",
		"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord",
		"db-backed-property-application-data",
		"property-application-write-read-back-rollback",
	],
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
	};
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}
