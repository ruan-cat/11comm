export interface WorkOrderListItem {
	orderId: string;
	orderNo: string;
	title: string;
	type: string;
	typeName: string;
	status: string;
	statusName: string;
	priority: string;
	priorityName: string;
	content: string;
	staffId?: string;
	staffName?: string;
	creatorId: string;
	creatorName: string;
	planStartTime: string;
	planEndTime: string;
	createTime: string;
	communityId: string;
	communityName: string;
	isCopyToMe?: boolean;
}

export interface WorkOrderDetail extends WorkOrderListItem {
	attachments: string[];
	copyUsers: Array<{ userId: string; userName: string }>;
	operationLogs: Array<{
		logId: string;
		orderId: string;
		operationType: string;
		operationTypeName: string;
		operatorId: string;
		operatorName: string;
		operationTime: string;
		remark?: string;
	}>;
}

export interface WorkOrderTask {
	taskId: string;
	workId: string;
	staffId: string;
	staffName: string;
	state: string;
	createTime: string;
}

export interface WorkOrderTaskItem {
	itemId: string;
	workId: string;
	taskId: string;
	content: string;
	staffId?: string;
	staffName?: string;
	state: string;
	remark?: string;
	finishTime?: string;
	pathUrls?: string[];
	createTime: string;
}

export interface PaginationResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface WorkOrderTodoQuery {
	page: number;
	row: number;
	communityId: string;
	status?: string;
	type?: string;
	keyword?: string;
}

export interface WorkOrderCopyQuery {
	page: number;
	row: number;
	status?: string;
	keyword?: string;
}

export interface WorkOrderTaskQuery {
	page: number;
	row: number;
	workId: string;
}

export interface WorkOrderTaskItemQuery extends WorkOrderTaskQuery {
	states?: string[];
}
