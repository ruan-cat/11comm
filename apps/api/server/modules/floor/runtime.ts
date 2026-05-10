import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createLegacyFloorAdapter } from "./legacy-adapter";
import { createFloorRepository, type FloorRepository } from "./repository";
import { createFloorService, type FloorService } from "./service";

export interface FloorRuntime {
	repository: FloorRepository;
	service: FloorService;
	legacyAdapter: ReturnType<typeof createLegacyFloorAdapter>;
}

const fallbackRuntime = createFloorRuntime(createFloorRepository());

export function getFloorRuntime(event?: H3Event): FloorRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.floorRuntime) {
		return context.floorRuntime as FloorRuntime;
	}

	const runtime = createFloorRuntime(createFloorRepository({ db: useDb(event) }));
	context.floorRuntime = runtime;
	return runtime;
}

export function createFloorRuntime(repository: FloorRepository): FloorRuntime {
	const service = createFloorService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyFloorAdapter(service),
	};
}
