export interface PurchaseUpdateApplyInput {
	[key: string]: unknown;
}

export interface PurchaseResourceStore {
	resId: string;
	resName: string;
	resCode: string;
	price: number;
	stock: number;
	description: string;
	quantity: number;
}

export interface PurchaseGuardDecision {
	code: number;
	message: string;
	errorCode: "PHASE7_MUTATION_GUARDED";
}
