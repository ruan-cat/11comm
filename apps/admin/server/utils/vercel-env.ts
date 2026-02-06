import { config } from "@dotenvx/dotenvx";
import { resolve } from "node:path";

const adminDir = process.cwd();

/** 标记环境变量是否已加载 */
let envLoaded = false;

/**
 * 加载环境变量文件
 *
 * 依次加载 .env 和 .env.vercel.local 文件
 * 确保环境变量只加载一次
 */
function loadEnvFiles() {
	if (envLoaded) return;

	config({ path: resolve(adminDir, ".env") });
	config({ path: resolve(adminDir, ".env.vercel.local") });

	envLoaded = true;
}

/**
 * 获取 Vercel 环境变量前缀
 *
 * 从 .env 文件中读取 VERCEL_ENV_PREFIX 变量
 * 该前缀用于识别从 Vercel Neon 集成拉取的环境变量
 *
 * @returns 环境变量前缀字符串，默认为 "comm_admin_11_"
 */
export function getVercelEnvPrefix(): string {
	loadEnvFiles();
	return process.env.VERCEL_ENV_PREFIX || "comm_admin_11_";
}

/**
 * 获取带前缀的 Vercel 环境变量
 *
 * 从 .env.vercel.local 文件中获取由 Vercel Neon 集成生成的环境变量
 * 这些环境变量带有配置的前缀（如 comm_admin_11_）
 *
 * @param envName - 环境变量名称（不含前缀），如 "DATABASE_URL"
 * @returns 环境变量值，如果不存在则返回 undefined
 *
 * @example
 * ```typescript
 * // 获取 comm_admin_11__DATABASE_URL 的值
 * const databaseUrl = getVercelEnv("DATABASE_URL");
 * ```
 */
export function getVercelEnv(envName: string): string | undefined {
	loadEnvFiles();
	const prefix = getVercelEnvPrefix();
	const fullEnvName = `${prefix}_${envName}`;
	return process.env[fullEnvName];
}

/**
 * 获取必需的 Vercel 环境变量
 *
 * 与 getVercelEnv 类似，但如果环境变量不存在则抛出错误
 *
 * @param envName - 环境变量名称（不含前缀），如 "DATABASE_URL"
 * @returns 环境变量值
 * @throws 如果环境变量不存在
 *
 * @example
 * ```typescript
 * // 获取 comm_admin_11__DATABASE_URL 的值，不存在则报错
 * const databaseUrl = getVercelEnvRequired("DATABASE_URL");
 * ```
 */
export function getVercelEnvRequired(envName: string): string {
	const value = getVercelEnv(envName);
	if (!value) {
		const prefix = getVercelEnvPrefix();
		const fullEnvName = `${prefix}_${envName}`;
		throw new Error(
			`Required environment variable ${fullEnvName} is not set. Please run 'pnpm env:pull' to fetch Vercel environment variables.`,
		);
	}
	return value;
}

/**
 * 获取 Neon 数据库连接 URL
 *
 * 优先从 Vercel 环境变量获取（带前缀），
 * 如果不存在则回退到标准的 DATABASE_URL
 *
 * @returns 数据库连接 URL
 * @throws 如果两种方式都无法获取到连接 URL
 */
export function getDatabaseUrl(): string {
	loadEnvFiles();

	const vercelDatabaseUrl = getVercelEnv("DATABASE_URL");
	if (vercelDatabaseUrl) {
		return vercelDatabaseUrl;
	}

	const standardDatabaseUrl = process.env.DATABASE_URL;
	if (standardDatabaseUrl) {
		return standardDatabaseUrl;
	}

	console.warn("⚠️ DATABASE_URL is not configured. Returning dummy URL for offline generation.");
	return "postgres://dummy:dummy@localhost:5432/dummy";
}

/**
 * 获取 Neon 数据库直连 URL（无连接池）
 *
 * 用于需要直连数据库的场景，如数据库迁移
 *
 * @returns 数据库直连 URL，如果不存在则返回 undefined
 */
export function getDatabaseUrlUnpooled(): string | undefined {
	loadEnvFiles();

	const vercelUrl = getVercelEnv("DATABASE_URL_UNPOOLED");
	if (vercelUrl) {
		return vercelUrl;
	}

	return process.env.DATABASE_URL_UNPOOLED;
}
