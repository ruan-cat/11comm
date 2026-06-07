import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getResourceRuntime } from "./runtime";

export const resourceLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/resourceStore.listStorehouses",
		method: "GET",
		handler: ({ query, body, event }) => getResourceRuntime(event).legacyAdapter.listStorehouses(mergeInput(query, body)),
	},
	{
		url: "/app/resourceStore.listAllocationStorehouseApplys",
		method: "GET",
		handler: ({ query, body, event }) =>
			getResourceRuntime(event).legacyAdapter.listAllocationStorehouseApplys(mergeInput(query, body)),
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
];
