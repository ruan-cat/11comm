import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getPurchaseRuntime } from "./runtime";

export const purchaseLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/purchase/updatePurchaseApply",
		method: "POST",
		handler: ({ query, body, event }) =>
			getPurchaseRuntime(event).legacyAdapter.updatePurchaseApply(mergeInput(query, body)),
	},
];
