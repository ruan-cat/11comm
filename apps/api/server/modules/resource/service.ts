import type { ResourceRepository } from "./repository";
import type { ResourcePageQuery, ResourceStorehouseQuery, ResourceWriteInput } from "./types";

export interface ResourceService {
	listStorehouses(query: ResourceStorehouseQuery): ReturnType<ResourceRepository["listStorehouses"]>;
	listAllocationStorehouseApplys(
		query: ResourcePageQuery,
	): ReturnType<ResourceRepository["listAllocationStorehouseApplys"]>;
	getResourceGuardDecision(
		action: string,
		input: ResourceWriteInput,
	): ReturnType<ResourceRepository["getResourceGuardDecision"]>;
}

export function createResourceService(repository: ResourceRepository): ResourceService {
	return {
		listStorehouses: (query) => repository.listStorehouses(query),
		listAllocationStorehouseApplys: (query) => repository.listAllocationStorehouseApplys(query),
		getResourceGuardDecision: (action, input) => repository.getResourceGuardDecision(action, input),
	};
}
