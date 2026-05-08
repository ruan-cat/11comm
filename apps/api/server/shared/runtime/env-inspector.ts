import type { H3Event } from "nitro/h3";
import { resolveCloudflareRuntimeEnv, resolveProcessEnv } from "./env";

export interface EnvironmentValueSnapshot {
	kind: "string" | "number" | "boolean" | "undefined" | "null" | "object";
	length: number;
	hash: string;
}

export interface EnvironmentSourceSnapshot {
	source: string;
	keyCount: number;
	keys: string[];
	entries: Record<string, EnvironmentValueSnapshot>;
}

export interface EnvironmentInspectionSummary {
	sourceCount: number;
	totalKeyCount: number;
	uniqueKeyCount: number;
	duplicateKeyCount: number;
}

export interface EnvironmentInspectionSnapshot {
	sources: Record<string, EnvironmentSourceSnapshot>;
	summary: EnvironmentInspectionSummary;
}

const environmentSources = [
	{
		source: "req.runtime.cloudflare.env",
		read: resolveCloudflareRuntimeEnv,
	},
	{
		source: "process.env",
		read: resolveProcessEnv,
	},
] as const;

export async function inspectEnvironmentSources(
	event: H3Event | Record<string, any>,
): Promise<EnvironmentInspectionSnapshot> {
	const snapshots = await Promise.all(
		environmentSources.map(async ({ source, read }) => {
			return [source, await snapshotEnvironmentSource(source, read(event))] as const;
		}),
	);

	const sources = Object.fromEntries(snapshots);
	const allKeys = snapshots.flatMap(([, snapshot]) => snapshot.keys);
	const uniqueKeys = [...new Set(allKeys)];

	return {
		sources,
		summary: {
			sourceCount: snapshots.length,
			totalKeyCount: allKeys.length,
			uniqueKeyCount: uniqueKeys.length,
			duplicateKeyCount: allKeys.length - uniqueKeys.length,
		},
	};
}

async function snapshotEnvironmentSource(
	source: string,
	environment: Record<string, string | undefined> | undefined,
): Promise<EnvironmentSourceSnapshot> {
	if (!environment) {
		return {
			source,
			keyCount: 0,
			keys: [],
			entries: {},
		};
	}

	const keys = Object.keys(environment).sort((left, right) => left.localeCompare(right));
	const entries = await buildEnvironmentEntries(environment, keys);

	return {
		source,
		keyCount: keys.length,
		keys,
		entries,
	};
}

async function buildEnvironmentEntries(
	environment: Record<string, string | undefined>,
	keys: string[],
): Promise<Record<string, EnvironmentValueSnapshot>> {
	const entries = await Promise.all(
		keys.map(async (key) => {
			const value = environment[key];
			return [key, await snapshotEnvironmentValue(value)] as const;
		}),
	);

	return Object.fromEntries(entries);
}

async function snapshotEnvironmentValue(value: unknown): Promise<EnvironmentValueSnapshot> {
	const { kind, serialized } = normalizeEnvironmentValue(value);

	return {
		kind,
		length: serialized.length,
		hash: await sha256(serialized),
	};
}

function normalizeEnvironmentValue(value: unknown): { kind: EnvironmentValueSnapshot["kind"]; serialized: string } {
	if (value === undefined) {
		return { kind: "undefined", serialized: "[undefined]" };
	}

	if (value === null) {
		return { kind: "null", serialized: "[null]" };
	}

	if (typeof value === "string") {
		return { kind: "string", serialized: value };
	}

	if (typeof value === "number") {
		return { kind: "number", serialized: String(value) };
	}

	if (typeof value === "boolean") {
		return { kind: "boolean", serialized: String(value) };
	}

	if (typeof value === "object") {
		return { kind: "object", serialized: JSON.stringify(value) || "[object]" };
	}

	return { kind: typeof value as EnvironmentValueSnapshot["kind"], serialized: String(value) };
}

async function sha256(value: string): Promise<string> {
	const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
