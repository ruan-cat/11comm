import type {
	ResourceAllocationItem,
	ResourceGuardDecision,
	ResourcePageQuery,
	ResourcePageResult,
	ResourceStoreHouse,
	ResourceStorehouseQuery,
	ResourceWriteInput,
} from "./types";

export interface ResourceRepository {
	listStorehouses(query: ResourceStorehouseQuery): Promise<ResourcePageResult<ResourceStoreHouse>>;
	listAllocationStorehouseApplys(query: ResourcePageQuery): Promise<ResourcePageResult<ResourceAllocationItem>>;
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

		async getResourceGuardDecision(action, input) {
			void input;
			return createGuardDecision(action);
		},
	};
}
