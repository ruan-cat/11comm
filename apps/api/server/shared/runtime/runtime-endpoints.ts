import { feeLegacyEndpointDefinitions } from "../../modules/fee/legacy-endpoints";

export const runtimeEndpointDefinitions = [...feeLegacyEndpointDefinitions];

export const runtimeEndpointManifest = runtimeEndpointDefinitions.map((definition) => ({
	url: definition.url,
	method: definition.method,
	phase: "phase2-fee-payment-report",
	ownerModule: "fee",
}));
