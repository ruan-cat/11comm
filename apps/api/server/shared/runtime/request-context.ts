import { randomUUID } from "node:crypto";
import type { H3Event } from "nitro/h3";
import { getMethod, getRequestURL } from "nitro/h3";
import { applyStandardHeaders, buildStandardHeaders, getRequestHeaderValue } from "./cors";

export interface ApiRequestContext {
	requestId: string;
	startTime: number;
	method: string;
	path: string;
}

export function initializeApiRequestContext(event: H3Event | Record<string, any>): ApiRequestContext {
	const context = ((event as any).context ??= {});
	if (context.apiRequestContext) {
		return context.apiRequestContext as ApiRequestContext;
	}

	const requestContext: ApiRequestContext = {
		requestId: resolveRequestId(event),
		startTime: Date.now(),
		method: resolveRequestMethod(event),
		path: resolveRequestPath(event),
	};

	context.apiRequestContext = requestContext;
	applyStandardHeaders(event, buildStandardHeaders(requestContext.requestId));
	return requestContext;
}

export function getApiRequestContext(event: H3Event | Record<string, any>): ApiRequestContext {
	return (
		((event as any).context?.apiRequestContext as ApiRequestContext | undefined) ?? initializeApiRequestContext(event)
	);
}

export function getRequestDurationMs(context: ApiRequestContext): number {
	return Date.now() - context.startTime;
}

function resolveRequestId(event: H3Event | Record<string, any>): string {
	return getRequestHeaderValue(event, "x-request-id") || `req_${randomUUID()}`;
}

function resolveRequestMethod(event: H3Event | Record<string, any>): string {
	try {
		return getMethod(event as H3Event);
	} catch {
		return String((event as any).req?.method || (event as any).method || "GET").toUpperCase();
	}
}

function resolveRequestPath(event: H3Event | Record<string, any>): string {
	try {
		return getRequestURL(event as H3Event).pathname;
	} catch {
		return String((event as any).path || (event as any).req?.url || "/").split("?")[0] || "/";
	}
}
