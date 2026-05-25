import type { H3Event } from "nitro/h3";
import { createLegacyOwnerAdapter } from "./legacy-adapter";
import { createOwnerRepository, type OwnerRepository } from "./repository";
import { createOwnerService, type OwnerService } from "./service";

export interface OwnerRuntime {
	repository: OwnerRepository;
	service: OwnerService;
	legacyAdapter: ReturnType<typeof createLegacyOwnerAdapter>;
}

const fallbackRuntime = createOwnerRuntime(createOwnerRepository());

export function getOwnerRuntime(_event?: H3Event): OwnerRuntime {
	return fallbackRuntime;
}

function createOwnerRuntime(repository: OwnerRepository): OwnerRuntime {
	const service = createOwnerService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyOwnerAdapter(service),
	};
}
