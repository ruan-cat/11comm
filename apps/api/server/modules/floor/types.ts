export interface Floor {
	floorId: string;
	floorNum: string;
	floorName: string;
	communityId: string;
}

export interface FloorListQuery {
	communityId?: string;
	floorNum?: string;
	keyword?: string;
	page: number;
	row: number;
}

export interface FloorListResult {
	list: Floor[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}
