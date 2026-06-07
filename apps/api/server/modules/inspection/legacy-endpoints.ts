import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getInspectionRuntime } from "./runtime";

export const inspectionLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/staff.listStaffs",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getInspectionRuntime(event).legacyAdapter.listStaffs(mergeInput(query, body)),
	},
	{
		url: "/app/inspection.getTodayReport",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getInspectionRuntime(event).legacyAdapter.getTodayReport(mergeInput(query, body)),
	},
	{
		url: "/app/inspection.listInspectionItemTitles",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getInspectionRuntime(event).legacyAdapter.listInspectionItemTitles(mergeInput(query, body)),
	},
	{
		url: "/app/inspection.listInspectionTasks",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getInspectionRuntime(event).legacyAdapter.listInspectionTasks(mergeInput(query, body)),
	},
	{
		url: "/app/inspection.listInspectionTaskDetails",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getInspectionRuntime(event).legacyAdapter.listInspectionTaskDetails(mergeInput(query, body)),
	},
	{
		url: "/app/inspection.submitInspection",
		method: "POST",
		handler: ({ query, body, event }) =>
			getInspectionRuntime(event).legacyAdapter.guardedWrite(
				"/app/inspection.submitInspection",
				mergeInput(query, body),
			),
	},
	{
		url: "/app/inspection.transferTask",
		method: "POST",
		handler: ({ query, body, event }) =>
			getInspectionRuntime(event).legacyAdapter.guardedWrite("/app/inspection.transferTask", mergeInput(query, body)),
	},
];
