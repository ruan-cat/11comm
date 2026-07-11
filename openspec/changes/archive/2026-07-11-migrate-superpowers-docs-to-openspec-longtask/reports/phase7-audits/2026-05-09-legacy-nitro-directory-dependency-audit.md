# 旧内置 Nitro 目录依赖审计

本文是 `migrate-superpowers-docs-to-openspec-longtask` §7 的目录级依赖审计入口，用于承接已归档 `assess-legacy-nitro-server-retirement` 的只读评估结论，并结合 2026-06-05 本轮 agent team 审计结果重新建账。本文不授权删除 `apps/admin/server` 或 `apps/app/server`；删除只能在 §7 后续 dry-run 与证据矩阵全部通过后执行。

## 审计来源

- 归档评估：`openspec/changes/archive/2026-06-05-assess-legacy-nitro-server-retirement/tasks.md`、`design.md`、`retirement-evidence-matrix.md`。
- admin 只读审计：确认 `apps/api` 已按路径承接 `apps/admin/server/api` 的 155 个 route，但 admin 仍保留 Nitro/Vite、legacy DB/seed、Drizzle compatibility、R2/upload 和活动文档/generator 依赖。
- app 只读审计：确认 app 仍保留自有 Nitro config/build、mock/test 对 `server/modules/**` 的直接依赖、legacy-dispatch 和 fallback-only 路径。
- api 只读审计：确认 `apps/api` 已独立部署并承接 Drizzle/R2/部分 legacy runtime，但仍需要补齐 fallback-only exact handler、seed 入口、readiness 扩展和真实环境 drill。
- OpenSpec 只读审计：确认旧 `all_done` 只代表历史任务完成，不代表目录级退役完成。

## Admin 依赖审计

| 文件组                | 当前依赖                                                                                                                                  | 目标替代                                                                                         | 当前状态      | 必须完成的 §7 任务                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------- | ----------------------------------------------------------------------------- |
| Nitro/Vite 接入       | `apps/admin/build/plugins/index.ts` 仍导入 `nitro/vite` 并启用 `nitro()`；`apps/admin/nitro.config.ts` 仍声明 `serverDir` 与 `scanDirs`。 | admin 只作为前端项目运行；API 由 `apps/api` 提供。                                               | `blocked`     | 7A: build plugin、Nitro config、package scripts 修改与 admin build 验证。     |
| package scripts       | `apps/admin/package.json` 仍有 `nitro:*`、`db:*`、`db:legacy:*` 或等价旧入口。                                                            | 删除、废弃或转向 `apps/api` package-local 命令。                                                 | `blocked`     | 7A: 脚本改写、引用扫描、admin typecheck/build。                               |
| Drizzle compatibility | `apps/admin/drizzle.config.ts` 仍引用旧 `server/utils/vercel-env`。                                                                       | `apps/api/drizzle.config.ts` 是唯一长期迁移入口，schema 仍来自 `apps/type`。                     | `blocked`     | 7A/7C: admin Drizzle 退役、`apps/api` readiness/drift 自检。                  |
| legacy DB/seed        | `apps/admin/server/db/seed/**` 仍是旧 seed/reset 来源，历史评估指出 reset 具有高风险 destructive 语义。                                   | 迁入 `apps/api/server/db/seed/**` 或明确废弃；缺 DB URL 时 fail-closed。                         | `blocked`     | 7A: seed 决策与 `apps/api` 命令补齐。                                         |
| R2/upload 源依赖      | 旧 `server/services/**`、`server/utils/r2-*` 仍作为 upload 源实现与回滚来源；admin 页面必须证明 control plane 命中 `apps/api`。           | `apps/api/server/modules/contract/upload-service.ts`、R2 client/env、upload session repository。 | `keep-source` | 7A/7C/7D: upload resolver、R2 CORS、browser shared-upload、cleanup/residual。 |
| 活动 generator/docs   | `scripts/generate-tasks.ts` 和活动 guide 仍可能指向 `apps/admin/server/**`、admin DB/seed 或 admin Nitro。                                | 生成器和 guide 指向 `apps/api` 或明确废弃旧入口。                                                | `blocked`     | 7A: generator 与 docs 更新。                                                  |

## App 依赖审计

| 文件组                  | 当前依赖                                                                                                                                                                                                 | 目标替代                                                                                       | 当前状态  | 必须完成的 §7 任务                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------- |
| app Nitro config        | `apps/app/nitro.config.ts` 仍声明 `serverDir: "./server"`，并把 `/app/**`、`/callComponent/**` 指向旧 `legacy-dispatch`。                                                                                | `apps/api` 承接 app legacy exact handler、guard/blocked 契约和 fallback 行为。                 | `blocked` | 7B/7C: config 退役、exact handler 与 fallback-off 验证。    |
| Vite Nitro plugin       | `apps/app/vite.config.ts` 仍含 `nitro()` 与 `serverDir` 口径。                                                                                                                                           | app H5 只作为前端构建，API base 指向 `apps/api`。                                              | `blocked` | 7B: Vite config 修改与 H5 build/typecheck。                 |
| package/turbo scripts   | `apps/app/package.json`、`apps/app/turbo.json` 仍保留 app 自有 Nitro dev/build/preview/ci pipeline。                                                                                                     | `@01s-11comm/api` 负责 Nitro build/deploy。                                                    | `blocked` | 7B: scripts/pipeline 移除与 build 验证。                    |
| app mock                | `apps/app/src/api/mock/**/*.mock.ts` 仍直接导入 `../../../server/modules/**`，`shared/utils.ts` 仍依赖旧 runtime helpers。                                                                               | app-local fixture、`apps/api` test helper 或非 server 共享工具。                               | `blocked` | 7B: mock 逐文件迁移。                                       |
| app nitro-runtime tests | task428-task432 已删除旧 business endpoint、runtime helper 和 `process.cwd()/server` 扫描测试；当前目录只剩纯前端 URL 解析的 `runtime-base-url.test.ts`，且 app tsconfig 不再 include `server/**/*.ts`。 | app 只保留前端 URL 解析测试；后续阻断转向 fallback-only 收口、production evidence 与 dry-run。 | `blocked` | 7B/7C/7D/7E: dry-run 前扫描、fallback-only 收口、生产证据。 |
| fallback-only endpoints | 历史快照为 app 214 个 unique endpoint，其中 150 个 `/app/**` fallback-only；当前执行前必须 fresh scan。                                                                                                  | exact handler、guarded/blocked、not-candidate 或明确废弃。                                     | `blocked` | 7C: 差集清单、exact handlers、fallback 关闭和 ledger 更新。 |

## `apps/api` 承接缺口

| 承接面              | 当前事实                                                                                   | 缺口                                                                                | 对应 §7 任务 |
| ------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------ |
| Drizzle/Neon        | `apps/api/drizzle.config.ts` 已读取 `apps/type` schema，迁移目录在 `apps/api/drizzle/**`。 | seed 运维入口与 readiness 检查仍需扩展到关键 app legacy 表、seed sentinel、R2 env。 | 7A/7C        |
| R2/upload           | contract upload control plane 已在 `apps/api`，并有部分测试和生产证据。                    | 删除旧 admin server 前仍需 standalone/shadow-off 页面证据和真实环境 residual 复验。 | 7A/7C/7D     |
| app legacy dispatch | `apps/api` registry exact 先于 fallback，未注册路径可进入 fallback。                       | fallback-only 未清零，fallback 关闭后的环境级验收不足。                             | 7C/7D        |
| package/build       | `apps/api` 是独立 Nitro 服务。                                                             | 需要证明 admin/app 不再构建内置 Nitro。                                             | 7A/7B/7E     |

## 当前结论

`apps/admin/server` 与 `apps/app/server` 当前都保持 `blocked` 或 `keep-source`，不能删除。后续执行入口是 `tasks.md` §7：先迁移/废弃阻断依赖，再补 `apps/api` 承接和生产证据，最后执行隔离 dry-run。任何未分类命中都必须写回本文或 `retirement-evidence-matrix.md`，不得只在聊天中说明。
