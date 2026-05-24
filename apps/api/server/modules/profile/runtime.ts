import type { H3Event } from "nitro/h3";
import { createLegacyProfileAdapter } from "./legacy-adapter";
import { createProfileRepository, type ProfileRepository } from "./repository";
import { createProfileService, type ProfileService } from "./service";

export interface ProfileRuntime {
	repository: ProfileRepository;
	service: ProfileService;
	legacyAdapter: ReturnType<typeof createLegacyProfileAdapter>;
}

const fallbackRuntime = createProfileRuntime(createProfileRepository());

export function getProfileRuntime(_event?: H3Event): ProfileRuntime {
	return fallbackRuntime;
}

function createProfileRuntime(repository: ProfileRepository): ProfileRuntime {
	const service = createProfileService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyProfileAdapter(service),
	};
}
