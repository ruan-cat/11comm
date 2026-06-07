import type { H3Event } from "nitro/h3";
import { createLegacyItemReleaseAdapter } from "./legacy-adapter";
import { createItemReleaseRepository, type ItemReleaseRepository } from "./repository";
import { createItemReleaseService, type ItemReleaseService } from "./service";

export interface ItemReleaseRuntime {
	repository: ItemReleaseRepository;
	service: ItemReleaseService;
	legacyAdapter: ReturnType<typeof createLegacyItemReleaseAdapter>;
}

const fallbackRuntime = createItemReleaseRuntime(createItemReleaseRepository());

export function getItemReleaseRuntime(_event?: H3Event): ItemReleaseRuntime {
	return fallbackRuntime;
}

function createItemReleaseRuntime(repository: ItemReleaseRepository): ItemReleaseRuntime {
	const service = createItemReleaseService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyItemReleaseAdapter(service),
	};
}
