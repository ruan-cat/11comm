import type { PurchaseGuardDecision, PurchaseUpdateApplyInput } from "./types";

export interface PurchaseRepository {
	getUpdatePurchaseApplyGuardDecision(input: PurchaseUpdateApplyInput): Promise<PurchaseGuardDecision>;
}

const guardedDecision: PurchaseGuardDecision = {
	code: 409,
	message:
		"Phase7 mutation guard blocked purchase.updatePurchaseApply; no exact legacy server source exists, so this endpoint stays no-go until write read-back rollback evidence is designed.",
	errorCode: "PHASE7_MUTATION_GUARDED",
};

export function createPurchaseRepository(): PurchaseRepository {
	return {
		async getUpdatePurchaseApplyGuardDecision(input) {
			void input;
			return guardedDecision;
		},
	};
}
