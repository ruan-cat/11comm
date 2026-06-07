import type { H3Event } from "nitro/h3";
import { createLegacyInspectionAdapter } from "./legacy-adapter";
import { createInspectionRepository, type InspectionRepository } from "./repository";
import { createInspectionService, type InspectionService } from "./service";

export interface InspectionRuntime {
	repository: InspectionRepository;
	service: InspectionService;
	legacyAdapter: ReturnType<typeof createLegacyInspectionAdapter>;
}

const fallbackRuntime = createInspectionRuntime(createInspectionRepository());

export function getInspectionRuntime(_event?: H3Event): InspectionRuntime {
	return fallbackRuntime;
}

function createInspectionRuntime(repository: InspectionRepository): InspectionRuntime {
	const service = createInspectionService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyInspectionAdapter(service),
	};
}
