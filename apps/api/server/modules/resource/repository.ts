import type {
	ResourceAllocationItem,
	ResourceApplyItem,
	ResourceAuditTask,
	ResourceGuardDecision,
	ResourceMyStoreQuery,
	ResourcePageQuery,
	ResourcePageResult,
	ResourceStoreItem,
	ResourceStoreHouse,
	ResourceStorehouseQuery,
	ResourceWriteInput,
} from "./types";

export interface ResourceRepository {
	listStorehouses(query: ResourceStorehouseQuery): Promise<ResourcePageResult<ResourceStoreHouse>>;
	listAllocationStorehouseApplys(query: ResourcePageQuery): Promise<ResourcePageResult<ResourceAllocationItem>>;
	listPurchaseApplys(query: ResourcePageQuery): Promise<ResourcePageResult<ResourceApplyItem>>;
	listItemReleases(query: ResourcePageQuery): Promise<ResourcePageResult<ResourceApplyItem>>;
	listMyAuditOrders(query: ResourcePageQuery): Promise<ResourcePageResult<ResourceAuditTask>>;
	queryUndoItemRelease(query: ResourcePageQuery): Promise<ResourcePageResult<ResourceAuditTask>>;
	listAllocationStoreAuditOrders(query: ResourcePageQuery): Promise<ResourcePageResult<ResourceAuditTask>>;
	listAllocationStorehouses(query: ResourcePageQuery): Promise<ResourcePageResult<ResourceStoreItem>>;
	queryMyResourceStoreInfo(query: ResourceMyStoreQuery): Promise<ResourcePageResult<ResourceStoreItem>>;
	getResourceGuardDecision(action: string, input: ResourceWriteInput): Promise<ResourceGuardDecision>;
}

const storeHouseList: ResourceStoreHouse[] = [
	{
		shId: "SH_001",
		shName: "Headquarters Warehouse",
		shCode: "HQ-001",
		address: "Building 1",
		allowPurchase: "ON",
	},
	{
		shId: "SH_002",
		shName: "Branch Warehouse",
		shCode: "BR-002",
		address: "Building 2",
		allowPurchase: "ON",
	},
	{
		shId: "SH_003",
		shName: "Temporary Warehouse",
		shCode: "TMP-003",
		address: "Building 3",
		allowPurchase: "OFF",
	},
];

const allocationList: ResourceAllocationItem[] = [
	{
		allocationId: "AL_20240301_001",
		resourceNames: "Office Desk",
		state: 1200,
		stateName: "Pending Audit",
		createUserId: "USER_001",
		createUserName: "Admin",
		createTime: "2024-03-01 10:00:00",
		fromShName: "Headquarters Warehouse",
		toShName: "Branch Warehouse",
	},
];

const resourceStoreList: ResourceStoreItem[] = [
	{
		resId: "RES_001",
		resName: "Office Desk",
		resCode: "OFFICE_001",
		parentRstName: "Office Furniture",
		rstName: "Desk",
		price: 599,
		stock: 50,
		description: "Standard office desk",
		unitCodeName: "piece",
		miniStock: 1,
		miniUnitCodeName: "piece",
		isFixed: "Y",
		isFixedName: "Yes",
	},
	{
		resId: "RES_002",
		resName: "Office Chair",
		resCode: "OFFICE_002",
		parentRstName: "Office Furniture",
		rstName: "Chair",
		price: 299,
		stock: 100,
		description: "Ergonomic office chair",
		unitCodeName: "piece",
		miniStock: 1,
		miniUnitCodeName: "piece",
		isFixed: "Y",
		isFixedName: "Yes",
	},
	{
		resId: "RES_003",
		resName: "A4 Printer Paper",
		resCode: "OFFICE_003",
		parentRstName: "Office Supplies",
		rstName: "Paper",
		price: 25,
		stock: 500,
		description: "A4 printer paper",
		unitCodeName: "pack",
		miniStock: 1,
		miniUnitCodeName: "pack",
		isFixed: "N",
		isFixedName: "No",
	},
];

const myResourceStoreList: ResourceStoreItem[] = [
	{
		resId: "MY_RES_001",
		resName: "Office Desk",
		resCode: "OFFICE_001",
		parentRstName: "Office Furniture",
		rstName: "Desk",
		price: 0,
		stock: 5,
		description: "",
		unitCodeName: "piece",
		miniStock: 5,
		miniUnitCodeName: "piece",
		isFixed: "Y",
		isFixedName: "Yes",
		userId: "USER_001",
		userName: "Admin",
	},
	{
		resId: "MY_RES_002",
		resName: "Office Chair",
		resCode: "OFFICE_002",
		parentRstName: "Office Furniture",
		rstName: "Chair",
		price: 0,
		stock: 8,
		description: "",
		unitCodeName: "piece",
		miniStock: 8,
		miniUnitCodeName: "piece",
		isFixed: "Y",
		isFixedName: "Yes",
		userId: "USER_001",
		userName: "Admin",
	},
	{
		resId: "MY_RES_003",
		resName: "Laser Printer",
		resCode: "ELECTRONIC_002",
		parentRstName: "Electronic Equipment",
		rstName: "Printer",
		price: 0,
		stock: 1,
		description: "",
		unitCodeName: "piece",
		miniStock: 1,
		miniUnitCodeName: "piece",
		isFixed: "Y",
		isFixedName: "Yes",
		userId: "USER_002",
		userName: "Operator",
	},
];

const purchaseApplyList: ResourceApplyItem[] = [
	{
		applyOrderId: "PA_20240301_001",
		resourceNames: "Office Desk, Office Chair",
		state: 1200,
		stateName: "Pending Audit",
		createUserId: "USER_001",
		createUserName: "Admin",
		createTime: "2024-03-01 10:00:00",
		description: "Office purchase",
	},
	{
		applyOrderId: "PA_20240302_001",
		resourceNames: "Printer Paper, Pen",
		state: 1300,
		stateName: "Completed",
		createUserId: "USER_002",
		createUserName: "Operator",
		createTime: "2024-03-02 14:30:00",
		description: "Daily office supplies",
	},
];

const itemReleaseList: ResourceApplyItem[] = [
	{
		applyOrderId: "IO_20240301_001",
		resourceNames: "Desktop Computer",
		state: 1200,
		stateName: "Pending Audit",
		createUserId: "USER_003",
		createUserName: "Worker",
		createTime: "2024-03-01 09:00:00",
		description: "New staff office equipment",
	},
	{
		applyOrderId: "IO_20240302_001",
		resourceNames: "Laser Printer",
		state: 1300,
		stateName: "Released",
		createUserId: "USER_004",
		createUserName: "Manager",
		createTime: "2024-03-02 11:00:00",
		description: "Department printer replacement",
	},
];

const auditTaskList: ResourceAuditTask[] = [
	{
		taskId: "TASK_001",
		businessId: "PA_20240301_001",
		businessType: "Purchase Audit",
		state: 1200,
		stateName: "Pending Audit",
		resourceNames: "Office Desk, Office Chair",
		createUserId: "USER_001",
		createUserName: "Admin",
		createTime: "2024-03-01 10:00:00",
	},
	{
		taskId: "TASK_002",
		businessId: "IO_20240301_001",
		businessType: "Item Release Audit",
		state: 1200,
		stateName: "Pending Audit",
		resourceNames: "Desktop Computer",
		createUserId: "USER_003",
		createUserName: "Worker",
		createTime: "2024-03-01 09:00:00",
	},
	{
		taskId: "TASK_003",
		businessId: "AL_20240301_001",
		businessType: "Allocation Audit",
		state: 1200,
		stateName: "Pending Audit",
		resourceNames: "Office Desk, File Cabinet",
		createUserId: "USER_001",
		createUserName: "Admin",
		createTime: "2024-03-01 15:00:00",
	},
];

function paginate<T>(items: T[], query: ResourcePageQuery): ResourcePageResult<T> {
	const page = query.page > 0 ? query.page : 1;
	const pageSize = query.row > 0 ? query.row : 10;
	const start = (page - 1) * pageSize;
	const list = items.slice(start, start + pageSize);

	return {
		list: structuredClone(list),
		total: items.length,
		page,
		pageSize,
		hasMore: start + pageSize < items.length,
	};
}

function createGuardDecision(action: string): ResourceGuardDecision {
	return {
		code: "409",
		message: `Phase7 mutation guard blocked ${action}; resource writes stay guarded until write read-back rollback evidence is designed.`,
		errorCode: "PHASE7_MUTATION_GUARDED",
	};
}

export function createResourceRepository(): ResourceRepository {
	return {
		async listStorehouses(query) {
			const filteredStorehouses = query.allowPurchase
				? storeHouseList.filter((storeHouse) => storeHouse.allowPurchase === query.allowPurchase)
				: storeHouseList;

			return paginate(filteredStorehouses, query);
		},

		async listAllocationStorehouseApplys(query) {
			return paginate(allocationList, query);
		},

		async listPurchaseApplys(query) {
			return paginate(purchaseApplyList, query);
		},

		async listItemReleases(query) {
			return paginate(itemReleaseList, query);
		},

		async listMyAuditOrders(query) {
			return paginate(
				auditTaskList.filter((task) => task.businessType === "Purchase Audit"),
				query,
			);
		},

		async queryUndoItemRelease(query) {
			return paginate(
				auditTaskList.filter((task) => task.businessType === "Item Release Audit"),
				query,
			);
		},

		async listAllocationStoreAuditOrders(query) {
			return paginate(
				auditTaskList.filter((task) => task.businessType === "Allocation Audit"),
				query,
			);
		},

		async listAllocationStorehouses(query) {
			return paginate(resourceStoreList, query);
		},

		async queryMyResourceStoreInfo(query) {
			let list = myResourceStoreList;
			if (query.resName) {
				list = list.filter((item) => item.resName.includes(query.resName ?? ""));
			}
			if (query.searchUserName) {
				list = list.filter((item) => item.userName?.includes(query.searchUserName ?? ""));
			}

			return paginate(list, query);
		},

		async getResourceGuardDecision(action, input) {
			void input;
			return createGuardDecision(action);
		},
	};
}
