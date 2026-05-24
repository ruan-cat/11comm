import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getFloorRuntime } from "./runtime";

export const floorLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/floor.queryFloors",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFloorRuntime(event).legacyAdapter.listFloors(mergeInput(query, body)),
	},
	{
		url: "/app/floor.queryFloorDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFloorRuntime(event).legacyAdapter.queryFloorDetail(mergeInput(query, body)),
	},
];
