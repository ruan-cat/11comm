export type RenovationState = 1000 | 2000 | 3000 | 4000 | 5000 | 6000;

export interface RenovationApplication {
	rId: string;
	communityId: string;
	roomId: string;
	roomName: string;
	userId: string;
	personName: string;
	personTel: string;
	startTime: string;
	endTime: string;
	renovationCompany: string;
	personMain: string;
	personMainTel: string;
	isPostpone: "Y" | "N";
	postponeTime?: string;
	remark: string;
	state: number;
	stateName: string;
	isViolation: "Y" | "N";
}

export interface RenovationQueryParams {
	page: number;
	row: number;
	communityId: string;
	roomName?: string;
	state?: string;
}

export interface RenovationRecord {
	recordId: string;
	rId: string;
	communityId: string;
	roomId: string;
	roomName: string;
	state: number;
	stateName: string;
	staffName: string;
	remark: string;
	createTime: string;
	isTrue?: string;
}

export interface RenovationRecordQueryParams {
	page: number;
	row: number;
	communityId: string;
	rId: string;
	roomName?: string;
	roomId?: string;
}

export interface RenovationRecordMedia {
	detailId: string;
	recordId: string;
	relTypeCd: 19000 | 21000;
	url: string;
	remark?: string;
}

export interface RenovationListResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}
