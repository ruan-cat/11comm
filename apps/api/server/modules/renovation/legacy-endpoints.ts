import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getRenovationRuntime } from "./runtime";

export const renovationLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/roomRenovation/queryRoomRenovation",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRenovationRuntime(event).legacyAdapter.queryRoomRenovation(mergeInput(query, body)),
	},
	{
		url: "/app/roomRenovation/queryRoomRenovationRecord",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRenovationRuntime(event).legacyAdapter.queryRoomRenovationRecord(mergeInput(query, body)),
	},
	{
		url: "/app/roomRenovation/queryRoomRenovationRecordDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getRenovationRuntime(event).legacyAdapter.queryRoomRenovationRecordDetail(mergeInput(query, body)),
	},
	{
		url: "/app/roomRenovation/updateRoomToExamine",
		method: "POST",
		handler: ({ body, event }) =>
			getRenovationRuntime(event).legacyAdapter.guardedWrite("/app/roomRenovation/updateRoomToExamine", asRecord(body)),
	},
	{
		url: "/app/roomRenovation/saveRoomRenovationDetail",
		method: "POST",
		handler: ({ body, event }) =>
			getRenovationRuntime(event).legacyAdapter.guardedWrite(
				"/app/roomRenovation/saveRoomRenovationDetail",
				asRecord(body),
			),
	},
	{
		url: "/app/roomRenovation/updateRoomRenovationState",
		method: "POST",
		handler: ({ body, event }) =>
			getRenovationRuntime(event).legacyAdapter.guardedWrite(
				"/app/roomRenovation/updateRoomRenovationState",
				asRecord(body),
			),
	},
	{
		url: "/app/roomRenovation/updateRoomDecorationRecord",
		method: "POST",
		handler: ({ body, event }) =>
			getRenovationRuntime(event).legacyAdapter.guardedWrite(
				"/app/roomRenovation/updateRoomDecorationRecord",
				asRecord(body),
			),
	},
	{
		url: "/app/roomRenovation/deleteRoomRenovationRecord",
		method: "POST",
		handler: ({ body, event }) =>
			getRenovationRuntime(event).legacyAdapter.guardedWrite(
				"/app/roomRenovation/deleteRoomRenovationRecord",
				asRecord(body),
			),
	},
];
