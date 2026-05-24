export interface MonitorArea {
	maId: string;
	maName: string;
}

export interface MonitorMachine {
	machineId: string;
	communityId: string;
	machineName: string;
	maId: string;
	maName: string;
	photoUrl?: string;
}

export interface VideoPlayUrl {
	url: string;
}

export interface PaginationResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface PaginationQuery {
	page: number;
	row: number;
}

export interface MonitorMachineQuery extends PaginationQuery {
	maId?: string;
	machineNameLike?: string;
}

export interface VideoPlayUrlQuery {
	machineId: string;
}
