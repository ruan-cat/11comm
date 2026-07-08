import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";
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
	{
		url: "/app/applyRoomDiscount/queryApplyRoomDiscount",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getPropertyApplicationRuntime(event).legacyAdapter.queryApplyRoomDiscount(mergeInput(query, body)),
	},
	{
		url: "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getPropertyApplicationRuntime(event).legacyAdapter.queryApplyRoomDiscountRecord(mergeInput(query, body)),
	},
	{
		url: "/app/applyRoomDiscount/updateApplyRoomDiscount",
		method: "POST",
		handler: ({ body, event }) =>
			getPropertyApplicationRuntime(event).legacyAdapter.guardedWrite(
				"/app/applyRoomDiscount/updateApplyRoomDiscount",
				asRecord(body),
			),
	},
	{
		url: "/app/applyRoomDiscount/updateReviewApplyRoomDiscount",
		method: "POST",
		handler: ({ body, event }) =>
			getPropertyApplicationRuntime(event).legacyAdapter.guardedWrite(
				"/app/applyRoomDiscount/updateReviewApplyRoomDiscount",
				asRecord(body),
			),
	},
	{
		url: "/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord",
		method: "POST",
		handler: ({ body, event }) =>
			getPropertyApplicationRuntime(event).legacyAdapter.guardedWrite(
				"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord",
				asRecord(body),
			),
	},
	{
		url: "/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord",
		method: "POST",
		handler: ({ body, event }) =>
			getPropertyApplicationRuntime(event).legacyAdapter.guardedWrite(
				"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord",
				asRecord(body),
			),
	},
];
