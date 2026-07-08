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

export interface ResourceApplyItem {
	applyOrderId: string;
	resourceNames: string;
	state: number;
	stateName: string;
	createUserId: string;
	createUserName: string;
	createTime: string;
	description?: string;
}

export interface ResourceAuditTask {
	taskId: string;
	businessId: string;
	businessType: string;
	state: number;
	stateName: string;
	resourceNames: string;
	createUserId: string;
	createUserName: string;
	createTime: string;
}

export interface ResourceStoreItem {
	resId: string;
	resName: string;
	resCode: string;
	parentRstName?: string;
	rstName?: string;
	price: number;
	stock: number;
	description: string;
	unitCodeName?: string;
	miniStock?: number;
	miniUnitCodeName?: string;
	isFixed?: string;
	isFixedName?: string;
	userId?: string;
	userName?: string;
}

export interface ResourceStoreType {
	rstId: string;
	rstName: string;
	parentRstId: string;
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

export interface ResourceUserStorehouseQuery extends ResourcePageQuery {
	keyword?: string;
}

export interface ResourceUserStorehouseResult {
	resources: ResourceStoreItem[];
	total: number;
}

export interface ResourcePageQuery {
	page: number;
	row: number;
}

export interface ResourceMyStoreQuery extends ResourcePageQuery {
	resName?: string;
	searchUserName?: string;
}

export interface ResourceWriteInput {
	[key: string]: unknown;
}

export interface ResourceGuardDecision {
	code: string;
	message: string;
	errorCode: "PHASE7_MUTATION_GUARDED";
}
