import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { CouponService } from "./service";
import type { LegacyPaginationResponse } from "./types";

export const couponLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write-batch28",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/couponProperty.listCouponPropertyUserDetail",
		"/app/integral.listIntegralSetting",
		"/app/integral.listIntegralUserDetail",
		"/app/reserveOrder.listReserveGoodsConfirmOrder",
	],
	guardedEndpoints: [
		"/app/couponProperty.writeOffCouponPropertyUser",
		"/app/integral.useIntegral",
		"/app/reserveOrder.saveReserveGoodsConfirmOrder",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: [
		"db-backed-coupon-data",
		"coupon-integral-reserve-write-read-back-rollback",
		"production-app-h5-coupon-integral-network",
	],
} as const;

export function createLegacyCouponAdapter(service: CouponService) {
	return {
		async listCouponPropertyUserDetail(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const couponQrcode = toString(input.couponQrcode);

			return legacySuccess(
				createPaginationResponse(await service.listCouponOrders({ couponQrcode, page, row }), page, row),
				"查询成功",
			);
		},

		async listIntegralSetting(_input: Record<string, unknown>) {
			return legacySuccess(await service.listIntegralSettings(), "查询成功");
		},

		async listIntegralUserDetail(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const ownerTel = toString(input.ownerTel);

			return legacySuccess(
				createPaginationResponse(await service.listIntegralLogs({ ownerTel, page, row }), page, row),
				"查询成功",
			);
		},

		async listReserveGoodsConfirmOrder(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const reserveQrcode = toString(input.reserveQrcode);

			return legacySuccess(
				createPaginationResponse(await service.listReserveOrders({ reserveQrcode, page, row }), page, row),
				"OK",
			);
		},

		async guardedWrite(action: string, _input: Record<string, unknown>) {
			return legacyFailure(`Phase7 coupon mutation guarded: ${action}`, 409, {
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
		},
	};
}

function createPaginationResponse<T>(data: T[], page = 1, pageSize = 10): LegacyPaginationResponse<T> {
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
