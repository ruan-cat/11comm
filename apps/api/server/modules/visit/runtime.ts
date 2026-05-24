import type { H3Event } from "nitro/h3";
import { createLegacyVisitAdapter } from "./legacy-adapter";
import { createVisitRepository, type VisitRepository } from "./repository";
import { createVisitService, type VisitService } from "./service";

export interface VisitRuntime {
	repository: VisitRepository;
	service: VisitService;
	legacyAdapter: ReturnType<typeof createLegacyVisitAdapter>;
}

const fallbackRuntime = createVisitRuntime(createVisitRepository());

export function getVisitRuntime(_event?: H3Event): VisitRuntime {
	return fallbackRuntime;
}

function createVisitRuntime(repository: VisitRepository): VisitRuntime {
	const service = createVisitService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyVisitAdapter(service),
	};
}
