import type { EndpointDispatchInput } from "./endpoint-registry";
import { defaultLegacyAppFallbackBaseUrl } from "./env";

export interface LegacyAppFallbackResponse {
	status: number;
	headers: Headers;
	body: unknown;
}

export interface LegacyAppFallbackOptions {
	baseUrl?: string;
	fetchImpl?: typeof fetch;
}

export function isLegacyAppFallbackPath(path: string): boolean {
	return path.startsWith("/app/") || path.startsWith("/callComponent/");
}

export function isLegacyAppFallbackEnabled(): boolean {
	const configuredValue = String(process.env.PHASE7_LEGACY_APP_FALLBACK_ENABLED ?? "")
		.trim()
		.toLowerCase();
	if (!configuredValue) {
		return true;
	}
	return !["0", "false", "off", "disabled", "no"].includes(configuredValue);
}

export function buildLegacyAppFallbackUrl(baseUrl: string, path: string, query: Record<string, unknown> = {}): string {
	const url = new URL(path, ensureTrailingSlash(baseUrl));
	for (const [name, value] of Object.entries(query)) {
		if (value === undefined || value === null || value === "") {
			continue;
		}
		if (Array.isArray(value)) {
			for (const item of value) {
				url.searchParams.append(name, String(item));
			}
			continue;
		}
		url.searchParams.set(name, String(value));
	}
	return url.toString();
}

export async function proxyLegacyAppRequest(
	input: EndpointDispatchInput,
	options: LegacyAppFallbackOptions = {},
): Promise<LegacyAppFallbackResponse> {
	if (!isLegacyAppFallbackPath(input.path)) {
		const error = new Error(`Legacy fallback path is not allowed: ${input.path}`);
		(error as any).statusCode = 404;
		throw error;
	}
	if (!isLegacyAppFallbackEnabled()) {
		const error = new Error(`Legacy app fallback is disabled: ${input.path}`);
		(error as any).statusCode = 404;
		throw error;
	}

	const fetchImpl = options.fetchImpl ?? fetch;
	const url = buildLegacyAppFallbackUrl(
		options.baseUrl || process.env.PHASE7_LEGACY_APP_FALLBACK_BASE_URL || defaultLegacyAppFallbackBaseUrl,
		input.path,
		input.query,
	);
	const hasBody = input.method !== "GET" && input.body !== undefined;
	const response = await fetchImpl(url, {
		method: input.method,
		headers: {
			accept: "application/json, text/plain, */*",
			...(hasBody ? { "content-type": "application/json;charset=UTF-8" } : {}),
		},
		body: hasBody ? JSON.stringify(input.body) : undefined,
	});

	return {
		status: response.status,
		headers: response.headers,
		body: await readResponseBody(response),
	};
}

async function readResponseBody(response: Response): Promise<unknown> {
	const contentType = response.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		return await response.json();
	}
	return await response.text();
}

function ensureTrailingSlash(baseUrl: string): string {
	return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}
