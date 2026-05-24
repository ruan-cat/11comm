import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getNoticeRuntime } from "./runtime";

export const noticeLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/notice.listNotices",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getNoticeRuntime(event).legacyAdapter.listNotices(mergeInput(query, body)),
	},
];
