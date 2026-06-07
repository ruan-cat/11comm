import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getPropertyApplicationRuntime } from "./runtime";

export const propertyApplicationLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/feeDiscount/queryFeeDiscount",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getPropertyApplicationRuntime(event).legacyAdapter.queryFeeDiscount(mergeInput(query, body)),
	},
	{
		url: "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getPropertyApplicationRuntime(event).legacyAdapter.queryApplyRoomDiscountRecordDetail(mergeInput(query, body)),
	},
];
