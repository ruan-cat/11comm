import type { CouponRepository } from "./repository";
import type { CouponOrderQuery, IntegralLogQuery, ReserveOrderQuery } from "./types";

export interface CouponService {
	listCouponOrders(query: CouponOrderQuery): ReturnType<CouponRepository["listCouponOrders"]>;
	listIntegralSettings(): ReturnType<CouponRepository["listIntegralSettings"]>;
	listIntegralLogs(query: IntegralLogQuery): ReturnType<CouponRepository["listIntegralLogs"]>;
	listReserveOrders(query: ReserveOrderQuery): ReturnType<CouponRepository["listReserveOrders"]>;
}

export function createCouponService(repository: CouponRepository): CouponService {
	return {
		listCouponOrders: (query) => repository.listCouponOrders(query),
		listIntegralSettings: () => repository.listIntegralSettings(),
		listIntegralLogs: (query) => repository.listIntegralLogs(query),
		listReserveOrders: (query) => repository.listReserveOrders(query),
	};
}
