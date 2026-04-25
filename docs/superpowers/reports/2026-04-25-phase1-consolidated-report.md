# 2026-04-25 Phase1 迁入合并汇总报告

## 结论

Phase1 快照迁入、证据保全、workspace 识别、app 测试门禁和关键修复已经收口，可判定为 `pass`。

Memorix canonical history retention gate 已拆分释放：对 Phase2 继续推进、准备和后续 `apps/api` 迁移不再阻断，状态为 `released-for-phase2-progress` / `pass-with-permanent-source-retention`。旧源目录 `D:\code\ruan-cat\01s-11comm-app` 是完整独立 git 项目，永久禁止删除、移动、归档、重命名、清空或废弃。legacy `apps/app/server` 的剩余 H3/handler/mock 风格统一作为下一阶段历史债务处理。

## 当前有效证据

| 项目              | 结论                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------- |
| workspace 识别    | `pnpm -r list --depth -1` 已确认 root/admin/app/type 被识别。                            |
| app 全量测试      | `pnpm -F @01s-11comm/app exec vitest run` 已通过，记录为 43 文件、126 测试。             |
| app 重点测试      | fee endpoint 测试与 Uno 配置测试已通过。                                                 |
| app type-check    | `pnpm -F @01s-11comm/app type-check` 已通过，且 `apps/app/dist` 不应因 type-check 生成。 |
| Turbo 调度        | `build:nitro:vercel` dry run 已确认依赖 `build:h5:prod`。                                |
| Chrome docs smoke | VitePress docs smoke 已通过；按用户要求不再保留静态截图资产。                            |
| git whitespace    | 本轮相关文档 `git diff --check` 通过。                                                   |

## 已收口问题

| 问题                                                          | 当前口径                                                                                              |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Chrome 截图曾缺失                                             | 用户已确认曾手动删除；当前仅保留 Chrome smoke 文字验收结论，不再保留截图文件。                        |
| `apps/app/node_modules` / docs cache                          | 属于生成物，最终证据要求不保留在迁入快照里。                                                          |
| `apps/app/dist`                                               | 已通过删除 `compilerOptions.composite` 避免 `vue-tsc --noEmit` 生成 `tsconfig.tsbuildinfo`。          |
| app Vitest 依赖                                               | 已补 `@unocss/preset-legacy-compat@66.0.0` 与 `unocss-applet@0.12.2`，lockfile 已同步。               |
| app-local Prettier / lint-staged / `.npmrc` / `.editorconfig` | 按用户要求和根级统一规则删除或不恢复，不是待补缺口。                                                  |
| `apps/app/.github`                                            | 已按用户要求清理，不要求恢复；根 `.github` 承载当前 monorepo app CI/docs workflow 与 issue template。 |
| 少量 `h3` -> `nitro/h3` 改写                                  | 保留，不回滚。后续发现或未处理的 legacy H3 写法进入下一阶段债务。                                     |

## 迁移证据压缩

`apps/app/docs/migration/*.md` 曾用于 Phase1 过程审计，但内容高度重复且体量过大，后续阅读和维护容易过时。当前这些过程文件的有效结论已压缩到本报告；`apps/app/docs/migration` 不再作为长期文档入口维护。

| 原过程文档                               | 压缩后保留的信息                                                                                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `snapshot-sha256-baseline.md`            | 快照迁入已完成；源目标对账无未解释阻断；`package.json`、`tsconfig.json` 等有意改写已记录；Phase2 进度 gate 为 `released-for-phase2-progress`。 |
| `encoding-and-line-ending-check.md`      | UTF-8 strict failures 为 0，`U+FFFD` 为 0，明显 mojibake 阻断为 0；终端显示乱码不写回源码。                                                    |
| `markdown-inventory.md`                  | app Markdown 已盘点，迁移价值按 P0/P1/P2/P3 分层；未保留阻断级敏感信息命中。                                                                   |
| `ai-memory-merge-inventory.md`           | app AI 记忆按 `keep-app-scope`、`promote-root-memory`、`merge-canonical-skill`、`archive-reference`、`reject-or-redact` 分流。                 |
| `dual-project-spec-compliance-matrix.md` | 根项目规则为 canonical；app-local OpenSpec/OPSX 冗余副本已清理；app 专属非 OpenSpec 技能保留在 app 作用域。                                    |
| `memorix-memory-inventory.md`            | 迁移保全链可检索；旧源 key memories 可访问；旧源 alias `status=0` 是 alias/canonical mismatch，不代表无历史。                                  |
| `memorix-project-alias-map.md`           | source canonical 为 `nwt-q/001-Smart-Community`，source alias 为 `ruan-cat/11comm-app`，target monorepo 为 `ruan-cat/11comm`。                 |
| `memorix-session-summary.md`             | root、`apps/app`、旧源目录三视角已记录；Memorix retention 不再阻断 Phase2 进度；旧源目录永久保留。                                             |
| `legacy-endpoint-matrix.md`              | fee/payment/owe-fee/report/iot/machine/callComponent 等 legacy 输入已识别，作为后续 `apps/api` 迁移输入。                                      |
| `mock-document-sync-inventory.md`        | mock endpoint、文档、测试同步关系已压缩保留；`fee-endpoints.test.ts` 是当前最强 legacy 契约输入。                                              |

## 仍需保留的边界

| 边界                                  | 说明                                                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 不在本轮启动 `apps/api` 代码实现      | Memorix gate 已允许 Phase2 推进/准备和后续迁移，但本轮编辑子代理只更新文档，不创建或迁移 `apps/api` 代码。                     |
| 永久保留旧源目录                      | `D:\code\ruan-cat\01s-11comm-app` 是完整独立 git 项目，任何阶段、gate 或验收结论都不允许删除、移动、归档、重命名、清空或废弃。 |
| 不把 Phase2 目标倒灌为 Phase1 blocker | legacy `apps/app/server` 当前只作为迁移来源和历史债务输入。                                                                    |
| 不恢复 app-local 重复配置             | 根级 canonical 配置优先，app 侧只保留必要子包配置和历史上下文。                                                                |

## 压缩说明

为减少报告干扰，旧的过程型 Markdown 报告和 `apps/app/docs/migration/*.md` 迁移过程文档不再保留独立文件，关键信息已压缩吸收到本合并报告和 Phase1 plan/spec 中。

已被压缩吸收的旧报告包括：

| 原报告                                                        | 保留在本合并报告中的信息        |
| ------------------------------------------------------------- | ------------------------------- |
| `2026-04-25-phase1-plan-explorer-report.md`                   | 早期 plan 与配置盘点。          |
| `2026-04-25-agent-report-inventory-review.md`                 | 多报告一致性复核。              |
| `2026-04-25-agent-code-evidence-review.md`                    | 代码证据与阻断项复核。          |
| `2026-04-25-agent-acceptance-review.md`                       | 验收口径复核。                  |
| `2026-04-25-agent-progress-editor-prep.md`                    | 进度修正准备说明。              |
| `2026-04-25-phase1-app-vitest-dependency-fix-report.md`       | app Vitest 依赖修复记录。       |
| `2026-04-25-phase1-app-tsconfig-generated-dist-fix-report.md` | app tsconfig 生成物修复记录。   |
| `2026-04-25-agent-admin-typecheck-fix-report.md`              | admin typecheck 修复记录。      |
| `2026-04-25-phase1-final-review-report.md`                    | 旧最终复核报告。                |
| `2026-04-25-phase1-codex-reverification-report.md`            | fresh reverification 过程报告。 |

后续阅读优先以本文件、Phase1 plan 和 design spec 为准。`docs/superpowers/reports` 下不再保留这些过程报告的归档副本，`apps/app/docs/migration` 也不再作为长期阅读入口。
