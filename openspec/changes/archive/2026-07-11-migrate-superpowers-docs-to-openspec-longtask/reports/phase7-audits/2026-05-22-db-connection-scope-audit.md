# Task 116 数据库连接作用域审计

审计日期：2026-05-20

## 审计范围

- 主审计范围：`apps/api/server`，共扫描 254 个服务端文件。
- legacy/source-side 对照范围：
  - `apps/admin/server`，共扫描 189 个服务端文件。
  - `apps/app/server`，共扫描 69 个服务端文件。
- 审计规则：数据库连接只能从 Nitro `event.context` 或既有 DB helper 获取；不得在业务模块、route、repository、service 或模块顶层直接创建 Neon/Drizzle 连接。
- 本轮审计只读扫描运行时代码，审计文档之外未修改任何运行时代码。

## 有效命令

```log
rg --files apps/api/server apps/admin/server apps/app/server

rg -n '@neondatabase/serverless|drizzle-orm/neon-http|drizzle\(|neon\(|useDb\(|getDb\(|context\.db|event\.context\.db' apps/api/server

rg -n 'const\s+db\s*=|let\s+db\s*=|var\s+db\s*=|export\s+const\s+db|export\s+let\s+db|new\s+Pool\(|Pool\(|postgres\(|createClient\(|DATABASE_URL|POSTGRES_URL|NITRO_DATABASE_URL|comm_admin_11__DATABASE_URL' apps/api/server

rg -n 'create.*Repository\(\{ db|type .*RepositoryDependencies|db:' apps/api/server/modules

rg -n '@neondatabase/serverless|drizzle-orm/neon-http|drizzle\(|neon\(|useDb\(|getDb\(|DATABASE_URL|POSTGRES_URL' apps/app/server

rg -n '@neondatabase/serverless|drizzle-orm/neon-http|drizzle\(|neon\(|useDb\(|getDb\(' apps/admin/server

rg --files apps/api/server | Measure-Object | Select-Object -ExpandProperty Count
rg --files apps/admin/server | Measure-Object | Select-Object -ExpandProperty Count
rg --files apps/app/server | Measure-Object | Select-Object -ExpandProperty Count
```

一次无效命令记录如下。该命令因 PowerShell 引号转义导致 `rg` 把正则片段误判为路径，结论不采用；后续已用上方有效命令重跑。

```log
rg -n "useDb\(|from [\"'].*server/db|from [\"'].*db[\"']|@neondatabase/serverless|drizzle-orm/neon-http|drizzle\(|neon\(" apps/api/server
```

## 结论

- `apps/api/server` 未发现业务模块顶层直接创建 Neon/Drizzle 连接的真实违规。
- `apps/api/server/db/index.ts` 是独立 API server 当前唯一 Neon/Drizzle 连接创建点；连接创建发生在 `useDb(event)` 函数调用期间，并写入 `event.context.db`，不属于模块顶层创建连接。
- `apps/api/server` 的业务 runtime 通过 `useDb(event)` 获取数据库实例，再以 `{ db: useDb(event) }` 依赖注入到 repository；repository 文件只接收 `DbType` 并执行查询，没有自行读取连接串或创建连接。
- `apps/api/server/shared/runtime/env.ts` 只解析连接串来源；未创建 Neon client 或 Drizzle database。
- `apps/app/server` 未命中 Neon/Drizzle/useDb/getDb/数据库连接串相关模式，可归类为 legacy app source-side 对照中的非 DB 连接创建侧。
- `apps/admin/server` 存在历史 DB helper 与大量 `useDb(event)` 使用。它是 legacy/source-side 对照范围，不按本次 task 116 的 `apps/api/server` 主审计结论升级为独立 API server 违规；但其中历史 helper 仍是后续旧服务冻结和退役评审的风险来源。

## 文件级证据

### apps/api/server/db/index.ts

- 第 1-2 行导入 `neon` 与 `drizzle`。
- 第 10 行导出 `useDb(event: H3Event)`。
- 第 13-15 行优先返回 `context.db`。
- 第 17 行通过 `resolveDatabaseUrlFromSources(event)` 获取连接串。
- 第 24-25 行在函数内部执行 `drizzle(neon(url), { schema })` 并写入 `context.db`。

判定：合规。连接创建绑定到 Nitro request event，并缓存到 `event.context`；没有在模块顶层立即创建连接。

### apps/api/server/shared/runtime/env.ts

- 第 35-40 行定义数据库 URL 候选 key。
- 第 54-66 行 `resolveDatabaseUrlFromSources(event, runtimeConfig)` 从 Cloudflare runtime env、`process.env`、Nitro runtimeConfig 解析 URL。

判定：合规。该文件只解析配置，不创建 Neon/Drizzle 连接。

### apps/api/server/routes/\_\_nitro/ready.get.ts

- 第 2 行从 `../../db` 导入 `hasDatabaseUrl` 与 `useDb`。
- 第 31 行仅在 `RUN_PHASE7_DB_READINESS_CHECK=1` 时调用 `probeDatabaseReadiness(useDb(event))`。

判定：合规。ready route 从既有 DB helper 获取连接，没有自行创建连接。

### apps/api/server/modules/\*/runtime.ts

扫描命中：

```log
apps/api/server/modules/community/runtime.ts:25
apps/api/server/modules/contract/runtime.ts:25
apps/api/server/modules/dev/runtime.ts:25
apps/api/server/modules/floor/runtime.ts:25
apps/api/server/modules/house/runtime.ts:25
apps/api/server/modules/operation/runtime.ts:25
apps/api/server/modules/parking/runtime.ts:25
apps/api/server/modules/patrol/runtime.ts:25
apps/api/server/modules/setting/runtime.ts:25
apps/api/server/modules/fee/runtime.ts:27
apps/api/server/modules/repair/runtime.ts:27
```

这些文件均使用 `createXRepository({ db: useDb(event) })` 形态。典型例子：`apps/api/server/modules/fee/runtime.ts` 第 27 行。

判定：合规。runtime 从 `useDb(event)` 获取 DB，并缓存模块 runtime 到 request context；未自行创建 Neon/Drizzle 连接。

### apps/api/server/modules/\*/repository.ts

扫描命中 `createDbXRepository(db: DbType)`：

```log
community/repository.ts:58
contract/repository.ts:75
dev/repository.ts:68
floor/repository.ts:19
house/repository.ts:64
operation/repository.ts:85
parking/repository.ts:29
patrol/repository.ts:41
repair/repository.ts:42
setting/repository.ts:98
fee/repository.ts:319
```

判定：合规。repository 接收注入的 `DbType`，没有自行导入 `@neondatabase/serverless`、调用 `neon()`、调用 `drizzle()` 或读取连接串。

### apps/admin/server/db/index.ts（legacy/source-side 对照）

- 第 1-2 行导入 `neon` 与 `drizzle`。
- 第 10-11 行存在模块级 `_db` 缓存与 `_envLoaded` 状态。
- 第 42 行 `getDb()` 用于 seed/Node 环境，首次调用后缓存 `_db`。
- 第 67 行导出 deprecated `db` 常量，当前值为 `null`。
- 第 193 行 `useDb(event)` 从 event 解析连接串。
- 第 224-225 行在 `useDb(event)` 内创建 Neon/Drizzle 实例并写入 `event.context.db`。

判定：legacy/source-side 风险记录。`useDb(event)` 路径符合 request event 作用域；`getDb()` 和模块级 `_db` 是旧服务历史 helper，用于旧 admin server/seed 场景，不应复制到 `apps/api/server` 的业务模块或新 helper 中。

### apps/admin/server/api 与 services（legacy/source-side 对照）

扫描到大量 `const db = useDb(event)`、`await useDb(event)` 和 `createDbUploadRepository(useDb(event))` 使用。

判定：legacy/source-side 对照。旧 admin API 当前主要通过既有 DB helper 获取连接；这些文件不在本次写入或修复范围内。

### apps/app/server（legacy/source-side 对照）

对 `@neondatabase/serverless`、`drizzle-orm/neon-http`、`drizzle(`、`neon(`、`useDb(`、`getDb(`、`DATABASE_URL`、`POSTGRES_URL` 的扫描无命中。

判定：未发现 app legacy server 直接创建 Neon/Drizzle 连接。

## 误报/历史风险

- `apps/api/server/db/index.ts` 中 `const db = drizzle(neon(url), { schema })` 会被简单正则命中为连接创建，但它位于 `useDb(event)` 函数内部，并立即写入 `context.db`；按 task 116 规则不是违规。
- `apps/api/server/shared/runtime/env.ts` 中的 `DATABASE_URL`、`POSTGRES_URL`、`NITRO_DATABASE_URL` 命中只是配置解析，不代表连接创建。
- `apps/api/server/routes/__nitro/ready.get.ts` 的 `probeDatabaseReadiness(useDb(event))` 是 readiness 探针调用既有 helper，不是 route 顶层创建 DB。
- `apps/api/server/modules/*/runtime.ts` 中的顶层 `fallbackRuntime` 是 in-memory fallback runtime，不是 Neon/Drizzle 连接，也不能作为 DB-backed 完成证据。
- `apps/admin/server/db/index.ts` 的模块级 `_db` 是 legacy admin helper 历史风险。它不应作为 `apps/api/server` 新实现模板；后续旧服务退役前仍需单独处理。
- `apps/admin/server/utils/handle-db-error.ts` 导入 `NeonDbError` 只用于错误类型处理，不创建连接。
- `apps/admin/server/types.d.ts`、`apps/admin/server/db/seed/helpers.ts` 命中 `NeonHttpDatabase` 只属于类型引用，不创建连接。
- `apps/app/server` 无 DB 连接命中，不代表 app legacy endpoint 已完成迁移或退役；这里只能说明本次 DB 连接作用域扫描未发现连接创建风险。

## 后续约束

- `apps/api/server` 新增 DB-backed 能力时，只允许从 `useDb(event)` 或同等 request-scoped DB helper 获取连接。
- 禁止在 `apps/api/server/modules/**`、`apps/api/server/routes/**`、`apps/api/server/handlers/**`、`apps/api/server/shared/**` 的模块顶层直接调用 `neon()`、`drizzle()`、`new Pool()`、`postgres()` 或 `createClient()`。
- repository 只能接收注入的 `DbType` 或抽象 adapter；不得读取 `process.env.*DATABASE*` 或 Nitro runtimeConfig 来创建连接。
- readiness、health、diagnostic route 如需访问 DB，也必须通过 `useDb(event)` 获取，并明确区分 `READY_CONFIGURED` 与真实 `DB_READY`。
- 不得把 `apps/admin/server/db/index.ts` 的 legacy `_db`/`getDb()` 模块级缓存模式复制到独立 `apps/api/server`。
- 后续每个切片合并前建议复跑本审计中的 `rg` 命令，若出现新增连接创建命中，必须先分类为合规 helper、误报、legacy 对照或真实违规；真实违规只记录并进入对应修复任务，不在审计 worker 中直接改代码。
