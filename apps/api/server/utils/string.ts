export function toOptionalTrimmedString(value: unknown): string | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	const stringValue = `${value}`.trim();

	return stringValue === "" ? undefined : stringValue;
}
