# Task 115：Nitro H3 导入与鉴权禁用审计记录

## 审计范围

- 审计任务：task 115。
- 审计目标：
  - H3 API 必须从 `nitro/h3` 导入。
  - 禁止从 `h3` 直接导入。
  - 禁止新增或保留 JWT、Token、Neon Auth、鉴权中间件等 Nitro 服务端鉴权逻辑。
- 扫描范围：
  - `apps/admin/server`
  - `apps/app/server`
  - `apps/api/server`
  - `apps/admin/package.json`
  - `apps/app/package.json`
  - `apps/api/package.json`
- 排除范围：
  - 未修改运行时代码。
  - 审计命令本身未修改 `tasks.md`、`agent-progress.md`、`agent-findings.md`；任务状态由主代理在审计完成后统一收敛。
  - `apps/admin/tests/**`、`apps/admin/mock/**`、`apps/admin/src/**` 的鉴权词命中只作为误报背景，不作为 Nitro 运行时违规证据。

## 执行命令

```log
Get-Location; git status --short
```

```log
rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!*lock*' "from ['\"]h3['\"]|from ['\"]nitro/h3['\"]" apps/admin/server apps/api/server
```

上述命令因 PowerShell 引号转义失败，报错为 `The string is missing the terminator: "`，未作为有效审计证据。

```log
rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!*lock*' --glob '!**/*.md' "JWT|jwt|Token|token|Neon Auth|@neondatabase/auth|auth|鉴权|middleware" apps/admin/server apps/api/server
```

```log
rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!*lock*' --glob '!**/*.md' '@neondatabase/auth|jsonwebtoken|jose|jwt-decode|Authorization|authorization|Bearer|bearer|verifyToken|verifyJwt|requireAuth|authMiddleware|defineMiddleware|server/middleware|middleware' apps/admin apps/api package.json pnpm-workspace.yaml
```

```log
Get-ChildItem -Recurse -File apps\admin\server\middleware,apps\admin\server\plugins,apps\api\server\middleware,apps\api\server\plugins -ErrorAction SilentlyContinue | Select-Object FullName
```

```log
rg -n 'nitro/h3' apps/admin/server apps/api/server
```

```log
rg -n 'from .h3.' apps/admin/server apps/api/server
```

```log
rg -n 'from .h3.' apps/admin/server apps/api/server; if ($LASTEXITCODE -eq 1) { 'NO_MATCH' }
```

```log
(rg -l 'nitro/h3' apps/admin/server apps/api/server | Measure-Object).Count
```

```log
(rg -l 'from .h3.' apps/admin/server apps/api/server | Measure-Object).Count
```

```log
rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!**/*.md' '@neondatabase/auth|jsonwebtoken|jose|jwt|JWT|Authorization|Bearer|defineMiddleware|authMiddleware|requireAuth|verifyJwt|verifyToken' apps/admin/server apps/api/server apps/admin/package.json apps/api/package.json
```

```log
Get-Content -LiteralPath 'apps\admin\server\middleware\1.logger.ts'
Get-Content -LiteralPath 'apps\api\server\middleware\cors.ts'
Get-Content -LiteralPath 'apps\api\server\middleware\request-context.ts'
```

主代理补充复核时扩展覆盖旧 app Nitro 服务端：

```log
rg -n 'from "h3"' apps\admin\server apps\app\server apps\api\server
```

```log
rg -n "from 'h3'" apps\admin\server apps\app\server apps\api\server
```

```log
rg -n 'import\(' apps\admin\server apps\app\server apps\api\server | Select-Object -First 40
```

```log
(rg -l 'nitro/h3' apps\admin\server apps\app\server apps\api\server | Measure-Object).Count
```

```log
(rg -l 'from .h3.' apps\admin\server apps\app\server apps\api\server | Measure-Object).Count
```

```log
rg -n '@neondatabase/auth|jsonwebtoken|jose|jwt|JWT|Authorization|Bearer|defineMiddleware|authMiddleware|requireAuth|verifyJwt|verifyToken' apps\admin\server apps\app\server apps\api\server apps\admin\package.json apps\app\package.json apps\api\package.json
```

## 结论

- 未发现直接从 `h3` 导入的 Nitro 服务端代码。`apps/admin/server`、`apps/app/server`、`apps/api/server` 的 `from "h3"` 与 `from 'h3'` 扫描均无命中，`rg -l 'from .h3.'` 文件计数为 `0`。
- 服务端目录中 `nitro/h3` 命中文件数为 `350`，H3 相关导入整体遵循 `nitro/h3` 约束。
- 动态 `import(` 命中只包含 `@dotenvx/dotenvx`、`dotenv`、`cloudflare:workers`、`modules/fee/runtime` 与测试文件内的相对模块加载，未发现动态 `import("h3")` 或 `import('h3')`。
- 未发现 `@neondatabase/auth`、`jsonwebtoken`、`jwt` 校验函数、`Authorization`/`Bearer` 解析、`authMiddleware`、`requireAuth`、`verifyJwt`、`verifyToken` 等 Nitro 运行时鉴权逻辑。
- 实际存在的 Nitro 运行时中间件为：
  - `apps/admin/server/middleware/1.logger.ts`：请求日志与 requestId 注入，非鉴权。
  - `apps/api/server/middleware/cors.ts`：CORS 与标准响应头处理，非鉴权。
  - `apps/api/server/middleware/request-context.ts`：请求上下文初始化，非鉴权。
  - `apps/app/server` 当前未发现鉴权 middleware/plugin 命中。
- **未发现真实违规。**

## 误报分类

- `apps/admin/server/utils/sensitive-data.ts` 中 `maskToken(token)` 属于敏感数据脱敏工具，未解析请求头、未校验 Token、未参与鉴权链路，归类为误报。
- `apps/admin/package.json` 中存在 `jose` 依赖，但本次在 `apps/admin/server` 与 `apps/api/server` 运行时代码中未发现 `jose` 导入或 JWT 校验调用；按 task 115 范围归类为历史依赖/非运行时证据，需后续清理时另行评估。
- `apps/app/package.json` 与 `apps/api/package.json` 未发现 JWT、Neon Auth 或鉴权库依赖；`@neondatabase/serverless` 是数据库驱动，不是 Neon Auth。
- `apps/admin/tests/nitro/**` 下的 `jose`、`Authorization`、`Bearer`、`authMiddleware` 命中属于历史测试代码，不在本次 Nitro 运行时扫描范围内，归类为测试遗留误报。
- `apps/admin/mock/**`、`apps/admin/src/**` 中的 `Authorization`、`Bearer` 命中属于前端/mock 行为，不构成 Nitro 服务端鉴权中间件。
- `defineMiddleware` 命中 `apps/admin/server/middleware/1.logger.ts`，人工复核后确认是日志中间件，不是鉴权中间件。

## 后续约束

- 新增或修改 Nitro 服务端 API、middleware、plugin、shared runtime 时，所有 H3 函数和类型必须从 `nitro/h3` 导入，禁止直接从 `h3` 导入。
- 不得在 `apps/admin/server`、`apps/app/server` 或 `apps/api/server` 中新增 JWT、Token、Bearer、Neon Auth、`@neondatabase/auth`、`jose`、`jsonwebtoken`、`authMiddleware`、`requireAuth`、`verifyJwt`、`verifyToken` 等鉴权实现。
- 如确需处理请求头，只能用于日志、CORS、requestId、非鉴权上下文等公开接口基础设施；不得据此拒绝请求或建立身份态。
- 后续审计建议继续使用两类命令组合：
  - `rg -n 'nitro/h3|from .h3.' apps/admin/server apps/app/server apps/api/server`
  - `rg -n --glob '!**/*.md' '@neondatabase/auth|jsonwebtoken|jose|jwt|JWT|Authorization|Bearer|authMiddleware|requireAuth|verifyJwt|verifyToken' apps/admin/server apps/app/server apps/api/server apps/admin/package.json apps/app/package.json apps/api/package.json`
