import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getOwnerRuntime } from "./runtime";

export const ownerLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/owner.queryOwnerAndMembers",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getOwnerRuntime(event).legacyAdapter.queryOwnerAndMembers(mergeInput(query, body)),
	},
	{
		url: "/app/owner.saveRoomOwner",
		method: "POST",
		handler: ({ query, body, event }) => getOwnerRuntime(event).legacyAdapter.saveRoomOwner(mergeInput(query, body)),
	},
	{
		url: "/app/owner.editOwner",
		method: "POST",
		handler: ({ query, body, event }) => getOwnerRuntime(event).legacyAdapter.editOwner(mergeInput(query, body)),
	},
	{
		url: "/app/owner.deleteOwner",
		method: "POST",
		handler: ({ query, body, event }) => getOwnerRuntime(event).legacyAdapter.deleteOwner(mergeInput(query, body)),
	},
];
