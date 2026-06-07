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
