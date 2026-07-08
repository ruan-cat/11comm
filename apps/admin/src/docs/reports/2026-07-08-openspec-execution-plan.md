# OpenSpec 执行计划：migrate-superpowers-docs-to-openspec-longtask

**日期**：2026-07-08  
**范围**：`D:\code\ruan-cat\01s-11comm\openspec\changes\migrate-superpowers-docs-to-openspec-longtask`  
**任务源**：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`（唯一 canonical 任务源）  
**说明**：本计划只读 OpenSpec 工件并输出执行计划，不修改任何代码。

---

## 1. 背景与目标

本 change 已从「Superpowers 文档迁移到 OpenSpec」扩展为「旧内置 Nitro 退役执行增补阶段」。核心目标仍然是：

- 把 `apps/admin/server` 的旧 admin Nitro API 职责与 `apps/app/server` / `D:\code\ruan-cat\01s-11comm-app` 的 app legacy/mock Nitro API 职责合并到独立 `apps/api`；
- 在统一 `apps/api` runtime、调用端、DB_READY、写入/R2 回滚、shadow-off/fallback 和生产证据全部闭环后，才允许删除 `apps/admin/server` 与 `apps/app/server`；
- `D:\code\ruan-cat\01s-11comm-app` 永久只读保留，不删除。

设计依据：`design.md` §2026-06-05 Retirement Execution Extension 明确，目录级状态机高于 endpoint 数量统计，必须完成 §7A-7E 所有门禁后才可删除旧目录。

---

## 2. 已读工件

- `proposal.md` 全文
- `design.md` 全文
- `tasks.md` 关键章节（§7A-§7E）全文
- 全部 12 份 `specs/**/spec.md`：
  - `admin-api-cutover`
  - `admin-special-cases`
  - `agent-team-batch-execution`
  - `app-legacy-cutover`
  - `browser-and-environment-verification`
  - `db-readiness-and-write-verification`
  - `legacy-superpowers-content-transcription`
  - `phase7-evidence-model`
  - `retirement-gate-and-archive`
  - `source-history-and-memory-governance`
  - `unified-nitro-api-consolidation`
  - `vitest-and-runtime-verification`

---

## 3. 未完成任务统计

`tasks.md` 中共有 **27 个** 未完成任务（`[ ]` checkbox），全部位于 §7A-§7E（旧内置 Nitro 退役执行阶段）。

---

## 4. 未完成任务清单（按章节/能力分组）

### §7A Admin 内置 Nitro 删除阻断清理（2 个）

| 编号 | 标题 | 简要描述 | 验证命令 | 依赖/风险 |
|------|------|----------|----------|-----------|
| **task1132** | `[dry-run] apps/admin/server` | 在隔离 worktree 或临时 rename 中将目录改名为 `server.__retirement_dryrun__`，运行 admin 引用扫描、typecheck、build 和关键页面/API base URL 测试。 | 1. `git worktree add` 或临时 rename 目录；<br>2. `rg -n "apps/admin/server\|apps\\admin\\server\|server/db\|server/utils\|server/services\|db:legacy\|nitro:" apps/admin/package.json apps/admin/src apps/api tests scripts --glob "!**/docs/**"`；<br>3. `pnpm -F @01s-11comm/admin typecheck`；<br>4. `pnpm -F @01s-11comm/admin build:prod`；<br>5. 关键页面/API base URL 测试。 | 依赖 §7A 已关闭的审计/清理任务（ Nitro 插件、package scripts、旧配置文件、seed 入口等）。风险：引用扫描仍会命中 `apps/api` 自身脚本、生成器 legacy 注释或测试 helper，需人工分类，避免误判。 |
| **task1133** | `[候选] apps/admin/server/**` | 只有 route parity、DB/seed/R2、Nitro config、脚本、docs/generator、引用扫描、dry-run、页面 Network 和回滚证据都通过后，才能把目录状态升级为 `delete-candidate`。 | 1. 确认 `retirement-evidence-matrix.md` 中 `apps/admin/server` 各文件组均满足 `directoryPath`、`currentDependency`、`targetReplacement`、`configScriptEvidence`、`testBuildEvidence`、`runtimeEvidence`、`fallbackOrShadowEvidence`、`dbR2SeedEvidence`、`dryRunEvidence`、`rollbackNote`、`retirementDecision`；<br>2. 独立复核子代理结论。 | 依赖 task1132 通过；依赖 §7C 的 DB/R2 readiness 与 §7D 的 admin production Network。风险：155/155 old path exact coverage 或 resolver 完成不能单独升级为 delete-candidate。 |

### §7B App 内置 Nitro 删除阻断清理（2 个）

| 编号 | 标题 | 简要描述 | 验证命令 | 依赖/风险 |
|------|------|----------|----------|-----------|
| **task1172** | `[dry-run] apps/app/server` | 在隔离 worktree 或临时 rename 中将目录改名为 `server.__retirement_dryrun__`，运行 app 引用扫描、runtime-base-url 测试、typecheck、build 和 H5 API base 验证。 | 1. 隔离 worktree 或临时 rename；<br>2. `rg -n "server/modules\|server/shared/runtime\|apps/app/server\|legacy-dispatch\|build:nitro\|dev:nitro\|preview:nitro" apps/app apps/api`；<br>3. `pnpm -F @01s-11comm/app exec vitest run src/tests/runtime-base/runtime-base-url.test.ts`；<br>4. `pnpm -F @01s-11comm/app typecheck`；<br>5. `pnpm -F @01s-11comm/app run build:h5:prod`。 | 依赖 §7B 已关闭的 mock/test 迁移、Nitro 命令清理、CI 改造。风险：2026-07-08 已完成 `apps/app/server` 目录删除，但本任务仍需 dry-run 证据与正式 delete-candidate 升级；`apps/app/src/api/mock` 的本地 fixture 和 `apps/api` 的 exact handler 替代需与 §7C 同步。 |
| **task1173** | `[候选] apps/app/server/**` | 只有 mock/test/runtime/fallback/Nitro build 引用清零、fallback-only endpoint 全部处理、dry-run 通过且回滚路径明确后，才能把目录状态升级为 `delete-candidate`。 | 1. 确认 `retirement-evidence-matrix.md` 中 `apps/app/server` 各文件组证据字段完整；<br>2. 确认 `old-service-retirement-candidates.md` 与 `app-retirement-ledger.md` 中 fallback-only 已清零或已显式标记为 guarded/blocked/not-candidate；<br>3. 独立复核子代理结论。 | 依赖 task1172 通过；强依赖 §7C 的 fallback-only 收口（task1200/task1201）。风险：app 删除门禁高于 admin；admin 完成不能推导 app 完成。 |

### §7C `apps/api` 承接增强与 fallback-only 收口（7 个）

| 编号 | 标题 | 简要描述 | 验证命令 | 依赖/风险 |
|------|------|----------|----------|-----------|
| **task1200** | `[新增] apps/api/server/modules/{...}/**` | 按小批次补齐 activity、coupon、fee、inspection、item-release、maintenance、meter、oa-workflow、parking、profile、property-application、purchase、renovation、repair、resource、staff、visit、work-order 等 app fallback-only exact handlers；每批只处理 2-3 个 endpoint 或一个小模块。 | 1. 每批先跑 TDD 红灯：`pnpm -F @01s-11comm/api exec vitest run tests/legacy/<module>-legacy-endpoints.test.ts tests/runtime/app-legacy-gap-registry.test.ts tests/runtime/endpoint-registry.test.ts tests/runtime/legacy-dispatch-fallback-drill.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/app-legacy-module-layering.test.ts tests/infra/phase7-api-contracts.test.ts`；<br>2. 实现后复跑同一组；<br>3. `pnpm -F @01s-11comm/api run typecheck`；<br>4. 更新 `old-service-retirement-candidates.md` / `app-retirement-ledger.md` / `retirement-evidence-matrix.md`。 | 依赖 §7B mock/test 迁出（避免旧 app server 仍被测试库化依赖）。风险：单批不可处理过多模块；高风险写入口必须保持 guarded，不能伪造 DB-backed。 |
| **task1201** | `[修改] apps/api/server/shared/runtime/runtime-endpoints.ts` | 注册新增 exact handlers，并把 former fallback-only 的状态收敛为 exact、blocked、guarded 或 not-candidate，不得继续模糊标记完成。 | 1. 运行 `apps/api/tests/runtime/endpoint-registry.test.ts` 与 `tests/infra/endpoint-manifest.test.ts`；<br>2. 确认 `runtime-endpoints.ts` 中每个 legacy path 的 `cutoverStatus`、`dataSourceStatus`、`phase` 字段明确；<br>3. `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`。 | 依赖 task1200 的每批新增；需与 `app-legacy-gap-registry.test.ts` 保持同步。风险：manifest 条目与 module 文件不同步会导致格式自检失败。 |
| **task1204** | `[迁移] deterministic seed legacy adapters` | 对 room、unit、owner、contact、complaint、notice、profile、video 等 `deterministic-compat-seed-no-db-ready` 模块分批改为 DB-backed repository，或明确保留为 not-candidate。 | 1. 按模块识别当前 deterministic compat seed 的字段缺口；<br>2. 若要 DB-backed，则使用 `apps/type/src/business/**/schema.ts` 的 Drizzle table 从 `apps/api` 实现 repository/service；<br>3. 运行对应模块的 Vitest、typecheck；<br>4. 若保留 not-candidate，必须在 `agent-findings.md` 记录原因。 | 依赖 `apps/type` schema 事实源确认。风险：不可直接复制 schema 到 `apps/api`；B 方案要求 schema ownership 留在 `apps/type`。 |
| **task1205** | `[扩展] apps/api/server/db/readiness` | 覆盖 contract upload 表、关键 app legacy 表、seed sentinel、R2 env 可用性，并区分 `READY_CONFIGURED` 与 `DB_READY` 删除门禁。 | 1. `pnpm -F @01s-11comm/api exec vitest run tests/infra/health-ready.test.ts`；<br>2. 检查 `apps/api/server/db/readiness.ts` 中 required tables 包含关键 app legacy 表；<br>3. 检查 `apps/api/server/shared/runtime/r2-env.ts` 探针。 | 依赖 task1204 的表梳理。风险：readiness 只证明 DB 连接和表存在，不能替代业务 endpoint 证据。 |
| **task1206** | `[验证] RUN_PHASE7_DB_READINESS_CHECK=1` | 本地和生产 `GET /__nitro/ready` 必须在删除门禁前返回 `DB_READY`；只返回 `READY_CONFIGURED` 不得升级目录状态。 | 1. 本地：`RUN_PHASE7_DB_READINESS_CHECK=1 pnpm -F @01s-11comm/api run dev` 后访问 `GET http://localhost:<port>/__nitro/ready`；<br>2. 生产：确认 Vercel `apps/api` 环境变量后，Chrome MCP 或 curl 访问 `https://<api-homepage>/__nitro/ready`；<br>3. 记录 ready code、脱敏 host、required tables、migration count。 | 依赖 task1205。风险：必须用公开 HTTP 路径验证；不能凭本机 `.env` 或配置截图代替生产 runtime 证据。 |
| **task1207** | `[验证] R2/upload 真实环境 drill` | 通过 `apps/api` 执行 live R2 `init/status/sign-part/browser PUT/complete/status/cleanup/residual`，记录脱敏证据。 | 1. 运行 `pnpm -F @01s-11comm/api exec vitest run tests/admin/contract-upload-r2-blocked.test.ts`；<br>2. 在生产或受控 Vercel runtime 执行完整 multipart 链路：init → status → sign-part → 浏览器 PUT → complete → status → cleanup → residual HEAD；<br>3. 保存到 `.tmp/phase7-dev-browser/**`，不保存 signed URL、object key、ETag 或 secret。 | 依赖 task1205 readiness 覆盖 R2 env；依赖 task1206 的 DB_READY。风险：server-side drill 不能替代浏览器 CORS 与 shared-upload 页面闭环；cleanup/residual 失败时必须停止新增 R2 写入。 |
| **task1208** | `[验证] apps/api 包级测试` | 至少运行 `pnpm -F @01s-11comm/api test:infra`、指定 legacy/admin 测试、typecheck、`build:node`。 | 1. `pnpm -F @01s-11comm/api test:infra`；<br>2. `pnpm -F @01s-11comm/api exec vitest run tests/runtime tests/legacy tests/admin/contract-upload-r2-blocked.test.ts tests/admin/contract-change-draft-crud.test.ts`；<br>3. `pnpm -F @01s-11comm/api typecheck`；<br>4. `pnpm -F @01s-11comm/api build:node`。 | 依赖 task1200/task1201/task1205 的实现。风险：包级测试通过不能替代生产 Network、DB_READY 或退役门禁。 |

### §7D 双前端 standalone 切流与生产证据（7 个）

| 编号 | 标题 | 简要描述 | 验证命令 | 依赖/风险 |
|------|------|----------|----------|-----------|
| **task1301** | `[核对] apps/admin/package.json、apps/app/package.json` | 重新读取 `homepage` 作为生产地址权威来源，不得从旧报告或控制台截图推断。 | 1. `cat apps/admin/package.json | grep homepage`（或 jq）；<br>2. `cat apps/app/package.json | grep homepage`；<br>3. `cat apps/api/package.json | grep homepage`；<br>4. 记录当前生产入口到 `agent-progress.md`。 | 无前置依赖，是 §7D 首任务。风险：homepage 可能随 Vercel 配置变化，每次执行前必须重新读取。 |
| **task1302** | `[配置] apps/admin/.env.production 或 Vercel env` | 明确 admin standalone apps/api 模式，避免依赖同域 `/api/**` 或 admin 内置 Nitro。 | 1. 检查 `apps/admin/.env.production`、Vercel project env 或等效配置；<br>2. 确认 `VITE_11COMM_API_*` 或 resolver 指向生产 `apps/api` homepage；<br>3. 运行 `pnpm -F @01s-11comm/admin exec vitest run src/utils/http/tests/api-base-url.test.ts` 或等价 resolver 测试。 | 依赖 task1301。风险：admin 仍需 `/api-shadow` 本地 dev 路径，需区分 local 与 production 配置。 |
| **task1303** | `[配置] apps/app/.env.production 或 Vercel env` | 明确 app production shadow-disabled 时仍指向 `https://01s-11-server.ruan-cat.com` 或当前 `apps/api` homepage。 | 1. 检查 `apps/app/.env.production`、Vercel project env；<br>2. 确认 shadow-disabled 时 API base URL 指向生产 `apps/api`；<br>3. 运行 `pnpm -F @01s-11comm/app exec vitest run src/tests/runtime-base/runtime-base-url.test.ts`。 | 依赖 task1301。风险：旧配置可能仍指向旧 app server 或本地 fallback。 |
| **task1304** | `[验证] admin production Network` | 在生产 admin H5 采集关键 list/detail/CUD/upload 请求，确认 control plane 全部命中 `apps/api`，不命中内置 admin Nitro。 | 1. Chrome DevTools MCP 打开 admin 生产 homepage；<br>2. 进入关键业务页面，触发 list/detail/CUD/upload 请求；<br>3. 记录 Network request URL、status、是否命中 `apps/api`、是否仍走 `/api-shadow` 或同域 `/api/**`；<br>4. 保存到 `.tmp/phase7-dev-browser/**`。 | 依赖 task1302、task1206（DB_READY）、task1207（R2 drill）。风险：admin 不能只用 resolver Vitest 代替页面/HTTP 证据；CUD/upload 需与 §2/§4 特殊端点同步。 |
| **task1305** | `[验证] app production Network` | 在生产 app H5 采集代表性 `/app/**`、`/callComponent/**` 请求，确认 exact/guard/blocked 行为由 `apps/api` 承接，不依赖旧 app fallback。 | 1. Chrome DevTools MCP 打开 app 生产 homepage；<br>2. 触发代表性 `/app/**`、`/callComponent/**` 请求；<br>3. 记录请求目标、legacy envelope、是否命中 `apps/api`、fallback 状态；<br>4. 保存到 `.tmp/phase7-dev-browser/**`。 | 依赖 task1303、task1200/task1201（fallback-only 收口）、task1206。风险：app 生产 evidence 不能从 admin 完成推导。 |
| **task1306** | `[验证] shadow-off drill` | admin 与 app 分别关闭 shadow 或 fallback 后，目标 endpoint 仍命中 `apps/api`；admin 不能只用 resolver Vitest 代替页面/HTTP 证据。 | 1. 本地或受控环境关闭 `VITE_11COMM_API_SHADOW_ENABLE` / `PHASE7_LEGACY_APP_FALLBACK_ENABLED`；<br>2. Chrome MCP 或 HTTP 请求复验目标 endpoint；<br>3. 确认 `apps/api` exact handler 返回，不触发旧 admin/app fallback。 | 依赖 task1304/task1305。风险：fallback 关闭后未收口路径会 404，需先完成 task1200/task1201。 |
| **task1307** | `[记录] .tmp/phase7-dev-browser/**、agent-progress.md、agent-findings.md` | 保存脱敏 production evidence、requestId、状态码、响应摘要和 residual check，不保存 token、cookie、signed URL、object key、secret。 | 1. 每次 §7D 验证后记录到 `.tmp/phase7-dev-browser/` 和 `agent-progress.md`；<br>2. 在 `agent-findings.md` 记录任何失败、缺口或环境限制；<br>3. 检查无敏感信息泄露。 | 贯穿 §7D 所有任务。风险：误存 signed URL、cookie、token 会造成安全风险。 |

### §7E 删除执行门禁与最终收尾（9 个）

| 编号 | 标题 | 简要描述 | 验证命令 | 依赖/风险 |
|------|------|----------|----------|-----------|
| **task1311** | `[dry-run] 隔离 worktree` | 建立独立 worktree 或临时 branch，分别 rename `apps/admin/server` 与 `apps/app/server`，跑 admin/app/api 引用扫描、typecheck、Vitest、build、OpenSpec strict 和 `git diff --check`。 | 1. `git worktree add ../01s-11comm-retirement-dryrun` 或临时 branch；<br>2. `mv apps/admin/server apps/admin/server.__retirement_dryrun__` 与 `mv apps/app/server apps/app/server.__retirement_dryrun__`；<br>3. `rg -n "apps/admin/server\|apps/app/server\|server/modules\|server/shared/runtime" apps/admin apps/app apps/api tests scripts --glob "!**/docs/**"`；<br>4. `pnpm -F @01s-11comm/admin typecheck && pnpm -F @01s-11comm/admin build:prod`；<br>5. `pnpm -F @01s-11comm/app typecheck && pnpm -F @01s-11comm/app run build:h5:prod`；<br>6. `pnpm -F @01s-11comm/api run typecheck && pnpm -F @01s-11comm/api build:node`；<br>7. `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`；<br>8. `git diff --check`。 | 依赖 §7A-§7D 全部完成（尤其是 task1133/1173 的 delete-candidate 状态）。风险：任何失败必须恢复目录名并回退状态为 blocked。 |
| **task1312** | `[回滚] dry-run 回滚演练` | 在 dry-run 后恢复目录名，确认无需 `git reset --hard` 即可回滚；记录命令、失败点和残留。 | 1. `mv apps/admin/server.__retirement_dryrun__ apps/admin/server`；<br>2. `mv apps/app/server.__retirement_dryrun__ apps/app/server`；<br>3. 重新跑上述 typecheck/build 验证无残留；<br>4. 记录回滚命令与结果。 | 依赖 task1311。风险：回滚失败或需要 `git reset --hard` 说明 dry-run 不可接受。 |
| **task1313** | `[复核] 检查复核子代理` | 复核 `retirement-evidence-matrix.md`、dry-run 结果、admin/app/api 验证命令和剩余引用；任何缺口必须回退到 7A-7D。 | 1. 独立复核子代理读取 `retirement-evidence-matrix.md`、`old-service-retirement-candidates.md`、`app-retirement-ledger.md`；<br>2. 复核 task1311/task1312 的命令输出；<br>3. 输出 PASS/FAIL 结论。 | 依赖 task1311/task1312。风险：复核发现越权状态升级时必须回退。 |
| **task1314** | `[删除] apps/admin/server/**` | 仅当 admin 目录状态为 `delete-candidate`、dry-run 和生产证据全部通过时执行；删除后立即运行 admin/app/api 扫描和构建测试。 | 1. 确认 `retirement-evidence-matrix.md` 中 admin 目录状态为 `delete-candidate`；<br>2. 执行 `rm -rf apps/admin/server`（或 `git rm -r`）；<br>3. 重新跑引用扫描、typecheck、build、OpenSpec strict。 | 依赖 task1133、task1311-1313。风险：删除后不可撤销，必须先在隔离环境中验证。 |
| **task1315** | `[删除] apps/app/server/**` | 仅当 app 目录状态为 `delete-candidate`、fallback-only 清零或 blocked 化、dry-run 和生产证据全部通过时执行；删除后立即运行 app/api 扫描和构建测试。 | 1. 确认 `retirement-evidence-matrix.md` 中 app 目录状态为 `delete-candidate`；<br>2. 确认 `fallbackOnly=0` 或全部已显式 blocked/guarded/not-candidate；<br>3. 执行删除；<br>4. 重新跑引用扫描、typecheck、build、OpenSpec strict。 | 依赖 task1173、task1311-1313。风险：app 是最高风险删除项，必须等 fallback-only 完全收口。 |
| **task1316** | `[保护] D:\code\ruan-cat\01s-11comm-app` | 再次确认旧 app 源目录只读永久保留，不纳入删除对象。 | 1. `ls D:\code\ruan-cat\01s-11comm-app` 确认存在；<br>2. 检查无任何脚本或命令尝试删除/移动该目录。 | 与 task1314/1315 同步执行。风险：误删旧 app 源目录会导致历史证据与回滚核对丢失。 |
| **task1317** | `[验证] 最终 OpenSpec 校验` | 运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`、`openspec instructions apply --change migrate-superpowers-docs-to-openspec-longtask --json`、限定 `git diff --check` 和必要包级测试。 | 1. `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`；<br>2. `openspec instructions apply --change migrate-superpowers-docs-to-openspec-longtask --json`；<br>3. `git diff --check`；<br>4. `pnpm -F @01s-11comm/api test:infra`；<br>5. 相关 admin/app/api 包级测试。 | 依赖 task1314/1315。风险：`isComplete=true` 或 `all_done` 不能替代证据矩阵；仍需检查 `tasks.md` 是否有残留 open checkbox。 |
| **task1318** | `[记录] 最终 readiness 报告` | 编写 `legacy-nitro-retirement-readiness-report.md`，说明是否已安全删除旧内置 Nitro、剩余风险、回滚路径和未关闭项。 | 1. 撰写 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/legacy-nitro-retirement-readiness-report.md` 或 `apps/admin/src/docs/reports/...`；<br>2. 包含删除范围、证据矩阵摘要、剩余风险、回滚命令、未关闭项。 | 依赖 task1314/1315/1317。风险：报告不是任务源，不能替代 `tasks.md` 和证据矩阵。 |
| **task1319** | `[记录] Memorix` | 记录本 longtask 从文档迁移扩展为旧内置 Nitro 退役执行的最终结果、提交范围和未推送状态。 | 1. 使用 `mcp__memorix__memorix_store` 或项目记忆工具记录；<br>2. 包含变更摘要、文件、验证命令、剩余风险、提交哈希。 | 收尾任务。风险：记录前需确保所有验证命令实际运行通过。 |

---

## 5. 任务依赖关系图

```text
§7A 已关闭审计/清理任务
  │
  ├─→ task1132 [dry-run] apps/admin/server
  │     └─→ task1133 [候选] apps/admin/server/**
  │
§7B 已关闭审计/清理任务
  │
  ├─→ task1172 [dry-run] apps/app/server
  │     └─→ task1173 [候选] apps/app/server/**
  │
§7C 承接增强
  │
  ├─→ task1200 补齐 exact handlers ──→ task1201 runtime-endpoints 状态收敛
  │     │
  │     ├─→ task1204 deterministic seed DB-backed 迁移/归类
  │     │
  │     ├─→ task1205 readiness 扩展 ──→ task1206 DB_READY 验证
  │     │
  │     ├─→ task1207 R2/upload 真实 drill
  │     │
  │     └─→ task1208 apps/api 包级测试
  │
§7D 生产证据
  │
  ├─→ task1301 核对 homepage ──→ task1302 admin env / task1303 app env
  │     │
  │     ├─→ task1304 admin production Network ──→ task1306 shadow-off drill
  │     │
  │     ├─→ task1305 app production Network ─────→ task1306 shadow-off drill
  │     │
  │     └─→ task1307 证据记录（贯穿）
  │
§7E 删除执行门禁
  │
  ├─→ task1311 隔离 worktree dry-run ──→ task1312 回滚演练
  │     │
  │     └─→ task1313 独立复核
  │           │
  │           ├─→ task1314 删除 apps/admin/server
  │           │
  │           ├─→ task1315 删除 apps/app/server
  │           │
  │           ├─→ task1316 保护旧 app 源目录
  │           │
  │           ├─→ task1317 最终 OpenSpec 校验
  │           │
  │           ├─→ task1318 最终 readiness 报告
  │           │
  │           └─→ task1319 Memorix 记录
```

关键路径：  
`task1200/task1201` → `task1206/task1207` → `task1304/task1305` → `task1306` → `task1311` → `task1313` → `task1314/task1315` → `task1317` → `task1318/task1319`

---

## 6. 建议并行分组

由于任务之间存在文件/状态依赖，建议按以下分组并行推进，组内串行、组间可并行：

### 分组 A：Admin 目录退役门禁（串行）
- task1132 → task1133
- 负责人：1 个主代理 + 1 个复核子代理
- 前提：§7A 已关闭任务已验证

### 分组 B：App 目录退役门禁（串行）
- task1172 → task1173
- 负责人：1 个主代理 + 1 个复核子代理
- 前提：§7B 已关闭任务已验证；task1200/task1201 已大幅收敛 fallback-only

### 分组 C：apps/api fallback-only 收口（可进一步拆小批次）
- task1200 拆分为多个小批次：每次 2-3 个 endpoint 或一个小模块；
- 每个小批次先 TDD 红灯，再实现，再运行 7 个 api 测试文件 + typecheck；
- task1201 随每个小批次同步更新；
- task1204 可并行于 task1200（按模块独立）；
- task1205 → task1206 可并行于 task1200（readiness 与 DB_READY）；
- task1207 需等 task1205 完成；
- task1208 是汇总验证，最后执行。
- 负责人：多个编辑子代理（按模块拆分）+ 1 个主代理整合 `runtime-endpoints.ts` 和台账

### 分组 D：生产环境配置与证据（串行）
- task1301 → task1302/task1303 → task1304/task1305 → task1306
- task1307 贯穿全程
- 负责人：1 个主代理（使用 Chrome DevTools MCP）

### 分组 E：最终删除与收尾（严格串行）
- task1311 → task1312 → task1313 → task1314/task1315 → task1317 → task1318 → task1319
- 负责人：主代理 + 独立复核子代理
- 任何一步失败即回退到分组 A/B/C/D

**并行安全边界**：
- 分组 C 的多个小批次必须按 disjoint module 拆分，避免同时修改同一 `runtime-endpoints.ts` 段；主代理负责合并。
- 分组 A/B 的 dry-run 不能与分组 C 的代码修改同时执行，避免状态不一致。
- 分组 D 的生产证据采集必须在分组 C 的 fallback 收口之后，否则 shadow-off 会暴露未处理路径。

---

## 7. 风险点与阻塞点

| 风险/阻塞 | 影响 | 缓解措施 |
|-----------|------|----------|
| **fallback-only 未清零即删除 app server** | 删除后未注册 `/app/**` 路径返回 404，生产 app H5 功能不可用 | 必须完成 task1200/task1201；`fallbackOnly` 必须为 0 或全部显式 blocked/guarded/not-candidate；task1173 不得提前升级。 |
| **DB_READY 被 `READY_CONFIGURED` 替代** | 误升目录状态，删除后生产 DB 查询失败 | 必须公开 HTTP `GET /__nitro/ready` 返回 `DB_READY`；task1206 必须本地和生产双验证。 |
| **R2/upload 浏览器 CORS 未闭环** | 上传组件在生产 admin H5 中失败 | task1207 必须覆盖浏览器 `OPTIONS`/`PUT`、complete、cleanup/residual；server-side drill 不能替代。 |
| **admin 155/155 或 resolver 完成被误用** | 误以为 admin server 可删 | task1133 必须检查目录级证据矩阵；`retirementDecision` 不能仅凭 old path coverage 升级。 |
| **app 完成从 admin 完成推导** | 误删 app server | admin 与 app 两条源流独立；task1173 必须单独验证。 |
| **dry-run 未在隔离环境执行** | 当前工作区直接删除导致不可恢复 | task1311 必须 worktree/临时 branch；task1312 必须演练回滚。 |
| **删除旧 app 源目录 `D:\code\ruan-cat\01s-11comm-app`** | 历史证据与回滚核对丢失 | task1316 显式保护；任何删除请求必须阻断。 |
| **子代理 429/超时中断** | 批次中间状态丢失，台账不一致 | 每小批次必须更新 `old-service-retirement-candidates.md`、`app-retirement-ledger.md`、`retirement-evidence-matrix.md`；主代理在子代理中断后重新 fresh scan。 |
| **敏感信息写入证据文件** | 泄露 signed URL、token、cookie、secret | task1307 和 task1207 必须脱敏；验证时扫描 `.tmp/phase7-dev-browser/**` 不含敏感字符串。 |
| **历史证据被当作当前证据** | 状态误升级 | 所有 2026-05 及以前证据必须标注为 dated snapshot；当前执行前必须 fresh scan。 |
| **格式自检（infra test）失败** | endpoint 未对齐 manifest/allowlist/contract/test | 每批次必须跑 `tests/infra/endpoint-manifest.test.ts`、`tests/infra/app-legacy-module-layering.test.ts`、`tests/infra/phase7-api-contracts.test.ts`。 |
| **CI/workflow 仍调用旧 Nitro 构建** | 删除后 CI 失败 | 删除前重新检查 `.github/workflows/app-ci.yml` 与 `apps/app/turbo.json`，确保无 `build:nitro:vercel`。 |

---

## 8. 下一步建议

1. **优先完成 §7C**：task1200 的剩余 fallback-only 收口是当前最大阻塞；建议按模块拆小批次，每批次遵循 TDD 红灯→实现→绿灯→更新台账→复核。  
2. **同步推进 §7A/§7B 的 dry-run**：在 §7C 大幅收敛后（fallback-only 显著降低），启动 task1132 和 task1172。  
3. **生产证据 §7D 放在 §7C 之后**：避免在 fallback 未收口时执行 shadow-off drill 导致大量 404。  
4. **最终删除 §7E 严格串行**：必须在隔离 dry-run、回滚演练、独立复核全部通过后才能执行。  
5. **持续更新 `agent-progress.md` 与 `agent-findings.md`**：每轮小批次结束后记录 checkpoint 与风险，并在修改状态后写入 Memorix。  

---

**计划文件路径**：`D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-openspec-execution-plan.md`  
**OpenSpec change**：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask`
