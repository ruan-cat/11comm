import type { PurchaseGuardDecision, PurchaseResourceStore, PurchaseUpdateApplyInput } from "./types";

export interface PurchaseRepository {
	listResourceStores(): Promise<PurchaseResourceStore[]>;
	getPurchaseGuardDecision(action: string, input: PurchaseUpdateApplyInput): Promise<PurchaseGuardDecision>;
}

const resourceStores: PurchaseResourceStore[] = [
	{
		resId: "RES_001",
		resName: "Office Desk",
		resCode: "OFFICE_001",
		price: 599,
		stock: 50,
		description: "Standard desk",
		quantity: 0,
	},
	{
		resId: "RES_002",
		resName: "Office Chair",
		resCode: "OFFICE_002",
		price: 299,
		stock: 100,
		description: "Ergonomic chair",
		quantity: 0,
	},
	{
		resId: "RES_003",
		resName: "Printer Paper",
		resCode: "OFFICE_003",
		price: 25,
		stock: 500,
		description: "A4 paper",
		quantity: 0,
	},
];

function createGuardDecision(action: string): PurchaseGuardDecision {
	return {
		code: 409,
		message: `Phase7 mutation guard blocked ${action}; purchase writes stay no-go until write read-back rollback evidence is designed.`,
		errorCode: "PHASE7_MUTATION_GUARDED",
	};
}

export function createPurchaseRepository(): PurchaseRepository {
	return {
		async listResourceStores() {
			return structuredClone(resourceStores);
		},

		async getPurchaseGuardDecision(action, input) {
			void input;
			return createGuardDecision(action);
		},
	};
}
