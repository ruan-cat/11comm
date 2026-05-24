import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getVideoRuntime } from "./runtime";

export const videoLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/video.listMonitorArea",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getVideoRuntime(event).legacyAdapter.listMonitorArea(mergeInput(query, body)),
	},
	{
		url: "/app/video.listStaffMonitorMachine",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getVideoRuntime(event).legacyAdapter.listStaffMonitorMachine(mergeInput(query, body)),
	},
	{
		url: "/app/video.getPlayVideoUrl",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getVideoRuntime(event).legacyAdapter.getPlayVideoUrl(mergeInput(query, body)),
	},
];
