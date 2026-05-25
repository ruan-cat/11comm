import type { H3Event } from "nitro/h3";
import { createLegacyActivityAdapter } from "./legacy-adapter";
import { createActivityRepository, type ActivityRepository } from "./repository";
import { createActivityService, type ActivityService } from "./service";

export interface ActivityRuntime {
	repository: ActivityRepository;
	service: ActivityService;
	legacyAdapter: ReturnType<typeof createLegacyActivityAdapter>;
}

const fallbackRuntime = createActivityRuntime(createActivityRepository());

export function getActivityRuntime(_event?: H3Event): ActivityRuntime {
	return fallbackRuntime;
}

function createActivityRuntime(repository: ActivityRepository): ActivityRuntime {
	const service = createActivityService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyActivityAdapter(service),
	};
}
