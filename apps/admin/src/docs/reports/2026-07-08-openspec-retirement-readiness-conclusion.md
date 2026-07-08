# 2026-07-08 OpenSpec 旧内置 Nitro 退役准备度复核结论

## 一、复核范围

本次复核汇总了前三份子代理审计报告，并结合当前工作树实际状态进行判断：

- 2026-07-08 OpenSpec 长任务未完成任务审计报告
- 2026-07-08 OpenSpec 目标达成度审计报告
- 2026-07-08 OpenSpec 长期任务状态审计报告
- 当前工作树关键目录与文件：
  - `D:/code/ruan-cat/01s-11comm/apps/api/`
  - `D:/code/ruan-cat/01s-11comm/apps/admin/server/`
  - `D:/code/ruan-cat/01s-11comm/apps/app/server/`
  - `D:/code/ruan-cat/01s-11comm/apps/app/package.json`
  - `D:/code/ruan-cat/01s-11comm/.github/workflows/app-ci.yml`
  - `D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`

## 二、用户核心问题回答

### 1. 我们是否真实完成了独立 nitro 接口的制作任务？

**答案：是，但只完成了“独立 Nitro 项目存在且可运行”这一步，尚未完成“完全承接 admin/app 旧 Nitro 职责”的临门一脚。**

实际证据：

- `apps/api` 是一个独立 Nitro 项目，具备自己的：
  - `package.json`：`D:/code/ruan-cat/01s-11comm/apps/api/package.json`
  - 独立 homepage：`https://01s-11-server.ruan-cat.com`
  - Nitro 脚本：`dev`、`build`、`build:node`、`build:vercel`、`build:cloudflare`、`preview`
  - Drizzle 脚本：`db:generate`、`db:migrate`、`db:push`、`db:studio`、`db:seed`、`db:seed:dry-run`
  - 核心依赖：`nitro`、`drizzle-orm`、`@neondatabase/serverless`、`@aws-sdk/client-s3` 等
- 目录结构完整：
  - `apps/api/server/routes/`
  - `apps/api/server/modules/`（已覆盖 activity、complaint、contract、fee、floor、inspection、item-release、maintenance、meter、notice、owner、profile、property-application、purchase、repair、resource、room-unit、staff、visit、work-order 等模块）
  - `apps/api/server/db/`
  - `apps/api/server/handlers/`
  - `apps/api/server/middleware/`
  - `apps/api/tests/`（infra、smoke、runtime、legacy、admin、modules 等）
- 已有 readiness 探针：`apps/api/server/routes/__nitro/ready.get.ts`，可返回 `DB_READY`，并包含 R2 环境检查。
- 已有 legacy-dispatch 和 fallback 机制。

**但尚未完成的部分：**

- `apps/api` 仍有约 70 条 app legacy fallback-only 路径（`fallbackOnly=70` 左右）未收口为 exact handler、guarded、blocked 或 not-candidate。
- `apps/api/server/shared/runtime/runtime-endpoints.ts` 未将新增 exact handler 状态收敛。
- 部分 deterministic seed 适配器仍为 `deterministic-compat-seed-no-db-ready`，未改为 DB-backed。
- readiness probe 未覆盖全部关键 app legacy 表和 seed sentinel。

### 2. 我们可以进入到收尾阶段吗？

**答案：不可以。**

当前不满足 OpenSpec 设计的收尾先决条件，具体原因如下：

1. `tasks.md` 仍有 27 个未完成任务，全部集中在旧内置 Nitro 退役执行阶段（§7A-§7E）。
2. `retirement-evidence-matrix.md` 中没有任何一行升级为 `delete-candidate`。
3. `apps/admin/server/` 仍然物理存在，且其 dry-run、delete-candidate 升级、production standalone 证据均未完成。
4. `apps/app/server/` 虽然本次会话已删除，但 `tasks.md` 中对应的 dry-run、delete-candidate 升级任务仍开放，且全局 fallback-only 未清零。
5. 生产环境验证缺口：admin production Network、app production Network、shadow-off drill、R2/upload 真实环境 drill 均未完成。
6. 最终 OpenSpec 校验、最终 readiness 报告、Memorix 记录均未完成。

### 3. `tasks.md` 的任务清单还有哪些没做完？

当前 `tasks.md` 共 464 个顶层任务，已完成 437 个，未完成 27 个。未完成清单如下：

| 行号 | 所属章节 | 任务标题/摘要 |
|------|----------|---------------|
| 1132 | 7A | `[dry-run] apps/admin/server` |
| 1133 | 7A | `[候选] apps/admin/server/**` |
| 1172 | 7B | `[dry-run] apps/app/server` |
| 1173 | 7B | `[候选] apps/app/server/**` |
| 1200 | 7C | `[新增] apps/api/server/modules/{activity,coupon,fee,inspection,item-release,maintenance,meter,oa-workflow,parking,profile,property-application,purchase,renovation,repair,resource,staff,visit,work-order}/**` |
| 1201 | 7C | `[修改] apps/api/server/shared/runtime/runtime-endpoints.ts` |
| 1204 | 7C | `[迁移] deterministic seed legacy adapters` |
| 1205 | 7C | `[扩展] apps/api/server/db/readiness` |
| 1206 | 7C | `[验证] RUN_PHASE7_DB_READINESS_CHECK=1` |
| 1207 | 7C | `[验证] R2/upload 真实环境 drill` |
| 1208 | 7C | `[验证] apps/api 包级测试` |
| 1301 | 7D | `[核对] apps/admin/package.json、apps/app/package.json` |
| 1302 | 7D | `[配置] apps/admin/.env.production 或 Vercel env` |
| 1303 | 7D | `[配置] apps/app/.env.production 或 Vercel env` |
| 1304 | 7D | `[验证] admin production Network` |
| 1305 | 7D | `[验证] app production Network` |
| 1306 | 7D | `[验证] shadow-off drill` |
| 1307 | 7D | `[记录] .tmp/phase7-dev-browser/**、agent-progress.md、agent-findings.md` |
| 1311 | 7E | `[dry-run] 隔离 worktree` |
| 1312 | 7E | `[回滚] dry-run 回滚演练` |
| 1313 | 7E | `[复核] 检查复核子代理` |
| 1314 | 7E | `[删除] apps/admin/server/**` |
| 1315 | 7E | `[删除] apps/app/server/**` |
| 1316 | 7E | `[保护] D:\code\ruan-cat\01s-11comm-app` |
| 1317 | 7E | `[验证] 最终 OpenSpec 校验` |
| 1318 | 7E | `[记录] 最终 readiness 报告` |
| 1319 | 7E | `[记录] Memorix` |

## 三、当前代码库实际状态

### 1. `apps/api/` 目录结构

`apps/api` 已具备独立 Nitro 服务所需的核心结构：

- `apps/api/server/routes/`：包括 `__nitro/health`、`__nitro/ready` 等运维路由，以及 `api/**` 业务路由。
- `apps/api/server/modules/`：已覆盖 27 个领域模块。
- `apps/api/server/db/`：包含 Drizzle 迁移、seed、readiness 探针。
- `apps/api/server/handlers/`：legacy-dispatch 等 handler。
- `apps/api/server/middleware/`：中间件。
- `apps/api/tests/`：infra、smoke、runtime、legacy、admin、modules 测试。
- `apps/api/package.json`：homepage 为 `https://01s-11-server.ruan-cat.com`，包含完整 Nitro 和 Drizzle 脚本。

### 2. `apps/admin/server/` 状态

`apps/admin/server/` 仍然物理存在，包含：

- `apps/admin/server/api/`
- `apps/admin/server/db/`
- `apps/admin/server/middleware/`
- `apps/admin/server/plugins/`
- `apps/admin/server/services/`
- `apps/admin/server/utils/`

`apps/admin/package.json` 已移除 `nitro.config.ts` 和 `drizzle.config.ts`，DB 脚本已委托给 `apps/api`，但旧 `server/` 目录尚未进入 dry-run 和删除候选流程。

### 3. `apps/app/server/` 状态

`apps/app/server/` 在当前工作树中已不存在（本次会话已删除），`git status` 显示大量 `D apps/app/server/...` 删除记录。

但 `tasks.md` 中对应的 dry-run 和 delete-candidate 任务仍开放，说明删除前置流程尚未正式关闭。

### 4. `apps/app/package.json` 状态

`apps/app/package.json` 中已无 Nitro 相关脚本/依赖：

- 无 `nitro.config.ts`
- 无 `serverDir` 或 `nitro` 脚本
- 脚本集中在 `dev:h5`、`build:h5:prod` 等 UniApp 前端构建
- CI 脚本为 `ci: turbo run build:h5:prod --filter=@01s-11comm/app`

### 5. `.github/workflows/app-ci.yml` 状态

`app-ci.yml` 当前仅包含：

1. 安装依赖
2. `pnpm -F @01s-11comm/app run build:h5:prod`
3. `pnpm -F @01s-11comm/app run type-check`
4. `pnpm -F @01s-11comm/app exec vitest run`
5. `pnpm -F @01s-11comm/app exec vitest run src/tests/runtime-base/runtime-base-url.test.ts`

已无旧 Nitro 构建命令。

## 四、关键判断

### 1. 独立 `apps/api` 是否已真实具备承接 admin/app 的能力？

**部分具备，但未完全具备。**

- admin canonical 侧：大量路由已由 `apps/api` 承接，但 `apps/admin/server/` 仍保留旧 db/seed/services/middleware，存在 destructive reset 风险。
- app legacy 侧：仍有约 70 条 fallback-only 路径，需要收口为 exact/guarded/blocked/not-candidate。
- DB 真实就绪：虽然 `apps/api` 有 `DB_READY` readiness 逻辑，但本地和生产是否真正返回 `DB_READY` 尚未验证。
- R2/upload：控制面（init/sign/status/abort）有证据，但 production complete/cleanup/residual 闭环未完整验证。
- 生产 shadow-off：无证据。

### 2. 当前状态是否满足 OpenSpec 设计中的退役先决条件？

**不满足。**

退役先决条件要求：

- `tasks.md` 全部关闭
- `retirement-evidence-matrix.md` 中对应目录升级为 `delete-candidate`
- 隔离 worktree dry-run 通过
- 生产 shadow-off/fallback-off 验证通过
- `DB_READY` 真实返回
- 最终 OpenSpec 校验和 Memorix 记录完成

以上条件当前均未满足。

### 3. 是否可以进入收尾阶段？

**不可以。**

必须完成 §7C 承接增强、§7D 生产验证、§7E dry-run 和最终删除/记录后，才能进入收尾阶段。

## 五、必须完成的剩余条件

1. **关闭 §7C 承接增强**
   - 按小批次补齐 15 个模块的 fallback-only exact handlers（每批 2-3 个 endpoint）。
   - 收敛 `runtime-endpoints.ts` 状态为 exact/blocked/guarded/not-candidate。
   - 明确 deterministic seed 模块的 DB-backed 或 not-candidate 决策。
   - 扩展 readiness probe 覆盖关键 app legacy 表、seed sentinel、R2 env。

2. **完成验证矩阵**
   - 本地和生产 `GET /__nitro/ready` 返回 `DB_READY`。
   - 完成 R2/upload 真实环境 drill 并记录脱敏证据。
   - 通过 `apps/api` 包级测试：`test:infra`、`tests/runtime`、`tests/legacy`、`tests/admin/contract-upload-r2-blocked.test.ts`、`tests/admin/contract-change-draft-crud.test.ts`、`typecheck`、`build:node`。

3. **完成生产环境验收**
   - 重新读取 `apps/admin/package.json`、`apps/app/package.json`、`apps/api/package.json` 的 `homepage`。
   - admin production Network：关键 list/detail/CUD/upload 命中 `apps/api`。
   - app production Network：代表性 `/app/**`、`/callComponent/**` 命中 `apps/api`。
   - shadow-off drill：关闭 shadow/fallback 后目标 endpoint 仍命中 `apps/api`。

4. **执行目录级 dry-run**
   - 在隔离 worktree 或临时 rename 中 rename `apps/admin/server` 与 `apps/app/server`。
   - 运行引用扫描、typecheck、Vitest、build、OpenSpec strict、`git diff --check`。
   - 恢复目录名并记录回滚命令与结果。

5. **升级目录状态为 delete-candidate**
   - `apps/admin/server`：route parity、DB/seed/R2、Nitro config、脚本、docs/generator、引用扫描、dry-run、页面 Network、回滚证据全部通过。
   - `apps/app/server`：mock/test/runtime/fallback/Nitro build 引用清零、fallback-only 全部处理、dry-run 通过、回滚路径明确。

6. **执行最终删除与验证**
   - 删除 `apps/admin/server/**` 与 `apps/app/server/**`。
   - 删除后立即运行 admin/app/api 扫描和构建测试。

7. **最终文档与记忆**
   - 编写 `legacy-nitro-retirement-readiness-report.md`。
   - 运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict` 和 `openspec instructions apply --change migrate-superpowers-docs-to-openspec-longtask --json`。
   - 将最终结果、提交范围和未推送状态写入 Memorix。

## 六、结论

- **独立 nitro 接口已真实存在**：`apps/api` 是一个可独立运行、独立部署、具备完整 Nitro + Drizzle + 测试体系的项目。
- **尚未完成全部承接工作**：app legacy fallback-only 路径未清零、admin 旧 `server/` 目录未删除、生产验证和 dry-run 证据缺失。
- **不能进入收尾阶段**：必须完成上述 7 类剩余条件后，才能宣布本 longtask 进入收尾。

## 七、可执行的下一步建议

1. 优先重新运行全量 fresh scan，刷新 `fallbackOnly` 和 `retirement-evidence-matrix.md`。
2. 补齐剩余 app legacy fallback-only exact handlers（建议按 oa-workflow、renovation、repair、resource、staff 等小批次）。
3. 验证本地和生产 `GET /__nitro/ready` 返回 `DB_READY`。
4. 解决 R2 浏览器 CORS 和 production complete/cleanup/residual 问题。
5. 对 `apps/admin/server` 执行隔离 worktree dry-run，记录回滚证据。
6. 完成 admin/app production Network 和 shadow-off drill 后，升级目录状态为 `delete-candidate`。
7. 最终执行删除并产出 `legacy-nitro-retirement-readiness-report.md`。
