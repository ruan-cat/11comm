import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
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

function mergeInput(query: unknown, body: unknown): Record<string, unknown> {
	return {
		...asRecord(query),
		...asRecord(body),
	};
}

function asRecord(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return {};
	}
	return value as Record<string, unknown>;
}
