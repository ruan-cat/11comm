import type { FloorRepository } from "./repository";
import type { FloorListQuery, FloorListResult } from "./types";
import type { Floor } from "./types";

export interface FloorService {
	getFloorById: (floorId: string) => Promise<Floor | undefined>;
	listFloors: (params: FloorListQuery) => Promise<FloorListResult>;
}

export function createFloorService(repository: FloorRepository): FloorService {
	return {
		getFloorById: (floorId) => repository.getFloorById(floorId),
		listFloors: (params) => repository.listFloors(params),
	};
}
