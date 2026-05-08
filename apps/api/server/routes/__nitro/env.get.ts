import { defineHandler, setResponseStatus } from "nitro/h3";
import { getPublicRuntimeConfig } from "../../shared/runtime/env";
import { inspectEnvironmentSources } from "../../shared/runtime/env-inspector";
import { getApiRequestContext } from "../../shared/runtime/request-context";

export default defineHandler(async (event) => {
	const requestContext = getApiRequestContext(event);
	const publicConfig = getPublicRuntimeConfig();

	try {
		return {
			success: true,
			service: publicConfig.serviceName,
			phase: publicConfig.phase,
			requestId: requestContext.requestId,
			timestamp: new Date().toISOString(),
			data: await inspectEnvironmentSources(event),
		};
	} catch {
		setResponseStatus(event, 500);
		return {
			success: false,
			service: publicConfig.serviceName,
			phase: publicConfig.phase,
			requestId: requestContext.requestId,
			timestamp: new Date().toISOString(),
			code: "ENV_INSPECTION_FAILED",
			message: "Environment inspection failed.",
			data: null,
		};
	}
});
