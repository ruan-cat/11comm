import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { PurchaseService } from "./service";

export const purchaseLegacyGuardEvidence = {
	scope: "client-only-gap-plus-old-source-batch29",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/resourceStore.listResourceStores"],
	guardedEndpoints: [
		"/app/purchase/updatePurchaseApply",
		"/app/purchase/purchaseApply",
		"/app/purchase/urgentPurchaseApply",
	],
	defaultBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-purchase-data", "purchase-write-read-back-rollback", "production-app-h5-purchase-network"],
} as const;

export function createLegacyPurchaseAdapter(service: PurchaseService) {
	return {
		async listResourceStores() {
			return legacySuccess({ resourceStores: await service.listResourceStores() }, "查询成功");
		},

		async updatePurchaseApply(input: Record<string, unknown>) {
			const decision = await service.getPurchaseGuardDecision("purchase.updatePurchaseApply", input);
			return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
		},

		async purchaseApply(input: Record<string, unknown>) {
			const decision = await service.getPurchaseGuardDecision("purchase.purchaseApply", input);
			return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
		},

		async urgentPurchaseApply(input: Record<string, unknown>) {
			const decision = await service.getPurchaseGuardDecision("purchase.urgentPurchaseApply", input);
			return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
		},
	};
}
