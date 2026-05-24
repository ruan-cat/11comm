import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getProfileRuntime } from "./runtime";

export const profileLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/profile.getUserProfile",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getProfileRuntime(event).legacyAdapter.getUserProfile(mergeInput(query, body)),
	},
	{
		url: "/app/profile.listCommunities",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getProfileRuntime(event).legacyAdapter.listCommunities(mergeInput(query, body)),
	},
	{
		url: "/app/profile.listAttendanceRecords",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getProfileRuntime(event).legacyAdapter.listAttendanceRecords(mergeInput(query, body)),
	},
];
