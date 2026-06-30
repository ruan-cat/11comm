import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getStaffRuntime } from "./runtime";

export const staffLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/staff/organizations",
		method: "GET",
		handler: ({ query, body, event }) => getStaffRuntime(event).legacyAdapter.getOrganizations(mergeInput(query, body)),
	},
	{
		url: "/app/staff/online",
		method: "GET",
		handler: ({ query, body, event }) => getStaffRuntime(event).legacyAdapter.getOnlineStaffs(mergeInput(query, body)),
	},
	{
		url: "/app/staff/STAFF_001",
		method: "GET",
		handler: ({ query, body, event }) =>
			getStaffRuntime(event).legacyAdapter.getStaffDetail({
				...mergeInput(query, body),
				staffId: "STAFF_001",
			}),
	},
	{
		url: "/app/staff/by-department",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getStaffRuntime(event).legacyAdapter.getStaffsByDepartment(mergeInput(query, body)),
	},
	{
		url: "/app/query.staff.infos",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getStaffRuntime(event).legacyAdapter.queryStaffInfos(mergeInput(query, body)),
	},
	{
		url: "/app/staff/search",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getStaffRuntime(event).legacyAdapter.searchStaffs(mergeInput(query, body)),
	},
	{
		url: "/app/staff/update-online-status",
		method: "POST",
		handler: ({ query, body, event }) =>
			getStaffRuntime(event).legacyAdapter.guardUpdateOnlineStatus(mergeInput(query, body)),
	},
	{
		url: "/app/staff/add",
		method: "POST",
		handler: ({ query, body, event }) => getStaffRuntime(event).legacyAdapter.guardAddStaff(mergeInput(query, body)),
	},
];
