export interface RoomUnitPagination<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface UnitItem {
	unitId: string;
	unitNum: string;
	floorId: string;
	communityId: string;
}

export interface RoomItem {
	roomId: string;
	roomNum: string;
	unitId: string;
	floorId: string;
	communityId: string;
}

export interface UnitListQuery {
	communityId?: string;
	floorId?: string;
	unitNum?: string;
	page: number;
	row: number;
}

export interface RoomListQuery {
	communityId?: string;
	floorId?: string;
	unitId?: string;
	roomNum?: string;
	page: number;
	row: number;
}
