export interface VisitRecord {
	visitId: string;
	name: string;
	phoneNumber: string;
	ownerName: string;
	roomName: string;
	carNum: string;
	visitTime: string;
	state: string;
	stateName: string;
	taskId?: string;
}

export interface VisitDetail extends VisitRecord {
	departureTime: string;
	visitCase: string;
}

export interface PaginationResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface VisitListQuery {
	page: number;
	row: number;
	state?: string;
	visitId?: string;
}

export interface VisitDetailQuery {
	page: number;
	row: number;
	visitId: string;
}
