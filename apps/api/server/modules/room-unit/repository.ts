import type { RoomItem, RoomListQuery, RoomUnitPagination, UnitItem, UnitListQuery } from "./types";

export interface RoomUnitRepository {
	listUnits(query: UnitListQuery): RoomUnitPagination<UnitItem>;
	getUnitById(unitId: string): UnitItem | undefined;
	listRooms(query: RoomListQuery): RoomUnitPagination<RoomItem>;
	getRoomById(roomId: string): RoomItem | undefined;
}

const communityIds = ["COMM_001", "COMM_002", "COMM_003"] as const;

interface RoomUnitSeed {
	units: UnitItem[];
	rooms: RoomItem[];
}

const seed = createSeed();

export function createRoomUnitRepository(): RoomUnitRepository {
	return {
		listUnits(query) {
			let filtered = seed.units;

			if (query.communityId) {
				filtered = filtered.filter((unit) => unit.communityId === query.communityId);
			}
			if (query.floorId) {
				filtered = filtered.filter((unit) => unit.floorId === query.floorId);
			}
			if (query.unitNum) {
				const keyword = query.unitNum.toLowerCase();
				filtered = filtered.filter((unit) => unit.unitNum.toLowerCase().includes(keyword));
			}

			return paginate(filtered, query.page, query.row);
		},

		getUnitById(unitId) {
			const unit = seed.units.find((item) => item.unitId === unitId);
			return unit ? cloneValue(unit) : undefined;
		},

		listRooms(query) {
			let filtered = seed.rooms;

			if (query.communityId) {
				filtered = filtered.filter((room) => room.communityId === query.communityId);
			}
			if (query.floorId) {
				filtered = filtered.filter((room) => room.floorId === query.floorId);
			}
			if (query.unitId) {
				filtered = filtered.filter((room) => room.unitId === query.unitId);
			}
			if (query.roomNum) {
				filtered = filtered.filter((room) => room.roomNum.includes(query.roomNum ?? ""));
			}

			return paginate(filtered, query.page, query.row);
		},

		getRoomById(roomId) {
			const room = seed.rooms.find((item) => item.roomId === roomId);
			return room ? cloneValue(room) : undefined;
		},
	};
}

function createSeed(): RoomUnitSeed {
	const units: UnitItem[] = [];
	const rooms: RoomItem[] = [];

	for (const communityId of communityIds) {
		for (let floorIndex = 1; floorIndex <= 30; floorIndex += 1) {
			for (let unitIndex = 1; unitIndex <= 8; unitIndex += 1) {
				const unit = createUnit(communityId, floorIndex, unitIndex);
				units.push(unit);

				for (let roomIndex = 1; roomIndex <= 6; roomIndex += 1) {
					rooms.push(createRoom(communityId, floorIndex, unitIndex, roomIndex));
				}
			}
		}
	}

	return { units, rooms };
}

function createUnit(communityId: string, floorIndex: number, unitIndex: number): UnitItem {
	const floorCode = floorIndex.toString().padStart(3, "0");
	const unitCode = unitIndex.toString().padStart(2, "0");
	const floorId = `F_${communityId}_${floorCode}`;

	return {
		unitId: `U_${communityId}_${floorCode}_${unitCode}`,
		unitNum: `${unitIndex}`,
		floorId,
		communityId,
	};
}

function createRoom(communityId: string, floorIndex: number, unitIndex: number, roomIndex: number): RoomItem {
	const floorCode = floorIndex.toString().padStart(3, "0");
	const unitCode = unitIndex.toString().padStart(2, "0");
	const roomCode = roomIndex.toString().padStart(2, "0");
	const floorId = `F_${communityId}_${floorCode}`;
	const unitId = `U_${communityId}_${floorCode}_${unitCode}`;

	return {
		roomId: `R_${communityId}_${floorCode}_${unitCode}_${roomCode}`,
		roomNum: `${unitIndex}${roomCode}`,
		unitId,
		floorId,
		communityId,
	};
}

function paginate<T>(items: readonly T[], page: number, row: number): RoomUnitPagination<T> {
	const start = (page - 1) * row;
	const end = start + row;

	return {
		list: cloneValue(items.slice(start, end)),
		total: items.length,
		page,
		pageSize: row,
		hasMore: end < items.length,
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
