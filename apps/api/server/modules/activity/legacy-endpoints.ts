import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getActivityRuntime } from "./runtime";

export const activityLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/activities.listActivitiess",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.listActivities(mergeInput(query, body)),
	},
];
