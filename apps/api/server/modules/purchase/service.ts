import type { PurchaseRepository } from "./repository";
import type { PurchaseUpdateApplyInput } from "./types";

export interface PurchaseService {
	getUpdatePurchaseApplyGuardDecision(
		input: PurchaseUpdateApplyInput,
	): ReturnType<PurchaseRepository["getUpdatePurchaseApplyGuardDecision"]>;
}

export function createPurchaseService(repository: PurchaseRepository): PurchaseService {
	return {
		getUpdatePurchaseApplyGuardDecision: (input) => repository.getUpdatePurchaseApplyGuardDecision(input),
	};
}
