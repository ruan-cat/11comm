import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { H3Event } from "nitro/h3";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { useRuntimeConfig } from "nitro/runtime-config";
import consola from "consola";
import * as schema from "./schema";

/**
 * Drizzle ORM 数据库实例（仅用于 seed 脚本等 Node.js 环境）
 *
 * @description
 * 在 Cloudflare Worker 环境下，模块顶层的 process.env 不可用，
 * 此实例可能为 null。seed 脚本等 Node.js 环境下可正常使用。
 * Nitro API 路由中请始终使用 useDb(event) 获取数据库连接。
 */
function createSeedDb(): NeonHttpDatabase<typeof schema> | null {
	try {
		const url = process.env.comm_admin_11__DATABASE_URL;
		if (!url) return null;
		return drizzle(neon(url), { schema });
	} catch {
		return null;
	}
}

export const db = createSeedDb();

/**
 * 数据库连接类型
 */
export type DbType = NeonHttpDatabase<typeof schema>;

/**
 * 尝试从多个来源获取数据库连接 URL
 *
 * @description
 * 获取优先级（从高到低）：
 * 1. event.context.cloudflare.env — Cloudflare Dashboard 设置的 Secrets/变量，
 *    运行时通过 Cloudflare Bindings 注入，这是 Cloudflare Worker 部署的首选来源
 * 2. process.env.comm_admin_11__DATABASE_URL — Nitro 将 wrangler.vars 在构建时
 *    polyfill 到 process.env（handler 内可用）
 * 3. process.env.DATABASE_URL — 标准环境变量名，用于 Vercel 等平台
 * 4. Nitro runtimeConfig.databaseUrl — 通过 nitro.config.ts 的 runtimeConfig 配置
 *
 * @remarks
 * Cloudflare Worker 环境变量有两种来源，获取方式不同：
 * - **Cloudflare Dashboard Secrets** → 运行时通过 `event.context.cloudflare.env` 访问
 * - **nitro.config.ts wrangler.vars** → 构建时 polyfill 到 `process.env`
 * 两种来源都需要检查，确保无论哪种配置方式都能正确获取。
 *
 * @param event - H3 事件对象，用于访问 Cloudflare Bindings
 * @returns 数据库连接 URL，未找到时返回 undefined
 */
function resolveDatabaseUrl(event: H3Event): string | undefined {
	/**
	 * 最高优先级：Cloudflare Dashboard 设置的 Secrets/变量
	 * 通过 Cloudflare Bindings 在运行时注入到 event.context.cloudflare.env
	 */
	try {
		const cfEnv = (event.context as any).cloudflare?.env;
		if (cfEnv) {
			if (cfEnv.comm_admin_11__DATABASE_URL) {
				consola.success("从 cloudflare.env 获取到环境变量: comm_admin_11__DATABASE_URL");
				return cfEnv.comm_admin_11__DATABASE_URL as string;
			}
			if (cfEnv.DATABASE_URL) {
				consola.success("从 cloudflare.env 获取到环境变量: DATABASE_URL");
				return cfEnv.DATABASE_URL as string;
			}
		}
	} catch {
		/** 非 Cloudflare 环境，静默忽略 */
	}

	/** 其次检查 process.env（wrangler.vars 构建时 polyfill） */
	if (process.env.comm_admin_11__DATABASE_URL) {
		consola.success("从 process.env 获取到环境变量: comm_admin_11__DATABASE_URL");
		return process.env.comm_admin_11__DATABASE_URL;
	}

	/** 再检查标准的 DATABASE_URL 环境变量 */
	if (process.env.DATABASE_URL) {
		consola.success("从 process.env 获取到环境变量: DATABASE_URL");
		return process.env.DATABASE_URL;
	}

	/** 最后尝试 Nitro runtimeConfig */
	try {
		const config = useRuntimeConfig();
		if (config?.databaseUrl) {
			consola.success("从 Nitro runtimeConfig 获取到 databaseUrl");
			return config.databaseUrl as string;
		}
	} catch {
		/** useRuntimeConfig 在非 Nitro 运行时环境中不可用，静默忽略 */
	}

	return undefined;
}

/**
 * 获取数据库实例
 *
 * @description
 * 在 Cloudflare Worker 环境中，环境变量只在请求处理时可用（handler 内），
 * 因此需要在每个请求时动态初始化数据库连接。
 *
 * 已缓存到 event.context.db 实现单请求内的单例模式，
 * 避免同一请求内多次调用 useDb 时重复创建连接。
 *
 * @param event - H3 事件对象
 * @returns Drizzle 数据库实例
 *
 * @example
 * ```typescript
 * // 在 API 路由中使用
 * export default defineHandler(async (event) => {
 *   const db = useDb(event);
 *   return await db.select().from(users);
 * });
 * ```
 */
export function useDb(event: H3Event): DbType {
	/** 如果事件上下文中已有数据库实例，直接返回（单例模式） */
	if (event.context.db) {
		return event.context.db as DbType;
	}

	/** 从多个来源解析数据库连接 URL（传入 event 以访问 Cloudflare Bindings） */
	const url = resolveDatabaseUrl(event);

	if (!url) {
		consola.error("未能获取数据库连接 URL，已检查以下来源：");
		consola.error("  - event.context.cloudflare.env.comm_admin_11__DATABASE_URL");
		consola.error("  - event.context.cloudflare.env.DATABASE_URL");
		consola.error("  - process.env.comm_admin_11__DATABASE_URL");
		consola.error("  - process.env.DATABASE_URL");
		consola.error("  - Nitro runtimeConfig.databaseUrl");

		throw new Error("未设置数据库连接地址 URL。请确保环境变量已正确配置。", {
			cause: {
				checkedSources: [
					"event.context.cloudflare.env.comm_admin_11__DATABASE_URL",
					"event.context.cloudflare.env.DATABASE_URL",
					"process.env.comm_admin_11__DATABASE_URL",
					"process.env.DATABASE_URL",
					"Nitro runtimeConfig.databaseUrl",
				],
			},
		});
	}

	/** 创建新的数据库连接并缓存到事件上下文中 */
	const envSql = neon(url);
	const envDbInstance = drizzle(envSql, { schema }) as DbType;
	event.context.db = envDbInstance;

	return envDbInstance;
}

/**
 * 导出 schema 定义
 */
export * from "./schema";
