import { legacyFailure } from "../../shared/runtime/response-builder";
import type { PurchaseService } from "./service";

export const purchaseLegacyGuardEvidence = {
	scope: "client-only-gap-write-guard",
	dataSourceStatus: "no-exact-legacy-server-source",
	responseContract: "{ code, msg, data }",
	endpoint: "/app/purchase/updatePurchaseApply",
	defaultBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
} as const;

export function createLegacyPurchaseAdapter(service: PurchaseService) {
	return {
		async updatePurchaseApply(input: Record<string, unknown>) {
			const decision = await service.getUpdatePurchaseApplyGuardDecision(input);
			return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
		},
	};
}
