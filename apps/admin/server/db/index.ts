import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { H3Event } from "nitro/h3";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import consola from "consola";
import { isEmpty } from "lodash-es";
import * as schema from "./schema";

/**
 * 创建 Neon 数据库连接（用于 seed 脚本）
 * 注意：Cloudflare Worker 环境下 process.env 在模块顶层不可用
 * seed 脚本需要在运行时通过 useDb(event) 获取数据库连接
 */
const databaseUrl = process.env.comm_admin_11__DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;
const dbInstance = sql ? drizzle(sql, { schema }) : null;

/**
 * Drizzle ORM 数据库实例（用于 seed 脚本）
 * 导出此实例用于在 seed 脚本中执行数据库操作
 */
export const db = dbInstance;

/**
 * 数据库连接类型
 */
export type DbType = NeonHttpDatabase<typeof schema>;

/**
 * 获取数据库实例
 *
 * 在 Cloudflare Worker 环境中，环境变量只在请求处理时可用
 * 因此需要在每个请求时动态初始化数据库连接
 *
 * @param event - H3 事件对象，用于获取运行时配置
 * @returns Drizzle 数据库实例
 *
 * @example
 * ```typescript
 * // 在 API 路由中使用
 * export default defineEventHandler(async (event) => {
 *   const db = useDb(event);
 *   return await db.select().from(users);
 * });
 * ```
 */
export function useDb(event: H3Event): DbType {
	/** 数据库链接地址 URL */
	let databaseUrl: string | undefined = undefined;

	/** 从事件上下文中获取 Cloudflare 环境变量 */
	const cloudflareEnv: Record<string, unknown> = (event.context?.cloudflare as any)?.env ?? {};

	// 如果事件上下文中已有数据库实例，直接返回（单例模式）
	if (event.context.db) {
		return event.context.db as DbType;
	}

	if (isEmpty(cloudflareEnv)) {
		consola.info("当前 Cloudflare 环境变量为空");
	} else {
		if (cloudflareEnv.comm_admin_11__DATABASE_URL) {
			consola.success("设置了cloudflare环境变量: comm_admin_11__DATABASE_URL");
			databaseUrl = cloudflareEnv.comm_admin_11__DATABASE_URL as string;
		}
		if (cloudflareEnv.DATABASE_URL) {
			consola.success("设置了cloudflare环境变量: DATABASE_URL");
			databaseUrl = cloudflareEnv.DATABASE_URL as string;
		}
	}

	if (process.env.comm_admin_11__DATABASE_URL) {
		consola.success("设置了process环境变量: comm_admin_11__DATABASE_URL");
		databaseUrl = process.env.comm_admin_11__DATABASE_URL as string;
	}

	if (!databaseUrl) {
		throw new Error("未设置数据库连接地址 URL", {
			cause: {
				cloudflareEnv,
				processEnv: process.env,
			},
		});
	}

	// 创建新的数据库连接并缓存到事件上下文中
	const envSql = neon(databaseUrl);
	const envDbInstance = drizzle(envSql, { schema }) as DbType;
	event.context.db = envDbInstance;

	return envDbInstance;
}

/**
 * 导出 schema 定义
 */
export * from "./schema";
