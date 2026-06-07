export interface ResourceStoreHouse {
	shId: string;
	shName: string;
	shCode: string;
	address: string;
	allowPurchase: string;
}

export interface ResourceAllocationItem {
	allocationId: string;
	resourceNames: string;
	state: number;
	stateName: string;
	createUserId: string;
	createUserName: string;
	createTime: string;
	fromShName: string;
	toShName: string;
}

export interface ResourcePageResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface ResourceLegacyResponse<T> {
	success: boolean;
	code: string;
	message: string;
	data: T;
	timestamp: number;
}

export interface ResourceStorehouseQuery {
	allowPurchase?: string;
	page: number;
	row: number;
}

export interface ResourcePageQuery {
	page: number;
	row: number;
}

export interface ResourceWriteInput {
	[key: string]: unknown;
}

export interface ResourceGuardDecision {
	code: string;
	message: string;
	errorCode: "PHASE7_MUTATION_GUARDED";
}
