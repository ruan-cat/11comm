import type { H3Event } from "nitro/h3";
import { createLegacyResourceAdapter } from "./legacy-adapter";
import { createResourceRepository, type ResourceRepository } from "./repository";
import { createResourceService, type ResourceService } from "./service";

export interface ResourceRuntime {
	repository: ResourceRepository;
	service: ResourceService;
	legacyAdapter: ReturnType<typeof createLegacyResourceAdapter>;
}

const fallbackRuntime = createResourceRuntime(createResourceRepository());

export function getResourceRuntime(_event?: H3Event): ResourceRuntime {
	return fallbackRuntime;
}

function createResourceRuntime(repository: ResourceRepository): ResourceRuntime {
	const service = createResourceService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyResourceAdapter(service),
	};
}
