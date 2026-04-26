import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { H3Event } from "nitro/h3";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@01s-11comm/type";
import { resolveDatabaseUrlFromSources } from "../shared/runtime/env";

export type DbType = NeonHttpDatabase<typeof schema>;

export function useDb(event: H3Event): DbType {
	const context = ((event as any).context ??= {});

	if (context.db) {
		return context.db as DbType;
	}

	const url = resolveDatabaseUrlFromSources(event);
	if (!url) {
		throw new Error(
			"Database URL is not configured. Configure comm_admin_11__DATABASE_URL, NITRO_DATABASE_URL, DATABASE_URL, POSTGRES_URL, or runtimeConfig.databaseUrl.",
		);
	}

	const db = drizzle(neon(url), { schema }) as DbType;
	context.db = db;
	return db;
}

export function hasDatabaseUrl(event: H3Event): boolean {
	return Boolean(resolveDatabaseUrlFromSources(event));
}
