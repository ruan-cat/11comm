import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getMeterRuntime } from "./runtime";

export const meterLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/meter.queryFeeTypes",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getMeterRuntime(event).legacyAdapter.queryFeeTypes(mergeInput(query, body)),
	},
	{
		url: "/app/meter.queryFeeTypesItems",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getMeterRuntime(event).legacyAdapter.queryFeeTypesItems(mergeInput(query, body)),
	},
	{
		url: "/app/meter.listMeterType",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getMeterRuntime(event).legacyAdapter.listMeterType(mergeInput(query, body)),
	},
	{
		url: "/app/meter.listMeterWaters",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getMeterRuntime(event).legacyAdapter.listMeterWaters(mergeInput(query, body)),
	},
	{
		url: "/app/meter.queryPreMeterWater",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getMeterRuntime(event).legacyAdapter.queryPreMeterWater(mergeInput(query, body)),
	},
	{
		url: "/app/meter.listFloorShareReading",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getMeterRuntime(event).legacyAdapter.listFloorShareReading(mergeInput(query, body)),
	},
	{
		url: "/app/meter.listFloorShareMeter",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getMeterRuntime(event).legacyAdapter.listFloorShareMeter(mergeInput(query, body)),
	},
	{
		url: "/app/meter.saveMeterWater",
		method: "POST",
		handler: ({ query, body, event }) =>
			getMeterRuntime(event).legacyAdapter.guardedWrite("/app/meter.saveMeterWater", mergeInput(query, body)),
	},
	{
		url: "/app/meter.saveFloorShareReading",
		method: "POST",
		handler: ({ query, body, event }) =>
			getMeterRuntime(event).legacyAdapter.guardedWrite("/app/meter.saveFloorShareReading", mergeInput(query, body)),
	},
	{
		url: "/app/meter.auditFloorShareReading",
		method: "POST",
		handler: ({ query, body, event }) =>
			getMeterRuntime(event).legacyAdapter.guardedWrite("/app/meter.auditFloorShareReading", mergeInput(query, body)),
	},
];
