import type { CouponRepository } from "./repository";
import type { CouponOrderQuery, IntegralLogQuery } from "./types";

export interface CouponService {
	listCouponOrders(query: CouponOrderQuery): ReturnType<CouponRepository["listCouponOrders"]>;
	listIntegralSettings(): ReturnType<CouponRepository["listIntegralSettings"]>;
	listIntegralLogs(query: IntegralLogQuery): ReturnType<CouponRepository["listIntegralLogs"]>;
}

export function createCouponService(repository: CouponRepository): CouponService {
	return {
		listCouponOrders: (query) => repository.listCouponOrders(query),
		listIntegralSettings: () => repository.listIntegralSettings(),
		listIntegralLogs: (query) => repository.listIntegralLogs(query),
	};
}
