<!-- 已完成 -->

# 2026-04-25 11comm App Monorepo API Migration Phase3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 加固 `apps/api` 的部署、运行时配置、跨域、可观测性、错误响应、健康检查、接入策略、测试分层与 CI/部署门禁，为后续 Phase4/Phase5 业务迁移提供可配置、可回退、可验收的基础设施。

**Architecture:** Phase3 延续影子迁移策略，只在现有 `apps/api` Phase2 fee/payment/report 样板之上补齐基础设施层，不迁移更多业务域。`apps/api` 继续作为独立 Nitro 服务，app/admin 只获得可开关的 API base URL 和代理/回退能力，不做全量切流；旧 `apps/admin/server` 与 `apps/app/server` 保留为对照和回退来源。

**Tech Stack:** pnpm workspace, Turbo, Nitro v3, H3 from `nitro/h3`, Drizzle ORM, Neon Serverless, Cloudflare Worker runtime env, Vercel/Cloudflare presets, consola, Vitest Node environment, Vue/uni-app, Axios, Alova

---

## Phase3 Scope Lock

Phase3 只做基础设施加固与接入准备，允许范围如下：

- 部署 preset 与平台配置：Node server、Vercel、Cloudflare Worker 构建路径和验收命令。
- `runtimeConfig`、环境变量解析、数据库 URL 解析与 `useDb(event)` 加固。
- CORS、预检请求、响应头与 request id。
- 结构化日志、错误追踪字段、统一错误响应和健康检查增强。
- app/admin API base URL 接入策略、代理策略和回退策略。
- Phase2 endpoint registry 固化为可审计清单。
- 测试分层、CI、部署验收和最终门禁。

Phase3 禁止范围如下：

- 不迁移 repair/resource/parking、charge-machine/open-door、machine-record 或其他业务域。
- 不扩大 Phase2 的 fee/payment/report 样板，不把它解释为 repair/resource/parking 的前置迁移。
- 不做 app/admin 全量切流，只允许白名单、环境变量开关和局部 shadow 验证。
- 不删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server` 或 `D:\code\ruan-cat\01s-11comm-app`。
- 不处理 Phase4/Phase5 的大批量业务迁移。
- 不添加任何接口鉴权，不引入 Neon Auth、JWT、Token 校验或 `@neondatabase/auth`。
- 不把 Nitro config 写成 Vite 配置对象；禁止在 `apps/api/nitro.config.ts` 中使用 `plugins`、`server.proxy`、`build.rollupOptions` 等 Vite 配置字段。

硬性编码约束：

- 所有 H3 helper 必须从 `nitro/h3` 导入。
- 所有数据库访问必须通过 `useDb(event)`，不得在模块顶层创建数据库连接。
- Cloudflare Worker 环境变量必须从 `event.req.runtime?.cloudflare?.env` 读取；`event.context.cloudflare.env` 只能作为降级兼容记录，不能作为主路径。
- 测试文件必须是 `*.test.ts`，使用 Vitest 的 `import { test, describe } from "vitest";`，并放在对应子包的 `tests/` 或 `src/tests/` 下。

## File Responsibility Map

### Phase3 Plan File

- Create: `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase3.md`
  - 本文件只描述第三阶段执行计划。本轮编辑子代理只创建该文件，不修改其他文件，不提交 git。

### Phase3 Implementation Files

- Modify: `apps/api/package.json`
  - 增加 API 基础设施验收脚本和多 preset 构建脚本。
- Modify: `apps/api/nitro.config.ts`
  - 固化 Nitro runtimeConfig、compatibilityDate、rollup external、Cloudflare/Vercel/Node preset 配置。
- Modify: `apps/api/server/db/index.ts`
  - 改为复用统一 env resolver，并确保数据库连接只通过 `useDb(event)` 创建。
- Create: `apps/api/server/shared/runtime/env.ts`
  - 解析 runtimeConfig、process.env、Cloudflare Worker env 和公开运行时配置。
- Create: `apps/api/server/shared/runtime/cors.ts`
  - 解析允许来源、预检请求和响应头策略。
- Create: `apps/api/server/middleware/cors.ts`
  - 在 `/api/**`、`/app/**`、`/__nitro/**` 统一设置 CORS 与基础安全响应头。
- Create: `apps/api/server/shared/runtime/request-context.ts`
  - 生成 request id、读取请求路径/方法、写入响应头。
- Create: `apps/api/server/middleware/request-context.ts`
  - 将 request id 和开始时间放入 `event.context`。
- Create: `apps/api/server/shared/runtime/errors.ts`
  - 标准化错误对象、HTTP 状态、request id、是否暴露 stack。
- Create: `apps/api/server/shared/runtime/observability.ts`
  - 结构化日志字段和 request/error 日志 helper。
- Modify: `apps/api/server/shared/runtime/response-builder.ts`
  - 统一 app legacy 与 admin canonical 的错误响应构造。
- Modify: `apps/api/server/handlers/legacy-dispatch.ts`
  - 使用统一错误响应和日志，不改变 Phase2 白名单。
- Modify: `apps/api/server/routes/__nitro/health.get.ts`
  - 增强健康检查，不访问数据库，只报告数据库配置状态。
- Create: `apps/api/server/routes/__nitro/ready.get.ts`
  - 暴露部署就绪检查，默认不执行 DB 查询。
- Create: `apps/api/server/routes/__nitro/endpoints.get.ts`
  - 输出 Phase2 固化 endpoint registry 清单，供 CI 和人工复核。
- Modify: `apps/api/server/shared/runtime/runtime-endpoints.ts`
  - 导出 endpoint manifest，只包含 Phase2 fee/payment/report 白名单。
- Create: `apps/api/tests/infra/runtime-env.test.ts`
- Create: `apps/api/tests/infra/cors.test.ts`
- Create: `apps/api/tests/infra/errors-observability.test.ts`
- Create: `apps/api/tests/infra/health-ready.test.ts`
- Create: `apps/api/tests/infra/endpoint-manifest.test.ts`
  - 覆盖 Phase3 基础设施行为。
- Modify: `apps/app/src/http/runtime-base.ts`
- Modify: `apps/app/src/http/alova.ts`
- Modify: `apps/app/src/env.d.ts`
- Modify: `apps/app/env/.env.development-nitro-api`
- Modify: `apps/app/env/.env.production-nitro-api`
- Modify: `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`
  - app 端只增加 Phase2 endpoint 白名单接入策略，不切全部 app 请求。
- Create: `apps/admin/src/utils/http/api-base-url.ts`
- Modify: `apps/admin/src/utils/http/index.ts`
- Modify: `apps/admin/types/env.shim.d.ts`
- Modify: `apps/admin/vite.config.ts`
- Create: `apps/admin/src/utils/http/tests/api-base-url.test.ts`
  - admin 端只增加 shadow base URL helper 与代理策略，不改变默认全局请求目标。
- Modify: `.github/workflows/ci.yaml`
- Modify: `.github/workflows/app-ci.yml`
- Modify: `.github/workflows/vercel-deploy-tool.yaml`
- Modify: `.github/workflows/release.yaml`
  - 移除全局安装和 `run_install` 模式，保持 Node 22.14.0、`pnpm install --frozen-lockfile` 与 workspace-local 工具调用，加入 API preset 验收。

## Implementation Steps

### Task 1: Phase3 边界冻结与现状审计

**Files:**

- Read: `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`
- Read: `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase1.md`
- Read: `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase2.md`
- Read: `docs/superpowers/reports/2026-04-26-phase2-consolidated-report.md`
- Verify: `apps/api/**`
- Verify: `apps/admin/server/**`
- Verify: `apps/app/server/**`
- Verify: `D:\code\ruan-cat\01s-11comm-app`

- [x] **Step 1: 记录 Phase3 输入事实**

Run:

```powershell
Test-Path apps/api
Test-Path apps/admin/server
Test-Path apps/app/server
$oldSource = "D:\code\ruan-cat\01s-11comm-app"
Test-Path $oldSource
pnpm -r list --depth -1
```

Expected:

- `apps/api`、`apps/admin/server`、`apps/app/server` 均为 `True`。
- 旧源目录 `D:\code\ruan-cat\01s-11comm-app` 为 `True`。
- workspace 输出包含 `@01s-11comm/api`、`@01s-11comm/admin`、`@01s-11comm/app`、`@01s-11comm/type`。

- [x] **Step 2: 固化 Phase3 禁止迁移清单**

在执行上下文中记录以下边界，不写入代码：

```text
Phase3 不迁移 repair/resource/parking。
Phase3 不迁移 charge-machine/open-door/machine-record。
Phase3 不做 app/admin 全量切流。
Phase3 不删除 apps/admin/server、apps/app/server 或旧源目录。
Phase3 不添加 Neon Auth、JWT、Token 或任意接口鉴权。
Phase3 只使用 Phase2 fee/payment/report endpoint 作为验证输入。
```

- [x] **Step 3: 扫描禁止模式**

Run:

```powershell
rg -n "from ['\"]h3['\"]" apps/api
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 校验|token 校验|Bearer|Authorization" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
rg -n "repair|resource|parking|ChargeMachine|listMachineRecords|openDoor|OpenDoor" apps/api/server
```

Expected:

- 前三条无输出。
- 第四条只允许在排除性测试或 Phase4/Phase5 输入清单文本中出现，不允许在 `apps/api/server/modules/fee/**` 或 runtime endpoint 注册中出现。

- [x] **Step 4: 验证 Phase2 样板仍可运行**

Run:

```powershell
pnpm -F @01s-11comm/api test
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build
```

Expected:

- API tests pass。
- Typecheck pass。
- Nitro build pass。
- 如失败，先修复 Phase2 回归，再进入 Task 2；不得用扩大业务范围掩盖基础设施问题。

### Task 2: `apps/api` runtimeConfig/env/database resolver 加固

**Files:**

- Modify: `apps/api/nitro.config.ts`
- Create: `apps/api/server/shared/runtime/env.ts`
- Modify: `apps/api/server/db/index.ts`
- Create: `apps/api/tests/infra/runtime-env.test.ts`

- [x] **Step 1: 先写 runtime env 测试**

Create `apps/api/tests/infra/runtime-env.test.ts`:

```ts
import { test, describe } from "vitest";
import { expect } from "vitest";

import {
	resolveCloudflareRuntimeEnv,
	resolveDatabaseUrlFromSources,
	resolvePublicRuntimeConfig,
} from "../../server/shared/runtime/env";

describe("api runtime env resolver", () => {
	test("uses Cloudflare Worker runtime env as the highest priority source", () => {
		const event = {
			req: {
				runtime: {
					cloudflare: {
						env: {
							comm_admin_11__DATABASE_URL: "postgresql://cf-runtime",
							DATABASE_URL: "postgresql://standard",
						},
					},
				},
			},
		};

		expect(resolveCloudflareRuntimeEnv(event as any)).toMatchObject({
			comm_admin_11__DATABASE_URL: "postgresql://cf-runtime",
		});
		expect(resolveDatabaseUrlFromSources(event as any, { databaseUrl: "postgresql://runtime" })).toBe(
			"postgresql://cf-runtime",
		);
	});

	test("falls back to runtimeConfig before returning undefined", () => {
		expect(resolveDatabaseUrlFromSources({} as any, { databaseUrl: "postgresql://runtime" })).toBe(
			"postgresql://runtime",
		);
	});

	test("normalizes public runtime config values", () => {
		expect(
			resolvePublicRuntimeConfig({
				serviceName: "@01s-11comm/api",
				phase: "phase3-infra",
				corsAllowedOrigins: "http://localhost:5173,https://example.com",
			}),
		).toMatchObject({
			serviceName: "@01s-11comm/api",
			phase: "phase3-infra",
			corsAllowedOrigins: ["http://localhost:5173", "https://example.com"],
		});
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra/runtime-env.test.ts
```

Expected:

- Red: fails because `server/shared/runtime/env.ts` does not exist.

- [x] **Step 2: 创建统一 env resolver**

Create `apps/api/server/shared/runtime/env.ts`:

```ts
import type { H3Event } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export interface RuntimeConfigLike {
	databaseUrl?: string;
	public?: Record<string, unknown>;
}

export interface PublicRuntimeConfig {
	serviceName: string;
	phase: string;
	corsAllowedOrigins: string[];
	enableDetailedErrors: boolean;
	apiBasePath: string;
}

export type RuntimeEnvRecord = Record<string, string | undefined>;

export function resolveCloudflareRuntimeEnv(event: H3Event | Record<string, any>): RuntimeEnvRecord | undefined {
	return (event as any).req?.runtime?.cloudflare?.env as RuntimeEnvRecord | undefined;
}

export function resolveProcessEnv(): RuntimeEnvRecord {
	return process.env as RuntimeEnvRecord;
}

export function resolveNitroRuntimeConfig(): RuntimeConfigLike {
	try {
		return useRuntimeConfig() as RuntimeConfigLike;
	} catch {
		return {};
	}
}

export function resolveDatabaseUrlFromSources(
	event: H3Event | Record<string, any>,
	runtimeConfig: RuntimeConfigLike = resolveNitroRuntimeConfig(),
): string | undefined {
	const cloudflareEnv = resolveCloudflareRuntimeEnv(event);
	const processEnv = resolveProcessEnv();

	return (
		cloudflareEnv?.comm_admin_11__DATABASE_URL ||
		cloudflareEnv?.NITRO_DATABASE_URL ||
		cloudflareEnv?.DATABASE_URL ||
		processEnv.comm_admin_11__DATABASE_URL ||
		processEnv.NITRO_DATABASE_URL ||
		processEnv.DATABASE_URL ||
		runtimeConfig.databaseUrl
	);
}

export function resolvePublicRuntimeConfig(raw: RuntimeConfigLike["public"] = {}): PublicRuntimeConfig {
	return {
		serviceName: String(raw.serviceName || "@01s-11comm/api"),
		phase: String(raw.phase || "phase3-infra"),
		corsAllowedOrigins: parseCsv(raw.corsAllowedOrigins),
		enableDetailedErrors: String(raw.enableDetailedErrors || "false") === "true",
		apiBasePath: String(raw.apiBasePath || "/"),
	};
}

export function getPublicRuntimeConfig(): PublicRuntimeConfig {
	return resolvePublicRuntimeConfig(resolveNitroRuntimeConfig().public);
}

export function hasConfiguredDatabaseUrl(event: H3Event): boolean {
	return Boolean(resolveDatabaseUrlFromSources(event));
}

function parseCsv(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value
			.map(String)
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return String(value || "")
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}
```

Expected:

- Cloudflare env 主路径使用 `event.req.runtime?.cloudflare?.env`。
- 不直接读取 `event.context.cloudflare.env`。
- 不创建数据库连接。

- [x] **Step 3: 加固 Nitro config**

Modify `apps/api/nitro.config.ts` to keep Nitro config syntax:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "nitro";

const apiRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	serverDir: "./server",
	ignore: ["modules/**"],
	compatibilityDate: {
		cloudflare: "2024-09-19",
		vercel: "2024-09-19",
	},
	runtimeConfig: {
		databaseUrl:
			process.env.comm_admin_11__DATABASE_URL || process.env.NITRO_DATABASE_URL || process.env.DATABASE_URL || "",
		public: {
			serviceName: "@01s-11comm/api",
			phase: "phase3-infra",
			apiBasePath: "/",
			corsAllowedOrigins: process.env.NITRO_CORS_ALLOWED_ORIGINS || "",
			enableDetailedErrors: process.env.NODE_ENV === "production" ? "false" : "true",
		},
	},
	devServer: {
		port: Number.parseInt(process.env.NITRO_PORT || "3102", 10),
		watch: ["./server/**/*.ts"],
	},
	handlers: [
		{
			route: "/app/**",
			handler: "./server/handlers/legacy-dispatch",
		},
	],
	alias: {
		server: path.resolve(apiRoot, "server"),
	},
	rollupConfig: {
		external: ["cloudflare:workers"],
	},
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
```

Expected:

- File remains Nitro config, not Vite config.
- No `server.proxy`, no Vite plugins, no Vite `build.rollupOptions`.
- `cloudflare:workers` is externalized.

- [x] **Step 4: 让数据库入口复用 env resolver**

Modify `apps/api/server/db/index.ts`:

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { H3Event } from "nitro/h3";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@01s-11comm/type";
import { resolveDatabaseUrlFromSources } from "../shared/runtime/env";

export type DbType = NeonHttpDatabase<typeof schema>;

export function useDb(event: H3Event): DbType {
	const context = ((event as any).context ??= {});

	if (context.db) {
		return context.db as DbType;
	}

	const url = resolveDatabaseUrlFromSources(event);
	if (!url) {
		throw new Error(
			"未设置数据库连接地址 URL。请配置 comm_admin_11__DATABASE_URL、NITRO_DATABASE_URL、DATABASE_URL 或 runtimeConfig.databaseUrl。",
		);
	}

	const db = drizzle(neon(url), { schema }) as DbType;
	context.db = db;
	return db;
}

export function hasDatabaseUrl(event: H3Event): boolean {
	return Boolean(resolveDatabaseUrlFromSources(event));
}
```

Expected:

- `useDb(event)` 是唯一数据库连接入口。
- 无模块顶层数据库连接实例。
- schema 仍只从 `@01s-11comm/type` 导入。

- [x] **Step 5: 跑 runtime env 绿灯验证**

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra/runtime-env.test.ts
pnpm -F @01s-11comm/api typecheck
```

Expected:

- Runtime env tests pass。
- API typecheck pass。

### Task 3: CORS 与响应头策略

**Files:**

- Create: `apps/api/server/shared/runtime/cors.ts`
- Create: `apps/api/server/middleware/cors.ts`
- Create: `apps/api/tests/infra/cors.test.ts`

- [x] **Step 1: 先写 CORS 单元测试**

Create `apps/api/tests/infra/cors.test.ts`:

```ts
import { test, describe } from "vitest";
import { expect } from "vitest";

import { buildCorsHeaders, isOriginAllowed } from "../../server/shared/runtime/cors";

describe("api cors policy", () => {
	test("allows configured origins only when a list is present", () => {
		expect(isOriginAllowed("https://app.example.com", ["https://app.example.com"])).toBe(true);
		expect(isOriginAllowed("https://other.example.com", ["https://app.example.com"])).toBe(false);
	});

	test("does not use wildcard when credentials are enabled", () => {
		const headers = buildCorsHeaders({
			origin: "https://app.example.com",
			allowedOrigins: ["https://app.example.com"],
		});

		expect(headers["Access-Control-Allow-Origin"]).toBe("https://app.example.com");
		expect(headers["Access-Control-Allow-Credentials"]).toBe("true");
		expect(headers["Access-Control-Allow-Origin"]).not.toBe("*");
	});

	test("sets stable allowed methods and headers for preflight", () => {
		const headers = buildCorsHeaders({
			origin: "http://localhost:5173",
			allowedOrigins: ["http://localhost:5173"],
		});

		expect(headers["Access-Control-Allow-Methods"]).toBe("GET,POST,PUT,PATCH,DELETE,OPTIONS");
		expect(headers["Access-Control-Allow-Headers"]).toContain("Content-Type");
		expect(headers["Access-Control-Expose-Headers"]).toContain("X-Request-Id");
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra/cors.test.ts
```

Expected:

- Red: fails because CORS helper does not exist.

- [x] **Step 2: 创建 CORS helper**

Create `apps/api/server/shared/runtime/cors.ts`:

```ts
export interface CorsHeaderInput {
	origin?: string;
	allowedOrigins: string[];
}

export function isOriginAllowed(origin: string | undefined, allowedOrigins: string[]): boolean {
	if (!origin) {
		return false;
	}

	if (allowedOrigins.length === 0) {
		return isLocalhostOrigin(origin);
	}

	return allowedOrigins.includes(origin);
}

export function buildCorsHeaders(input: CorsHeaderInput): Record<string, string> {
	const allowOrigin = isOriginAllowed(input.origin, input.allowedOrigins) ? input.origin : "";

	return {
		...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}),
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type,Accept,X-Requested-With,X-Request-Id",
		"Access-Control-Expose-Headers": "X-Request-Id,X-API-Phase",
		Vary: "Origin",
	};
}

export function buildSecurityHeaders(): Record<string, string> {
	return {
		"X-Content-Type-Options": "nosniff",
		"Referrer-Policy": "no-referrer-when-downgrade",
	};
}

function isLocalhostOrigin(origin: string): boolean {
	return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}
```

Expected:

- 空允许列表只允许本地开发来源。
- credential 场景不使用 `*`。

- [x] **Step 3: 创建 CORS middleware**

Create `apps/api/server/middleware/cors.ts`:

```ts
import { defineHandler, getMethod, getRequestHeader, setResponseHeader, setResponseStatus } from "nitro/h3";
import { buildCorsHeaders, buildSecurityHeaders } from "../shared/runtime/cors";
import { getPublicRuntimeConfig } from "../shared/runtime/env";

export default defineHandler((event) => {
	const origin = getRequestHeader(event, "origin");
	const publicConfig = getPublicRuntimeConfig();
	const headers = {
		...buildCorsHeaders({ origin, allowedOrigins: publicConfig.corsAllowedOrigins }),
		...buildSecurityHeaders(),
		"X-API-Phase": publicConfig.phase,
	};

	for (const [key, value] of Object.entries(headers)) {
		setResponseHeader(event, key, value);
	}

	if (getMethod(event) === "OPTIONS") {
		setResponseStatus(event, 204);
		return "";
	}
});
```

Expected:

- H3 helper 均来自 `nitro/h3`。
- 不添加鉴权 header，不读取 Token。

- [x] **Step 4: 跑 CORS 绿灯验证**

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra/cors.test.ts
pnpm -F @01s-11comm/api typecheck
```

Expected:

- CORS tests pass。
- Typecheck pass。

### Task 4: 结构化日志、request id、错误响应与健康检查增强

**Files:**

- Create: `apps/api/server/shared/runtime/request-context.ts`
- Create: `apps/api/server/middleware/request-context.ts`
- Create: `apps/api/server/shared/runtime/errors.ts`
- Create: `apps/api/server/shared/runtime/observability.ts`
- Modify: `apps/api/server/shared/runtime/response-builder.ts`
- Modify: `apps/api/server/handlers/legacy-dispatch.ts`
- Modify: `apps/api/server/routes/__nitro/health.get.ts`
- Create: `apps/api/server/routes/__nitro/ready.get.ts`
- Create: `apps/api/tests/infra/errors-observability.test.ts`
- Create: `apps/api/tests/infra/health-ready.test.ts`

- [x] **Step 1: 先写错误与观测测试**

Create `apps/api/tests/infra/errors-observability.test.ts`:

```ts
import { test, describe } from "vitest";
import { expect } from "vitest";

import { normalizeApiError } from "../../server/shared/runtime/errors";
import { createRequestLogFields } from "../../server/shared/runtime/observability";

describe("api error and observability helpers", () => {
	test("normalizes unknown errors without leaking stack by default", () => {
		const normalized = normalizeApiError(new Error("db failed"), {
			requestId: "req_001",
			exposeStack: false,
		});

		expect(normalized).toMatchObject({
			statusCode: 500,
			message: "db failed",
			requestId: "req_001",
		});
		expect(normalized.stack).toBeUndefined();
	});

	test("keeps status code from error objects", () => {
		const error = Object.assign(new Error("missing endpoint"), { statusCode: 404 });

		expect(normalizeApiError(error, { requestId: "req_404", exposeStack: false })).toMatchObject({
			statusCode: 404,
			message: "missing endpoint",
			requestId: "req_404",
		});
	});

	test("builds structured log fields", () => {
		expect(
			createRequestLogFields({
				requestId: "req_001",
				method: "GET",
				path: "/__nitro/health",
				statusCode: 200,
				durationMs: 12,
			}),
		).toMatchObject({
			requestId: "req_001",
			method: "GET",
			path: "/__nitro/health",
			statusCode: 200,
			durationMs: 12,
		});
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra/errors-observability.test.ts
```

Expected:

- Red: fails because helpers do not exist.

- [x] **Step 2: 创建 request context**

Create `apps/api/server/shared/runtime/request-context.ts`:

```ts
import type { H3Event } from "nitro/h3";
import { getMethod, getRequestHeader, getRequestURL, setResponseHeader } from "nitro/h3";

export interface ApiRequestContext {
	requestId: string;
	method: string;
	path: string;
	startedAt: number;
}

export function resolveRequestId(event: H3Event): string {
	return (
		getRequestHeader(event, "x-request-id") ||
		getRequestHeader(event, "cf-ray") ||
		`req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
	);
}

export function createApiRequestContext(event: H3Event): ApiRequestContext {
	const context = {
		requestId: resolveRequestId(event),
		method: getMethod(event),
		path: getRequestURL(event).pathname,
		startedAt: Date.now(),
	};

	setResponseHeader(event, "X-Request-Id", context.requestId);
	return context;
}

export function getApiRequestContext(event: H3Event): ApiRequestContext {
	const context = ((event as any).context ??= {});

	if (!context.apiRequestContext) {
		context.apiRequestContext = createApiRequestContext(event);
	}

	return context.apiRequestContext as ApiRequestContext;
}
```

- [x] **Step 3: 创建 request context middleware**

Create `apps/api/server/middleware/request-context.ts`:

```ts
import { defineHandler } from "nitro/h3";
import { getApiRequestContext } from "../shared/runtime/request-context";

export default defineHandler((event) => {
	getApiRequestContext(event);
});
```

Expected:

- 每个请求都有 `X-Request-Id`。
- middleware 不做鉴权。

- [x] **Step 4: 创建错误和日志 helper**

Create `apps/api/server/shared/runtime/errors.ts`:

```ts
export interface NormalizedApiError {
	statusCode: number;
	message: string;
	requestId: string;
	error?: string;
	stack?: string;
}

export interface NormalizeApiErrorOptions {
	requestId: string;
	exposeStack: boolean;
	fallbackMessage?: string;
}

export function normalizeApiError(error: unknown, options: NormalizeApiErrorOptions): NormalizedApiError {
	const statusCode = normalizeStatusCode((error as any)?.statusCode || (error as any)?.status);
	const message = error instanceof Error ? error.message : options.fallbackMessage || "接口调用失败";

	return {
		statusCode,
		message,
		requestId: options.requestId,
		error: error instanceof Error ? error.name : undefined,
		stack: options.exposeStack && error instanceof Error ? error.stack : undefined,
	};
}

function normalizeStatusCode(value: unknown): number {
	const statusCode = Number(value || 500);
	return statusCode >= 400 && statusCode <= 599 ? statusCode : 500;
}
```

Create `apps/api/server/shared/runtime/observability.ts`:

```ts
import consola from "consola";

export interface RequestLogFields {
	requestId: string;
	method: string;
	path: string;
	statusCode: number;
	durationMs: number;
	errorName?: string;
	errorMessage?: string;
}

export function createRequestLogFields(fields: RequestLogFields): RequestLogFields {
	return fields;
}

export function logRequestError(fields: RequestLogFields): void {
	consola.error("[apps/api] request failed", fields);
}

export function logRequestInfo(fields: RequestLogFields): void {
	consola.info("[apps/api] request completed", fields);
}
```

- [x] **Step 5: 更新响应构造器和 legacy dispatch**

Modify `apps/api/server/shared/runtime/response-builder.ts`:

```ts
import type { JsonVO } from "@01s-11comm/type";
import type { NormalizedApiError } from "./errors";

export interface LegacyResponse<T> {
	code: number;
	msg: string;
	data: T;
	requestId?: string;
}

export function legacySuccess<T>(data: T, msg = "操作成功"): LegacyResponse<T> {
	return {
		code: 0,
		msg,
		data,
	};
}

export function legacyFailure(message: string, code = 500, requestId?: string): LegacyResponse<null> {
	return {
		code,
		msg: message,
		data: null,
		requestId,
	};
}

export function adminSuccess<T>(data: T, message = "查询成功"): JsonVO<T> {
	return {
		success: true,
		code: 200,
		message,
		data,
	};
}

export function adminFailure(message: string, error?: unknown, requestId?: string): JsonVO<null> {
	return {
		success: false,
		code: 500,
		message,
		data: null,
		error: error instanceof Error ? error.message : error === undefined ? undefined : String(error),
		requestId,
	} as JsonVO<null>;
}

export function legacyErrorResponse(error: NormalizedApiError): LegacyResponse<null> {
	return legacyFailure(error.message, error.statusCode, error.requestId);
}

export function adminErrorResponse(error: NormalizedApiError): JsonVO<null> {
	return {
		success: false,
		code: error.statusCode,
		message: error.message,
		data: null,
		error: error.error,
		stack: error.stack,
		requestId: error.requestId,
	} as JsonVO<null>;
}
```

Modify `apps/api/server/handlers/legacy-dispatch.ts`:

```ts
import { defineHandler, setResponseStatus } from "nitro/h3";
import { createEndpointRegistry, dispatchEndpoint } from "../shared/runtime/endpoint-registry";
import { normalizeApiError } from "../shared/runtime/errors";
import { getPublicRuntimeConfig } from "../shared/runtime/env";
import { logRequestError } from "../shared/runtime/observability";
import { getApiRequestContext } from "../shared/runtime/request-context";
import { toEndpointDispatchInput } from "../shared/runtime/request-adapter";
import { legacyErrorResponse } from "../shared/runtime/response-builder";
import { runtimeEndpointDefinitions } from "../shared/runtime/runtime-endpoints";

const registry = createEndpointRegistry(runtimeEndpointDefinitions);

export default defineHandler(async (event) => {
	const requestContext = getApiRequestContext(event);

	try {
		return await dispatchEndpoint(registry, await toEndpointDispatchInput(event));
	} catch (error) {
		const publicConfig = getPublicRuntimeConfig();
		const normalized = normalizeApiError(error, {
			requestId: requestContext.requestId,
			exposeStack: publicConfig.enableDetailedErrors,
			fallbackMessage: "接口调用失败",
		});

		setResponseStatus(event, normalized.statusCode);
		logRequestError({
			requestId: requestContext.requestId,
			method: requestContext.method,
			path: requestContext.path,
			statusCode: normalized.statusCode,
			durationMs: Date.now() - requestContext.startedAt,
			errorName: normalized.error,
			errorMessage: normalized.message,
		});

		return legacyErrorResponse(normalized);
	}
});
```

Expected:

- 未命中 endpoint 仍返回 legacy 兼容错误结构。
- 错误响应包含 request id，便于日志关联。
- 不新增鉴权逻辑。

- [x] **Step 6: 增强 health 和 ready**

Modify `apps/api/server/routes/__nitro/health.get.ts`:

```ts
import { defineHandler } from "nitro/h3";
import { hasDatabaseUrl } from "../../db";
import { getPublicRuntimeConfig } from "../../shared/runtime/env";
import { getApiRequestContext } from "../../shared/runtime/request-context";
import { runtimeEndpointManifest } from "../../shared/runtime/runtime-endpoints";

export default defineHandler((event) => {
	const requestContext = getApiRequestContext(event);
	const publicConfig = getPublicRuntimeConfig();

	return {
		success: true,
		service: publicConfig.serviceName,
		status: "ok",
		phase: publicConfig.phase,
		requestId: requestContext.requestId,
		timestamp: new Date().toISOString(),
		uptimeSeconds: Math.floor(process.uptime()),
		database: {
			configured: hasDatabaseUrl(event),
		},
		endpoints: {
			phase2FeePaymentReportCount: runtimeEndpointManifest.length,
		},
	};
});
```

Create `apps/api/server/routes/__nitro/ready.get.ts`:

```ts
import { defineHandler } from "nitro/h3";
import { hasDatabaseUrl } from "../../db";
import { getPublicRuntimeConfig } from "../../shared/runtime/env";
import { getApiRequestContext } from "../../shared/runtime/request-context";

export default defineHandler((event) => {
	const requestContext = getApiRequestContext(event);
	const publicConfig = getPublicRuntimeConfig();
	const databaseConfigured = hasDatabaseUrl(event);

	return {
		success: true,
		service: publicConfig.serviceName,
		status: databaseConfigured ? "ready" : "ready-without-database-url",
		phase: publicConfig.phase,
		requestId: requestContext.requestId,
		database: {
			configured: databaseConfigured,
			connectionChecked: false,
			reason: databaseConfigured
				? "database url configured"
				: "database url absent; Phase2 in-memory fallback remains available",
		},
	};
});
```

Expected:

- `health` 不访问数据库。
- `ready` 默认不执行 DB 查询，避免没有真实 Neon 配置时阻断 Phase3。
- 数据库真实连通性作为部署环境验收项，不替代 `useDb(event)` 约束。

- [x] **Step 7: 写 health/ready 测试并跑绿灯**

Create `apps/api/tests/infra/health-ready.test.ts`:

```ts
import { test, describe } from "vitest";
import { expect } from "vitest";

import healthHandler from "../../server/routes/__nitro/health.get";
import readyHandler from "../../server/routes/__nitro/ready.get";

describe("api health and ready endpoints", () => {
	test("health returns phase3 metadata without database query", async () => {
		const response = await healthHandler({ context: {} } as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			status: "ok",
			phase: "phase3-infra",
			database: {
				configured: expect.any(Boolean),
			},
		});
	});

	test("ready reports fallback state when database url is absent", async () => {
		const response = await readyHandler({ context: {} } as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			database: {
				connectionChecked: false,
			},
		});
		expect(response.status).toMatch(/^ready/);
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra/errors-observability.test.ts tests/infra/health-ready.test.ts
pnpm -F @01s-11comm/api typecheck
```

Expected:

- Tests pass。
- Typecheck pass。

### Task 5: API base URL、代理与回退策略，不做全量切流

**Files:**

- Modify: `apps/app/src/http/runtime-base.ts`
- Modify: `apps/app/src/http/alova.ts`
- Modify: `apps/app/src/env.d.ts`
- Modify: `apps/app/env/.env.development-nitro-api`
- Modify: `apps/app/env/.env.production-nitro-api`
- Modify: `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`
- Create: `apps/admin/src/utils/http/api-base-url.ts`
- Modify: `apps/admin/src/utils/http/index.ts`
- Modify: `apps/admin/types/env.shim.d.ts`
- Modify: `apps/admin/vite.config.ts`
- Create: `apps/admin/src/utils/http/tests/api-base-url.test.ts`

- [x] **Step 1: 固定 app 端 Phase2 白名单测试**

Modify `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts` and add:

```ts
import { test, describe } from "vitest";
import { expect } from "vitest";
import { isPhase2ApiShadowEndpoint, resolveHttpBaseUrlForPath } from "@/http/runtime-base";

describe("phase3 app api shadow base url", () => {
	test("only enables shadow api base for Phase2 fee/payment/report endpoints", () => {
		expect(isPhase2ApiShadowEndpoint("/app/fee.listFee")).toBe(true);
		expect(isPhase2ApiShadowEndpoint("/app/payment.nativeQrcodePayment")).toBe(true);
		expect(isPhase2ApiShadowEndpoint("/app/reportFeeMonthStatistics.queryReportFeeSummary")).toBe(true);
		expect(isPhase2ApiShadowEndpoint("/app/ownerRepair.listOwnerRepairs")).toBe(false);
		expect(isPhase2ApiShadowEndpoint("/app/resourceStore.listResourceStores")).toBe(false);
		expect(isPhase2ApiShadowEndpoint("/app/owner.queryOwnerCars")).toBe(false);
	});

	test("uses shadow api base only when the switch is enabled", () => {
		expect(
			resolveHttpBaseUrlForPath("/app/fee.listFee", {
				VITE_API_RUNTIME: "nitro-standalone",
				VITE_SERVER_BASEURL: "http://legacy.example.com",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
				VITE_11COMM_API_SHADOW_ENABLE: "true",
			}),
		).toBe("http://127.0.0.1:3102");

		expect(
			resolveHttpBaseUrlForPath("/app/ownerRepair.listOwnerRepairs", {
				VITE_API_RUNTIME: "nitro-standalone",
				VITE_SERVER_BASEURL: "http://legacy.example.com",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
				VITE_11COMM_API_SHADOW_ENABLE: "true",
			}),
		).toBe("http://legacy.example.com");
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

Expected:

- Red until runtime-base helper is implemented.

- [x] **Step 2: app runtime-base 只切 Phase2 白名单**

Modify `apps/app/src/http/runtime-base.ts`:

```ts
import { resolve11CommNitroServerBaseUrl } from "@/config/project-domains";

export type ApiRuntime = "mock" | "nitro-vite" | "nitro-standalone";

export interface RuntimeBaseEnv {
	VITE_API_RUNTIME?: string;
	VITE_APP_PROXY_ENABLE?: boolean | string;
	VITE_APP_PROXY_PREFIX?: string;
	VITE_SERVER_BASEURL?: string;
	VITE_UPLOAD_BASEURL?: string;
	VITE_11COMM_API_BASE_URL?: string;
	VITE_11COMM_API_SHADOW_ENABLE?: boolean | string;
}

export const PHASE2_API_SHADOW_ENDPOINTS = [
	"/app/fee.listFee",
	"/app/fee.queryFeeDetail",
	"/app/feeApi/listOweFees",
	"/app/payment.nativeQrcodePayment",
	"/app/oweFeeCallable.listOweFeeCallable",
	"/app/oweFeeCallable.writeOweFeeCallable",
	"/app/fee.saveRoomCreateFee",
	"/app/feeConfig.listFeeConfigs",
	"/app/reportFeeMonthStatistics.queryReportFeeSummary",
	"/app/reportFeeMonthStatistics/queryPayFeeDetail",
	"/app/reportFeeMonthStatistics.queryReportFeeDetailRoom",
	"/app/dataReport.queryFeeDataReport",
] as const;

export function resolveApiRuntime(env: RuntimeBaseEnv): ApiRuntime {
	const runtime = env.VITE_API_RUNTIME;

	if (runtime === "nitro-vite" || runtime === "nitro-standalone") {
		return runtime;
	}

	return "mock";
}

export function isMockProxyEnabled(env: RuntimeBaseEnv): boolean {
	return String(env.VITE_APP_PROXY_ENABLE) === "true";
}

export function isPhase2ApiShadowEndpoint(url: string): boolean {
	const path = normalizeRequestPath(url);
	return PHASE2_API_SHADOW_ENDPOINTS.some((endpoint) => endpoint === path);
}

export function isApiShadowEnabled(env: RuntimeBaseEnv): boolean {
	return String(env.VITE_11COMM_API_SHADOW_ENABLE) === "true";
}

export function resolveHttpBaseUrl(env: RuntimeBaseEnv): string {
	const runtime = resolveApiRuntime(env);

	if (runtime === "nitro-vite") {
		return "";
	}

	if (runtime === "nitro-standalone") {
		return env.VITE_SERVER_BASEURL || resolve11CommNitroServerBaseUrl();
	}

	if (isMockProxyEnabled(env)) {
		return env.VITE_APP_PROXY_PREFIX || "";
	}

	return env.VITE_SERVER_BASEURL || "";
}

export function resolveHttpBaseUrlForPath(url: string, env: RuntimeBaseEnv): string {
	if (isApiShadowEnabled(env) && isPhase2ApiShadowEndpoint(url)) {
		return env.VITE_11COMM_API_BASE_URL || resolve11CommNitroServerBaseUrl();
	}

	return resolveHttpBaseUrl(env);
}

export function prependRuntimeBaseUrl(url: string, env: RuntimeBaseEnv): string {
	if (/^https?:\/\//.test(url)) {
		return url;
	}

	const baseUrl = resolveHttpBaseUrlForPath(url, env);

	if (!baseUrl) {
		return url;
	}

	if (url === baseUrl || url.startsWith(`${baseUrl}/`)) {
		return url;
	}

	if (!url.startsWith("/")) {
		return `${baseUrl}/${url}`;
	}

	return `${baseUrl}${url}`;
}

export function resolveUploadBaseUrl(env: RuntimeBaseEnv): string {
	const runtime = resolveApiRuntime(env);

	if (runtime === "nitro-vite") {
		return "/upload";
	}

	return env.VITE_UPLOAD_BASEURL || prependRuntimeBaseUrl("/upload", env);
}

function normalizeRequestPath(url: string): string {
	try {
		return new URL(url, "http://local").pathname;
	} catch {
		return url.split("?")[0] || url;
	}
}
```

Expected:

- 只允许 Phase2 fee/payment/report 白名单走 `VITE_11COMM_API_BASE_URL`。
- repair/resource/parking 继续走原运行时。

- [x] **Step 3: app Alova 按请求路径设置 shadow base**

In `apps/app/src/http/alova.ts`, make these exact replacements:

1. Replace the existing runtime-base import:

```ts
import { resolveHttpBaseUrl } from "@/http/runtime-base";
```

with:

```ts
import { resolveHttpBaseUrl, resolveHttpBaseUrlForPath } from "@/http/runtime-base";
```

2. Replace only the existing `beforeRequest: onAuthRequired((method) => { ... }),` callback with this complete callback body. Keep the existing `responded: onResponseRefreshToken(...)` block unchanged.

```ts
beforeRequest: onAuthRequired((method) => {
	method.baseURL = resolveHttpBaseUrlForPath(method.url, import.meta.env);
	method.config.headers = {
		ContentType: ContentTypeEnum.JSON,
		Accept: "application/json, text/plain, */*",
		...method.config.headers,
	};

	const { config } = method;
	const ignoreAuth = !config.meta?.ignoreAuth;
	console.log("ignoreAuth===>", ignoreAuth);
	if (ignoreAuth) {
		const token = "getToken()";
		if (!token) {
			throw new Error("[请求错误]：未登录");
		}
	}

	if (config.meta?.domain) {
		method.baseURL = config.meta.domain;
		console.log("当前域名", method.baseURL);
	}
}),
```

Expected:

- `responded: onResponseRefreshToken(...)` 保持原文件现有完整逻辑，不在 Phase3 重写业务响应适配。
- 不移除 app 现有 mock/runtime 能力。
- 不新增登录或鉴权。

- [x] **Step 4: app 环境类型与示例值**

Modify `apps/app/src/env.d.ts`:

```ts
interface ImportMetaEnv {
	readonly VITE_11COMM_API_BASE_URL: string;
	readonly VITE_11COMM_API_SHADOW_ENABLE: "true" | "false";
}
```

Modify `apps/app/env/.env.development-nitro-api`:

```dotenv
VITE_API_RUNTIME = 'nitro-standalone'
VITE_SERVER_BASEURL = 'http://127.0.0.1:3101'
VITE_UPLOAD_BASEURL = 'http://127.0.0.1:3101/upload'
VITE_11COMM_API_BASE_URL = 'http://127.0.0.1:3102'
VITE_11COMM_API_SHADOW_ENABLE = 'false'
```

Modify `apps/app/env/.env.production-nitro-api`:

```dotenv
VITE_SERVER_BASEURL = ''
VITE_UPLOAD_BASEURL = ''
VITE_API_SECONDARY_URL = ''
VITE_API_RUNTIME = 'nitro-standalone'
VITE_11COMM_API_BASE_URL = ''
VITE_11COMM_API_SHADOW_ENABLE = 'false'
```

Expected:

- 默认不切流。
- 开关显式打开后，只影响 Phase2 白名单 endpoint。

- [x] **Step 5: admin base URL helper 测试**

Create `apps/admin/src/utils/http/tests/api-base-url.test.ts`:

```ts
import { test, describe } from "vitest";
import { expect } from "vitest";

import { resolveAdminApiBaseUrl, resolveAdminShadowApiBaseUrl } from "../api-base-url";

describe("admin api base url strategy", () => {
	test("keeps existing base url when shadow api is disabled", () => {
		expect(
			resolveAdminApiBaseUrl({
				VITE_IS_REVERSE_PROXY: "false",
				VITE_PROXY_PREFIX: "/dev-api",
				VITE_BASE_URL: "https://mock.example.com",
				VITE_11COMM_API_SHADOW_ENABLE: "false",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			}),
		).toBe("https://mock.example.com");
	});

	test("resolves shadow api base without changing default base url", () => {
		expect(
			resolveAdminShadowApiBaseUrl({
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_USE_PROXY: "true",
			}),
		).toBe("/api-shadow");
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts
```

Expected:

- Red until helper exists.

- [x] **Step 6: admin helper 与代理配置**

Create `apps/admin/src/utils/http/api-base-url.ts`:

```ts
export interface AdminApiBaseEnv {
	VITE_IS_REVERSE_PROXY?: string;
	VITE_PROXY_PREFIX?: string;
	VITE_BASE_URL?: string;
	VITE_11COMM_API_BASE_URL?: string;
	VITE_11COMM_API_PROXY_PREFIX?: string;
	VITE_11COMM_API_USE_PROXY?: string;
	VITE_11COMM_API_SHADOW_ENABLE?: string;
}

export function resolveAdminApiBaseUrl(env: AdminApiBaseEnv): string {
	if (env.VITE_IS_REVERSE_PROXY === "true") {
		return env.VITE_PROXY_PREFIX || "";
	}

	return env.VITE_BASE_URL || "";
}

export function resolveAdminShadowApiBaseUrl(env: AdminApiBaseEnv): string {
	if (env.VITE_11COMM_API_USE_PROXY === "true") {
		return env.VITE_11COMM_API_PROXY_PREFIX || "/api-shadow";
	}

	return env.VITE_11COMM_API_BASE_URL || "";
}

export function isAdminApiShadowEnabled(env: AdminApiBaseEnv): boolean {
	return env.VITE_11COMM_API_SHADOW_ENABLE === "true";
}
```

Modify `apps/admin/types/env.shim.d.ts`:

```ts
interface ImportMetaEnv {
	VITE_11COMM_API_BASE_URL?: string;
	VITE_11COMM_API_PROXY_PREFIX?: string;
	VITE_11COMM_API_USE_PROXY?: `${boolean}`;
	VITE_11COMM_API_SHADOW_ENABLE?: `${boolean}`;
}
```

Modify `apps/admin/vite.config.ts` with these exact placements:

1. Inside `export default ({ mode }: ConfigEnv): UserConfigExport => {`, immediately after the existing lines that define `VITE_PROXY_PREFIX`、`VITE_BASE_URL` and `VITE_IS_REVERSE_PROXY`, insert:

```ts
const VITE_11COMM_API_BASE_URL = env.VITE_11COMM_API_BASE_URL;
const VITE_11COMM_API_PROXY_PREFIX = env.VITE_11COMM_API_PROXY_PREFIX || "/api-shadow";
const VITE_11COMM_API_USE_PROXY = env.VITE_11COMM_API_USE_PROXY;
```

2. Replace the current `server.proxy` object in the returned Vite config with this complete object:

```ts
proxy: {
	...(IS_REVERSE_PROXY()
		? {
				[VITE_PROXY_PREFIX]: {
					changeOrigin: true,
					target: VITE_BASE_URL,
					secure: false,
					rewrite: (path) => path.replace(new RegExp("^" + VITE_PROXY_PREFIX), ""),
				},
			}
		: {}),
	...(VITE_11COMM_API_USE_PROXY === "true" && VITE_11COMM_API_BASE_URL
		? {
				[VITE_11COMM_API_PROXY_PREFIX]: {
					changeOrigin: true,
					target: VITE_11COMM_API_BASE_URL,
					secure: false,
					rewrite: (path) => path.replace(new RegExp("^" + VITE_11COMM_API_PROXY_PREFIX), ""),
				},
			}
		: {}),
},
```

The resulting `server` block keeps the existing `open`、`port`、`host` and `warmup` fields:

```ts
server: {
	open: true,
	port: VITE_PORT,
	host: "0.0.0.0",

	proxy: {
		...(IS_REVERSE_PROXY()
			? {
					[VITE_PROXY_PREFIX]: {
						changeOrigin: true,
						target: VITE_BASE_URL,
						secure: false,
						rewrite: (path) => path.replace(new RegExp("^" + VITE_PROXY_PREFIX), ""),
					},
				}
			: {}),
		...(VITE_11COMM_API_USE_PROXY === "true" && VITE_11COMM_API_BASE_URL
			? {
					[VITE_11COMM_API_PROXY_PREFIX]: {
						changeOrigin: true,
						target: VITE_11COMM_API_BASE_URL,
						secure: false,
						rewrite: (path) => path.replace(new RegExp("^" + VITE_11COMM_API_PROXY_PREFIX), ""),
					},
				}
			: {}),
	},

	warmup: {
		clientFiles: ["./src/{views,pages,components}/*"],
	},
},
```

Expected:

- 默认 admin 请求仍使用原 `VITE_BASE_URL` / `VITE_PROXY_PREFIX` 策略。
- `/api-shadow` 只为人工或局部接口验证提供代理入口。

- [x] **Step 7: 跑接入策略验证**

Run:

```powershell
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts
pnpm -F @01s-11comm/app run type-check
pnpm -F @01s-11comm/admin typecheck
```

Expected:

- app runtime tests pass。
- admin base URL tests pass。
- app/admin typecheck pass。
- 没有 app/admin 全量切流。

### Task 6: Endpoint registry 固化与 Phase2 样板审计

**Files:**

- Modify: `apps/api/server/shared/runtime/runtime-endpoints.ts`
- Create: `apps/api/server/routes/__nitro/endpoints.get.ts`
- Create: `apps/api/tests/infra/endpoint-manifest.test.ts`

- [x] **Step 1: 写 endpoint manifest 测试**

Create `apps/api/tests/infra/endpoint-manifest.test.ts`:

```ts
import { test, describe } from "vitest";
import { expect } from "vitest";

import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

describe("phase3 endpoint manifest", () => {
	test("only contains Phase2 fee payment report endpoints", () => {
		const urls = runtimeEndpointManifest.map((item) => item.url);

		expect(urls).toContain("/app/fee.listFee");
		expect(urls).toContain("/app/payment.nativeQrcodePayment");
		expect(urls).toContain("/app/reportFeeMonthStatistics.queryReportFeeSummary");
		expect(urls).not.toContain("/app/ownerRepair.listOwnerRepairs");
		expect(urls).not.toContain("/app/resourceStore.listResourceStores");
		expect(urls).not.toContain("/app/owner.queryOwnerCars");
		expect(urls).not.toContain("/app/machine/listMachineRecords");
	});
});
```

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra/endpoint-manifest.test.ts
```

Expected:

- Red until manifest is exported.

- [x] **Step 2: 导出可审计 manifest**

Modify `apps/api/server/shared/runtime/runtime-endpoints.ts`:

```ts
import { feeLegacyEndpointDefinitions } from "../../modules/fee/legacy-endpoints";

export const runtimeEndpointDefinitions = [...feeLegacyEndpointDefinitions];

export const runtimeEndpointManifest = runtimeEndpointDefinitions.map((definition) => ({
	url: definition.url,
	method: definition.method,
	phase: "phase2-fee-payment-report",
	ownerModule: "fee",
}));
```

Expected:

- manifest 只来自 Phase2 `feeLegacyEndpointDefinitions`。
- 不注册 repair/resource/parking。

- [x] **Step 3: 暴露只读 endpoints 路由**

Create `apps/api/server/routes/__nitro/endpoints.get.ts`:

```ts
import { defineHandler } from "nitro/h3";
import { getPublicRuntimeConfig } from "../../shared/runtime/env";
import { getApiRequestContext } from "../../shared/runtime/request-context";
import { runtimeEndpointManifest } from "../../shared/runtime/runtime-endpoints";

export default defineHandler((event) => {
	const requestContext = getApiRequestContext(event);
	const publicConfig = getPublicRuntimeConfig();

	return {
		success: true,
		service: publicConfig.serviceName,
		phase: publicConfig.phase,
		requestId: requestContext.requestId,
		data: runtimeEndpointManifest,
	};
});
```

Expected:

- 只读元数据路由。
- 不泄露数据库配置值。

- [x] **Step 4: 跑 endpoint 固化验证**

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra/endpoint-manifest.test.ts
pnpm -F @01s-11comm/api test -- tests/runtime/endpoint-registry.test.ts
```

Expected:

- Manifest test pass。
- 原 Phase2 registry test 仍 pass。

### Task 7: CI/workflow 与部署 preset 加固

**Files:**

- Modify: `apps/api/package.json`
- Modify: `.github/workflows/ci.yaml`
- Modify: `.github/workflows/app-ci.yml`
- Modify: `.github/workflows/vercel-deploy-tool.yaml`
- Modify: `.github/workflows/release.yaml`

- [x] **Step 1: 增加 API preset 构建脚本**

Modify `apps/api/package.json` scripts:

```json
{
	"scripts": {
		"dev": "nitro dev",
		"build": "nitro build",
		"build:node": "nitro build --preset node-server",
		"build:vercel": "nitro build --preset vercel",
		"build:cloudflare": "nitro build --preset cloudflare-module",
		"preview": "nitro preview",
		"typecheck": "tsc --noEmit",
		"test": "vitest run",
		"test:infra": "vitest run tests/infra tests/smoke tests/runtime",
		"verify:phase3": "pnpm run test:infra && pnpm run typecheck && pnpm run build:node && pnpm run build:vercel && pnpm run build:cloudflare"
	}
}
```

Expected:

- 不新增依赖。
- 不使用全局工具。
- 当前计划固定使用 `nitro build --preset node-server`、`nitro build --preset vercel` 和 `nitro build --preset cloudflare-module`；`pnpm -F @01s-11comm/api run verify:phase3` 必须一次性通过三类 preset 构建。

- [x] **Step 2: 加固全量 CI**

Modify `.github/workflows/ci.yaml` by adding API Phase3 verification after `pnpm run ci`:

```yaml
- name: 验证 API Phase3 基础设施
  run: pnpm -F @01s-11comm/api run verify:phase3

- name: 扫描禁止的 API 模式
  run: |
    ! rg -n "from ['\"]h3['\"]" apps/api
    ! rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 校验|token 校验" apps/api/server apps/api/tests
    ! rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
```

Expected:

- Workflow 继续使用 Node 22.14.0 后再 `pnpm install --frozen-lockfile`。
- 继续使用 `pnpm exec turbo` 或 `pnpm run ci`，不使用全局 `turbo`。
- 保留 `actions/checkout@v6`、`pnpm/action-setup@v5`、`actions/setup-node@v6`，不降级 major versions。

- [x] **Step 3: 保持 App 专项 CI，增加 shadow 策略测试**

Modify `.github/workflows/app-ci.yml`:

```yaml
- name: 验证 App API runtime 策略
  run: pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
```

Expected:

- App 专项 CI 继续包含 H5 production build、type-check、Vitest、Nitro Vercel build。
- 新增步骤只验证 runtime base URL 策略，不要求 app 全量切到 `apps/api`。

- [x] **Step 4: 修复 Vercel deploy workflow 的全局安装模式**

Modify `.github/workflows/vercel-deploy-tool.yaml`:

```yaml
- name: 安装 pnpm 包管理器
  uses: pnpm/action-setup@v5

- name: 安装 Node.js 运行时
  uses: actions/setup-node@v6
  with:
    node-version: 22.14.0
    cache: pnpm

- name: 安装工作区依赖
  run: pnpm install --frozen-lockfile

- name: 检查本地工具版本
  run: |
    node -v
    pnpm -v
    pnpm exec vercel --version
    pnpm exec turbo info

- name: 登录 Turbo 远程缓存
  run: pnpm exec turbo login --token=${{ env.TURBO_TOKEN }} --team=${{ env.TURBO_TEAM }}

- name: 关联 Turbo 远程缓存项目
  run: pnpm exec turbo link --token=${{ env.TURBO_TOKEN }} --scope=${{ env.TURBO_TEAM }} --yes
```

Expected:

- 移除 `run_install`。
- 移除 `--global`。
- 移除 `pnpm ls -g`。
- 移除直接 `turbo` 命令，统一使用 `pnpm exec turbo`。

- [x] **Step 5: 修复 release workflow 的语义命名与全局安装模式**

Modify `.github/workflows/release.yaml` in three exact ranges: the top-level workflow name, the beginning of `jobs.release`, and the installation/Node setup steps.

Replace the top-level workflow name line with:

```yaml
name: 发布 Release
```

Replace the beginning of the `jobs.release` block with this structure, preserving the existing `runs-on` and later steps under the same job:

```yaml
jobs:
  release:
    name: 创建 GitHub Release
    runs-on: ubuntu-latest
```

Replace the current `安装pnpm`、`安装node` and `corepack手动再安装一次pnpm` steps with:

```yaml
- name: 安装 pnpm 包管理器
  uses: pnpm/action-setup@v5

- name: 安装 Node.js 运行时
  uses: actions/setup-node@v6
  with:
    node-version: 22.14.0
    cache: pnpm
    registry-url: "https://registry.npmjs.org"

- name: 安装工作区依赖
  run: pnpm install --frozen-lockfile

- name: 检查本地工具版本
  run: |
    node -v
    pnpm -v
    pnpm exec gh --version || gh --version
```

Expected:

- Top-level workflow name is `发布 Release`。
- `jobs.release.name` is `创建 GitHub Release`。
- Release workflow 保留 `actions/checkout@v6`、`pnpm/action-setup@v5`、`actions/setup-node@v6`。
- Node 固定为 `22.14.0`，不使用 `lts/*`。
- 移除 `run_install` 与 `--global`。
- 不再运行 `corepack enable && corepack install` 覆盖当前 workspace 的 pnpm 设置。
- 使用 `pnpm install --frozen-lockfile` 安装依赖。
- Release 创建步骤继续使用 GitHub runner 自带 `gh`；如需要验证版本，先尝试 `pnpm exec gh --version`，再降级为 `gh --version`，不得全局安装 `gh`。

- [x] **Step 6: 跑 CI 配置扫描**

Run:

```powershell
rg -n "run_install|--global|pnpm ls -g|turbo --version|run: turbo" .github/workflows
pnpm -F @01s-11comm/api run verify:phase3
pnpm run ci
```

Expected:

- `rg` 对全量 `.github/workflows` 无输出，不能被 `.github/workflows/release.yaml` 卡住。
- API Phase3 verification pass。
- Full Turbo CI pass。

### Task 8: 测试分层、部署验收与最终门禁

**Files:**

- Verify: `apps/api/tests/infra/**`
- Verify: `apps/api/tests/smoke/**`
- Verify: `apps/api/tests/runtime/**`
- Verify: `apps/api/tests/legacy/**`
- Verify: `apps/api/tests/admin/**`
- Verify: `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`
- Verify: `apps/admin/src/utils/http/tests/api-base-url.test.ts`
- Verify: `.github/workflows/**`
- Verify: `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase3.md`

- [x] **Step 1: 执行分层测试命令**

Run:

```powershell
pnpm -F @01s-11comm/api test -- tests/infra
pnpm -F @01s-11comm/api test -- tests/smoke tests/runtime
pnpm -F @01s-11comm/api test -- tests/legacy tests/admin tests/modules
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts
```

Expected:

- API infra tests pass。
- Phase2 smoke/runtime/legacy/admin/modules tests pass。
- app/admin base URL strategy tests pass。

- [x] **Step 2: 执行类型、构建与 preset 验收**

Run:

```powershell
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build
pnpm -F @01s-11comm/api run build:node
pnpm -F @01s-11comm/api run build:vercel
pnpm -F @01s-11comm/api run build:cloudflare
pnpm -F @01s-11comm/type typecheck
pnpm -F @01s-11comm/app run type-check
pnpm -F @01s-11comm/admin typecheck
```

Expected:

- API default build pass。
- Node/Vercel/Cloudflare preset build pass。
- type/app/admin typecheck pass。

- [x] **Step 3: 执行禁止模式扫描**

Run:

```powershell
rg -n "from ['\"]h3['\"]" apps/api
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 校验|token 校验|Bearer token|Authorization 校验" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
rg -n "server\\.proxy|plugins:|build:\\s*\\{|rollupOptions" apps/api/nitro.config.ts
rg -n "repair|resource|parking|ChargeMachine|listMachineRecords|openDoor|OpenDoor" apps/api/server
```

Expected:

- 前四条无输出。
- 第五条不在 runtime 注册、handler、service、repository 中出现。

- [x] **Step 4: 执行旧服务与旧源目录保留验证**

Run:

```powershell
Test-Path apps/admin/server
Test-Path apps/app/server
$oldSource = "D:\code\ruan-cat\01s-11comm-app"
Test-Path $oldSource
git -C $oldSource rev-parse --is-inside-work-tree
$oldSourceItems = Get-ChildItem -LiteralPath $oldSource -Force
$oldSourceItems.Count -gt 0
```

Expected:

- 三个 `Test-Path` 均为 `True`。
- 旧源目录仍为 git repo。
- 旧源目录非空。

- [x] **Step 5: 执行全量 CI 与 workflow 扫描**

Run:

```powershell
pnpm install --frozen-lockfile
pnpm run ci
pnpm -F @01s-11comm/app run build:h5:prod
pnpm -F @01s-11comm/app run type-check
pnpm -F @01s-11comm/app exec vitest run
pnpm -F @01s-11comm/app run build:nitro:vercel
rg -n "run_install|--global|pnpm ls -g|turbo --version|run: turbo" .github/workflows
git diff --check
```

Expected:

- Frozen lockfile install pass。
- Full CI pass。
- App 专项四步 pass。
- Workflow 禁止模式无输出。
- `git diff --check` 无输出。

- [x] **Step 6: 记录 Phase4/Phase5 输入清单**

在执行总结中记录以下后续输入，不把它们纳入 Phase3 验收范围：

```text
Phase4 输入：
- repair 模块 app legacy endpoints 与 admin 业务路径映射。
- resource 模块 app legacy endpoints 与 admin 业务路径映射。
- parking 模块 app legacy endpoints 与 admin 业务路径映射。
- charge-machine/open-door/machine-record 是否需要后台业务路径补齐。
- /callComponent/** 兼容路径是否拆成独立字典/组件调用迁移。

Phase5 输入：
- app/admin 全量 API base URL 切流策略。
- apps/admin/server 与 apps/app/server 的长期收口策略。
- 大批量业务域迁移后的端到端灰度与回退。
```

Expected:

- Phase4/Phase5 输入清单只作为下一阶段入口。
- Phase3 不实现这些业务迁移。

- [x] **Step 7: 最终门禁判定**

Phase3 pass 条件：

```text
1. apps/api infra tests、Phase2 legacy/admin tests、typecheck 和多 preset build 全部通过。
2. CORS、request id、统一错误响应、结构化日志字段、health/ready/endpoints 路由可验证。
3. runtime env resolver 使用 event.req.runtime?.cloudflare?.env 作为 Cloudflare Worker 主路径。
4. 数据库连接仍只通过 useDb(event)。
5. app/admin 仅具备白名单 shadow 接入和代理/回退策略，未全量切流。
6. Phase2 endpoint registry 只包含 fee/payment/report 白名单。
7. CI/workflow 不含 run_install、--global、pnpm ls -g、turbo --version、直接 run: turbo。
8. 未引入 Neon Auth、JWT、Token 或任何接口鉴权。
9. 未删除 apps/admin/server、apps/app/server 或旧源目录。
10. 未迁移 repair/resource/parking 等 Phase4/Phase5 业务域。
```

任一条件失败时：

```text
Phase3 判定为 fail。
执行代理必须先修复失败项并重新运行对应分层命令。
不得通过扩大业务迁移范围、删除旧服务、跳过 CI 或降低 action major version 来规避失败。
```

## Verification Command Summary

```powershell
pnpm -F @01s-11comm/api test -- tests/infra
pnpm -F @01s-11comm/api test -- tests/smoke tests/runtime
pnpm -F @01s-11comm/api test -- tests/legacy tests/admin tests/modules
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api run verify:phase3
pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts
pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts
pnpm -F @01s-11comm/type typecheck
pnpm -F @01s-11comm/app run type-check
pnpm -F @01s-11comm/admin typecheck
pnpm install --frozen-lockfile
pnpm run ci
pnpm -F @01s-11comm/app run build:h5:prod
pnpm -F @01s-11comm/app exec vitest run
pnpm -F @01s-11comm/app run build:nitro:vercel
rg -n "from ['\"]h3['\"]" apps/api
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 校验|token 校验" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
rg -n "run_install|--global|pnpm ls -g|turbo --version|run: turbo" .github/workflows
git diff --check
```

## Execution Notes

- 本计划执行时不自动提交 git；提交必须由用户另行授权。
- 所有代码修改都应保持最小范围，不重排无关文件。
- Nitro preset 构建固定使用 `pnpm -F @01s-11comm/api run build:node`、`pnpm -F @01s-11comm/api run build:vercel` 和 `pnpm -F @01s-11comm/api run build:cloudflare`；三条命令都必须通过后才允许进入 Phase3 pass 判定。
- 如果真实平台缺少 Vercel/Cloudflare secrets，执行总结必须把它标记为平台配置风险；不能伪装成本地代码验证失败，也不能用鉴权方案替代环境变量治理。
