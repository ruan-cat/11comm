import type { H3Event } from "nitro/h3";

export type EndpointMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EndpointDispatchInput {
	method: EndpointMethod | string;
	path: string;
	query?: Record<string, unknown>;
	body?: unknown;
	event?: H3Event;
}

export interface EndpointDefinition<TResponse = unknown> {
	url: string;
	method: EndpointMethod | EndpointMethod[];
	handler: (input: EndpointDispatchInput & { method: EndpointMethod }) => TResponse | Promise<TResponse>;
}

export type EndpointRegistry = Map<string, EndpointDefinition>;

export function createEndpointRegistry(definitions: EndpointDefinition[]): EndpointRegistry {
	const registry: EndpointRegistry = new Map();

	for (const definition of definitions) {
		for (const method of asMethodArray(definition.method)) {
			registry.set(createEndpointKey(method, definition.url), definition);
		}
	}

	return registry;
}

export function findEndpointDefinition(
	registry: EndpointRegistry,
	method: EndpointMethod | string,
	path: string,
): EndpointDefinition | undefined {
	return registry.get(createEndpointKey(normalizeEndpointMethod(method), path));
}

export async function dispatchEndpoint(registry: EndpointRegistry, input: EndpointDispatchInput): Promise<any> {
	const method = normalizeEndpointMethod(input.method);
	const definition = findEndpointDefinition(registry, method, input.path);

	if (!definition) {
		const error = new Error(`Endpoint not found: ${method} ${input.path}`);
		(error as any).statusCode = 404;
		throw error;
	}

	return await definition.handler({ ...input, method });
}

export function normalizeEndpointMethod(method: EndpointMethod | string): EndpointMethod {
	const normalized = method.toUpperCase();

	if (["GET", "POST", "PUT", "PATCH", "DELETE"].includes(normalized)) {
		return normalized as EndpointMethod;
	}

	throw new Error(`Unsupported endpoint method: ${method}`);
}

function asMethodArray(method: EndpointMethod | EndpointMethod[]): EndpointMethod[] {
	return Array.isArray(method) ? method : [method];
}

function createEndpointKey(method: EndpointMethod, path: string): string {
	return `${method} ${path}`;
}
