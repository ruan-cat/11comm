import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getResourceRuntime } from "./runtime";

export const resourceLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/resourceStore.listStorehouses",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.listStorehouses(mergeInput(query, body)),
	},
	{
		url: "/app/resourceStore.listAllocationStorehouseApplys",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.listAllocationStorehouseApplys(mergeInput(query, body)),
	},
	{
		url: "/app/purchaseApply.listPurchaseApplys",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.listPurchaseApplys(mergeInput(query, body)),
	},
	{
		url: "/app/itemRelease.listItemRelease",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.listItemReleases(mergeInput(query, body)),
	},
	{
		url: "/app/purchaseApply.listMyAuditOrders",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.listMyAuditOrders(mergeInput(query, body)),
	},
	{
		url: "/app/itemRelease.queryUndoItemRelease",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.queryUndoItemRelease(mergeInput(query, body)),
	},
	{
		url: "/app/resourceStore.listAllocationStoreAuditOrders",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.listAllocationStoreAuditOrders(mergeInput(query, body)),
	},
	{
		url: "/app/resourceStore.listAllocationStorehouses",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.listAllocationStorehouses(mergeInput(query, body)),
	},
	{
		url: "/app/resourceStore.queryMyResourceStoreInfo",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.queryMyResourceStoreInfo(mergeInput(query, body)),
	},
	{
		url: "/app/resourceStore.saveAllocationStorehouse",
		method: "POST",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.guardedWrite(
				"resourceStore.saveAllocationStorehouse",
				mergeInput(query, body),
			),
	},
	{
		url: "/app/purchaseApply.auditApplyOrder",
		method: "POST",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.guardedWrite("purchaseApply.auditApplyOrder", mergeInput(query, body)),
	},
	{
		url: "/app/itemRelease.auditUndoItemRelease",
		method: "POST",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.guardedWrite("itemRelease.auditUndoItemRelease", mergeInput(query, body)),
	},
	{
		url: "/app/resourceStore.auditAllocationStoreOrder",
		method: "POST",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.guardedWrite(
				"resourceStore.auditAllocationStoreOrder",
				mergeInput(query, body),
			),
	},
];
