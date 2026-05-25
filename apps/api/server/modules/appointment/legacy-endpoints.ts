import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getAppointmentRuntime } from "./runtime";

export const appointmentLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/communitySpace.listCommunitySpaceConfirmOrder",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getAppointmentRuntime(event).legacyAdapter.listCommunitySpaceConfirmOrders(mergeInput(query, body)),
	},
	{
		url: "/app/communitySpace.saveCommunitySpaceConfirmOrder",
		method: "POST",
		handler: ({ query, body, event }) =>
			getAppointmentRuntime(event).legacyAdapter.saveCommunitySpaceConfirmOrder(mergeInput(query, body)),
	},
];
