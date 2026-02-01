import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * 创建 Neon 数据库连接
 *
 * 使用 @neondatabase/serverless 驱动连接 Neon PostgreSQL
 * 该驱动专为 Serverless 环境优化，支持 Edge Runtime
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Drizzle ORM 数据库实例
 *
 * 导出此实例用于在路由中执行数据库操作
 * schema 参数用于启用关系查询功能
 */
export const db = drizzle(sql, { schema });

/** 导出所有 schema 定义，便于在其他地方使用 */
export * from "./schema";
