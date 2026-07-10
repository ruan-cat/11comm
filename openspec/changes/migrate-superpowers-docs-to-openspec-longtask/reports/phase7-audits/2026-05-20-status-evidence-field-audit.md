# 2026-05-20 Task 119 Status Evidence Field Audit

## 审计范围

本 artifact 支撑 `tasks.md` task 119：每个 status 升级必须同时填写或引用 `coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision`；缺字段时不得勾选完成。

本轮只审计当前 change 中容易被误用为 status upgrade 的稳定 artifact，不修改运行时代码，也不修改 `tasks.md`、`agent-progress.md`、`agent-findings.md`：

- `route-inventory.md`
- `route-inventory-details.csv.md`
- `module-layering-audit.md`
- `contract-boundary-audit.md`
- `schema-wiring-audit.md`
- `db-connection-scope-audit.md`
- `nitro-h3-auth-audit.md`

这些 artifact 可作为 route inventory、module layering、contract boundary、schema wiring、DB connection scope、Nitro/H3 auth/no-auth 的结构证据或安全边界证据；除非另有完整 endpoint ledger 引用，否则不能单独支持 endpoint status 升级。

## 必需字段含义

task 119 的 8 个必需字段来自 `specs/phase7-evidence-model/spec.md` 的证据模型。状态升级时必须在同一 endpoint 行内填写，或明确引用稳定 evidence 中的对应字段。

| 字段                        | phase7-evidence-model 中的含义                                                                                                                                                              | 缺失时的保守状态                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `coverageKind`              | 区分旧路径是否精确覆盖：`old-path-exact-covered`、`canonical-only`、`not-covered`、`unknown-needs-triage`。canonical route 存在不能抵扣 old path exact coverage。                           | `unknown-needs-triage` 或保持原状态                                |
| `dataSourceStatus`          | 区分 DB/repository/schema/mock/fallback 状态，如 `db-ready`、`db-read-repository-wired-with-gap`、`schema-exists-not-wired`、`in-memory-only`、`legacy-fallback`、`blocked-for-execution`。 | `unknown-needs-triage`、`legacy-fallback`、`blocked-for-execution` |
| `targetStatus`              | 描述迁移目标当前候选状态，如 `available-in-apps-api-not-caller-verified`、`candidate-after-evidence`、`blocked-for-execution`、`not-candidate`。它不是退役决定。                            | `unknown-needs-triage`、`blocked-for-execution`、`not-candidate`   |
| `browserEvidence`           | 页面级或环境级浏览器证据；Chrome MCP 页面 Network、真实页面上下文或明确无页面原因加 HTTP gate 才能支撑升级。Vitest、shell fetch、日志不能冒充 browser evidence。                            | `pending-chrome-mcp` 或保持未完成                                  |
| `fallbackEvidence`          | shadow-off、fallback drill、legacy dispatch 或兼容保护证据；必须证明切流失败时的实际保护行为。                                                                                              | `pending-shadow-off-or-fallback-drill`                             |
| `dbReadinessEvidence`       | 真实 DB readiness 证据；只有 `/__nitro/ready` 在指定环境和开关下返回 `DB_READY`，并能追溯连接与样本，才可升级。`READY_CONFIGURED`、fake DB、fallback 不等价。                               | `READY_CONFIGURED-only` 或 incomplete                              |
| `writeReadRollbackEvidence` | 写入口闭环证据；必须包含 guard-before、controlled write、read-back、rollback/cleanup、residual check、guard-after。无写入行为时才可写 `not-applicable`。                                    | `pending`、`guarded`、`blocked-for-execution`                      |
| `retirementDecision`        | 旧服务退役判断；与 `targetStatus` 分离，至少区分 `keep-source`、`blocked`、`candidate-after-review`、`delete-candidate`。                                                                   | `keep-source` 或 `blocked`                                         |

补充说明：`phase7-evidence-model` 还要求 `callerEvidence` 和 `notes` 参与 endpoint ledger 追溯。task 119 的 gate 聚焦上表 8 项，但实际退役 ledger 仍应保留 caller 与 notes；缺 caller evidence 时不得把可达 endpoint 推进为旧服务退役。

## 当前 Artifact 矩阵

| artifact                         | 类型                       | endpoint/status ledger                 | 字段完整性结论                                                                                                              | 可支持的判断                                                                                              | 不得单独支持的升级                                                                                |
| -------------------------------- | -------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `route-inventory.md`             | route inventory 摘要       | not-applicable                         | 只有库存、映射规则、owner module、app legacy registry 摘要；不是完整 endpoint 状态行。                                      | 当前 route 文件、legacy path/canonical path/method/owner 的发现范围。                                     | `old-path-exact-covered` 完成、DB_READY、fallback ready、retirement。                             |
| `route-inventory-details.csv.md` | route inventory 明细       | partial inventory, not endpoint ledger | 有 route/runtime/legacy/canonical/method/owner/manifest phase/status；缺 caller/browser/fallback/db/write/retirement 字段。 | route 与 runtime manifest 的静态盘点。                                                                    | old path exact covered 升级、退役候选、DB 或写入完成。                                            |
| `module-layering-audit.md`       | module layering 审计       | not-applicable                         | 结构边界审计，不承载 8 个 endpoint 证据字段。                                                                               | runtime/module/adapter/fallback 分层风险。                                                                | endpoint status、DB_READY、delete-candidate。                                                     |
| `contract-boundary-audit.md`     | contract boundary 审计     | not-applicable                         | response contract 与 admin/app envelope 边界审计，不是 endpoint ledger。                                                    | JsonVO/PageDTO 与 app legacy envelope 不混用的边界。                                                      | caller/browser/fallback/DB/write/retirement 完整升级。                                            |
| `schema-wiring-audit.md`         | schema wiring 审计         | not-applicable                         | 只支持 `dataSourceStatus` 的 gap 口径；不覆盖 8 字段完整升级。                                                              | `db-read-repository-wired-with-gap`、`schema-exists-not-wired`、`unknown-needs-triage` 等数据源接线判断。 | `db-ready`、`DB_READY`、browser evidence、fallback ready、write-read-rollback、delete-candidate。 |
| `db-connection-scope-audit.md`   | DB connection scope 审计   | not-applicable                         | 连接作用域与 request-scoped DB 审计，不是 endpoint 状态 ledger。                                                            | DB 连接注入、fallback runtime 与 scope 风险。                                                             | 生产 readiness、真实库样本、写入闭环、旧服务退役。                                                |
| `nitro-h3-auth-audit.md`         | Nitro/H3 auth/no-auth 审计 | not-applicable                         | H3 import 与无鉴权边界审计，不含 endpoint 8 字段。                                                                          | Nitro/H3 API 规则与项目无鉴权约束。                                                                       | route coverage、DB_READY、fallback/write/retirement。                                             |

当前 change 中未发现可以单独承担完整 endpoint/status ledger 的 artifact。后续若要升级任何 endpoint status，必须在 `tasks.md` 或其引用的稳定 evidence artifact 中组合出完整字段，并逐 endpoint 说明来源。

## Status Upgrade Gate

本 gate 只允许把“完整字段齐全或稳定引用齐全”的 endpoint 推进到更高状态。`route-inventory.md` 中的 `cutoverStatus`、`route-inventory-details.csv.md` 中的 `manifestStatus` 只是 inventory 标签，不是 `phase7-evidence-model` 的正式 `targetStatus` 或 `retirementDecision`，也不能替代 `coverageKind`。

后续任何 endpoint status 升级必须至少落入如下模板；字段无法填写时必须写保守默认值或引用阻断原因：

| 字段                        | 必填或引用要求                                                                                                           | 缺失时处理                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `endpoint/scope`            | 旧路径、canonical path、method、owner module 或明确的任务切片范围                                                        | 不得升级，保持 `unknown-needs-triage`                                           |
| `coverageKind`              | 直接填写 `old-path-exact-covered`、`canonical-only`、`not-covered` 或 `unknown-needs-triage`，或引用稳定 endpoint ledger | 不得用 `manifestStatus`、route 文件存在或 legacySource 推导                     |
| `dataSourceStatus`          | 直接填写 data source 枚举，或引用 schema/repository/DB evidence                                                          | 缺失时保持 `unknown-needs-triage`、`legacy-fallback` 或 `blocked-for-execution` |
| `targetStatus`              | 直接填写 target status 枚举，或引用稳定 endpoint ledger                                                                  | 不得把 `available-in-apps-api-not-caller-verified` 解释成退役完成               |
| `browserEvidence`           | 引用 Chrome MCP、页面 Network、API server browser evidence，或明确无页面原因加 HTTP gate                                 | 缺失时保持 `pending-chrome-mcp`                                                 |
| `fallbackEvidence`          | 引用 shadow-off/fallback drill、legacy dispatch 或 guard/fallback evidence                                               | 缺失时保持 `pending-shadow-off-or-fallback-drill`                               |
| `dbReadinessEvidence`       | 引用 `/__nitro/ready` 的 `DB_READY`、真实库样本或明确的 DB 阻断记录                                                      | 缺失时保持 `READY_CONFIGURED-only` 或 incomplete                                |
| `writeReadRollbackEvidence` | 无写入时写 `not-applicable` 并说明原因；写入口必须引用 guard/write/read-back/cleanup/guard-after                         | 写入口缺失时保持 `pending`、`guarded` 或 `blocked-for-execution`                |
| `retirementDecision`        | 直接填写 `keep-source`、`blocked`、`candidate-after-review` 或 `delete-candidate`，并引用独立复核                        | 缺字段时必须是 `keep-source` 或 `blocked`                                       |
| `artifactPath`              | 指向稳定 evidence artifact、task 行或 progress/findings 记录                                                             | 没有 artifact 时不得升级                                                        |
| `notes`                     | 记录字段缺口、默认值、mock/fallback/compat gap 和 no-go                                                                  | notes 缺失时不得退役                                                            |

本轮 task 119 只补齐 gate 与已完成 artifact 的字段适用性审计；没有新增任何 endpoint 的 status upgrade，也没有补全逐 endpoint 的全量 retirement ledger。后续若要升级具体 endpoint 状态，必须另行在稳定 evidence artifact 内逐字段补齐并复核。

## `route-inventory-details.csv.md` 字段检查

`route-inventory-details.csv.md` 当前列头为：

```csv
routeFile,runtimeKey,legacyPath,canonicalPath,method,ownerModule,legacySource,manifestPhase,manifestStatus
```

字段覆盖结论：

- 已覆盖 route identity 与 inventory 字段：`routeFile`、`runtimeKey`、`legacyPath`、`canonicalPath`、`method`、`ownerModule`、`legacySource`、`manifestPhase`、`manifestStatus`。
- 未覆盖 task119 必需证据字段：`coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision`。
- 也未覆盖 `phase7-evidence-model` ledger 追溯所需的 `callerEvidence` 和 `notes`。

因此，该 CSV 明细只能作为 route/runtime/legacy/canonical/method/owner/manifest phase/status 的库存证据；它不能单独支持 `old-path-exact-covered`、`delete-candidate`、旧服务退役、生产 `DB_READY`、真实库样本或写入闭环升级。若后续引用它参与升级，必须同时引用其他稳定 evidence 填齐 caller/browser/fallback/db/write/retirement 等字段。

## `schema-wiring-audit.md` 字段检查

`schema-wiring-audit.md` 的有效范围是 DB-backed schema wiring。它可支持的只是 `dataSourceStatus` 的 gap 口径，例如：

- `db-read-repository-wired-with-gap`
- `schema-exists-not-wired`
- `schema-missing`
- `unknown-needs-triage`
- `non-db-or-fallback`

字段缺口：

- 不支持完整 `coverageKind` 升级；schema 接线不能证明 old path exact coverage。
- 不支持 `browserEvidence`；repository/schema 证据不是页面 Network 或真实交互。
- 不支持 `fallbackEvidence`；fallback runtime 或 legacy proxy 不能自动等同 shadow-off/fallback drill 完成。
- 不支持 `dbReadinessEvidence` 完成；schema 接线和 request-scoped DB 不能证明生产 `DB_READY` 或真实库样本。
- 不支持 `writeReadRollbackEvidence`；read repository 接线不能外推 create/update/delete、支付、缴费、开门、报修流转、审批等写入口闭环。
- 不支持 `retirementDecision` 完整升级；缺 caller/browser/fallback/DB/write/独立复核时必须保持 `keep-source` 或 `blocked`。

因此，`schema-wiring-audit.md` 可以作为数据源接线 gap 证据，但不能单独把 endpoint 升级为 `db-ready`、`DB_READY`、fallback ready、write complete 或 `delete-candidate`。

## No-Go

- 任何 artifact 缺少 task119 的 8 个必需字段时，只能引用其他稳定 evidence 填齐字段，或保持 `unknown-needs-triage`、`keep-source`、`blocked` 等保守状态。
- 不得把 route 文件存在、runtime manifest 条目、HTTP 200、Vitest 通过、mock 返回、in-memory seed、fallback proxy、schema table 存在或 repository 接线写成完整状态升级。
- 不得把 `available-in-apps-api-not-caller-verified` 解释成旧服务可删；`targetStatus` 与 `retirementDecision` 必须分离。
- 不得在缺 browser/fallback/db/write/retirement 任一证据时升级成 `delete-candidate`、`DB_READY` 或旧服务退役。
- 写入口在缺 guard-before、controlled write、read-back、rollback/cleanup、residual check、guard-after 时必须保持 `pending`、`guarded` 或 `blocked-for-execution`。
- 非 endpoint 状态升级 artifact 统一视为 not-applicable；它们可以降低排查成本，但不能替代 endpoint ledger。

## Task 119 结论

本 artifact 是字段完整性 gate。当前已完成的是对 status evidence 字段的审计与 no-go 规则固化，不代表任何 endpoint status 被升级，也不代表任何旧服务进入退役候选。

因此，本项只能在 gate 规则与 artifact 适用性审计已经落地后勾选；后续任何具体 endpoint status 升级仍必须先确认被升级 endpoint 能同时填写或引用 8 个必需字段，字段不全时不得升级。
