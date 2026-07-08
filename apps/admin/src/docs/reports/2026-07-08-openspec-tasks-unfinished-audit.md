# 2026-07-08 OpenSpec 长任务未完成任务审计报告

## 审计对象

- 源文件：`D:/code/ruan-cat/01s-11comm/openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`
- 审计日期：2026-07-08
- 审计范围：文件中所有 checkbox 任务条目（`- [ ]` / `- [x]`）

## 统计摘要

| 指标 | 数值 |
|------|------|
| 任务总数（顶层 checkbox） | 464 |
| 已完成数（`[x]`） | 437 |
| 未完成数（`[ ]`） | 27 |
| 完成率 | 94.18% |

注：本文件未使用显式 `Task XXXX` 编号，以下任务以**所在行号 + 所属章节**作为唯一标识。

## 未完成清单（按类别）

### 一、与 admin 内置 Nitro 退役相关的（4 项）

| 行号 | 所属章节 | 任务标题/摘要 | 关键交付物 |
|------|----------|---------------|------------|
| 1132 | ### 7A | `[dry-run] apps/admin/server` | 在隔离 worktree 或临时 rename 中将目录改名为 `server.__retirement_dryrun__`，运行 admin 引用扫描、typecheck、build 和关键页面/API base URL 测试 |
| 1133 | ### 7A | `[候选] apps/admin/server/**` | route parity、DB/seed/R2、Nitro config、脚本、docs/generator、引用扫描、dry-run、页面 Network 和回滚证据全部通过后，目录升级为 `delete-candidate` |
| 1302 | ### 7D | `[配置] apps/admin/.env.production` 或 Vercel env | 明确 admin standalone apps/api 模式，避免依赖同域 `/api/**` 或 admin 内置 Nitro |
| 1314 | ### 7E | `[删除] apps/admin/server/**` | 仅当 admin 目录状态为 `delete-candidate`、dry-run 和生产证据全部通过后执行删除；删除后立即运行 admin/app/api 扫描和构建测试 |

### 二、与 app 内置 Nitro 退役相关的（4 项）

| 行号 | 所属章节 | 任务标题/摘要 | 关键交付物 |
|------|----------|---------------|------------|
| 1172 | ### 7B | `[dry-run] apps/app/server` | 在隔离 worktree 或临时 rename 中将目录改名为 `server.__retirement_dryrun__`，运行 app 引用扫描、runtime-base-url 测试、typecheck、build 和 H5 API base 验证 |
| 1173 | ### 7B | `[候选] apps/app/server/**` | mock/test/runtime/fallback/Nitro build 引用清零、fallback-only endpoint 全部处理、dry-run 通过且回滚路径明确后，升级为 `delete-candidate` |
| 1303 | ### 7D | `[配置] apps/app/.env.production` 或 Vercel env | 明确 app production shadow-disabled 时仍指向 `https://01s-11-server.ruan-cat.com` 或当前 `apps/api` homepage |
| 1315 | ### 7E | `[删除] apps/app/server/**` | 仅当 app 目录状态为 `delete-candidate`、fallback-only 清零或 blocked 化、dry-run 和生产证据全部通过后执行删除；删除后立即运行 app/api 扫描和构建测试 |

### 三、与 apps/api 独立接口承接/增强相关的（4 项）

| 行号 | 所属章节 | 任务标题/摘要 | 关键交付物 |
|------|----------|---------------|------------|
| 1200 | ### 7C | `[新增] apps/api/server/modules/{activity,coupon,fee,inspection,item-release,maintenance,meter,oa-workflow,parking,profile,property-application,purchase,renovation,repair,resource,staff,visit,work-order}/**` | 按小批次补齐 app fallback-only exact handlers；每批只处理 2-3 个 endpoint 或一个小模块 |
| 1201 | ### 7C | `[修改] apps/api/server/shared/runtime/runtime-endpoints.ts` | 注册新增 exact handlers，并把 former fallback-only 状态收敛为 exact、blocked、guarded 或 not-candidate |
| 1204 | ### 7C | `[迁移] deterministic seed legacy adapters` | 对 room、unit、owner、contact、complaint、notice、profile、video 等 `deterministic-compat-seed-no-db-ready` 模块分批改为 DB-backed repository，或明确保留为 not-candidate |
| 1205 | ### 7C | `[扩展] apps/api/server/db/readiness` 或等价 readiness probe | 覆盖 contract upload 表、关键 app legacy 表、seed sentinel、R2 env 可用性，并区分 `READY_CONFIGURED` 与 `DB_READY` 删除门禁 |

### 四、与测试/验证/文档相关的（14 项）

| 行号 | 所属章节 | 任务标题/摘要 | 关键交付物 |
|------|----------|---------------|------------|
| 1206 | ### 7C | `[验证] RUN_PHASE7_DB_READINESS_CHECK=1` | 本地和生产 `GET /__nitro/ready` 在删除门禁前必须返回 `DB_READY`；只返回 `READY_CONFIGURED` 不得升级目录状态 |
| 1207 | ### 7C | `[验证] R2/upload 真实环境 drill` | 通过 `apps/api` 执行 live R2 `init/status/sign-part/browser PUT/complete/status/cleanup/residual`，记录脱敏证据 |
| 1208 | ### 7C | `[验证] apps/api 包级测试` | 运行 `pnpm -F @01s-11comm/api test:infra`、指定 Vitest 套件、`typecheck`、`build:node` |
| 1301 | ### 7D | `[核对] apps/admin/package.json`、`apps/app/package.json` | 重新读取 `homepage` 作为生产地址权威来源，不得从旧报告或控制台截图推断 |
| 1304 | ### 7D | `[验证] admin production Network` | 在生产 admin H5 采集关键 list/detail/CUD/upload 请求，确认 control plane 全部命中 `apps/api`，不命中内置 admin Nitro |
| 1305 | ### 7D | `[验证] app production Network` | 在生产 app H5 采集代表性 `/app/**`、`/callComponent/**` 请求，确认 exact/guard/blocked 行为由 `apps/api` 承接 |
| 1306 | ### 7D | `[验证] shadow-off drill` | admin 与 app 分别关闭 shadow 或 fallback 后，目标 endpoint 仍命中 `apps/api` |
| 1307 | ### 7D | `[记录] .tmp/phase7-dev-browser/**`、`agent-progress.md`、`agent-findings.md` | 保存脱敏 production evidence、requestId、状态码、响应摘要和 residual check，不保存 token/cookie/signed URL/object key/secret |
| 1311 | ### 7E | `[dry-run] 隔离 worktree` | 建立独立 worktree 或临时 branch，分别 rename `apps/admin/server` 与 `apps/app/server`，跑 admin/app/api 引用扫描、typecheck、Vitest、build、OpenSpec strict 和 `git diff --check` |
| 1312 | ### 7E | `[回滚] dry-run 回滚演练` | 在 dry-run 后恢复目录名，确认无需 `git reset --hard` 即可回滚；记录命令、失败点和残留 |
| 1313 | ### 7E | `[复核] 检查复核子代理` | 复核 `retirement-evidence-matrix.md`、dry-run 结果、admin/app/api 验证命令和剩余引用；任何缺口必须回退到 7A-7D |
| 1317 | ### 7E | `[验证] 最终 OpenSpec 校验` | 运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`、`openspec instructions apply --change migrate-superpowers-docs-to-openspec-longtask --json`、限定 `git diff --check` 和必要包级测试 |
| 1318 | ### 7E | `[记录] 最终 readiness 报告` | 编写 `legacy-nitro-retirement-readiness-report.md`，说明是否已安全删除旧内置 Nitro、剩余风险、回滚路径和未关闭项 |
| 1319 | ### 7E | `[记录] Memorix` | 记录本 longtask 从文档迁移扩展为旧内置 Nitro 退役执行的最终结果、提交范围和未推送状态 |

### 五、其他（1 项）

| 行号 | 所属章节 | 任务标题/摘要 | 关键交付物 |
|------|----------|---------------|------------|
| 1316 | ### 7E | `[保护] D:\code\ruan-cat\01s-11comm-app` | 再次确认旧 app 源目录只读永久保留，不纳入删除对象 |

## 关键发现

1. **整体完成度较高**：文件 464 项顶层任务中 437 项已完成，完成率 94.18%，剩余 27 项未关闭。
2. **未完成任务集中在退役执行阶段**：全部 27 项未完成均位于 `§7A` 至 `§7E`，属于旧内置 Nitro 退役的临门一脚工作，前期迁移、审计、配置入口切换已基本完成。
3. **验证/文档类是最大缺口**：14 项属于测试、验证、记录、最终复核，占比 51.85%；其中生产 Network、shadow-off drill、R2 live drill、最终 OpenSpec 校验和 readiness 报告均尚未完成。
4. **admin/app 目录删除尚未解除门禁**：admin 和 app 各剩 2 项前置（dry-run + delete-candidate 升级），以及最终删除动作；`apps/admin/server/**` 和 `apps/app/server/**` 目前仍不可物理删除。
5. **apps/api 承接仍在进行中**：`§7C` 剩余 4 项，核心为补齐 15 个模块的 fallback-only exact handlers、runtime-endpoints 状态收敛、deterministic seed 迁移、readiness probe 扩展。
6. **无 §1D/§2/§3/§4D/§7.0 未完成项**：说明前期来源审计、业务批次迁移、风险排雷和重新开门阶段已全部关闭。
