export type ApplicationState = "0" | "1" | "2" | "3" | "4" | "5" | "6";

export interface ApplyRoomDiscount {
	ardId: string;
	applyType: string;
	applyTypeName: string;
	roomId: string;
	roomName: string;
	communityId: string;
	createUserName: string;
	createUserTel: string;
	createRemark: string;
	checkRemark: string;
	reviewRemark: string;
	startTime: string;
	endTime: string;
	feeId: string;
	state: ApplicationState;
	stateName: string;
	urls: string[];
	createTime: string;
	updateTime: string;
}

export interface ApplyRoomDiscountListQuery {
	page: number;
	row: number;
	communityId: string;
	roomName?: string;
	state?: string;
}

export interface ApplyRoomDiscountListResult {
	list: ApplyRoomDiscount[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface ApplyRoomDiscountRecord {
	ardrId: string;
	applicationId: string;
	roomId: string;
	roomName: string;
	state: string;
	stateName: string;
	remark: string;
	createUserName: string;
	createTime: string;
	communityId: string;
}

export interface ApplyRoomDiscountRecordQuery {
	page: number;
	row: number;
	communityId: string;
	applicationId?: string;
	roomId?: string;
	roomName?: string;
}

export interface ApplyRoomDiscountRecordListResult {
	list: ApplyRoomDiscountRecord[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface FeeDiscount {
	discountId: string;
	discountName: string;
	discountType: string;
	discountAmount: number;
	communityId: string;
}

export interface ApplicationRecordDetail {
	ardrId: string;
	applicationId: string;
	roomId: string;
	roomName: string;
	relTypeCd: string;
	url: string;
	remark: string;
	createTime: string;
}

export interface FeeDiscountQuery {
	discountType: string;
	communityId: string;
}

export interface ApplicationRecordDetailQuery {
	ardrId?: string;
	communityId?: string;
}
