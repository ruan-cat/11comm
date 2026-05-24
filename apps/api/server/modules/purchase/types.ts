export interface PurchaseUpdateApplyInput {
	[key: string]: unknown;
}

export interface PurchaseGuardDecision {
	code: number;
	message: string;
	errorCode: "PHASE7_MUTATION_GUARDED";
}
