import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

const apiRoot = dirname(fileURLToPath(import.meta.url));

loadDrizzleEnvFiles();

export const drizzleDatabaseUrlKeys = [
	"comm_admin_11__DATABASE_URL",
	"NITRO_DATABASE_URL",
	"DATABASE_URL",
	"POSTGRES_URL",
	"POSTGRES_PRISMA_URL",
	"VERCEL_POSTGRES_URL",
] as const;

export function resolveDrizzleDatabaseUrl(): string {
	for (const key of drizzleDatabaseUrlKeys) {
		const value = process.env[key]?.trim();
		if (value) {
			return value;
		}
	}

	throw new Error(
		`Missing database URL for apps/api Drizzle Kit. Configure one of: ${drizzleDatabaseUrlKeys.join(", ")}`,
	);
}

export function loadDrizzleEnvFiles(): void {
	if (process.env.NODE_ENV === "test" || process.env.VITEST) {
		return;
	}

	for (const envFilePath of [join(apiRoot, ".env"), join(apiRoot, ".env.vercel.local")]) {
		if (existsSync(envFilePath)) {
			config({ path: envFilePath });
		}
	}
}

/**
 * apps/api 是统一 Nitro runtime 的长期数据库运维入口。
 * schema 仍只从 apps/type 读取，避免复制表定义或恢复 admin 旧 schema 事实源。
 */
export default defineConfig({
	schema: ["../../apps/type/src/common/enums.ts", "../../apps/type/src/business/**/schema.ts"],
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: resolveDrizzleDatabaseUrl(),
	},
});
