# Agent Findings

本文件记录发现、风险、失败路径和不迁移原因，不记录可执行任务清单。

## Legacy Document Roles

- 三份旧 Superpowers 文档的细目、职责和历史用途已迁入 OpenSpec canonical：`design.md` 记录来源角色与压缩原则，`tasks.md` 记录唯一可执行 backlog，本文件记录历史 provenance、风险和证据索引。
- `docs/superpowers/phase7-openspec-migration-index.md` 是后续接力的稳定入口，指向 OpenSpec canonical、`tasks.md`、`agent-progress.md` 和本文件。
- 临时来源覆盖审计快照已经完成使命并被删除；后续不得恢复或维护第四份来源覆盖矩阵。
- 后续执行入口只能是 OpenSpec canonical：可执行 backlog 归 `tasks.md`，风险和禁止误判归本文件，checkpoint 归 `agent-progress.md`，架构和验收规则归 `design.md` 与 `specs/**`。

## Must Preserve

- 旧总设计的核心迁移目标：`apps/admin/server` 和 `apps/app/server` 的旧 Nitro API 责任逐步合并到独立部署的 `apps/api`。
- `apps/api` 是 admin 与 app 的唯一长期 Nitro API 服务目标。
- Phase7 是统一 Nitro API 迁移的退役准备阶段，不是孤立的 endpoint 数量统计阶段。
- admin legacy Nitro stream 与 app legacy/mock Nitro stream 必须分别跟踪；admin exact coverage 不能推导 app legacy 完成。
- `coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision` 的字段语义。
- `READY_CONFIGURED != DB_READY`。
- `legacy-fallback 200 != DB/repository 完成`。
- `canonical-only != old path exact covered`。
- `hook-level evidence != browserEvidence`。
- `local-dev browserEvidence != production browserEvidence`。
- `admin H5 evidence != app H5 evidence != API server evidence`。
- 当前 no-go-for-retirement 状态。
- 受保护路径：`apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`。
- Neon main 验收规则：不使用 Neon 测试分支；`RUN_PHASE7_DB_READINESS_CHECK=1` 且 `/__nitro/ready` 返回 `DB_READY` 才能记录 DB_READY。
- Neon/Drizzle 使用规则：DB-backed repository/service 必须使用 Drizzle 与 `@01s-11comm/type` 的 schema/table/type，`apps/type/src/business/**/schema.ts` 是业务 schema 事实源；禁止把旧 admin 私有 schema、旧 app in-memory 或本地 fake DB 写成生产数据库能力。
- 写入口闭环：guard-before、controlled write、read-back、rollback/cleanup、residual check、guard-after。
- Vitest 规则：运行时代码变更必须补 `*.test.ts` 或记录不可写原因；测试使用 `describe` 与 `test`，从 `vitest` 导入断言工具；Vitest 不能替代 Neon main `DB_READY`、真实库样本、写入读回回滚或旧服务退役门禁。
- Chrome MCP 三端双环境规则：admin H5、app H5、API server 必须分别在 local-dev 和 production 记录；local-dev 覆盖 `apps/api`、`apps/admin`、`apps/app` 三个 dev 服务，production 地址必须从三个 package 的 `homepage` 字段重新读取。

## Known Current Gaps

- 2026-05-19 初版 OpenSpec 迁移过度聚焦 Phase7 证据门禁，未充分呈现“admin/app 两套旧 Nitro API 合并到独立 `apps/api`”的上层主线；已补 `unified-nitro-api-consolidation` spec、设计四流模型和索引说明。
- 2026-05-19 二次复核发现 `tasks.md` 仍错误表现为 43/43 已完成，只覆盖文档载体迁移，没有承接旧计划 P0-P8 的后续 Nitro 合并任务；已重写为长期 backlog。
- 旧三文档已由用户手动恢复。删除它们不再是当前自动执行步骤，必须等 OpenSpec 完整承接未来任务、引用扫描通过且用户确认后再做。
- 旧矩阵存在冲突口径：同一文件既写 admin old path exact coverage 155/155，又在末尾风险中残留“未覆盖 exact legacy path 约 51 个”的旧说法。后续必须 fresh scan 后更新事实，不得直接照抄旧数字。
- 后续接力必须同时看 admin legacy stream、app legacy stream、unified `apps/api` runtime stream、retirement gate stream。
- 生产 `DB_READY` 仍未闭环。
- 真实库样本复核仍未闭环。
- shadow-off/fallback 页面演练仍未闭环。
- 真实页面 CRUD/交互证据仍未闭环。
- `property-manage/contract-manage` 12 个普通 list endpoint 仍需 runtime manifest/contract/HTTP gate；upload/R2、写入、删除、detail 继续单独评审。
- app legacy 后续仍需 `/callComponent/**`、floor、repair、fee/report、guarded writes、remaining modules、client-only gap 和 server-only endpoint 调度。
- 2026-05-19 specs 中文化与细化前，7 个 spec 多数只写门禁概念，缺少 Nitro 接口迁移的实施规则。已补充 `apps/api` 模块组织、admin 三级业务路径、contract-manage 下一切片、R2/upload、app legacy 各类端点、DB_READY、写入口闭环、状态升级和目录退役前提。
- 2026-05-19 用户追问后发现：app Nitro 迁移和 Neon 使用已有部分说明，但实现边界仍不够具体；Vitest 触发时机、文件位置、写法和测试/运行时证据边界没有独立 spec。已补 `app-legacy-cutover`、`db-readiness-and-write-verification`，并新增 `vitest-and-runtime-verification`。
- 2026-05-19 用户追问后发现：Chrome DevTools MCP、本地三 dev 和三个生产环境验收只散落在任务和旧文档口径中，OpenSpec 没有独立规范三端双环境矩阵。已新增 `browser-and-environment-verification` spec，并在 `tasks.md` 增加 4A 验收任务。
- 2026-05-19 重新扫描当前 working tree：`apps/api/server/routes/api` 160、`apps/admin/server/api` 155、`apps/app/server/modules` 56、`apps/api/server/shared/runtime` 11；调用端方面 `apps/admin/src` 的 `/api/` 命中 437，`apps/app/src` 的 `/app/` 或 `/callComponent/` 命中 640。后续 baseline 必须以 fresh scan 为准，而不是旧矩阵末尾的过期口径。
- 2026-05-19 扩展 `tasks.md` 时确认旧数量口径不能直接当 endpoint 清单：`dev-team/config-manage` 旧“16”是四个子模块 CRUD 方法，当前 legacy 文件树是 20 个文件；`setting-manage/system-manage` 旧“15”是五个子模块 CUD 方法，当前 legacy 文件树是 20 个文件；`expense-manage` 旧 Phase7 list 口径是 14 个，当前 legacy list 文件是 16 个；`report-manage` 旧 Phase7 list 口径是 12 个，当前 legacy list 文件是 13 个。后续状态升级必须同时说明历史口径和当前文件口径。
- 2026-05-19 扩展 `tasks.md` 时确认 app remaining modules 不能继续压缩为模块桶；`apps/app/server/modules/**/endpoints.ts` 中的 activity、contact、notice、oa-workflow、profile、staff、test、video 等模块此前在压缩清单里体现不足，已改为显式 URL 级待归类任务。
- 2026-05-19 再次补全 `tasks.md` 时确认：endpoint 行本身仍不足以支撑旧服务安全退役，还必须有 spec-to-task traceability、统一 `apps/api` runtime 对账、批次调度纪律、admin/app 调用端差集、Vitest/HTTP gate、Neon schema/DB_READY、写入闭环和三端双环境证据矩阵。已新增 §1A、§1B、§1C、§2A、§3A、§4B、§4C，并扩展 §5。
- 2026-05-19 任务载体边界再次确认：`agent-progress.md` 不应记录未执行的 Nitro 迁移任务，只能写 checkpoint 和验证结果；本轮补任务源时只在 `tasks.md` 增加 future backlog。
- OpenSpec delta parser 要求每个 requirement 正文包含英文 `MUST` 或 `SHALL`。specs 保留中文正文，并在正文中保留 `MUST` 以满足 CLI；不得把 OpenSpec 结构关键字翻成中文。
- PowerShell `Set-Content -Encoding UTF8` 会写入 UTF-8 BOM 和 CRLF，曾导致 OpenSpec 无法解析 specs delta。已改用无 BOM UTF-8 + LF 写回；后续修改 specs 后需检查 `openspec validate`。

## Source Re-Audit Findings

- 2026-05-19 独立子代理复核确认：旧总设计的核心任务是 `apps/admin/server` 与 `apps/app/server`/旧 app 项目中的旧 Nitro 职责合并到独立 `apps/api`，Phase7 只是这条主线的退役准备阶段。
- 2026-05-19 独立子代理复核确认：旧计划 §2、§12、§13 的 Agent Team 模型、每批固定流程、批次拆分和复核清单此前没有 spec 化；已新增 `agent-team-batch-execution`。
- 2026-05-19 独立子代理复核确认：旧总设计 Phase1.1 的 Markdown 文档迁移、skills/AI 记忆、Memorix 项目身份、敏感信息、字符集和动态 mock 文档同步此前承接不足；已新增 `source-history-and-memory-governance`。
- 2026-05-19 独立子代理复核确认：OpenSpec 原先缺少 git hash 级 provenance；已在本文件写入关键提交表。
- 2026-05-19 独立子代理复核确认：OpenSpec 原先缺少 `.tmp/phase7-dev-browser/**` 和 `.tmp/phase7-agent-reports/**` 证据 artifact 集中索引；已在本文件写入 artifact index。
- 2026-05-19 独立子代理复核确认：`agent-progress.md` 中“旧三文档已删除”的陈旧表达会误导后续接力；已修正为“用户已恢复，当前只作迁移来源/核对材料”。
- 2026-05-19 编辑子代理 B 复核确认：临时来源审计中值得长期保留的是 provenance 线索、Memorix lookup、artifact evidence、禁止误判和临时审计边界；旧文档章节覆盖大表不应原样迁入 canonical。

## Canonicalized Source Audit Summary

- 来源角色：旧 endpoint 矩阵提供证据字段、状态字段、扫描快照、当前口径和禁止误判；旧 batch 计划提供 Agent Team 调度、P0-P8 批次、每批固定流程和复核门槛；旧总设计提供唯一 `apps/api` 架构、Phase1-7 阶段链、文档/AI 记忆治理、Vitest、Neon main 和退役门禁。
- OpenSpec 落点：执行项进入 `tasks.md`；统一 API 主线进入 `unified-nitro-api-consolidation` 与 `design.md`；app/admin cutover 进入对应 specs；DB、Vitest、浏览器验收、Agent Team 与来源治理分别进入 `db-readiness-and-write-verification`、`vitest-and-runtime-verification`、`browser-and-environment-verification`、`agent-team-batch-execution`、`source-history-and-memory-governance`。
- 压缩决策：旧矩阵大表不逐字复制；只有 endpoint 级 backlog、明确差集调查、风险说明和证据索引进入 canonical。历史批次流水只能解释来源，不能自动继承为完成事实。
- 退场边界：临时来源覆盖审计快照完成迁移后已删除；后续 agent 不应继续要求同步维护它，也不得恢复成长期任务源。

## Git History Provenance

| 提交                               | 旧文件    | 结论                                                                                                                      |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `2af48327`                         | 总设计    | 创建 app 迁入与唯一 API 设计，确立 `apps/api` 目标和 `apps/type` 事实源。                                                 |
| `dd6c5078`、`cc50fec0`、`edc7a693` | 总设计    | 细化文档治理、字符集、AI 记忆和 Memorix 保全。                                                                            |
| `024c4785`                         | 总设计    | 补充 app 迁移自测与 Vitest 验收方案。                                                                                     |
| `22da5b95`                         | 总设计    | 补充 Phase6 计划与 Phase7 门禁。                                                                                          |
| `611c5f99`                         | 计划      | 创建 Phase7 分批计划，定义 Batch 0-6 与 Agent Team 执行框架。                                                             |
| `828a019e`                         | 矩阵/计划 | 创建 endpoint 矩阵和批次矩阵，明确证据字段和 delete-candidate 禁止升级。                                                  |
| `cf85abbd`                         | 三文件    | 引入 Neon main `DB_READY` 与写入闭环。                                                                                    |
| `e3b377fa`                         | 三文件    | 重写当前接力口径，压缩流水事实。                                                                                          |
| `058a9680`、`0a68f7d7`、`b3c94e2f` | 计划      | 记录 Chrome MCP 44/44、本地 Neon main `DB_READY`、shadow-off/fallback 44/44；均不得自动升级为生产 DB_READY 或旧服务退役。 |
| `1969bbac`                         | 矩阵/计划 | 记录 CRUD/CUD DB、HTTP gate 和 Upload R2 评审。                                                                           |
| `04a8e56c`                         | 三文件    | 同步 expense-summary、report-manage 和 App repair evidence。                                                              |
| `6bf1dbc2`                         | 三文件    | 同步 2026-05-19 admin list manifest/contract/HTTP gate 和 contract-manage 下一片。                                        |

## Memorix Lookup Index

- `#4152`：Neon main 验收口径；只能作为 DB readiness 规则来源，不能代替本轮生产 `DB_READY`。
- `#4217`、`#4218`、`#4220`、`#4221`：Phase7 resolver、readiness/browser/fallback 边界、handoff 文档和 no-go gotcha。
- `#4260`、`#4263`、`#4267`、`#4273`、`#4276`、`#4277`、`#4282`、`#4289`、`#4290`：operation/expense/report/browser/dev gotcha 链路，均为历史证据索引。
- `#4301`：Phase7 Chrome MCP final verification 44/44 PASS，属于 local evidence。
- `#4367`：report-manage remaining pages verified，属于 local admin browser evidence。
- `#4373`：Chrome MCP transport blocked；若使用 CDP fallback，必须写 fallback evidence，不能写 MCP 完成。
- `#4375`、`#4376`、`#4377`：App repair H5 CORS block、evidence docs 和 session completion；仍缺 production DB_READY、真实库样本、shadow-off/fallback 和 `/app/repairSetting.listRepairSettings` 单独页面证据。
- `#4405`-`#4409`：本次 OpenSpec 迁移修复过程的记录。

## Artifact Evidence Index

- `.tmp/phase7-dev-browser/2026-05-16-final-batch-page-network-verification.log`：local final batch page/API shadow 44/44 PASS。
- `.tmp/phase7-dev-browser/2026-05-16-final-batch-shadow-verification.log`：local shadow-off/fallback 44/44 演练。
- `.tmp/phase7-dev-browser/2026-05-16-crud-batch-http-gate-verification.log`：47 个 CRUD/边缘 route HTTP gate。
- `.tmp/phase7-dev-browser/2026-05-18-report-manage-remaining-page-network-verification.md`：7 个 report-manage 页面 Network。
- `.tmp/phase7-dev-browser/2026-05-18-report-manage-remaining-http-gate.log`：report-manage HTTP gate。
- `.tmp/phase7-dev-browser/2026-05-18-app-repair-readonly-h5-network-verification.md`：App repair 只读 H5 页面 Network；如本轮无法确认 MCP transport，应按 CDP/fallback 证据谨慎使用。
- `.tmp/phase7-agent-reports/**`：子代理历史报告；有效事实必须迁入 OpenSpec canonical 后才可用于接力。

## Reference Risks

- 三份旧文档曾被 prompt、历史计划、汇总报告和设计文档交叉引用。
- 2026-05-19：已提供稳定迁移索引 `docs/superpowers/phase7-openspec-migration-index.md`。
- 2026-05-19：删除后外部完整路径扫描无输出；外部历史文档和 prompt 的旧文件名宽匹配也无输出。
- 当前 OpenSpec change 内仍保留旧完整路径，用于说明迁移来源、删除对象和历史发现；这不是外部死链。
- `proposal.md`、`design.md`、`tasks.md` 与本文件已改为指向 OpenSpec canonical，不再把旧三文档或临时来源覆盖审计文件当作执行源。

## Deletion Notes

- 旧 endpoint 状态矩阵、旧 Phase7 batch 计划和旧 monorepo API 迁移总设计曾在前一轮被删除，但用户已手动恢复。
- `docs/superpowers/phase7-openspec-migration-index.md` 是后续文档侧稳定入口。
- 后续执行入口必须是 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`。
- 本次没有修改运行时代码、数据库 schema、部署配置或 package dependency。

## Failed Or Blocked Attempts

- 2026-05-19：尝试创建 date-prefixed OpenSpec change `2026-05-19-migrate-superpowers-docs-to-openspec-longtask` 失败，CLI 报错 change name must start with a letter。已改用合法名称 `migrate-superpowers-docs-to-openspec-longtask`。
