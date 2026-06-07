import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getWorkOrderRuntime } from "./runtime";

export const workOrderLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/workorder/todo/list",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getWorkOrderRuntime(event).legacyAdapter.listTodo(mergeInput(query, body)),
	},
	{
		url: "/app/workorder/detail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getWorkOrderRuntime(event).legacyAdapter.getDetail(mergeInput(query, body)),
	},
	{
		url: "/app/workorder/copy/list",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getWorkOrderRuntime(event).legacyAdapter.listCopy(mergeInput(query, body)),
	},
	{
		url: "/app/workorder/task/list",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getWorkOrderRuntime(event).legacyAdapter.listTasks(mergeInput(query, body)),
	},
	{
		url: "/app/workorder/task/items",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getWorkOrderRuntime(event).legacyAdapter.listTaskItems(mergeInput(query, body)),
	},
	{
		url: "/app/workorder/create",
		method: "POST",
		handler: ({ query, body, event }) =>
			getWorkOrderRuntime(event).legacyAdapter.guardedWrite("/app/workorder/create", mergeInput(query, body)),
	},
	{
		url: "/app/workorder/update",
		method: "POST",
		handler: ({ query, body, event }) =>
			getWorkOrderRuntime(event).legacyAdapter.guardedWrite("/app/workorder/update", mergeInput(query, body)),
	},
	{
		url: "/app/workorder/start",
		method: "POST",
		handler: ({ query, body, event }) =>
			getWorkOrderRuntime(event).legacyAdapter.guardedWrite("/app/workorder/start", mergeInput(query, body)),
	},
	{
		url: "/app/workorder/complete",
		method: "POST",
		handler: ({ query, body, event }) =>
			getWorkOrderRuntime(event).legacyAdapter.guardedWrite("/app/workorder/complete", mergeInput(query, body)),
	},
	{
		url: "/app/workorder/audit",
		method: "POST",
		handler: ({ query, body, event }) =>
			getWorkOrderRuntime(event).legacyAdapter.guardedWrite("/app/workorder/audit", mergeInput(query, body)),
	},
	{
		url: "/app/workorder/cancel",
		method: "POST",
		handler: ({ query, body, event }) =>
			getWorkOrderRuntime(event).legacyAdapter.guardedWrite("/app/workorder/cancel", mergeInput(query, body)),
	},
	{
		url: "/app/workorder/copy/finish",
		method: "POST",
		handler: ({ query, body, event }) =>
			getWorkOrderRuntime(event).legacyAdapter.guardedWrite("/app/workorder/copy/finish", mergeInput(query, body)),
	},
];
