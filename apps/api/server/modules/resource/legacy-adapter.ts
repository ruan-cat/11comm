import type { ResourceService } from "./service";
import type { ResourceLegacyResponse } from "./types";

export const resourceLegacyAdapterEvidence = {
	scope: "readonly-exact-batch15-32-plus-guarded-write-batch16-18-30-42",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ success, code, message, data, timestamp }",
	endpoints: [
		"/app/resourceStore.listStorehouses",
		"/app/resourceStore.listUserStorehouses",
		"/app/resourceStoreType.listResourceStoreTypes",
		"/app/resourceStore.listAllocationStorehouseApplys",
		"/app/purchaseApply.listPurchaseApplys",
		"/app/itemRelease.listItemRelease",
		"/app/purchaseApply.listMyAuditOrders",
		"/app/itemRelease.queryUndoItemRelease",
		"/app/resourceStore.listAllocationStoreAuditOrders",
		"/app/resourceStore.listAllocationStorehouses",
		"/app/resourceStore.queryMyResourceStoreInfo",
	],
	guardedEndpoints: [
		"/app/resourceStore.saveAllocationStorehouse",
		"/app/collection/resourceOut",
		"/app/purchase/resourceEnter",
		"/app/purchaseApply.deletePurchaseApply",
		"/app/resourceStore.allocationStoreEnter",
		"/app/resourceStore.deleteAllocationStorehouse",
		"/app/resourceStore.saveAllocationUserStorehouse",
		"/app/resourceStore.saveResourceReturn",
		"/app/resourceStore.saveResourceScrap",
		"/app/purchaseApply.auditApplyOrder",
		"/app/itemRelease.auditUndoItemRelease",
		"/app/resourceStore.auditAllocationStoreOrder",
	],
	excludedWriteEndpoints: [],
	notCovered: ["db-backed-resource-data", "resource-write-read-back-rollback", "production-app-h5-resource-network"],
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

		async listUserStorehouses(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 20);
			const keyword = toString(input.keyword);

			return resourceSuccess(await service.listUserStorehouses({ page, row, keyword }));
		},

		async listResourceStoreTypes(input: Record<string, unknown>) {
			const parentId = toString(input.parentId);

			return resourceSuccess(await service.listResourceStoreTypes(parentId));
		},

		async listAllocationStorehouseApplys(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return resourceSuccess(await service.listAllocationStorehouseApplys({ page, row }));
		},

		async listPurchaseApplys(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return resourceSuccess(await service.listPurchaseApplys({ page, row }));
		},

		async listItemReleases(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return resourceSuccess(await service.listItemReleases({ page, row }));
		},

		async listMyAuditOrders(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return resourceSuccess(await service.listMyAuditOrders({ page, row }));
		},

		async queryUndoItemRelease(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return resourceSuccess(await service.queryUndoItemRelease({ page, row }));
		},

		async listAllocationStoreAuditOrders(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return resourceSuccess(await service.listAllocationStoreAuditOrders({ page, row }));
		},

		async listAllocationStorehouses(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);

			return resourceSuccess(await service.listAllocationStorehouses({ page, row }));
		},

		async queryMyResourceStoreInfo(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const resName = toString(input.resName);
			const searchUserName = toString(input.searchUserName);

			return resourceSuccess(await service.queryMyResourceStoreInfo({ page, row, resName, searchUserName }));
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
