import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { getRepairRuntime } from "./runtime";

export const repairLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/ownerRepair.listOwnerRepairs",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listOwnerRepairs(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.queryOwnerRepair",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.queryOwnerRepair(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.saveOwnerRepair",
		method: "POST",
		handler: ({ body, event }) => getRepairRuntime(event).legacyAdapter.saveOwnerRepair(asRecord(body)),
	},
	{
		url: "/app/repairSetting.listRepairSettings",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listRepairSettings(mergeInput(query, body)),
	},
	{
		url: "/app/dict.queryRepairStates",
		method: ["GET", "POST"],
		handler: ({ event }) => getRepairRuntime(event).legacyAdapter.listRepairStates(),
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
