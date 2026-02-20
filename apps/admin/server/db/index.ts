import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { H3Event } from "h3";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { getDatabaseUrl, getVercelEnvRequired } from "server/utils/vercel-env";

/**
 * 创建 Neon 数据库连接（用于 seed 脚本）
 * 使用环境变量直接创建连接，不依赖运行时配置
 * 使用 Vercel 前缀获取环境变量
 */
const databaseUrl = getDatabaseUrl();
const sql = databaseUrl && databaseUrl !== "postgres://dummy:dummy@localhost:5432/dummy" ? neon(databaseUrl) : null;
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
	// 如果事件上下文中已有数据库实例，直接返回（单例模式）
	if (event.context.db) {
		return event.context.db as DbType;
	}

	// 从环境变量获取数据库 URL（使用 Vercel 前缀）
	const envDatabaseUrl = getVercelEnvRequired("DATABASE_URL");

	// 创建新的数据库连接并缓存到事件上下文中
	const envSql = neon(envDatabaseUrl);
	const envDbInstance = drizzle(envSql, { schema }) as DbType;
	event.context.db = envDbInstance;

	return envDbInstance;
}

/**
 * 导出 schema 定义
 */
export * from "./schema";
