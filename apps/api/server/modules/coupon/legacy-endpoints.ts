import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getCouponRuntime } from "./runtime";

export const couponLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/couponProperty.listCouponPropertyUserDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getCouponRuntime(event).legacyAdapter.listCouponPropertyUserDetail(mergeInput(query, body)),
	},
	{
		url: "/app/integral.listIntegralSetting",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getCouponRuntime(event).legacyAdapter.listIntegralSetting(mergeInput(query, body)),
	},
	{
		url: "/app/integral.listIntegralUserDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getCouponRuntime(event).legacyAdapter.listIntegralUserDetail(mergeInput(query, body)),
	},
];
