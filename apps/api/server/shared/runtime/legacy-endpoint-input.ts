export function mergeInput(query: unknown, body: unknown): Record<string, unknown> {
	return {
		...asRecord(query),
		...asRecord(body),
	};
}

export function asRecord(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return {};
	}

	return value as Record<string, unknown>;
}
