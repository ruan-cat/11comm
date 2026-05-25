import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getRoomUnitRuntime } from "./runtime";

export const roomUnitLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/room.queryRooms",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getRoomUnitRuntime(event).legacyAdapter.queryRooms(mergeInput(query, body)),
	},
	{
		url: "/app/room.queryRoomDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRoomUnitRuntime(event).legacyAdapter.queryRoomDetail(mergeInput(query, body)),
	},
	{
		url: "/app/unit.queryUnits",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getRoomUnitRuntime(event).legacyAdapter.queryUnits(mergeInput(query, body)),
	},
	{
		url: "/app/unit.queryUnitDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRoomUnitRuntime(event).legacyAdapter.queryUnitDetail(mergeInput(query, body)),
	},
];
