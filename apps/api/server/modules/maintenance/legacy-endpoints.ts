import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getMaintenanceRuntime } from "./runtime";

export const maintenanceLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/maintenance.listMaintenanceTasks",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getMaintenanceRuntime(event).legacyAdapter.listMaintenanceTasks(mergeInput(query, body)),
	},
	{
		url: "/app/maintenance.queryMaintenanceTask",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getMaintenanceRuntime(event).legacyAdapter.queryMaintenanceTask(mergeInput(query, body)),
	},
	{
		url: "/app/maintenance.listMaintenanceTaskDetails",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getMaintenanceRuntime(event).legacyAdapter.listMaintenanceTaskDetails(mergeInput(query, body)),
	},
	{
		url: "/app/maintenance.startMaintenanceTask",
		method: "POST",
		handler: ({ query, body, event }) =>
			getMaintenanceRuntime(event).legacyAdapter.guardedWrite(
				"maintenance.startMaintenanceTask",
				mergeInput(query, body),
			),
	},
	{
		url: "/app/maintenance.completeMaintenanceTask",
		method: "POST",
		handler: ({ query, body, event }) =>
			getMaintenanceRuntime(event).legacyAdapter.guardedWrite(
				"maintenance.completeMaintenanceTask",
				mergeInput(query, body),
			),
	},
	{
		url: "/app/maintenance.submitMaintenanceSingle",
		method: "POST",
		handler: ({ query, body, event }) =>
			getMaintenanceRuntime(event).legacyAdapter.guardedWrite(
				"maintenance.submitMaintenanceSingle",
				mergeInput(query, body),
			),
	},
	{
		url: "/app/maintenance.transferMaintenanceTask",
		method: "POST",
		handler: ({ query, body, event }) =>
			getMaintenanceRuntime(event).legacyAdapter.guardedWrite(
				"maintenance.transferMaintenanceTask",
				mergeInput(query, body),
			),
	},
];
