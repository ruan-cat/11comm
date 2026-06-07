export interface InspectionTodayReport {
	staffId: string;
	staffName: string;
	finishCount: number;
	waitCount: number;
}

export interface InspectionStaff {
	userId: string;
	userName: string;
}

export interface InspectionItemTitleValue {
	itemValue: string;
}

export interface InspectionItemTitle {
	titleId: string;
	itemTitle: string;
	titleType: string;
	radio: string | string[];
	inspectionItemTitleValueDtos: InspectionItemTitleValue[];
}

export interface InspectionTask {
	taskId: string;
	inspectionPlanId: string;
	inspectionPlanName: string;
	planUserName: string;
	planInsTime: string;
	signTypeName: string;
	stateName: string;
	state: string;
	originalPlanUserId?: string;
	originalPlanUserName?: string;
	planEndTime?: string;
	planUserId?: string;
	signType?: string;
	statusCd?: string;
}

export interface InspectionTaskDetail {
	taskDetailId: string;
	taskId: string;
	inspectionId: string;
	inspectionName: string;
	itemId: string;
	state: string;
	stateName?: string;
	pointStartTime?: string;
	pointEndTime?: string;
	description?: string;
	photos?: InspectionTaskPhoto[];
}

export interface InspectionTaskPhoto {
	url: string;
	fileId?: string;
}

export interface InspectionItemTitleQuery {
	communityId?: string;
	itemId: string;
	page: number;
	row: number;
}

export interface InspectionTaskQuery {
	canReexamine?: string;
	isToday: number;
	moreState?: string;
	page: number;
	planInsTime?: string;
	row: number;
}

export interface InspectionTaskDetailQuery {
	inspectionId?: string;
	page: number;
	planUserId?: string;
	qrCodeTime?: string;
	row: number;
	state?: string;
	taskId?: string;
}

export interface InspectionPaginationResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}
