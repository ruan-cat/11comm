import type { H3Event } from "nitro/h3";
import { createRenovationRepository, type RenovationRepository } from "./repository";
import { createRenovationService, type RenovationService } from "./service";
import { createLegacyRenovationAdapter } from "./legacy-adapter";

export interface RenovationRuntime {
	repository: RenovationRepository;
	service: RenovationService;
	legacyAdapter: ReturnType<typeof createLegacyRenovationAdapter>;
}

const fallbackRuntime = createRenovationRuntime(createRenovationRepository());

export function getRenovationRuntime(_event?: H3Event): RenovationRuntime {
	return fallbackRuntime;
}

function createRenovationRuntime(repository: RenovationRepository): RenovationRuntime {
	const service = createRenovationService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyRenovationAdapter(service),
	};
}
