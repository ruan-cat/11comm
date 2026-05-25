import type { RoomUnitRepository } from "./repository";
import type { RoomListQuery, UnitListQuery } from "./types";

export interface RoomUnitService {
	listUnits(query: UnitListQuery): ReturnType<RoomUnitRepository["listUnits"]>;
	getUnitById(unitId: string): ReturnType<RoomUnitRepository["getUnitById"]>;
	listRooms(query: RoomListQuery): ReturnType<RoomUnitRepository["listRooms"]>;
	getRoomById(roomId: string): ReturnType<RoomUnitRepository["getRoomById"]>;
}

export function createRoomUnitService(repository: RoomUnitRepository): RoomUnitService {
	return {
		listUnits: (query) => repository.listUnits(query),
		getUnitById: (unitId) => repository.getUnitById(unitId),
		listRooms: (query) => repository.listRooms(query),
		getRoomById: (roomId) => repository.getRoomById(roomId),
	};
}
