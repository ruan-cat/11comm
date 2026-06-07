import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getPurchaseRuntime } from "./runtime";

export const purchaseLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/resourceStore.listResourceStores",
		method: "GET",
		handler: ({ event }) => getPurchaseRuntime(event).legacyAdapter.listResourceStores(),
	},
	{
		url: "/app/purchase/purchaseApply",
		method: "POST",
		handler: ({ query, body, event }) => getPurchaseRuntime(event).legacyAdapter.purchaseApply(mergeInput(query, body)),
	},
	{
		url: "/app/purchase/urgentPurchaseApply",
		method: "POST",
		handler: ({ query, body, event }) =>
			getPurchaseRuntime(event).legacyAdapter.urgentPurchaseApply(mergeInput(query, body)),
	},
	{
		url: "/app/purchase/updatePurchaseApply",
		method: "POST",
		handler: ({ query, body, event }) =>
			getPurchaseRuntime(event).legacyAdapter.updatePurchaseApply(mergeInput(query, body)),
	},
];
