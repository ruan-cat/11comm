import { defineHandler } from "nitro/h3";
import { getPublicRuntimeConfig } from "../../shared/runtime/env";
import { getApiRequestContext } from "../../shared/runtime/request-context";
import { runtimeEndpointManifest } from "../../shared/runtime/runtime-endpoints";

export default defineHandler((event) => {
	const requestContext = getApiRequestContext(event);
	const publicConfig = getPublicRuntimeConfig();

	return {
		success: true,
		service: publicConfig.serviceName,
		phase: publicConfig.phase,
		requestId: requestContext.requestId,
		data: runtimeEndpointManifest,
	};
});
