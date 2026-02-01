import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./server/utils/vercel-env";

config({ path: ".env" });
config({ path: ".env.vercel.local" });

/**
 * Drizzle Kit 配置文件
 *
 * 用于配置数据库迁移工具的行为
 * - schema: 指定 Schema 文件位置
 * - out: 迁移文件输出目录
 * - dialect: 数据库方言（postgresql）
 * - dbCredentials: 数据库连接信息
 */
export default defineConfig({
	schema: "./server/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: getDatabaseUrl(),
	},
});
