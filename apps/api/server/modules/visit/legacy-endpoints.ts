import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getVisitRuntime } from "./runtime";

export const visitLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/visit.getVisit",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getVisitRuntime(event).legacyAdapter.listVisits(mergeInput(query, body)),
	},
	{
		url: "/app/visit.getVisitDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getVisitRuntime(event).legacyAdapter.getVisitDetail(mergeInput(query, body)),
	},
];
