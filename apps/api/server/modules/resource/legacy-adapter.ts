import type { ResourceService } from "./service";
import type { ResourceLegacyResponse } from "./types";

export const resourceLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write-batch30",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ success, code, message, data, timestamp }",
	endpoints: ["/app/resourceStore.listStorehouses", "/app/resourceStore.listAllocationStorehouseApplys"],
	guardedEndpoints: ["/app/resourceStore.saveAllocationStorehouse"],
	excludedWriteEndpoints: [],
	notCovered: [
		"/app/resourceStoreType.listResourceStoreTypes",
		"/app/resourceStore.listAllocationStoreAuditOrders",
		"/app/resourceStore.listAllocationStorehouses",
		"/app/resourceStore.queryMyResourceStoreInfo",
		"db-backed-resource-data",
		"resource-write-read-back-rollback",
		"production-app-h5-resource-network",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
} as const;

export function createLegacyResourceAdapter(service: ResourceService) {
	return {
		async listStorehouses(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const allowPurchase = toString(input.allowPurchase);

			return resourceSuccess(await service.listStorehouses({ page, row, allowPurchase }));
		},

		async listAllocationStorehouseApplys(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return resourceSuccess(await service.listAllocationStorehouseApplys({ page, row }));
		},

		async guardedWrite(endpoint: string, input: Record<string, unknown>) {
			const decision = await service.getResourceGuardDecision(endpoint, input);
			return resourceFailure(decision.message, decision.code, { errorCode: decision.errorCode });
		},
	};
}

function resourceSuccess<T>(data: T, message = "success"): ResourceLegacyResponse<T> {
	return {
		success: true,
		code: "0",
		message,
		data,
		timestamp: Date.now(),
	};
}

function resourceFailure(
	message: string,
	code: string,
	extra: Record<string, unknown> = {},
): ResourceLegacyResponse<null> & Record<string, unknown> {
	return {
		success: false,
		code,
		message,
		data: null,
		timestamp: Date.now(),
		...extra,
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}
