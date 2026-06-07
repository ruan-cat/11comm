import type { PurchaseRepository } from "./repository";
import type { PurchaseUpdateApplyInput } from "./types";

export interface PurchaseService {
	listResourceStores(): ReturnType<PurchaseRepository["listResourceStores"]>;
	getPurchaseGuardDecision(
		action: string,
		input: PurchaseUpdateApplyInput,
	): ReturnType<PurchaseRepository["getPurchaseGuardDecision"]>;
}

export function createPurchaseService(repository: PurchaseRepository): PurchaseService {
	return {
		listResourceStores: () => repository.listResourceStores(),
		getPurchaseGuardDecision: (action, input) => repository.getPurchaseGuardDecision(action, input),
	};
}
