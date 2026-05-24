import type { H3Event } from "nitro/h3";
import { createLegacyVideoAdapter } from "./legacy-adapter";
import { createVideoRepository, type VideoRepository } from "./repository";
import { createVideoService, type VideoService } from "./service";

export interface VideoRuntime {
	repository: VideoRepository;
	service: VideoService;
	legacyAdapter: ReturnType<typeof createLegacyVideoAdapter>;
}

const fallbackRuntime = createVideoRuntime(createVideoRepository());

export function getVideoRuntime(_event?: H3Event): VideoRuntime {
	return fallbackRuntime;
}

function createVideoRuntime(repository: VideoRepository): VideoRuntime {
	const service = createVideoService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyVideoAdapter(service),
	};
}
