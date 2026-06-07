import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getItemReleaseRuntime } from "./runtime";

export const itemReleaseLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/itemRelease.getItemRelease",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getItemReleaseRuntime(event).legacyAdapter.getItemRelease(mergeInput(query, body)),
	},
	{
		url: "/app/itemRelease.getItemReleaseRes",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getItemReleaseRuntime(event).legacyAdapter.getItemReleaseRes(mergeInput(query, body)),
	},
	{
		url: "/app/itemRelease.queryOaWorkflowUser",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getItemReleaseRuntime(event).legacyAdapter.queryOaWorkflowUser(mergeInput(query, body)),
	},
	{
		url: "/app/itemRelease.queryUndoItemReleaseV2",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getItemReleaseRuntime(event).legacyAdapter.queryUndoItemRelease(mergeInput(query, body)),
	},
	{
		url: "/app/itemRelease.queryFinishItemReleaseV2",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getItemReleaseRuntime(event).legacyAdapter.queryFinishItemRelease(mergeInput(query, body)),
	},
	{
		url: "/app/itemRelease.auditItemRelease",
		method: "POST",
		handler: ({ query, body, event }) =>
			getItemReleaseRuntime(event).legacyAdapter.guardedWrite(
				"/app/itemRelease.auditItemRelease",
				mergeInput(query, body),
			),
	},
];
