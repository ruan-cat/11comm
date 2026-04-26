import { defineHandler, setResponseStatus } from "nitro/h3";
import { hasDatabaseUrl } from "../../db";
import { getPublicRuntimeConfig } from "../../shared/runtime/env";
import { getApiRequestContext } from "../../shared/runtime/request-context";

export default defineHandler(async (event) => {
	const requestContext = getApiRequestContext(event);
	const publicConfig = getPublicRuntimeConfig();
	const configured = hasDatabaseUrl(event);

	if (!configured) {
		setResponseStatus(event, 503);
		return buildReadyResponse({
			success: false,
			ready: false,
			code: "DATABASE_CONFIG_MISSING",
			message: "Database URL is not configured.",
			requestId: requestContext.requestId,
			service: publicConfig.serviceName,
			phase: publicConfig.phase,
			configured: false,
			connected: false,
		});
	}

	setResponseStatus(event, 200);
	return buildReadyResponse({
		success: true,
		ready: true,
		code: "READY_CONFIGURED",
		message: "Ready; database URL is configured.",
		requestId: requestContext.requestId,
		service: publicConfig.serviceName,
		phase: publicConfig.phase,
		configured: true,
		connected: null,
	});
});

function buildReadyResponse(input: {
	success: boolean;
	ready: boolean;
	code: string;
	message: string;
	requestId: string;
	service: string;
	phase: string;
	configured: boolean;
	connected: boolean | null;
}) {
	return {
		success: input.success,
		ready: input.ready,
		code: input.code,
		message: input.message,
		service: input.service,
		phase: input.phase,
		requestId: input.requestId,
		timestamp: new Date().toISOString(),
		checks: {
			database: {
				configured: input.configured,
				connected: input.connected,
			},
		},
	};
}
