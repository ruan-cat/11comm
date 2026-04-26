import { feeLegacyEndpointDefinitions } from "../../modules/fee/legacy-endpoints";
import { repairLegacyEndpointDefinitions } from "../../modules/repair/legacy-endpoints";

const runtimeEndpointEntries = [
	...feeLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase2-fee-payment-report",
		ownerModule: "fee",
	})),
	...repairLegacyEndpointDefinitions.map((definition) => ({
		definition,
		phase: "phase4a-repair-minimal",
		ownerModule: "repair",
	})),
];

export const runtimeEndpointDefinitions = runtimeEndpointEntries.map((entry) => entry.definition);

export const runtimeEndpointManifest = runtimeEndpointEntries.map((entry) => ({
	url: entry.definition.url,
	method: entry.definition.method,
	phase: entry.phase,
	ownerModule: entry.ownerModule,
}));
