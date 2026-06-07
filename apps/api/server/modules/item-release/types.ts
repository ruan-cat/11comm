export interface ItemReleaseDetail {
	irId: string;
	flowId: string;
	typeName: string;
	applyCompany: string;
	applyPerson: string;
	applyTel: string;
	idCard: string;
	carNum: string;
	passTime: string;
	remark: string;
	createUserId: string;
}

export interface ItemReleaseDetailQuery {
	irId: string;
}

export interface ItemReleaseResource {
	resId: string;
	resName: string;
	amount: number;
}

export interface ItemReleaseResourceQuery {
	irId: string;
}

export interface ItemReleaseComment {
	staffName: string;
	context: string;
	endTime?: string;
}

export interface ItemReleaseCommentQuery {
	id: string;
}

export interface ItemReleaseTask {
	irId: string;
	flowId: string;
	taskId?: string;
	typeName: string;
	stateName: string;
	passTime: string;
	amount: number;
	action: string;
}

export interface ItemReleaseTaskPaginationQuery {
	page?: number;
	row?: number;
}

export interface LegacyPaginationResponse<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}
