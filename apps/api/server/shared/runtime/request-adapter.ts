import { getMethod, getQuery, getRequestURL, readBody } from "nitro/h3";
import type { H3Event } from "nitro/h3";
import type { EndpointDispatchInput } from "./endpoint-registry";
import { normalizeEndpointMethod } from "./endpoint-registry";

export async function toEndpointDispatchInput(event: H3Event): Promise<EndpointDispatchInput> {
	const method = normalizeEndpointMethod(getMethod(event));
	const query = getQuery(event) as Record<string, unknown>;
	const path = getRequestURL(event).pathname;
	const body = method === "GET" ? undefined : await readBody(event);

	return {
		method,
		path,
		query,
		body,
		event,
	};
}
