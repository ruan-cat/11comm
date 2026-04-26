<!-- 已完成 -->

# 2026-04-25 11comm App Monorepo API Migration Phase2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking; completed Phase2 steps are marked with `- [x]`.

**Goal:** 创建最小可运行的 `apps/api` Nitro 影子服务，并完成 fee/payment/report 首批 app legacy 兼容路径与 admin canonical 路径的纵切样板。

**Architecture:** Phase2 只建立一个独立 `apps/api` 服务，不改 app/admin 的生产接入方式。`apps/api` 通过共享 endpoint registry、request adapter、response helper 和 fee service/repository 同时支撑 app legacy DTO 与 admin canonical DTO；fee/payment/report 归入同一个 fee 模块，避免双端维护两套数据源。纯基础设施壳层加固、CI、部署、完整 runtimeConfig、CORS、日志监控和接入策略留到 Phase3；repair/resource/parking 与 charge-machine/open-door 等扩张波次留到 Phase4 或更晚。

**Tech Stack:** pnpm workspace, Nitro v3, H3 from `nitro/h3`, TypeScript, Vitest Node environment, Drizzle ORM, Neon serverless, `@01s-11comm/type`

---

## Phase2 Boundaries

Phase2 的完成状态必须是：

- `apps/api` 存在，并能通过 package scripts 独立启动、测试、类型检查和构建。
- `apps/api` 包含基础入口、健康检查、数据库访问入口、日期格式化工具、共享 runtime helpers、fee module 和测试。
- app legacy fee/payment/report 路径在 `apps/api` 中可被兼容 dispatch。
- admin canonical fee/report 样板路径在 `apps/api` 中可被单独调用。
- app legacy adapter 与 admin canonical adapter 共享同一个 fee service/repository。
- 无数据库 URL 时，admin canonical route handler 也能通过同一个 in-memory fee runtime 独立调用。
- 所有新增 H3 import 都来自 `nitro/h3`。
- 所有 schema、table、`JsonVO`、`PageDTO` 都来自 `@01s-11comm/type`，不在 `apps/api` 内私建 schema。
- Phase2 不保留未使用的直接 `zod` 依赖；统一请求校验和 `zod` 直连依赖归入 Phase3 validation runtime。

### Phase2 Completion Record

当前工作树中的 Phase2 已按本计划完成并通过验收。下文保留 TDD 红灯/绿灯步骤作为实施记录和复现说明；所有已完成步骤均标记为 `- [x]`。

已验证命令：

```powershell
pnpm -F @01s-11comm/api test
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build
pnpm -F @01s-11comm/type typecheck
pnpm install --lockfile-only --frozen-lockfile
pnpm -r list --depth -1
```

验收结果：

- `@01s-11comm/api` 测试通过，5 个测试文件、17 个用例通过。
- `@01s-11comm/api` 类型检查和 Nitro build 通过。
- `@01s-11comm/type` 类型检查通过。
- workspace 识别 `@01s-11comm/api`。
- `pnpm-lock.yaml` 只新增 `apps/api` importer，不保留整文件格式化 churn。
- `apps/api` 没有直接 `zod` 依赖；Nitro build 产物中出现的 `zod+drizzle-zod` chunk 来自 `@01s-11comm/type`/`drizzle-zod` 传递依赖，不代表 Phase2 直接依赖 `zod`。

### 2026-04-26 GitHub workflow 失败修复记录

GitHub Actions 已补充为 Phase2 -> Phase3 交接验收输入。失败证据如下：

- `CI` run `24943223560`：job `tester`，step `安装pnpm` 失败。
- `App CI` run `24943223567`：job `build`，step `Install dependencies` 失败。
- 直接错误为 `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY`，缺少 `drizzle-orm@0.42.0(@neondatabase/serverless@0.10.4)(@types/pg@8.15.6)(gel@2.2.0)` 的 lockfile snapshot。

根因与修复：

- `.github/workflows/ci.yaml` 通过 `pnpm/action-setup@v5` 的 `run_install` 在 `actions/setup-node@v6` 配置 Node 22.14.0 前递归安装依赖，并全局安装 `tsx`/`turbo`，同时违反项目禁止全局安装工具包的约束。
- `pnpm-lock.yaml` 中 `apps/api` importer 的 `drizzle-orm` peer resolution 指向 `@types/pg@8.15.6`，但 lockfile 已存在并实际复用的是 `@types/pg@8.11.6` snapshot。
- workflow 已调整为 checkout -> setup pnpm -> setup Node 22.14.0 with pnpm cache -> `pnpm install --frozen-lockfile` -> 输出 node/pnpm/workspace-local turbo 版本 -> 可选 Turbo 远程缓存登录/链接 -> `pnpm run ci`。
- 全量 CI 使用 `pnpm exec turbo` 调用 workspace-local Turbo，不再全局安装 `tsx` 或 `turbo`；workflow、job、step 名称改为语义化中文，且保留 `actions/checkout@v6`、`pnpm/action-setup@v5`、`actions/setup-node@v6`。
- `apps/api` importer 的 `drizzle-orm` resolution 已最小对齐到现有 `@types/pg@8.11.6` snapshot；本地 `pnpm install --frozen-lockfile` 继续暴露 `nitro` 和 `vitest` importer resolution 指向不存在 snapshot，已同样对齐到 lockfile 中已有 snapshot。不修改 `package.json` 依赖版本。

Phase2 不负责：

- 不迁移 repair/resource/parking。
- 不迁移 charge-machine/open-door endpoints；只记录为后续输入。
- 不迁移 `/app/iot/listChargeMachineBmoImpl`、`/app/iot/listChargeMachineOrderBmoImpl`、`/app/iot/listChargeMachinePortBmoImpl`、`/app/machine/listMachineRecords`。
- 不删除、移动、归档、重命名或清空 `D:\code\ruan-cat\01s-11comm-app`。
- 不删除 `apps/admin/server` 或 `apps/app/server`。
- 不做 app/admin 全量切流。
- 不引入鉴权、JWT、Token、Neon Auth 或 `@neondatabase/auth`。
- 不修改根 `turbo.json` 来完成 Phase2；当前根 `turbo.json` 只有通用 `build`、`docs:build` 和内部 `//#deploy` 编排，本阶段依赖 `apps/api/package.json` scripts 验收。
- 不执行未授权 `git commit`。

## Locked File Responsibilities

### Phase2 Create

- `apps/api/package.json`
  - 定义 `@01s-11comm/api` 包名、Nitro scripts、Vitest scripts 和本包显式依赖。
- `apps/api/nitro.config.ts`
  - 最小 Nitro 配置，`serverDir: "./server"`，注册 `/app/**` legacy handler，保留健康检查 route。
- `apps/api/tsconfig.json`
  - 只服务 `apps/api`，包含 `server/**/*.ts` 与 `tests/**/*.ts`，开启 `noEmit`。
- `apps/api/vitest.config.ts`
  - Node 环境测试配置，不使用 jsdom。
- `apps/api/server/routes/index.get.ts`
  - API 根入口，返回服务名、阶段和健康检查链接。
- `apps/api/server/routes/__nitro/health.get.ts`
  - 健康检查，返回 `success: true`、服务名和时间戳。
- `apps/api/server/db/index.ts`
  - 参考 `apps/admin/server/db/index.ts` 的 `useDb(event)`，但 schema 只从 `@01s-11comm/type` 导入。
- `apps/api/server/utils/format-date.ts`
  - 参考 admin `formatDateTime` 行为，提供 list adapter 所需日期格式化。
- `apps/api/server/shared/runtime/endpoint-registry.ts`
  - endpoint 定义、注册、查找、dispatch 的共享机制。
- `apps/api/server/shared/runtime/request-adapter.ts`
  - 把 H3 event 的 query/body/method/path 转成 registry dispatch input。
- `apps/api/server/shared/runtime/response-builder.ts`
  - app legacy 成功/失败响应 helper 与 admin `JsonVO` helper。
- `apps/api/server/shared/runtime/runtime-endpoints.ts`
  - 汇总本阶段允许进入 Nitro priority layer 的 endpoint 定义。
- `apps/api/server/handlers/legacy-dispatch.ts`
  - 处理 `/app/**`，只 dispatch Phase2 白名单路径。
- `apps/api/server/modules/fee/index.ts`
  - fee module 统一导出。
- `apps/api/server/modules/fee/types.ts`
  - 本模块内部 DTO、adapter input/output 类型；不得定义数据库 schema。
- `apps/api/server/modules/fee/service.ts`
  - app legacy 与 admin canonical 共享的业务服务。
- `apps/api/server/modules/fee/repository.ts`
  - fee/payment/report 数据访问抽象与最小实现。
- `apps/api/server/modules/fee/runtime.ts`
  - fee runtime/factory，统一组装 repository、service、legacy adapter 和 admin adapter；无数据库 URL 时复用 in-memory fallback。
- `apps/api/server/modules/fee/legacy-endpoints.ts`
  - Phase2 白名单 app legacy endpoint definitions。
- `apps/api/server/modules/fee/legacy-adapter.ts`
  - app legacy 请求字段、响应字段与 shared service 的映射。
- `apps/api/server/modules/fee/admin-adapter.ts`
  - admin canonical DTO 与 shared service 的映射。
- `apps/api/server/routes/api/property-manage/expense-manage/house-charge/list.post.ts`
  - admin canonical house charge list 样板。
- `apps/api/server/routes/api/property-manage/report-manage/payment-details-form/list.post.ts`
  - admin canonical payment details form list 样板。
- `apps/api/tests/smoke/health.test.ts`
  - API 根入口与健康检查 smoke test。
- `apps/api/tests/runtime/endpoint-registry.test.ts`
  - registry、request adapter、response helper 单元测试。
- `apps/api/tests/legacy/fee-legacy-endpoints.test.ts`
  - app legacy fee/payment/report 兼容测试。
- `apps/api/tests/admin/fee-admin-endpoints.test.ts`
  - admin canonical adapter 与 route handler 测试。
- `apps/api/tests/modules/fee-service.test.ts`
  - 共享 service/repository 断言，证明 app/admin 未分叉数据源。

### Phase2 Read-Only References

- `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`
- `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase1.md`
- `apps/app/src/api/fee.ts`
- `apps/app/server/modules/fee/endpoints.ts`
- `apps/app/server/modules/fee/repository.ts`
- `apps/app/src/tests/nitro-runtime/fee-endpoints.test.ts`
- `apps/admin/server/db/index.ts`
- `apps/admin/server/api/property-manage/expense-manage/house-charge/list.post.ts`
- `apps/admin/server/api/property-manage/report-manage/payment-details-form/list.post.ts`
- `apps/type/src/business/property-manage/expense-manage/schema.ts`
- `apps/type/src/business/property-manage/report-manage/schema.ts`
- `apps/type/src/common/index.ts`
- `pnpm-workspace.yaml`
- `turbo.json`

`pnpm-workspace.yaml` 已包含 `apps/*`，创建 `apps/api` 后会自动进入 workspace；Phase2 执行代理不得为了 workspace 识别去修改它。

## Implementation Steps

### TDD Execution Convention

每个创建测试文件的任务都按同一顺序执行：

1. 先写该任务列出的测试文件和断言。
2. 运行该任务指定的 `pnpm -F @01s-11comm/api test -- <test-file>`，预期失败原因必须是目标模块、函数或路径尚未实现。
3. 再写最小实现。
4. 再运行同一条测试命令，预期通过。
5. 最后运行该任务附带的 `typecheck` 或聚合测试命令。

不得先实现再补测试；如果某个测试在红灯阶段意外通过，必须检查是否误用了 `apps/app` 旧模块、admin 旧 handler 或未受控 mock。

### Task T1: 冻结 Phase2 边界和文件责任

**Files:**

- Read: `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`
- Read: `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase1.md`
- Read: `pnpm-workspace.yaml`
- Read: `turbo.json`
- Create later tasks only: `apps/api/**`

- [x] **Step 1: 确认 Phase2 输入事实**

Run:

```powershell
Test-Path apps/api
Get-Content -Raw -Encoding UTF8 pnpm-workspace.yaml
Get-Content -Raw -Encoding UTF8 turbo.json
```

Expected:

- `apps/api` 返回 `False`。
- `pnpm-workspace.yaml` 包含 `apps/*`。
- `turbo.json` 只把 `build`、`docs:build` 作为主验收编排入口；Phase2 不依赖新增 Turbo task。

- [x] **Step 2: 锁定 Phase2 endpoint 白名单**

Phase2 只迁入这些 app legacy paths：

```text
/app/fee.listFee
/app/fee.queryFeeDetail
/app/feeApi/listOweFees
/app/payment.nativeQrcodePayment
/app/oweFeeCallable.listOweFeeCallable
/app/oweFeeCallable.writeOweFeeCallable
/app/fee.saveRoomCreateFee
/app/feeConfig.listFeeConfigs
/app/reportFeeMonthStatistics.queryReportFeeSummary
/app/reportFeeMonthStatistics/queryPayFeeDetail
/app/reportFeeMonthStatistics.queryReportFeeDetailRoom
/app/dataReport.queryFeeDataReport
```

Expected:

- payment/report 没有独立 module，执行时归入 `server/modules/fee/**`。
- `/app/iot/**`、`/app/machine/listMachineRecords`、repair/resource/parking 不进入 Phase2 实现。

- [x] **Step 3: 锁定 admin canonical 样板路径**

Phase2 只新增这些 admin canonical API：

```text
POST /api/property-manage/expense-manage/house-charge/list
POST /api/property-manage/report-manage/payment-details-form/list
```

Expected:

- 两个路径都在 `apps/api/server/routes/api/**` 下实现。
- DTO 参考 admin 现有实现，但 schema/table/type 从 `@01s-11comm/type` 导入。

- [x] **Step 4: 记录禁止项到执行上下文**

执行代理在开始修改前必须明确记录：

```text
不迁移 repair/resource/parking。
不迁移 charge-machine/open-door endpoints。
不删除、移动、归档、重命名或清空 D:\code\ruan-cat\01s-11comm-app。
不删除 apps/admin/server 或 apps/app/server。
不做 app/admin 全量切流。
不引入鉴权、JWT、Token、Neon Auth 或 @neondatabase/auth。
H3 只从 nitro/h3 导入。
不在 apps/api 私建 schema。
不修改 pnpm-workspace.yaml 或 turbo.json 来完成 Phase2。
不执行未授权 git commit。
```

### Task T2: 创建 `apps/api` 最小 Nitro 骨架

**Files:**

- Create: `apps/api/package.json`
- Create: `apps/api/nitro.config.ts`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/vitest.config.ts`
- Create: `apps/api/server/routes/index.get.ts`
- Create: `apps/api/server/routes/__nitro/health.get.ts`
- Create: `apps/api/server/db/index.ts`
- Create: `apps/api/server/utils/format-date.ts`
- Create: `apps/api/tests/smoke/health.test.ts`

- [x] **Step 1: 创建 package manifest**

`apps/api/package.json` 使用这个结构：

```json
{
	"name": "@01s-11comm/api",
	"version": "0.0.0",
	"private": true,
	"type": "module",
	"packageManager": "pnpm@10.32.1",
	"engines": {
		"node": ">=22.14.0"
	},
	"scripts": {
		"dev": "nitro dev",
		"build": "nitro build",
		"preview": "nitro preview",
		"typecheck": "tsc --noEmit",
		"test": "vitest run"
	},
	"dependencies": {
		"@01s-11comm/type": "workspace:^",
		"@neondatabase/serverless": "^0.10.4",
		"consola": "^3.4.2",
		"drizzle-orm": "0.42.0",
		"nitro": "3.0.1-alpha.2"
	},
	"devDependencies": {
		"@types/node": "^24.12.0",
		"typescript": "^5.9.3",
		"vitest": "^3.2.4"
	}
}
```

Expected:

- 不向根 `package.json` 添加 `@01s-11comm/api` 依赖。
- 如执行 `pnpm install` 更新 lockfile，必须只解释为新增 workspace package manifest 的依赖同步，不混入 CI/部署变更。

- [x] **Step 2: 创建最小 Nitro config**

`apps/api/nitro.config.ts` 只包含本阶段需要的最小配置：

```ts
import path from "node:path";
import { defineConfig } from "nitro";

export default defineConfig({
	serverDir: "./server",
	scanDirs: ["./server"],
	devServer: {
		port: 3102,
		watch: ["./server/**/*.ts"],
	},
	handlers: [
		{
			route: "/app/**",
			handler: "./server/handlers/legacy-dispatch",
		},
	],
	alias: {
		server: path.resolve(process.cwd(), "server"),
	},
});
```

Expected:

- 不配置部署 preset。
- 不配置鉴权 middleware/plugin。
- 不把 CORS、日志监控、完整 runtimeConfig 作为 Phase2 完成条件。

- [x] **Step 3: 创建 TypeScript 与 Vitest 配置**

`apps/api/tsconfig.json` 必须覆盖 `server` 与 `tests`：

```json
{
	"extends": "../../tsconfig.json",
	"compilerOptions": {
		"baseUrl": ".",
		"noEmit": true,
		"types": ["node", "vitest"],
		"paths": {
			"server/*": ["server/*"]
		}
	},
	"include": ["server/**/*.ts", "tests/**/*.ts", "nitro.config.ts", "vitest.config.ts"]
}
```

`apps/api/vitest.config.ts` 必须使用 Node 环境：

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		include: ["tests/**/*.test.ts"],
	},
});
```

Expected:

- Nitro/API 测试不使用 jsdom。
- 测试文件扩展名使用 `*.test.ts`。

- [x] **Step 4: 创建根入口与健康检查**

`apps/api/server/routes/index.get.ts` 内容：

```ts
import { defineHandler } from "nitro/h3";

export default defineHandler(() => ({
	success: true,
	service: "@01s-11comm/api",
	phase: "phase2-shadow",
	health: "/__nitro/health",
}));
```

`apps/api/server/routes/__nitro/health.get.ts` 内容：

```ts
import { defineHandler } from "nitro/h3";

export default defineHandler(() => ({
	success: true,
	service: "@01s-11comm/api",
	status: "ok",
	timestamp: new Date().toISOString(),
}));
```

Expected:

- 两个文件都从 `nitro/h3` 导入 H3 helper。
- 不读取数据库，不依赖 app/admin 编译。

- [x] **Step 5: 创建 `useDb(event)` 与日期工具**

`apps/api/server/db/index.ts` 必须满足：

```text
从 nitro/h3 导入 H3Event 类型。
从 @neondatabase/serverless 导入 neon。
从 drizzle-orm/neon-http 导入 drizzle 与 NeonHttpDatabase 类型。
从 @01s-11comm/type 导入全部 schema namespace。
按 apps/admin/server/db/index.ts 的 useDb(event) 思路解析 DATABASE_URL。
把单请求 db 实例缓存到 event.context.db。
没有数据库 URL 时抛出清晰错误。
```

`apps/api/server/utils/format-date.ts` 必须满足：

```text
导出 formatDateTime(input)。
null/undefined/空字符串返回空字符串。
Date 返回 yyyy-MM-dd HH:mm:ss。
字符串能被 Date 解析时返回 yyyy-MM-dd HH:mm:ss。
无法解析的字符串原样返回。
```

- [x] **Step 6: 写 smoke tests 并运行红灯/绿灯**

先创建 `apps/api/tests/smoke/health.test.ts`：

```ts
import { describe, expect, test } from "vitest";

import healthHandler from "../../server/routes/__nitro/health.get";
import indexHandler from "../../server/routes/index.get";
import { formatDateTime } from "../../server/utils/format-date";

describe("api smoke endpoints", () => {
	test("returns the api root metadata", async () => {
		const response = await indexHandler({} as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			phase: "phase2-shadow",
			health: "/__nitro/health",
		});
	});

	test("returns the api health status", async () => {
		const response = await healthHandler({} as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			status: "ok",
		});
		expect(response.timestamp).toEqual(expect.any(String));
	});

	test("formats date values for adapters", () => {
		const formatted = formatDateTime(new Date("2026-04-25T00:00:00.000Z"));

		expect(formatted).toEqual(expect.any(String));
		expect(formatted.length).toBeGreaterThan(0);
	});
});
```

Red run before implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/smoke/health.test.ts
```

Expected red:

- Fails because `server/routes/index.get.ts`, `server/routes/__nitro/health.get.ts`, or `server/utils/format-date.ts` is not implemented yet.

Green run after implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/smoke/health.test.ts
pnpm -F @01s-11comm/api typecheck
```

Expected green:

- smoke tests pass。
- typecheck pass。

### Task T3: 建立共享 endpoint registry、request adapter、response helper

**Files:**

- Create: `apps/api/server/shared/runtime/endpoint-registry.ts`
- Create: `apps/api/server/shared/runtime/request-adapter.ts`
- Create: `apps/api/server/shared/runtime/response-builder.ts`
- Create: `apps/api/server/shared/runtime/runtime-endpoints.ts`
- Create: `apps/api/server/handlers/legacy-dispatch.ts`
- Create: `apps/api/tests/runtime/endpoint-registry.test.ts`

- [x] **Step 1: 创建 endpoint definition 类型和 registry**

`endpoint-registry.ts` 必须提供：

```ts
import type { H3Event } from "nitro/h3";

export type EndpointMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EndpointDispatchInput {
	method: EndpointMethod | string;
	path: string;
	query?: Record<string, unknown>;
	body?: unknown;
	event?: H3Event;
}

export interface EndpointDefinition<TResponse = unknown> {
	url: string;
	method: EndpointMethod | EndpointMethod[];
	handler: (input: EndpointDispatchInput & { method: EndpointMethod }) => TResponse | Promise<TResponse>;
}
```

Required functions:

```text
createEndpointRegistry(definitions)
findEndpointDefinition(registry, method, path)
dispatchEndpoint(registry, input)
normalizeEndpointMethod(method)
```

Expected:

- method matching is case-insensitive。
- unknown endpoint throws 404-style error object or Error with `statusCode = 404`。

- [x] **Step 2: 创建 H3 request adapter**

`request-adapter.ts` 必须从 `nitro/h3` 导入：

```text
getMethod
getQuery
getRequestURL
readBody
```

Required function:

```ts
export async function toEndpointDispatchInput(event: H3Event): Promise<EndpointDispatchInput>;
```

Expected:

- `path` 使用 request URL pathname。
- `event` 原样传入 dispatch input，供 endpoint handler 取得 request-scoped runtime。
- GET 请求 body 为 `undefined`。
- POST/PUT/PATCH/DELETE 请求读取 body。

- [x] **Step 3: 创建 response helper**

`response-builder.ts` 必须提供两类 helper：

```text
legacySuccess(data, msg)
legacyFailure(message, code)
adminSuccess(data, message)
adminFailure(message, error)
```

Expected:

- legacy response 保持 app 当前结构：`{ code, msg, data }` 或现有 success wrapper 兼容结构。
- admin response 使用 `JsonVO<T>` 类型，`success/code/message/data` 字段齐全。
- `JsonVO` 从 `@01s-11comm/type` 导入。

- [x] **Step 4: 创建 legacy dispatch handler**

`legacy-dispatch.ts` 必须：

```text
从 nitro/h3 导入 defineHandler、createError。
从 request-adapter 读取 dispatch input。
从 runtime-endpoints 读取 runtimeEndpointDefinitions。
调用 dispatchEndpoint。
未知 endpoint 返回 404。
```

Expected:

- 只处理 `/app/**`。
- 不处理 `/callComponent/**`。
- 不包含鉴权判断。

- [x] **Step 5: 写 registry tests**

先创建 `apps/api/tests/runtime/endpoint-registry.test.ts`：

```ts
import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
	normalizeEndpointMethod,
} from "../../server/shared/runtime/endpoint-registry";
import { adminSuccess, legacySuccess } from "../../server/shared/runtime/response-builder";

describe("endpoint registry", () => {
	test("normalizes methods and finds endpoints by method/path", async () => {
		const registry = createEndpointRegistry([
			{
				url: "/app/fee.listFee",
				method: ["GET", "POST"],
				handler: () => legacySuccess({ list: [] }, "查询成功"),
			},
		]);

		expect(normalizeEndpointMethod("get")).toBe("GET");
		expect(findEndpointDefinition(registry, "GET", "/app/fee.listFee")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/fee.listFee")).toBeTruthy();

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/fee.listFee",
			query: { page: 1 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: { list: [] },
		});
	});

	test("throws a 404 error for unknown endpoints", async () => {
		const registry = createEndpointRegistry([]);

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/unknown",
			}),
		).rejects.toMatchObject({
			statusCode: 404,
		});
	});

	test("builds admin success responses with JsonVO shape", () => {
		expect(adminSuccess({ list: [] }, "查询成功")).toMatchObject({
			success: true,
			code: 200,
			message: "查询成功",
			data: { list: [] },
		});
	});
});
```

Red run before implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/runtime/endpoint-registry.test.ts
```

Expected red:

- Fails because `endpoint-registry.ts` or `response-builder.ts` is not implemented yet.

Green run after implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/runtime/endpoint-registry.test.ts
```

Expected green:

- registry runtime tests pass。

### Task T4: 迁入 fee/payment/report legacy adapter 与测试

**Files:**

- Create: `apps/api/server/modules/fee/types.ts`
- Create: `apps/api/server/modules/fee/legacy-adapter.ts`
- Create: `apps/api/server/modules/fee/legacy-endpoints.ts`
- Create: `apps/api/server/modules/fee/runtime.ts`
- Create: `apps/api/server/modules/fee/index.ts`
- Modify: `apps/api/server/shared/runtime/runtime-endpoints.ts`
- Create: `apps/api/tests/legacy/fee-legacy-endpoints.test.ts`

- [x] **Step 1: 从 app legacy 源建立兼容矩阵**

Read:

```powershell
Get-Content -Raw -Encoding UTF8 apps/app/src/api/fee.ts
Get-Content -Raw -Encoding UTF8 apps/app/server/modules/fee/endpoints.ts
Get-Content -Raw -Encoding UTF8 apps/app/src/tests/nitro-runtime/fee-endpoints.test.ts
```

Write the matrix into `apps/api/tests/legacy/fee-legacy-endpoints.test.ts` test names and fixtures:

```text
fee.listFee returns page/row/total/list.
fee.queryFeeDetail returns data.list.
feeApi/listOweFees returns data.data and totalAmount.
payment.nativeQrcodePayment returns data.codeUrl.
oweFeeCallable.listOweFeeCallable returns list.
oweFeeCallable.writeOweFeeCallable returns code 0.
fee.saveRoomCreateFee returns successRoom/errorRoom counters.
feeConfig.listFeeConfigs returns configId/feeName/feeFlag/computingFormula.
reportFeeMonthStatistics.queryReportFeeSummary returns feeRoomCount/receivedFee.
reportFeeMonthStatistics/queryPayFeeDetail returns list and total.
reportFeeMonthStatistics.queryReportFeeDetailRoom returns roomId/feeName/oweFee.
dataReport.queryFeeDataReport returns name/value list.
```

- [x] **Step 2: 创建 legacy adapter 类型边界**

`types.ts` 必须包含：

```text
LegacyFeeListQuery
LegacyFeeDetailQuery
LegacyOweFeeQuery
LegacyPaymentBody
LegacyOweFeeCallableQuery
LegacyWriteOweFeeCallableBody
LegacyCreateFeeBody
LegacyReportQuery
```

Expected:

- 类型只描述 request/response adapter shape。
- 不定义 Drizzle table、不定义 Zod schema、不复制 `apps/app/src/types/fee.ts` 为长期 schema。

- [x] **Step 3: 创建 legacy endpoints 白名单**

`legacy-endpoints.ts` 必须导出：

```text
feeLegacyEndpointDefinitions
```

Expected:

- 只注册 T1 白名单路径。
- 明确不注册 `/app/iot/**`。
- 明确不注册 `/app/machine/listMachineRecords`。
- 每个 endpoint handler 只做参数收敛，通过 `getFeeRuntime(event).legacyAdapter` 调用共享 runtime，并返回 legacy response。

- [x] **Step 4: 汇总 runtime endpoints**

`runtime-endpoints.ts` 必须导出：

```ts
import { feeLegacyEndpointDefinitions } from "server/modules/fee";

export const runtimeEndpointDefinitions = [...feeLegacyEndpointDefinitions];
```

Expected:

- Phase2 runtime endpoints 只来自 fee module。

- [x] **Step 5: 写 legacy compatibility tests**

先创建 `apps/api/tests/legacy/fee-legacy-endpoints.test.ts`，至少包含以下测试骨架：

```ts
import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("fee legacy endpoints", () => {
	test("registers only Phase2 fee/payment/report legacy endpoints", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/app/fee.listFee")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/payment.nativeQrcodePayment")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/reportFeeMonthStatistics.queryReportFeeSummary")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords")).toBeUndefined();
	});

	test("serves fee list, owe fee, callable, create fee and payment qrcode legacy shapes", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const feeList = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/fee.listFee",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});
		expect(feeList.data).toMatchObject({
			total: expect.any(Number),
			page: 1,
			row: 5,
			list: expect.any(Array),
		});

		const payment = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/payment.nativeQrcodePayment",
			body: {
				roomId: "ROOM_001",
				communityId: "COMM_001",
				business: "oweFee",
				feeIds: ["FEE_001"],
			},
		});
		expect(payment.data).toMatchObject({
			code: 0,
			data: { codeUrl: expect.stringContaining("ROOM_001") },
		});
	});

	test("serves report legacy shapes", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const summary = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/reportFeeMonthStatistics.queryReportFeeSummary",
			query: { page: 1, row: 10, communityId: "COMM_001" },
		});
		expect(summary.data.list[0]).toMatchObject({
			feeRoomCount: expect.any(Number),
			receivedFee: expect.any(Number),
		});

		const dataReport = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/dataReport.queryFeeDataReport",
			query: { communityId: "COMM_001", reportCode: "FEE_REPORT" },
		});
		expect(dataReport.data.list[0]).toMatchObject({
			name: expect.any(String),
			value: expect.any(Number),
		});
	});
});
```

Minimum assertions:

```text
findEndpointDefinition(registry, "GET", "/app/fee.listFee") is truthy.
findEndpointDefinition(registry, "POST", "/app/payment.nativeQrcodePayment") is truthy.
findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineBmoImpl") is undefined.
findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords") is undefined.
dispatching each Phase2 whitelist endpoint returns the legacy shape expected by apps/app/src/api/fee.ts.
```

Red run before implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/legacy/fee-legacy-endpoints.test.ts
```

Expected red:

- Fails because `server/modules/fee/legacy-endpoints.ts`, `legacy-adapter.ts`, or `runtime-endpoints.ts` does not yet expose the Phase2 whitelist.

Green run after implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/legacy/fee-legacy-endpoints.test.ts
```

Expected green:

- app legacy compatibility tests pass。
- charge-machine/open-door assertions prove they are excluded from Phase2。

### Task T5: 建立共享 fee service/repository 并排除 charge/open-door

**Files:**

- Create: `apps/api/server/modules/fee/service.ts`
- Create: `apps/api/server/modules/fee/repository.ts`
- Create: `apps/api/server/modules/fee/runtime.ts`
- Modify: `apps/api/server/modules/fee/legacy-adapter.ts`
- Modify: `apps/api/server/modules/fee/admin-adapter.ts`
- Create: `apps/api/tests/modules/fee-service.test.ts`

- [x] **Step 1: 定义 repository contract**

`repository.ts` 必须导出一个共享 contract：

```text
FeeRepository
createFeeRepository(options)
createInMemoryFeeRepository(seed)
```

`FeeRepository` 必须覆盖：

```text
listHouseCharges
listFeeDetails
listOweFees
createNativeQrcodePayment
listOweFeeCallables
writeOweFeeCallable
saveRoomCreateFee
listFeeConfigs
getFeeSummaryReport
getPayFeeDetailReport
getRoomFeeReport
getDataReport
```

Expected:

- 不包含 `getChargeMachineList`。
- 不包含 `getChargeMachineOrderList`。
- 不包含 `getChargeMachinePortList`。
- 不包含 `getOpenDoorLogList`。

- [x] **Step 2: 定义 service contract**

`service.ts` 必须导出：

```text
FeeService
createFeeService(repository)
```

Expected:

- legacy adapter 和 admin adapter 都依赖 `FeeService`。
- service 方法名使用业务语义，不使用 legacy URL 当方法名。

- [x] **Step 2.5: 建立共享 fee runtime**

`runtime.ts` 必须导出：

```text
FeeRuntime
getFeeRuntime(event?)
```

Expected:

- `getFeeRuntime(event)` 有数据库 URL 时使用 request-scoped `useDb(event)` 和 db-backed repository。
- 无数据库 URL 或无 event 时返回同一个 in-memory fallback runtime。
- legacy endpoints 和 admin canonical routes 都通过 `getFeeRuntime(event)` 获取 adapter，不能各自创建互相独立的数据源。

- [x] **Step 3: 建立最小 in-memory seed**

In-memory repository 必须包含：

```text
至少 3 条 house charge/fee rows。
至少 1 条 payment detail row。
至少 1 条 owe fee callable row。
至少 1 条 fee config row。
至少 1 组 report summary data。
```

Expected:

- seed 数据只用于 Phase2 兼容测试和 shadow service。
- 不能把 app legacy repository 中的 charge machine/open-door seed 搬入 Phase2。

- [x] **Step 4: 写共享 service tests**

先创建 `apps/api/tests/modules/fee-service.test.ts`：

```ts
import { describe, expect, test } from "vitest";

import { createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";

describe("fee service shared repository", () => {
	test("shares one repository between legacy and admin read models", async () => {
		const repository = createInMemoryFeeRepository();
		const service = createFeeService(repository);

		const legacyList = await service.listLegacyFees({ page: 1, row: 10, communityId: "COMM_001" });
		const adminList = await service.listAdminHouseCharges({ pageIndex: 1, pageSize: 10 });

		expect(legacyList.list.length).toBeGreaterThan(0);
		expect(adminList.list.length).toBeGreaterThan(0);
		expect(adminList.list[0].id).toBe(legacyList.list[0].feeId);
	});

	test("mutations are visible through the shared service", async () => {
		const repository = createInMemoryFeeRepository();
		const service = createFeeService(repository);

		await service.writeOweFeeCallable({
			communityId: "COMM_001",
			feeIds: ["FEE_001"],
			roomId: "ROOM_001",
			remark: "电话提醒",
		});

		const callables = await service.listOweFeeCallables({
			communityId: "COMM_001",
			page: 1,
			row: 10,
			payerObjId: "ROOM_001",
		});

		expect(callables.list.some((item) => item.remark === "电话提醒")).toBe(true);
	});

	test("does not expose charge-machine or open-door repository methods in Phase2", () => {
		const repository = createInMemoryFeeRepository() as Record<string, unknown>;

		expect(repository.getChargeMachineList).toBeUndefined();
		expect(repository.getOpenDoorLogList).toBeUndefined();
	});
});
```

Red run before implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/modules/fee-service.test.ts
```

Expected red:

- Fails because `repository.ts` or `service.ts` is not implemented yet.

Green run after implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/modules/fee-service.test.ts
```

Expected green:

- shared service tests pass。

### Task T6: 建立 admin canonical adapter 与测试

**Files:**

- Create: `apps/api/server/modules/fee/admin-adapter.ts`
- Modify: `apps/api/server/modules/fee/runtime.ts`
- Create: `apps/api/server/routes/api/property-manage/expense-manage/house-charge/list.post.ts`
- Create: `apps/api/server/routes/api/property-manage/report-manage/payment-details-form/list.post.ts`
- Create: `apps/api/tests/admin/fee-admin-endpoints.test.ts`

- [x] **Step 1: 参考 admin 现有路由固定 response contract**

Read:

```powershell
Get-Content -Raw -Encoding UTF8 apps/admin/server/api/property-manage/expense-manage/house-charge/list.post.ts
Get-Content -Raw -Encoding UTF8 apps/admin/server/api/property-manage/report-manage/payment-details-form/list.post.ts
```

Admin canonical response 必须使用：

```text
JsonVO<PageDTO<T>>
success: true
code: 200
message: "查询成功"
data.list
data.total
data.pageSize
data.pageIndex
data.totalPages
```

- [x] **Step 2: 实现 house charge list adapter**

Route path:

```text
apps/api/server/routes/api/property-manage/expense-manage/house-charge/list.post.ts
```

Required behavior:

```text
从 nitro/h3 导入 defineHandler、readBody。
读取 page/pageIndex 和 pageSize。
支持 expenseItem、billingPeriod、status 过滤。
通过 getFeeRuntime(event).adminAdapter 调用共享 fee runtime。
返回 JsonVO<PageDTO<...>>。
```

Expected:

- 不直接查询 app legacy repository。
- 不直接返回 app legacy `{ code, msg, data }`。
- 无数据库 URL 时仍能调用成功，使用同一个 in-memory fallback runtime。

- [x] **Step 3: 实现 payment details form list adapter**

Route path:

```text
apps/api/server/routes/api/property-manage/report-manage/payment-details-form/list.post.ts
```

Required behavior:

```text
从 nitro/h3 导入 defineHandler、readBody。
读取 pageIndex/pageSize/name/status。
通过 getFeeRuntime(event).adminAdapter 调用共享 fee runtime。
返回 PaymentDetailsFormListItem 兼容字段。
返回 JsonVO<PageDTO<PaymentDetailsFormListItem>>。
```

Expected:

- `PaymentDetailsFormListItem`、`JsonVO`、`PageDTO` 从 `@01s-11comm/type` 导入。

- [x] **Step 4: 写 admin adapter tests**

先创建 `apps/api/tests/admin/fee-admin-endpoints.test.ts`：

```ts
import { describe, expect, test } from "vitest";

import { createAdminFeeAdapter, createLegacyFeeAdapter } from "../../server/modules/fee";
import { createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";

describe("fee admin canonical adapter", () => {
	test("returns house-charge list with JsonVO PageDTO shape", async () => {
		const service = createFeeService(createInMemoryFeeRepository());
		const admin = createAdminFeeAdapter(service);

		const response = await admin.listHouseCharges({
			page: 1,
			pageSize: 20,
			expenseItem: "物业",
		});

		expect(response).toMatchObject({
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				pageSize: 20,
				pageIndex: 1,
				totalPages: expect.any(Number),
			},
		});
	});

	test("returns payment-details-form list with JsonVO PageDTO shape", async () => {
		const service = createFeeService(createInMemoryFeeRepository());
		const admin = createAdminFeeAdapter(service);

		const response = await admin.listPaymentDetailsForm({
			pageIndex: 1,
			pageSize: 20,
			name: "物业",
		});

		expect(response.data.list[0]).toMatchObject({
			id: expect.any(String),
			name: expect.any(String),
			status: expect.any(String),
		});
	});

	test("legacy and admin adapters use the same service instance", async () => {
		const service = createFeeService(createInMemoryFeeRepository());
		const legacy = createLegacyFeeAdapter(service);
		const admin = createAdminFeeAdapter(service);

		const legacyResponse = await legacy.listFee({ page: 1, row: 10, communityId: "COMM_001" });
		const adminResponse = await admin.listHouseCharges({ pageIndex: 1, pageSize: 10 });

		expect(legacyResponse).toHaveProperty("code", 0);
		expect(adminResponse).toHaveProperty("success", true);
		expect(adminResponse.data.list[0].id).toBe(legacyResponse.data.list[0].feeId);
	});
});
```

还必须覆盖 route handler 直调：

```text
house-charge route without database url returns JsonVO<PageDTO<...>>.
payment-details route without database url returns JsonVO<PageDTO<PaymentDetailsFormListItem>>.
legacy and admin adapters resolved from getFeeRuntime() share repository state.
```

Red run before implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/admin/fee-admin-endpoints.test.ts
```

Expected red:

- Fails because `admin-adapter.ts` or route handlers are not implemented yet.

Green run after implementation:

```powershell
pnpm -F @01s-11comm/api test -- tests/admin/fee-admin-endpoints.test.ts
```

Expected green:

- admin canonical tests pass。

### Task T7: 接入 type schema、类型约束与数据库访问策略

**Files:**

- Modify: `apps/api/server/db/index.ts`
- Modify: `apps/api/server/modules/fee/repository.ts`
- Modify: `apps/api/server/modules/fee/runtime.ts`
- Modify: `apps/api/server/modules/fee/admin-adapter.ts`
- Modify: `apps/api/server/modules/fee/types.ts`
- Modify only if schema changes are proven necessary: `apps/type/src/business/property-manage/expense-manage/schema.ts`
- Modify only if schema changes are proven necessary: `apps/type/src/business/property-manage/report-manage/schema.ts`

- [x] **Step 1: 固定 schema import 规则**

All schema/table imports in `apps/api` must come from:

```ts
import { exHouseCharges, exPayments, rptPaymentDetails, type JsonVO, type PageDTO } from "@01s-11comm/type";
```

Expected:

- 不从 `apps/admin/server/db/schema` 导入。
- 不在 `apps/api/server/db/schema.ts` 创建私有 schema。
- 不复制 `apps/type/src/business/**/schema.ts` 到 `apps/api`。

- [x] **Step 2: 固定数据库访问策略**

`repository.ts` 必须支持两种数据源：

```text
in-memory repository for Phase2 tests and local shadow behavior.
db-backed repository factory that accepts useDb(event) result.
```

Expected:

- 没有 `DATABASE_URL` 时，测试使用 in-memory repository，不阻断 Vitest。
- 真实 DB 查询只在 route/event 有数据库配置时启用。
- DB-backed repository 使用 `@01s-11comm/type` tables。
- `getFeeRuntime(event)` 负责选择 db-backed repository 或 in-memory fallback，避免 admin route 和 legacy dispatch 分叉数据源。

- [x] **Step 3: 检查是否需要修改 apps/type schema**

Run:

```powershell
rg "exHouseCharges|exPayments|rptPaymentDetails|rptExpenseSummaries" apps/type/src/business/property-manage -n
```

Expected:

- 如果现有 schema 已满足 Phase2 list/payment/report 样板，不修改 `apps/type`。
- 如果确实需要新增字段，先停止实现并按 `schema-change-sync` 另开 schema 同步任务；Phase2 不允许临时在 `apps/api` 内补私有字段。

- [x] **Step 4: 类型检查**

Run:

```powershell
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/type typecheck
```

Expected:

- `@01s-11comm/api` typecheck pass。
- 如果 `apps/type` 未修改，仍运行 typecheck 证明复用类型未破坏。

### Task T8: 最终验收、验证命令、Phase3/Phase4 输入清单

**Files:**

- Verify: `apps/api/**`
- Verify: `apps/admin/server/**` unchanged unless explicitly authorized elsewhere
- Verify: `apps/app/server/**` unchanged unless explicitly authorized elsewhere
- Verify: `D:\code\ruan-cat\01s-11comm-app` untouched

- [x] **Step 1: 运行 workspace 与 package scripts 验收**

Run:

```powershell
pnpm -r list --depth -1
pnpm -F @01s-11comm/api test
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build
pnpm install --lockfile-only --frozen-lockfile
```

Expected:

- workspace list includes `@01s-11comm/api`。
- API tests pass。
- API typecheck pass。
- API build pass。
- frozen lockfile check pass；如果本机 pnpm 重写 lockfile 格式，必须恢复为只包含 `apps/api` importer 的最小 diff。

- [x] **Step 2: 运行约束扫描**

Run:

```powershell
rg "from ['\"]h3['\"]" apps/api
rg "@neondatabase/auth|JWT|jwt|Neon Auth|token 校验|Token 校验" apps/api
rg "pgTable|createInsertSchema|createSelectSchema" apps/api
```

Expected:

- 第一条没有输出。
- 第二条没有输出。
- 第三条没有输出；`apps/api` 不定义 schema。

- [x] **Step 3: 验证 legacy exclusion**

Run:

```powershell
rg "listChargeMachine|ChargeMachine|listMachineRecords|OpenDoor|getOpenDoor" apps/api/server apps/api/tests
```

Expected:

- 只允许在测试断言或 Phase3/Phase4 输入清单文字中出现。
- 不允许在 `apps/api/server/modules/fee/repository.ts` 的 Phase2 contract 中出现。
- 不允许注册为 runtime endpoint。

- [x] **Step 4: 验证旧服务与旧源目录未被处置**

Run:

```powershell
Test-Path apps/admin/server
Test-Path apps/app/server
$oldSource = "D:\code\ruan-cat\01s-11comm-app"
Test-Path $oldSource
git -C $oldSource rev-parse --is-inside-work-tree
git -C $oldSource status --short
$oldSourceItems = Get-ChildItem -LiteralPath $oldSource -Force
$oldSourceItems.Count -gt 0
```

Expected:

- `apps/admin/server`、`apps/app/server` 和 `$oldSource` 的 `Test-Path` 全部为 `True`。
- `git -C $oldSource rev-parse --is-inside-work-tree` 返回 `true`。
- `$oldSourceItems.Count -gt 0` 返回 `True`，证明旧源目录不是空目录。
- `git -C $oldSource status --short` 的输出必须记录到执行总结；如果出现由 Phase2 执行产生的新增、删除、移动或清空痕迹，Phase2 验收失败。
- Phase2 不删除、不移动、不归档、不重命名、不清空这些路径。

- [x] **Step 5: 记录 Phase3 输入清单**

在执行总结中记录这些 Phase3 输入，不作为 Phase2 blocker：

```text
apps/api CI workflow。
GitHub Actions workflow 正确性验收：Node 22.14.0 后安装依赖、`pnpm install --frozen-lockfile` 通过、workspace-local Turbo 全量构建、禁止全局安装 `turbo`/`tsx`、保留必要 action major versions、workflow/job/step 使用语义化中文命名；全量 Turbo CI pass criteria 包含 `@01s-11comm/admin`、`@01s-11comm/api`、`@01s-11comm/app`、`@01s-11comm/type` 四个 workspace 包。
根 turbo API build/test 编排。
部署 preset 与部署平台配置。
统一请求校验层与 validation runtime；如需要直接使用 `zod`，从该阶段引入。
完整 runtimeConfig 和环境变量治理。
CORS 策略。
日志、监控、错误追踪。
admin/app API base URL 接入策略与回退策略。
```

- [x] **Step 6: 记录 Phase4 输入清单**

在执行总结中记录这些 Phase4 或后续输入，不作为 Phase2 blocker：

```text
repair/resource/parking 模块迁移。
/app/iot/listChargeMachineBmoImpl。
/app/iot/listChargeMachineOrderBmoImpl。
/app/iot/listChargeMachinePortBmoImpl。
/app/machine/listMachineRecords。
/callComponent/core/list 是否需要作为 app 字典兼容路径单独迁移。
更多 admin 三级业务路径 CRUD。
```

- [x] **Step 7: 最终 git diff 检查**

Run:

```powershell
git status --short
git diff --check -- apps/api docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase2.md
```

Expected:

- `git status --short` 中 Phase2 实现只包含预期文件。
- `git diff --check` 无输出。
- 不执行 git commit，除非用户明确授权。

- [x] **Step 8: 验证 GitHub workflow 正确性纳入 Phase2 -> Phase3 交接**

Run:

```powershell
pnpm install --frozen-lockfile
rg -n "run_install|--global|pnpm ls -g|turbo --version" .github/workflows/ci.yaml .github/workflows/app-ci.yml
pnpm run ci
pnpm -F @01s-11comm/app run build:h5:prod
pnpm -F @01s-11comm/app run type-check
pnpm -F @01s-11comm/app exec vitest run
pnpm -F @01s-11comm/app run build:nitro:vercel
git diff --check
```

Expected:

- frozen lockfile 安装不再因 `drizzle-orm` peer resolution 缺失 snapshot 失败。
- workflow 不再包含 `run_install`、全局安装、全局 pnpm 包检查或直接 `turbo --version`。
- 根 `pnpm run ci` 通过 workspace-local Turbo 覆盖 `@01s-11comm/admin`、`@01s-11comm/api`、`@01s-11comm/app`、`@01s-11comm/type` 四个 workspace 包。
- `App 专项 CI` 的 H5 production build、type-check、Vitest 和 Nitro Vercel build 均通过。
- `git diff --check` 无输出。
- Phase3 承接 CI 时必须保留 Node 22.14.0 后安装依赖、workspace-local Turbo、必要 action major versions 不降级和语义化中文命名这些约束。

## Testing and Verification Summary

Phase2 最终验收命令：

```powershell
pnpm -r list --depth -1
pnpm -F @01s-11comm/api test
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build
pnpm -F @01s-11comm/type typecheck
rg "from ['\"]h3['\"]" apps/api
rg "@neondatabase/auth|JWT|jwt|Neon Auth|token 校验|Token 校验" apps/api
rg "pgTable|createInsertSchema|createSelectSchema" apps/api
Test-Path apps/admin/server
Test-Path apps/app/server
$oldSource = "D:\code\ruan-cat\01s-11comm-app"
Test-Path $oldSource
git -C $oldSource rev-parse --is-inside-work-tree
git -C $oldSource status --short
$oldSourceItems = Get-ChildItem -LiteralPath $oldSource -Force
$oldSourceItems.Count -gt 0
git diff --check -- apps/api docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase2.md
pnpm install --frozen-lockfile
rg -n "run_install|--global|pnpm ls -g|turbo --version" .github/workflows/ci.yaml .github/workflows/app-ci.yml
pnpm run ci
pnpm -F @01s-11comm/app run build:h5:prod
pnpm -F @01s-11comm/app run type-check
pnpm -F @01s-11comm/app exec vitest run
pnpm -F @01s-11comm/app run build:nitro:vercel
git diff --check
```

Pass criteria:

- API package 被 workspace 识别。
- API test/typecheck/build 全部通过。
- `@01s-11comm/type` typecheck 通过。
- `apps/api` 不存在直接从 `"h3"` 导入。
- `apps/api` 不存在鉴权实现。
- `apps/api` 不存在私有 Drizzle/Zod schema 定义。
- 旧服务目录和旧源目录仍存在，旧源目录仍是非空 git 项目，且没有 Phase2 造成的处置痕迹。
- Phase2 未把 charge-machine/open-door、repair/resource/parking 伪装为已迁移能力。
- GitHub Actions workflow 正确性已纳入 Phase2 -> Phase3 交接验收；CI 必须在 Node 22.14.0 配置完成后运行 `pnpm install --frozen-lockfile`，并通过 `pnpm run ci` 使用 workspace-local Turbo 全量构建 `@01s-11comm/admin`、`@01s-11comm/api`、`@01s-11comm/app`、`@01s-11comm/type` 四个 workspace 包。
- `App 专项 CI` 必须继续通过 H5 production build、type-check、Vitest 和 Nitro Vercel build。
