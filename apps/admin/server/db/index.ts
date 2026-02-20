import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { H3Event } from "h3";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * 创建 Neon 数据库连接（用于 seed 脚本）
 * 注意：Cloudflare Worker 环境下 process.env 在模块顶层不可用
 * seed 脚本需要在运行时通过 useDb(event) 获取数据库连接
 */
const databaseUrl = process.env.COMM_ADMIN_11__DATABASE_URL;
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
	// 如果事件上下文中已有数据库实例，直接返回（单例模式）
	if (event.context.db) {
		return event.context.db as DbType;
	}

	// 直接使用 process.env 在运行时获取带 Vercel 前缀的环境变量
	// 环境变量名称: comm_admin_11__DATABASE_URL (在 .env.vercel.local 中定义)
	// 注意：process.env 会自动将环境变量名转为大写
	const databaseUrl = process.env.COMM_ADMIN_11__DATABASE_URL;

	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL is not configured. Please set COMM_ADMIN_11__DATABASE_URL environment variable in Cloudflare Workers.",
		);
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
