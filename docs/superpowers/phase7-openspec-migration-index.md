# Phase7 OpenSpec 迁移索引

自 2026-05-19 起，Phase7 长任务的 canonical 入口迁移到 OpenSpec。旧 Superpowers 矩阵、批次计划和总设计文档不再作为执行源；后续接力必须先读取本索引，再进入 OpenSpec change。

本索引承接的核心任务不是单独维护 Phase7 文档，而是继续推进统一 Nitro API 迁移：把 `apps/admin/server` 的旧 admin Nitro API 责任、`apps/app/server` 和旧项目 `D:\code\ruan-cat\01s-11comm-app` 的 app legacy/mock Nitro API 责任，合并到独立部署的 `apps/api`，并在证据闭环后清退旧服务责任。Phase7 是这条主线的退役准备阶段。

## Canonical 入口

- OpenSpec change：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/`
- 唯一任务源：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`
- 设计与来源压缩：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/design.md`
- 进度记录：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-progress.md`
- 发现与风险：`openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-findings.md`

## 旧文档角色迁移

| 旧文档角色                                              | 旧文件名                                                 | 新承接位置                                                                                                                                                     |
| ------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase7 endpoint 状态矩阵                                | `phase7-endpoint-migration-matrix.md`                    | `specs/phase7-evidence-model/spec.md`、`specs/admin-api-cutover/spec.md`、`agent-progress.md`                                                                  |
| Phase7 batch 执行计划                                   | `2026-05-10-phase7-batch-migration-plan.md`              | `tasks.md`、`agent-progress.md`、`agent-findings.md`                                                                                                           |
| monorepo API 迁移总设计                                 | `2026-04-25-11comm-app-monorepo-api-migration-design.md` | `design.md`、`specs/unified-nitro-api-consolidation/spec.md`、`specs/db-readiness-and-write-verification/spec.md`、`specs/retirement-gate-and-archive/spec.md` |
| 旧三文档当前章节、git 历史、Memorix 编号和证据 artifact | 三份旧文档 + git history + Memorix                       | `design.md`、`specs/source-history-and-memory-governance/spec.md`、`agent-findings.md`                                                                         |
| Agent Team、batch 0-8、每批固定流程和复核清单           | `2026-05-10-phase7-batch-migration-plan.md`              | `specs/agent-team-batch-execution/spec.md`、`tasks.md`                                                                                                         |

## 统一 Nitro 合并主线

| 状态流                            | 旧来源                                                                       | 目标                                                        | 当前接力判断                                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Admin legacy Nitro stream         | `apps/admin/server/api/**`                                                   | `apps/api/server/routes/api/**` 与 admin resolver           | admin exact coverage 和 resolver 完成不等于旧服务可删，仍需 DB、fallback、browser/runtime 和 retirement gate |
| App legacy Nitro stream           | `apps/app/server/modules/**/endpoints.ts`、`D:\code\ruan-cat\01s-11comm-app` | `apps/api` legacy adapter、manifest、allowlist、guard       | app legacy 必须独立跟踪，不能由 admin coverage 推导完成                                                      |
| Unified `apps/api` runtime stream | `apps/api` 独立 Nitro 服务                                                   | 独立启动、构建、部署、health/ready、共享 repository/service | route 文件或 manifest 存在不等于生产 `DB_READY`                                                              |
| Retirement gate stream            | 旧服务责任、fallback、写入 guard、保护路径                                   | `retirementDecision` 与 OpenSpec canonical                  | 当前仍是 `no-go-for-retirement`                                                                              |

## 保留口径

- Phase7 仍是 partial migration，当前保持 `no-go-for-retirement`。
- `apps/api` 是 admin 与 app 的唯一长期 Nitro API 服务目标。
- `apps/admin/server` 与 `apps/app/server` 是旧服务责任、迁移来源、兼容参考或 fallback/rollback 证据，不是长期 API 目标。
- `tasks.md` 是唯一可执行任务清单；不要在本索引、`agent-progress.md` 或 `agent-findings.md` 中维护第二套任务树。
- 后续执行开始时必须搜索 Memorix，并读取 OpenSpec change 下的 `proposal.md`、`design.md`、`specs/**/spec.md`、`tasks.md`、`agent-progress.md` 和 `agent-findings.md`。
- `READY_CONFIGURED != DB_READY`；`legacy-fallback 200 != DB/repository 完成`；`canonical-only != old path exact covered`；`hook-level evidence != browserEvidence`。
- 受保护路径仍不得删除、移动、归档、重命名或清空：`apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`。

## 后续接力规则

1. 用 `openspec status --change migrate-superpowers-docs-to-openspec-longtask` 确认 artifacts 状态。
2. 只按 `tasks.md` 的 checkbox 继续推进。
3. 每完成一个 checkpoint，更新 `tasks.md` 和 `agent-progress.md`。
4. 发现失败路径、过时事实、引用断链或剩余风险时，记录到 `agent-findings.md`。
5. 修改 OpenSpec artifact 后运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`。
