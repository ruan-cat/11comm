import { defineHandler, getMethod, noContent } from "nitro/h3";
import {
	applyStandardHeaders,
	buildCorsHeaders,
	buildStandardHeaders,
	getRequestHeaderValue,
} from "../shared/runtime/cors";
import { getPublicRuntimeConfig } from "../shared/runtime/env";
import { getApiRequestContext } from "../shared/runtime/request-context";

export default defineHandler((event) => {
	const publicConfig = getPublicRuntimeConfig();
	const requestContext = getApiRequestContext(event);
	const corsHeaders = buildCorsHeaders({
		origin: getRequestHeaderValue(event, "origin"),
		allowedOrigins: publicConfig.corsAllowedOrigins,
		requestHeaders: getRequestHeaderValue(event, "access-control-request-headers"),
		preflight: getMethod(event) === "OPTIONS",
	});

	applyStandardHeaders(event, {
		...buildStandardHeaders(requestContext.requestId),
		...corsHeaders,
	});

	if (getMethod(event) === "OPTIONS") {
		return noContent(204);
	}
});
