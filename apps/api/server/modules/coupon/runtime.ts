import type { H3Event } from "nitro/h3";
import { createLegacyCouponAdapter } from "./legacy-adapter";
import { createCouponRepository, type CouponRepository } from "./repository";
import { createCouponService, type CouponService } from "./service";

export interface CouponRuntime {
	repository: CouponRepository;
	service: CouponService;
	legacyAdapter: ReturnType<typeof createLegacyCouponAdapter>;
}

const fallbackRuntime = createCouponRuntime(createCouponRepository());

export function getCouponRuntime(_event?: H3Event): CouponRuntime {
	return fallbackRuntime;
}

function createCouponRuntime(repository: CouponRepository): CouponRuntime {
	const service = createCouponService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyCouponAdapter(service),
	};
}
