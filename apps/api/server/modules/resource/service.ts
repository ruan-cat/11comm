import type { ResourceRepository } from "./repository";
import type { ResourceMyStoreQuery, ResourcePageQuery, ResourceStorehouseQuery, ResourceWriteInput } from "./types";

export interface ResourceService {
	listStorehouses(query: ResourceStorehouseQuery): ReturnType<ResourceRepository["listStorehouses"]>;
	listAllocationStorehouseApplys(
		query: ResourcePageQuery,
	): ReturnType<ResourceRepository["listAllocationStorehouseApplys"]>;
	listPurchaseApplys(query: ResourcePageQuery): ReturnType<ResourceRepository["listPurchaseApplys"]>;
	listItemReleases(query: ResourcePageQuery): ReturnType<ResourceRepository["listItemReleases"]>;
	listMyAuditOrders(query: ResourcePageQuery): ReturnType<ResourceRepository["listMyAuditOrders"]>;
	queryUndoItemRelease(query: ResourcePageQuery): ReturnType<ResourceRepository["queryUndoItemRelease"]>;
	listAllocationStoreAuditOrders(
		query: ResourcePageQuery,
	): ReturnType<ResourceRepository["listAllocationStoreAuditOrders"]>;
	listAllocationStorehouses(query: ResourcePageQuery): ReturnType<ResourceRepository["listAllocationStorehouses"]>;
	queryMyResourceStoreInfo(query: ResourceMyStoreQuery): ReturnType<ResourceRepository["queryMyResourceStoreInfo"]>;
	getResourceGuardDecision(
		action: string,
		input: ResourceWriteInput,
	): ReturnType<ResourceRepository["getResourceGuardDecision"]>;
}

export function createResourceService(repository: ResourceRepository): ResourceService {
	return {
		listStorehouses: (query) => repository.listStorehouses(query),
		listAllocationStorehouseApplys: (query) => repository.listAllocationStorehouseApplys(query),
		listPurchaseApplys: (query) => repository.listPurchaseApplys(query),
		listItemReleases: (query) => repository.listItemReleases(query),
		listMyAuditOrders: (query) => repository.listMyAuditOrders(query),
		queryUndoItemRelease: (query) => repository.queryUndoItemRelease(query),
		listAllocationStoreAuditOrders: (query) => repository.listAllocationStoreAuditOrders(query),
		listAllocationStorehouses: (query) => repository.listAllocationStorehouses(query),
		queryMyResourceStoreInfo: (query) => repository.queryMyResourceStoreInfo(query),
		getResourceGuardDecision: (action, input) => repository.getResourceGuardDecision(action, input),
	};
}
