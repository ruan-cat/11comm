export interface MaintenanceTask {
	taskId: string;
	taskName: string;
	machineName: string;
	machineId: string;
	planTime: string;
	status: string;
	statusName: string;
	staffId?: string;
	staffName?: string;
	communityId: string;
}

export interface MaintenanceTaskDetail {
	taskDetailId: string;
	taskId: string;
	itemName: string;
	itemContent: string;
	result?: string;
	remark?: string;
	photos?: string[];
}

export interface MaintenanceTaskQuery {
	page: number;
	row: number;
	communityId: string;
	status?: string;
}

export interface MaintenancePaginationResponse<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface MaintenanceLegacyResponse<T> {
	success: boolean;
	code: string;
	message: string;
	data: T;
	timestamp: number;
}
