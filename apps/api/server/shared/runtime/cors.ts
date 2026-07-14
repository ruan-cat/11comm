import type { H3Event } from "nitro/h3";

export type HeaderRecord = Record<string, string>;

export interface CorsHeaderOptions {
	origin?: string | null;
	allowedOrigins: string[];
	requestHeaders?: string | null;
	credentials?: boolean;
	preflight?: boolean;
}

const defaultMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
const defaultHeaders = ["content-type", "authorization", "x-request-id", "x-api-client"];

export function isOriginAllowed(origin: string | undefined | null, allowedOrigins: string[]): boolean {
	if (!origin) {
		return false;
	}

	if (allowedOrigins.length === 0) {
		return true;
	}

	return allowedOrigins.includes("*") || allowedOrigins.includes(origin);
}

export function buildCorsHeaders(options: CorsHeaderOptions): HeaderRecord {
	const credentials = options.credentials ?? true;
	const headers: HeaderRecord = {
		vary: "Origin",
		"access-control-allow-methods": defaultMethods.join(", "),
		"access-control-expose-headers": "x-request-id,x-api-phase",
	};

	if (credentials) {
		headers["access-control-allow-credentials"] = "true";
	}

	if (isOriginAllowed(options.origin, options.allowedOrigins)) {
		headers["access-control-allow-origin"] = credentials ? String(options.origin) : String(options.origin || "*");
	}

	if (options.preflight) {
		headers["access-control-max-age"] = "86400";
		headers["access-control-allow-headers"] = options.requestHeaders || defaultHeaders.join(",");
	}

	return headers;
}

export function buildStandardHeaders(requestId?: string): HeaderRecord {
	return {
		"x-api-phase": "phase3-infra",
		"x-content-type-options": "nosniff",
		"x-frame-options": "DENY",
		"referrer-policy": "no-referrer",
		...(requestId ? { "x-request-id": requestId } : {}),
	};
}

export function applyStandardHeaders(event: H3Event | Record<string, any>, headers: HeaderRecord): void {
	const responseHeaders = ensureResponseHeaders(event);

	for (const [name, value] of Object.entries(headers)) {
		responseHeaders.set(name, value);
	}
}

export function getRequestHeaderValue(event: H3Event | Record<string, any>, name: string): string | undefined {
	const requestHeaders = (event as any).req?.headers;
	if (requestHeaders?.get) {
		return requestHeaders.get(name) ?? undefined;
	}

	const nodeHeaders = (event as any).node?.req?.headers;
	const value = nodeHeaders?.[name.toLowerCase()];
	if (Array.isArray(value)) {
		return value[0];
	}
	return value;
}

function ensureResponseHeaders(event: H3Event | Record<string, any>): Headers {
	const response = ((event as any).res ??= {});
	if (!response.headers) {
		response.headers = new Headers();
	}
	return response.headers as Headers;
}
