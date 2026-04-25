import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { H3Event } from "nitro/h3";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { useRuntimeConfig } from "nitro/runtime-config";
import * as schema from "@01s-11comm/type";

export type DbType = NeonHttpDatabase<typeof schema>;

export function useDb(event: H3Event): DbType {
	const context = ((event as any).context ??= {});

	if (context.db) {
		return context.db as DbType;
	}

	const url = resolveDatabaseUrl(event);
	if (!url) {
		throw new Error(
			"未设置数据库连接地址 URL。请配置 comm_admin_11__DATABASE_URL、DATABASE_URL、NITRO_DATABASE_URL 或 runtimeConfig.databaseUrl。",
		);
	}

	const db = drizzle(neon(url), { schema }) as DbType;
	context.db = db;
	return db;
}

export function hasDatabaseUrl(event: H3Event): boolean {
	return Boolean(resolveDatabaseUrl(event));
}

function resolveDatabaseUrl(event: H3Event): string | undefined {
	const cloudflareEnv = (event as any).req?.runtime?.cloudflare?.env;
	return (
		cloudflareEnv?.comm_admin_11__DATABASE_URL ||
		cloudflareEnv?.NITRO_DATABASE_URL ||
		cloudflareEnv?.DATABASE_URL ||
		process.env.comm_admin_11__DATABASE_URL ||
		process.env.NITRO_DATABASE_URL ||
		process.env.DATABASE_URL ||
		resolveRuntimeConfigDatabaseUrl()
	);
}

function resolveRuntimeConfigDatabaseUrl(): string | undefined {
	try {
		return useRuntimeConfig().databaseUrl as string | undefined;
	} catch {
		return undefined;
	}
}
