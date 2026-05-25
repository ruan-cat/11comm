import type { H3Event } from "nitro/h3";
import { createLegacyRoomUnitAdapter } from "./legacy-adapter";
import { createRoomUnitRepository, type RoomUnitRepository } from "./repository";
import { createRoomUnitService, type RoomUnitService } from "./service";

export interface RoomUnitRuntime {
	repository: RoomUnitRepository;
	service: RoomUnitService;
	legacyAdapter: ReturnType<typeof createLegacyRoomUnitAdapter>;
}

const fallbackRuntime = createRoomUnitRuntime(createRoomUnitRepository());

export function getRoomUnitRuntime(_event?: H3Event): RoomUnitRuntime {
	return fallbackRuntime;
}

function createRoomUnitRuntime(repository: RoomUnitRepository): RoomUnitRuntime {
	const service = createRoomUnitService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyRoomUnitAdapter(service),
	};
}
