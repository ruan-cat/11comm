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
	{
		url: "/app/activities.likeActivity",
		method: "POST",
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.guardedWrite("/app/activities.likeActivity", mergeInput(query, body)),
	},
	{
		url: "/app/activities.increaseView",
		method: "POST",
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.guardedWrite("/app/activities.increaseView", mergeInput(query, body)),
	},
	{
		url: "/app/activities.updateStatus",
		method: "POST",
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.guardedWrite("/app/activities.updateStatus", mergeInput(query, body)),
	},
	{
		url: "/app/activities.updateLike",
		method: "POST",
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.guardedWrite("/app/activities.updateLike", mergeInput(query, body)),
	},
	{
		url: "/app/activities.updateCollect",
		method: "POST",
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.guardedWrite("/app/activities.updateCollect", mergeInput(query, body)),
	},
	{
		url: "/app/activities.saveActivities",
		method: "POST",
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.guardedWrite("/app/activities.saveActivities", mergeInput(query, body)),
	},
	{
		url: "/app/activities.updateActivities",
		method: "POST",
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.guardedWrite("/app/activities.updateActivities", mergeInput(query, body)),
	},
	{
		url: "/app/activities.deleteActivities",
		method: "POST",
		handler: ({ query, body, event }) =>
			getActivityRuntime(event).legacyAdapter.guardedWrite("/app/activities.deleteActivities", mergeInput(query, body)),
	},
];
