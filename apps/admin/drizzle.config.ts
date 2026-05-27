import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./server/utils/vercel-env";

console.warn(
	"[legacy-db] apps/admin/drizzle.config.ts is compatibility-only. Canonical Drizzle migrations and Neon operations now live in apps/api.",
);

config({ path: ".env" });
config({ path: ".env.vercel.local" });

/**
 * Legacy Drizzle Kit 配置文件
 *
 * 仅用于历史迁移源和兼容命令。
 * 长期权威入口是 apps/api/drizzle.config.ts：
 * - schema 仍从 apps/type 读取
 * - 新迁移文件输出到 apps/api/drizzle
 * - Neon readiness/drift 与受控迁移执行归 apps/api
 *
 * 本文件不应作为新增生产迁移或写库操作的首选入口。
 * - schema: 指定 Schema 文件位置
 * - out: 迁移文件输出目录
 * - dialect: 数据库方言（postgresql）
 * - dbCredentials: 数据库连接信息
 */
export default defineConfig({
	schema: ["../../apps/type/src/common/enums.ts", "../../apps/type/src/business/**/schema.ts"],
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: getDatabaseUrl(),
	},
});
