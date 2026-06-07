import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getRepairRuntime } from "./runtime";

export const repairLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/ownerRepair.listOwnerRepairs",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listOwnerRepairs(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.queryOwnerRepair",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.queryOwnerRepair(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.saveOwnerRepair",
		method: "POST",
		handler: ({ body, event }) => getRepairRuntime(event).legacyAdapter.saveOwnerRepair(asRecord(body)),
	},
	{
		url: "/app/repairSetting.listRepairSettings",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listRepairSettings(mergeInput(query, body)),
	},
	{
		url: "/app/dict.queryRepairStates",
		method: ["GET", "POST"],
		handler: ({ event }) => getRepairRuntime(event).legacyAdapter.listRepairStates(),
	},
	{
		url: "/app/dict.queryPayTypes",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getRepairRuntime(event).legacyAdapter.listPayTypes(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.getRepairStatistics",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.getRepairStatistics(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.listRepairStaffRecords",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listRepairStaffRecords(mergeInput(query, body)),
	},
	{
		url: "/app/ownerRepair.listRepairStaffs",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listRepairStaffs(mergeInput(query, body)),
	},
	{
		url: "/app/repair.listRepairTypeUsers",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRepairRuntime(event).legacyAdapter.listRepairTypeUsers(mergeInput(query, body)),
	},
	{
		url: "/app/resourceStore.listResources",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getRepairRuntime(event).legacyAdapter.listResources(mergeInput(query, body)),
	},
	{
		url: "/callComponent/core/list",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getRepairRuntime(event).legacyAdapter.listCoreDict(mergeInput(query, body)),
	},
	{
		url: "/callComponent/ownerRepair.appraiseRepair",
		method: "POST",
		handler: ({ body, event }) => getRepairRuntime(event).legacyAdapter.appraiseRepair(asRecord(body)),
	},
];
