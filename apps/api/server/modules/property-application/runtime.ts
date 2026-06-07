import type { H3Event } from "nitro/h3";
import { createLegacyPropertyApplicationAdapter } from "./legacy-adapter";
import { createPropertyApplicationRepository, type PropertyApplicationRepository } from "./repository";
import { createPropertyApplicationService, type PropertyApplicationService } from "./service";

export interface PropertyApplicationRuntime {
	repository: PropertyApplicationRepository;
	service: PropertyApplicationService;
	legacyAdapter: ReturnType<typeof createLegacyPropertyApplicationAdapter>;
}

const fallbackRuntime = createPropertyApplicationRuntime(createPropertyApplicationRepository());

export function getPropertyApplicationRuntime(_event?: H3Event): PropertyApplicationRuntime {
	return fallbackRuntime;
}

function createPropertyApplicationRuntime(repository: PropertyApplicationRepository): PropertyApplicationRuntime {
	const service = createPropertyApplicationService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyPropertyApplicationAdapter(service),
	};
}
