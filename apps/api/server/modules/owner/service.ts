import type { OwnerRepository } from "./repository";
import type { OwnerListQuery, OwnerWriteInput } from "./types";

export interface OwnerService {
	listOwners(query: OwnerListQuery): ReturnType<OwnerRepository["listOwners"]>;
	getWriteGuardDecision(endpoint: string, input: OwnerWriteInput): ReturnType<OwnerRepository["getWriteGuardDecision"]>;
}

export function createOwnerService(repository: OwnerRepository): OwnerService {
	return {
		listOwners: (query) => repository.listOwners(query),
		getWriteGuardDecision: (endpoint, input) => repository.getWriteGuardDecision(endpoint, input),
	};
}
