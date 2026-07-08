import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getOaWorkflowRuntime } from "./runtime";

export const oaWorkflowLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/oa/workflow/query",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.queryWorkflows(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/form/query",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getOaWorkflowRuntime(event).legacyAdapter.queryForm(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/form/data/query",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.queryFormData(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/task/undo/query",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.queryUndoTasks(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/task/his/query",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.queryHisTasks(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/user/query",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.queryComments(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/image/run",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.queryWorkflowImage(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/task/next",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.queryNextTask(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/undo/next-deal-user",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.queryNextDealUser(mergeInput(query, body)),
	},
	{
		url: "/app/oa/workflow/form/save",
		method: "POST",
		handler: ({ body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.guardedWrite("/app/oa/workflow/form/save", asRecord(body)),
	},
	{
		url: "/app/oa/workflow/form/update",
		method: "POST",
		handler: ({ body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.guardedWrite("/app/oa/workflow/form/update", asRecord(body)),
	},
	{
		url: "/app/oa/workflow/audit",
		method: "POST",
		handler: ({ body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.guardedWrite("/app/oa/workflow/audit", asRecord(body)),
	},
	{
		url: "/app/oa/workflow/undo/audit",
		method: "POST",
		handler: ({ body, event }) =>
			getOaWorkflowRuntime(event).legacyAdapter.guardedWrite("/app/oa/workflow/undo/audit", asRecord(body)),
	},
];
