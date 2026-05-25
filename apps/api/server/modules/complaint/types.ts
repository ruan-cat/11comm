export type ComplaintTypeCd = "809001" | "809002";
export type ComplaintState = "1100" | "1200";

export interface ComplaintPhoto {
	photoId: string;
	complaintId: string;
	photo: string;
	url: string;
}

export interface Complaint {
	complaintId: string;
	communityId: string;
	storeId: string;
	userId: string;
	typeCd: ComplaintTypeCd;
	typeName: string;
	complaintName: string;
	tel: string;
	roomId: string;
	roomName: string;
	floorNum?: string;
	unitNum?: string;
	roomNum?: string;
	context: string;
	state: ComplaintState;
	stateName: string;
	createTime: string;
	taskId: string;
	photos: ComplaintPhoto[];
}

export interface ComplaintEvent {
	eventId: string;
	complaintId: string;
	communityId: string;
	eventType: "1000" | "1001";
	eventTypeName: string;
	createUserId: string;
	createUserName: string;
	createTime: string;
	remark?: string;
}

export interface ComplaintAppraise {
	appraiseId: string;
	complaintId: string;
	communityId: string;
	context: string;
	score: number;
	state: string;
	stateName: string;
	replyContext: string;
	createTime: string;
	createUserName: string;
}

export interface ComplaintListQuery {
	page: number;
	row: number;
	process?: string;
}

export interface ComplaintDetailListQuery {
	complaintId: string;
	page: number;
	row: number;
}

export interface ComplaintListResult {
	data: Complaint[];
	total: number;
	page: number;
	records: number;
}

export interface ComplaintHistoryListResult {
	complaints: Complaint[];
	total: number;
	page: number;
	records: number;
}

export interface ComplaintEventListResult {
	data: ComplaintEvent[];
	total: number;
}

export interface ComplaintAppraiseListResult {
	data: ComplaintAppraise[];
	total: number;
}

export interface ComplaintWriteInput {
	[key: string]: unknown;
}

export interface ComplaintGuardDecision {
	code: 409;
	message: string;
	errorCode: "PHASE7_MUTATION_GUARDED";
}
