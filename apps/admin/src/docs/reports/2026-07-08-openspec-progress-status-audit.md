# 2026-07-08 OpenSpec 长期任务状态审计报告

## 1. 审计来源

本次审计基于以下只读证据文件：

- `D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-progress.md`
- `D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-findings.md`
- `D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/retirement-evidence-matrix.md`
- `D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/app-retirement-ledger.md`
- `D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/admin-retirement-ledger.md`
- `D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/legacy-nitro-retirement-execution-plan.md`

## 2. 当前阶段

- `migrate-superpowers-docs-to-openspec-longtask` 曾在 2026-06-05 前达到 `387/387 all_done`。
- 2026-06-05 用户指出 `apps/admin/server` 与 `apps/app/server` 仍承担实际运行时职责，主代理重新打开任务，在 `tasks.md` 新增 **§7 旧内置 Nitro 退役执行**，并新增 71 个未完成任务。
- 当前阶段：§7 的**受控退役执行阶段**，重点为补齐 `apps/api` 承接能力、调用端切流、shadow-off/fallback 验证、dry-run rename/delete 证据。
- 最近一次记录为 **2026-06-08**，之后距今一个月无新进展。

## 3. 已完成的关键里程碑

### 3.1 配置与生成器（§7A）

- 删除 `apps/admin/nitro.config.ts`、`apps/admin/drizzle.config.ts`、`apps/app/nitro.config.ts`。
- `apps/api` 已拥有独立 `drizzle.config.ts`、`db:*` 脚本和 `drizzle-kit` 工具链。
- `apps/admin` 的 DB/seed/Nitro/R2 文档、生成器全部指向 `apps/api`。
- 新增 `apps/api/tests/infra/legacy-nitro-config-retirement.test.ts` 固化门禁。

### 3.2 Admin 侧 7A 任务

- task407：admin upload hook 三态 URL resolver 证据。
- task408：`apps/api/tests/admin/contract-upload-r2-blocked.test.ts` 与 R2 CORS 相关 artifact 证据。
- task409：旧 `apps/admin/tests/nitro/**` 归类为历史对照，并从 `package.json` 移除 `@aws-sdk/client-s3`、`@neondatabase/serverless`、`drizzle-orm`、`nitro` 等直接服务端依赖。
- task410-412：admin 构建产物归口、admin typecheck/build 验证通过。
- **仍开放**：task413（dry-run）、task414（delete-candidate）。

### 3.3 App 侧 7B 任务

- task426：全部 28 个 `apps/app/src/api/mock/*.mock.ts` 文件移除对 `apps/app/server/modules/**` 和 `server/shared/runtime/mock-definition-adapter` 的导入，改为 app-local fixture。
- task428-429：业务 runtime 测试与 runtime helper 测试迁出或删除，新增 `apps/api/tests/runtime/app-legacy-gap-registry.test.ts` 等。
- task430：删除 `server-node-imports.test.ts`，新增 `apps/api/tests/infra/app-server-retirement-imports.test.ts`。
- task431-432：确认 `runtime-base-url.test.ts` 只保留前端 URL 解析；`apps/app/tsconfig.json` 移除 `server/**/*.ts` include。
- **仍开放**：task437-task439（fallback-only 收口）、task435-task436 等。

### 3.4 App 旧端点小批次收口（task438/task439）

已完成模块/批次包括：

- profile guarded exact
- property-application readonly exact
- visit guarded exact
- fee 充电桩/开门记录 readonly exact
- repair 多条 readonly exact
- work-order 七条写入口 guarded exact
- inspection 读/写入口 exact/guarded
- meter 读/写入口 exact/guarded
- activity 状态/CUD guarded exact
- item-release 多条 readonly exact + 审核 guarded
- coupon/integral 读/写入口
- maintenance 读/写入口
- parking 读/写入口
- resource 读/写入口（batch32/batch42）
- staff 读/写入口/样例详情（batch38-41）

### 3.5 验证

- `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 通过。
- `git diff --check` 通过。
- `pnpm -F @01s-11comm/api run typecheck` 通过。
- API 测试：58 文件 / 403 tests passed（另有 1 文件 / 25 tests skipped）。
- Admin 测试：66 文件 / 497 tests passed。
- App 测试：43 文件 / 235 tests passed。
- Root 测试：2 文件 / 5 tests passed。

## 4. 重要发现与风险

- 所有 task438/439 新增 endpoint 都是 **readonly exact** 或 **POST-only guarded exact**，写入口统一返回 `409 PHASE7_MUTATION_GUARDED`，**不执行真实 CUD**。
- 数据来源多为 deterministic compat seed，不是真实 DB 数据；`DB_READY` 状态仅在局部（如 contract）有实证。
- 主代理执行过程中多次遇到子代理 429/超时，关闭后由主代理接管完成，存在执行通道不稳定风险。
- 2026-06-05 后 `openspec instructions apply` 的 `all_done` 已被重新打开，当前任务状态以 `tasks.md` §7 为准。
- 代码层面 `apps/app` mock/test 对旧 server 的依赖已清理，但 `retirement-evidence-matrix.md` 仍标记 `app-mock`、`app-runtime-tests` 为 `blocked`，存在**文档与代码事实不一致**，需重新扫描更新。

## 5. 退役证据矩阵状态

- 矩阵中 **无 `delete-candidate` 行**。
- `apps/admin/server`：`blocked`（仍含 API、DB/seed、services、utils、middleware/plugins）。
- `apps/admin/server/api/**`：`keep-source`（路径 parity 已有，但生产 standalone 证据待补）。
- `apps/admin/server/db/**`：`blocked`（legacy seed/reset 仍是旧运维入口，destructive reset 风险）。
- `apps/admin/drizzle.config.ts`：`blocked`（仍引用旧 `server/utils/vercel-env`）。
- `apps/admin/build/plugins/index.ts` + `nitro.config.ts`：`blocked`（admin 仍把本包 server 接入构建）。
- `apps/admin/server/services/**`、`utils/**`（R2/upload）：`keep-source`。
- `scripts/generate-tasks.ts` 与活动 admin docs：`blocked`。
- `apps/app/server`：`blocked`。
- `apps/app/nitro.config.ts`、`vite.config.ts`：`blocked`。
- `apps/app/package.json`、`turbo.json`：脚本仍含 Nitro pipeline，`blocked`。
- `apps/app/src/api/mock/**` / `src/tests/nitro-runtime/**`：矩阵仍标 `blocked`，但代码层面已清理。
- `apps/app/server/modules/**`：`blocked`；最新保守全量扫描（resource batch32）显示 `fallbackOnly=70`。
- `apps/api/server/handlers/legacy-dispatch.ts` + `shared/runtime/legacy-fallback.ts`：`keep-source`。

## 6. Admin 与 App 退役清单

### 6.1 Admin 退役清单（`admin-retirement-ledger.md`）

- 160 条 admin canonical endpoint，全部 `retirementDecision=keep-source`，**无 delete-candidate**。
- 25 条特殊行覆盖：
  - R2 upload control plane（`init/sign-part/status/abort/complete`）：仅 `init/status/abort` 有生产 abort-only drill 证据，`complete` 与页面断点续传未实证。
  - manifest-missing 路由（`dev-team/cache-manage`、`dev-team/menu-manage`、`setting-manage/organize-manage/*` 等）：本地页面 Network 200，但 runtime manifest 仍缺失。
  - 诊断路由、placeholder 路由。
- 生产 DB 状态：均为 `READY_CONFIGURED-only`，不能写成 `DB_READY`。

### 6.2 App 退役清单（`app-retirement-ledger.md`）

- task306 21 行 baseline 全部 `keep-source` 或 `blocked`。
- task437 差集：
  - 旧 app：`rows=219`，`unique=214`。
  - API exact：`rows=142`，`unique=142`。
  - `exactOldSource=141`，`fallbackOnly=70`，`diagnostic=3`，`apiOnly=1`（`/app/purchase/updatePurchaseApply`）。
- task438/439 多批次后，各模块局部 remaining 已减少，但 **全局 `fallbackOnly` 自 resource batch32 后未再全量刷新**。
- 剩余重点缺口：
  - resource 写入口：`/app/collection/resourceOut`、`/app/purchase/resourceEnter`、`/app/resourceStore.allocationStoreEnter`、`/app/resourceStore.save*`、`/app/resourceStore.deleteAllocationStorehouse` 等。
  - staff 动态路由：`/app/staff/:staffId`。
  - oa-workflow、renovation、repair 等高数量 fallback-only 模块。

## 7. 退役执行计划当前进度

- 目录级状态机仍处在 **早期阶段**：`BLOCKED_SOURCE_DEPENDENCY` / `TARGET_MAPPED`，多数文件组未达到 `CALLER_CUTOVER_VERIFIED`、`DATA_READY_VERIFIED`、`SHADOW_OFF_VERIFIED`、`DRY_RUN_PASS`、`DELETE_APPROVED`。
- 文件组证据矩阵中 **所有文件组状态为 `blocked`**。
- 阶段 1（刷新阻断清单）部分完成。
- 阶段 2（补齐 `apps/api` 承接）部分完成。
- 阶段 3（调用端切流）与阶段 4（dry-run rename/delete）**尚未开始**。
- 无 dry-run rename/delete 证据。

## 8. 生产环境 / R2 / Upload 相关卡点

- **R2 浏览器 CORS**：生产 admin 起草合同页通过 shared-upload 控件触发生成 signed URL，但浏览器向 R2 直接 `PUT` 时因 preflight 缺少 `Access-Control-Allow-Origin` 被拦截，导致上传失败。
- **Production R2 complete/cleanup drill**：`complete` 后对象 public HEAD 200，但随后 `abort` cleanup 对 completed session 未清理对象，status 仍为 `completed`，R2 residual 检查失败。
- **Contract change/draft CUD**：task1013 生产窄口径 CUD 已通过，但只能窄口径关闭，不能外推到其它 admin 模块。
- **Admin 页面级证据**：真实 CRUD 页面交互、每个 detail/create/update/delete 分项仍 open。
- **App 生产 H5**：无全局 app production Network 证据。

## 9. 明确的 BLOCKED / NOT READY 信号

- `apps/admin/server` 与 `apps/app/server` 在证据矩阵中均为 **`blocked`**，**不得删除**。
- `tasks.md` §7 仍有 **27 个未完成 checkbox**；`openspec instructions apply` 的 `all_done` 状态已被重新打开。
- 全局 `fallbackOnly` **未清零**（保守值 70+），`apps/app/server/**` 不能进入 dry-run/delete。
- 绝大多数写入口状态为 `blocked-for-execution`（guarded 409），不是真实写入完成。
- 无生产 admin/app standalone shadow-off 证据。
- 无 dry-run rename/delete 证据。
- R2 生产浏览器上传闭环不完整。

## 10. 结论

- **独立 `apps/api` 已具备的能力**：独立 Nitro 运行时、Drizzle/Neon 运维入口与 `DB_READY` readiness、contract change/draft 生产 CUD、R2 控制面（init/sign/status/abort）本地/部分生产验证、大量 app legacy 只读 exact 与写入口 guarded 适配、测试门禁。
- **退役仍被卡住的点**：admin 侧遗留 `db/seed`、Drizzle 兼容 wrapper、R2 完整上传/complete/cleanup；app 侧仍遗留 fallback-only 路径、旧 server 构建脚本依赖；两侧都缺乏生产 shadow-off/fallback-off 和 dry-run 证据。
- **下一步建议**：
  1. 重新运行全量 fresh scan，刷新 `fallbackOnly` 与证据矩阵。
  2. 解决 R2 浏览器 CORS 与 production completed cleanup/residual 问题。
  3. 完成 admin/app production standalone 证据。
  4. 按文件组执行 dry-run rename/delete 并记录恢复命令。
  5. 在证据矩阵全部关闭前，不得将 `apps/admin/server` 或 `apps/app/server` 升级为 `delete-candidate`。
