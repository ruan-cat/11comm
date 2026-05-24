import type { H3Event } from "nitro/h3";
import { createLegacyPurchaseAdapter } from "./legacy-adapter";
import { createPurchaseRepository, type PurchaseRepository } from "./repository";
import { createPurchaseService, type PurchaseService } from "./service";

export interface PurchaseRuntime {
	repository: PurchaseRepository;
	service: PurchaseService;
	legacyAdapter: ReturnType<typeof createLegacyPurchaseAdapter>;
}

const fallbackRuntime = createPurchaseRuntime(createPurchaseRepository());

export function getPurchaseRuntime(_event?: H3Event): PurchaseRuntime {
	return fallbackRuntime;
}

function createPurchaseRuntime(repository: PurchaseRepository): PurchaseRuntime {
	const service = createPurchaseService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyPurchaseAdapter(service),
	};
}
