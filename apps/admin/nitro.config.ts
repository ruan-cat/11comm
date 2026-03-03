import { defineConfig } from "nitro";
import { pathResolve } from "./build/utils";
import { config } from "dotenv";
import { resolve } from "node:path";

const adminDir = process.cwd();

/**
 * 加载环境变量文件
 *
 * 在 Nitro 构建时加载 .env 和 .env.vercel.local 文件
 * 以便在 cloudflare.wrangler.vars 中使用这些环境变量
 */
function loadEnvFiles() {
	// 加载 .env 文件
	config({ path: resolve(adminDir, ".env") });
	// 加载 .env.vercel.local 文件
	config({ path: resolve(adminDir, ".env.vercel.local") });
}

// 加载环境变量
loadEnvFiles();

// 复用 server/utils/vercel-env.ts 中的 getVercelEnv 逻辑
// 注意：这里不能直接导入，因为 vercel-env.ts 使用 @dotenvx/dotenvx
// 而在构建时使用标准 dotenv 加载环境变量，所以需要保持相同的逻辑
function getVercelEnv(envName: string): string | undefined {
	const prefix = process.env.VERCEL_ENV_PREFIX || "comm_admin_11_";
	const fullEnvName = `${prefix}_${envName}`;
	return process.env[fullEnvName];
}

export default defineConfig({
	serverDir: "./server",

	compatibilityDate: {
		// https://v3.nitro.build/deploy/providers/cloudflare
		cloudflare: "2024-09-19",
		// https://nitro.build/deploy/providers/vercel#observability
		vercel: "2024-09-19",
	},

	/**
	 * 运行时配置
	 * @description
	 * 在 Cloudflare Worker 环境中，环境变量只在请求处理时可用
	 * 因此使用 runtimeConfig 让 Nitro 在运行时注入环境变量
	 *
	 * 注意：中间件应放在 server/middleware 目录中，Nitro 会自动加载
	 */
	runtimeConfig: {
		/** 数据库连接 URL — Nitro 会在运行时注入到 useRuntimeConfig().databaseUrl */
		databaseUrl: getVercelEnv("DATABASE_URL") || process.env.DATABASE_URL || "",

		/** Neon Auth 服务基础 URL */
		neonAuthBaseUrl: getVercelEnv("NEON_AUTH_BASE_URL") || process.env.NEON_AUTH_BASE_URL || "",
		/** Neon Auth Cookie 密钥（至少 32 字符） */
		neonAuthCookieSecret: getVercelEnv("NEON_AUTH_COOKIE_SECRET") || process.env.NEON_AUTH_COOKIE_SECRET || "",
		/** 前端基础 URL，用于 OAuth 回调 */
		publicBaseUrl: process.env.PUBLIC_BASE_URL || "http://localhost:8080",
	},

	/**
	 * 配置 Nitro 扫描目录
	 * @description
	 * 明确指定 Nitro 只扫描服务端目录，避免扫描客户端代码
	 * @see https://nitro.unjs.io/config#scandirs
	 */
	scanDirs: ["./server"],

	devServer: {
		watch: ["./server/**/*.ts"],
	},

	// FIXME: 无法实现全局类型导入
	// imports: {
	// 	autoImport: true,
	// 	imports: [
	// 		// import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
	// 		{ from: "@01s-11comm/type", name: "DEFAULT_PAGE_INDEX" },
	// 		{ from: "@01s-11comm/type", name: "DEFAULT_PAGE_SIZE" },
	// 		// import { defineHandler, readBody } from "nitro/h3";
	// 		{ from: "nitro/h3", name: "defineHandler" },
	// 		{ from: "nitro/h3", name: "readBody" },
	// 		// import type { JsonVO, PageDTO } from "@01s-11comm/type";
	// 		{ from: "@01s-11comm/type", name: "JsonVO", type: true },
	// 		{ from: "@01s-11comm/type", name: "PageDTO", type: true },
	// 	],
	// },

	alias: {
		/**
		 * Nitro 构建需要显式传入当前文件的 import.meta.url，
		 * 否则默认会以 build/utils.ts 的路径为基准，导致解析到 build/src。
		 */
		"@": pathResolve("./src", import.meta.url),
		components: pathResolve("./src/components", import.meta.url),
		composables: pathResolve("./src/composables", import.meta.url),
		server: pathResolve("./server", import.meta.url),
	},

	// 不提供任何写死的预设了 需要在运行命令的环境变量 NITRO_PRESET 内传入
	// preset: "cloudflare_module",

	/**
	 * Rollup 外部模块声明
	 *
	 * @description
	 * cloudflare:workers 是 Cloudflare Worker 运行时专属模块，仅在 CF 环境可用。
	 * 若不声明为 external，Vite/Rollup 在非 CF 构建阶段会尝试静态解析此模块，
	 * 导致 "Rollup failed to resolve import" 构建错误。
	 *
	 * @see https://nitro.build/config#rollupconfig
	 */
	rollupConfig: {
		external: ["cloudflare:workers"],
	},

	typescript: {
		// typeCheck: true,
		// generatedTypesDir: pathResolve("./src/types"),
	},

	cloudflare: {
		deployConfig: true,
		nodeCompat: true,
		wrangler: {
			// 部署到 cloudflare worker 的名称。 与 cloudflare worker 云端设置保持一致
			name: "01s-11comm-admin",
			vars: {
				// 从 .env.vercel.local 读取的 Vercel 前缀环境变量
				// 这些变量会被写入 wrangler.toml 并在运行时可用
				// 前缀默认为 comm_admin_11_
				...(getVercelEnv("DATABASE_URL") && {
					comm_admin_11__DATABASE_URL: getVercelEnv("DATABASE_URL"),
				}),
				...(getVercelEnv("DATABASE_URL_UNPOOLED") && {
					comm_admin_11__DATABASE_URL_UNPOOLED: getVercelEnv("DATABASE_URL_UNPOOLED"),
				}),
				...(getVercelEnv("NEON_AUTH_BASE_URL") && {
					comm_admin_11__NEON_AUTH_BASE_URL: getVercelEnv("NEON_AUTH_BASE_URL"),
				}),
				...(getVercelEnv("NEON_AUTH_COOKIE_SECRET") && {
					comm_admin_11__NEON_AUTH_COOKIE_SECRET: getVercelEnv("NEON_AUTH_COOKIE_SECRET"),
				}),
				...(getVercelEnv("PUBLIC_BASE_URL") && {
					comm_admin_11__PUBLIC_BASE_URL: getVercelEnv("PUBLIC_BASE_URL"),
				}),
				...(getVercelEnv("NEON_PROJECT_ID") && {
					comm_admin_11__NEON_PROJECT_ID: getVercelEnv("NEON_PROJECT_ID"),
				}),
				...(getVercelEnv("PGDATABASE") && {
					comm_admin_11__PGDATABASE: getVercelEnv("PGDATABASE"),
				}),
				...(getVercelEnv("PGHOST") && {
					comm_admin_11__PGHOST: getVercelEnv("PGHOST"),
				}),
				...(getVercelEnv("PGHOST_UNPOOLED") && {
					comm_admin_11__PGHOST_UNPOOLED: getVercelEnv("PGHOST_UNPOOLED"),
				}),
				...(getVercelEnv("PGPASSWORD") && {
					comm_admin_11__PGPASSWORD: getVercelEnv("PGPASSWORD"),
				}),
				...(getVercelEnv("PGUSER") && {
					comm_admin_11__PGUSER: getVercelEnv("PGUSER"),
				}),
			},
			// cloudflare 开启可观察日志
			observability: {
				logs: {
					enabled: true,
					invocation_logs: true,
				},
			},
		},
	},
});
