import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getContactRuntime } from "./runtime";

export const contactLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/contact.listContacts",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getContactRuntime(event).legacyAdapter.listContacts(mergeInput(query, body)),
	},
	{
		url: "/app/contact.getContactDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getContactRuntime(event).legacyAdapter.getContactDetail(mergeInput(query, body)),
	},
	{
		url: "/app/contact.getContactsByDepartment",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getContactRuntime(event).legacyAdapter.getContactsByDepartment(mergeInput(query, body)),
	},
	{
		url: "/app/contact.searchContacts",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getContactRuntime(event).legacyAdapter.searchContacts(mergeInput(query, body)),
	},
	{
		url: "/app/contact.getDepartments",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getContactRuntime(event).legacyAdapter.getDepartments(mergeInput(query, body)),
	},
	{
		url: "/app/contact.getFavoriteContacts",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getContactRuntime(event).legacyAdapter.getFavoriteContacts(mergeInput(query, body)),
	},
	{
		url: "/app/contact.getEmergencyContacts",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getContactRuntime(event).legacyAdapter.getEmergencyContacts(mergeInput(query, body)),
	},
	{
		url: "/app/contact.updateOnlineStatus",
		method: "POST",
		handler: ({ query, body, event }) =>
			getContactRuntime(event).legacyAdapter.updateOnlineStatus(mergeInput(query, body)),
	},
];
