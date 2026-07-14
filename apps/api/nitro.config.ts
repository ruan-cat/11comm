import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "nitro";

const apiRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	serverDir: "./server",
	ignore: ["modules/**"],

	// Phase3 infra: lock Nitro's runtime compatibility for every preset build.
	// Do not replace this file with Vite-style dev-server, plugin, or bundler-output settings.
	compatibilityDate: "2024-09-19",

	// Phase3 infra: runtimeConfig is the deployment-time source for service metadata,
	// CORS policy, detailed-error switches, and Node/Vercel database URL fallbacks.
	// Cloudflare Worker secrets still come from event.req.runtime?.cloudflare?.env in server/shared/runtime/env.ts.
	runtimeConfig: {
		wechat: {
			appId: process.env.WECHAT_MP_APPID || process.env.WECHAT_MP_APP_ID || "",
			secret: process.env.WECHAT_MP_SECRET || process.env.WECHAT_APP_SECRET || "",
		},
		auth: {
			tokenSecret: process.env.AUTH_TOKEN_SECRET || process.env.NITRO_AUTH_TOKEN_SECRET || "",
			accessTokenTtlSeconds: process.env.AUTH_ACCESS_TOKEN_TTL_SECONDS || "",
			refreshTokenTtlSeconds: process.env.AUTH_REFRESH_TOKEN_TTL_SECONDS || "",
		},
		databaseUrl:
			process.env.comm_admin_11__DATABASE_URL ||
			process.env.NITRO_DATABASE_URL ||
			process.env.DATABASE_URL ||
			process.env.POSTGRES_URL ||
			"",
		public: {
			serviceName: "@01s-11comm/api",
			phase: "phase3-infra",
			apiBasePath: "/",
			corsAllowedOrigins: process.env.NITRO_CORS_ALLOWED_ORIGINS || "",
			enableDetailedErrors: process.env.NODE_ENV === "production" ? "false" : "true",
		},
	},
	devServer: {
		// Keep the default API dev port stable, but allow local overrides when app/admin run together.
		port: Number.parseInt(process.env.NITRO_PORT || "3102", 10),
		watch: ["./server/**/*.ts"],
	},
	handlers: [
		{
			// Phase3 keeps the Phase2 app legacy shadow entrypoint. Do not expand this into
			// repair/resource/parking or other Phase4/Phase5 business migrations here.
			route: "/app/**",
			handler: "./server/handlers/legacy-dispatch",
		},
		{
			// Phase7 production cutover still needs app legacy fallback for routes not yet
			// migrated into apps/api, such as /callComponent/core/list.
			route: "/callComponent/**",
			handler: "./server/handlers/legacy-dispatch",
		},
	],
	alias: {
		server: path.resolve(apiRoot, "server"),
	},
	// Cloudflare Worker builds can reference platform modules; externalizing keeps
	// Node/Vercel builds from trying to bundle Cloudflare-only imports.
	rollupConfig: {
		external: ["cloudflare:workers"],
	},
	// Phase3 deployment target: generate Wrangler config for the standalone apps/api service.
	// Keep public routes public. Scoped auth is opt-in through explicit route helpers;
	// do not add an undeclared global JWT, token, or Neon Auth middleware.
	cloudflare: {
		deployConfig: true,
		nodeCompat: true,
		wrangler: {
			name: "01s-11comm-api",
			observability: {
				logs: {
					enabled: true,
					invocation_logs: true,
				},
			},
		},
	},
});
