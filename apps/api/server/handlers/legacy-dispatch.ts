import { defineHandler, setResponseStatus } from "nitro/h3";
import { createEndpointRegistry, dispatchEndpoint } from "../shared/runtime/endpoint-registry";
import { buildErrorResponse } from "../shared/runtime/errors";
import { getPublicRuntimeConfig } from "../shared/runtime/env";
import { apiLogger, logApiError, logApiRequest } from "../shared/runtime/observability";
import { getApiRequestContext, getRequestDurationMs } from "../shared/runtime/request-context";
import { toEndpointDispatchInput } from "../shared/runtime/request-adapter";
import { legacyFailure } from "../shared/runtime/response-builder";
import { runtimeEndpointDefinitions } from "../shared/runtime/runtime-endpoints";

const registry = createEndpointRegistry(runtimeEndpointDefinitions);

export default defineHandler(async (event) => {
	const requestContext = getApiRequestContext(event);

	try {
		const response = await dispatchEndpoint(registry, await toEndpointDispatchInput(event));
		logApiRequest(apiLogger, {
			requestId: requestContext.requestId,
			method: requestContext.method,
			path: requestContext.path,
			statusCode: 200,
			durationMs: getRequestDurationMs(requestContext),
		});
		return response;
	} catch (error) {
		const statusCode = Number((error as any)?.statusCode || 500);
		setResponseStatus(event, statusCode);
		logApiError(apiLogger, error, requestContext);

		const standardError = buildErrorResponse(error, {
			requestId: requestContext.requestId,
			exposeDetails: getPublicRuntimeConfig().enableDetailedErrors,
		});

		return legacyFailure(standardError.message, statusCode, {
			requestId: requestContext.requestId,
			errorCode: standardError.errorCode,
		});
	}
});
