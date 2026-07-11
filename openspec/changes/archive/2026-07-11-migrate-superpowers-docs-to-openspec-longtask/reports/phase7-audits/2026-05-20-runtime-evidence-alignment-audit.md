# 2026-05-20 Task 120 Runtime Evidence Alignment Audit

## Scope

本 artifact 只服务 `tasks.md` task 120: 复核 `apps/api` 的 health/ready、route file、runtime manifest、contract tests、HTTP gate 和 browser/API evidence 是否在证据层级上互相一致。

本 artifact 只做证据层级一致性 audit, 不代表任何 endpoint status 升级， 不代表生产 `DB_READY`, 不代表真实库样本已验证， 不代表 shadow-off/fallback drill 完成， 不代表写入闭环完成， 也不代表旧服务退役完成。

本 artifact 不修改运行时代码， 不补充 endpoint ledger, 不把任何 route 或 endpoint 推进为 `old-path-exact-covered`、`db-ready`、`delete-candidate` 或旧服务可退役。

## Evidence Layer Matrix

| evidence layer       | 能证明什么                                                                                                                                      | 不能证明什么                                                                                                                                                                    | 缺失时保守状态                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| health/ready         | `apps/api` 进程可响应诊断入口； 在显式 readiness 开关和环境配置满足时， 可作为 DB readiness 检查入口。                                          | 不能单独证明某个业务 endpoint 可用； 不能把 `READY_CONFIGURED`、mock DB 或 fallback 解释为生产 `DB_READY`; 不能证明真实库样本、browser 调用、写入闭环或旧服务退役。             | `READY_CONFIGURED-only`、`incomplete` 或 `unknown-needs-triage`。                  |
| route file           | 证明 Nitro 文件路由在源码树中存在， 并可推导 canonical path 与 method 候选。                                                                    | 不能证明 runtime manifest 已登记； 不能证明 old path exact coverage; 不能证明 response contract、DB readiness、caller/browser evidence、fallback drill 或 retirement decision。 | `canonical-only` 或 `unknown-needs-triage`; 不得写 `old-path-exact-covered`。      |
| runtime manifest     | 证明某 endpoint 被登记为审计或 runtime 清单条目， 并可记录 owner、target client、route kind、method、path、response contract 或 cutover label。 | 不能替代 route file 存在性验证； 不能替代 executable registry; 不能证明 HTTP gate、contract tests、browser/API evidence、DB readiness、fallback drill 或写入闭环。              | `manifest-missing` 时保持 `canonical-only` 或 `unknown-needs-triage`; 不得升级。   |
| contract tests       | 证明指定 endpoint/method/path 的响应 contract 在测试样本中符合预期， 例如 admin `JsonVO` 或 app legacy `{ code, msg, data }`。                  | 不能证明真实部署环境可访问； 不能证明 browser 页面已调用； 不能证明生产 DB_READY、真实库样本、fallback drill、写入 rollback 或旧服务退役。                                      | `contract-evidence-missing` 或 `unknown-needs-triage`; 不得升级。                  |
| HTTP gate            | 证明指定环境下 endpoint/method/path 可通过 HTTP 请求得到预期状态码和关键响应形态。                                                              | 不能替代 browser 页面证据； 不能证明 caller 已切流； 不能单独证明 DB 数据真实、fallback/shadow-off 完成、写入闭环或 retirement decision。                                       | `http-gate-missing` 或 `unknown-needs-triage`; 不得升级。                          |
| browser/API evidence | 证明真实页面 Network、API evidence 或明确的无页面原因加 API gate 已覆盖指定 endpoint。                                                          | 不能替代 runtime manifest、contract tests 或 HTTP gate; 不能单独证明 DB_READY、真实库样本、fallback drill、写入闭环或旧服务退役。                                               | `pending-chrome-mcp`、`api-evidence-missing` 或 `unknown-needs-triage`; 不得升级。 |

## Alignment Gate

任一 endpoint 若要从 audit/inventory 状态升级， runtime manifest、contract tests、HTTP gate 和 browser/API evidence 必须互相引用一致的 endpoint identity:

| identity field    | 对齐要求                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| endpoint          | 同一个业务 endpoint 或同一个明确 legacy/canonical route row。                                                                  |
| method            | `GET`、`POST` 或多 method 组合必须逐项一致； 不得用 `GET` 证据升级 `POST`。                                                    |
| path              | legacy path 与 canonical path 必须明确区分； `/app/**`、`/callComponent/**` 与 `/api/**` 不得互相替代。                        |
| response contract | admin canonical 必须保持 `JsonVO` / `PageDTO` 语义； app legacy 必须保持 `{ code, msg, data }` 语义； 不得跨 client 复用结论。 |
| environment       | local、preview、production、mock、fallback、DB-ready probe 必须写清； 不得把一个环境的证据外推到另一个环境。                   |
| data source       | DB、in-memory fallback、legacy proxy、mock sample 必须区分； 不得把 fallback 或 mock 写成真实库样本。                          |

任一层缺失时， 只能保持保守状态， 或明确写为待排查状态。缺 runtime manifest、缺 contract tests、缺 HTTP gate、缺 browser/API evidence 任一项时， 不得升级为 endpoint complete、old service retirement candidate、生产 `DB_READY`、fallback ready 或 write-read-rollback complete。

## Route Exists But Manifest Missing

`route-inventory-details.csv.md` 已显示多条 route row 具有 route file, 但 `manifestPhase` / `manifestStatus` 为 `manifest-missing`。这类 row 的结论必须保守：

| 条件                                                                        | 允许状态                                                                             | 禁止状态                                         |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------ |
| route file 存在， runtime manifest 缺失                                     | `canonical-only` 或 `unknown-needs-triage`                                           | `old-path-exact-covered`                         |
| route file 存在， legacy source same path, runtime manifest 缺失            | `canonical-only` 或 `unknown-needs-triage`; 可记录 legacy source 作为 inventory fact | `old-path-exact-covered`、`retirement candidate` |
| route file 存在， runtime manifest 存在， 但 contract/HTTP/browser 任一缺失 | `available-in-apps-api-not-caller-verified` 或 `unknown-needs-triage`                | `endpoint complete`、`delete-candidate`          |

结论： route 存在只能证明 canonical route 候选存在。runtime manifest 缺失时， 不能把 old path exact coverage 当作已覆盖事实写入。

## Existing Artifact References

| artifact                         | 可支持的局部证据                                                                                                                                                                                           | 不支持的升级                                                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `route-inventory.md`             | 支持 route inventory 摘要、owner module、runtime manifest 数量、legacy/canonical 映射规则和当前 gaps。                                                                                                     | 不支持 endpoint status 升级、生产 `DB_READY`、真实库样本、fallback ready、写入闭环或旧服务退役。                                                   |
| `route-inventory-details.csv.md` | 支持每个 route file 的 runtimeKey、legacyPath、canonicalPath、method、ownerModule、legacySource、manifestPhase、manifestStatus 盘点。                                                                      | `manifest-missing` row 不得升级为 `old-path-exact-covered`; CSV 不包含 browser/fallback/db/write/retirement 完整字段。                             |
| `status-evidence-field-audit.md` | 支持 status 升级必须补齐 `coverageKind`、`dataSourceStatus`、`targetStatus`、`browserEvidence`、`fallbackEvidence`、`dbReadinessEvidence`、`writeReadRollbackEvidence`、`retirementDecision` 的字段 gate。 | 不直接补齐任何 endpoint 的完整证据， 不代表具体 endpoint 已升级。                                                                                  |
| `module-layering-audit.md`       | 支持 module/runtime/adapter/repository 分层事实， 以及 handler、manifest、legacy registry 边界风险。                                                                                                       | 不支持把 module present 写成 endpoint complete、DB_READY、fallback ready 或 retirement complete。                                                  |
| `contract-boundary-audit.md`     | 支持 admin canonical contract 与 app legacy contract 必须分离， 并识别 `JsonVO` 与 `{ code, msg, data }` 的边界。                                                                                          | 不支持 browser evidence、HTTP gate、DB readiness、write-read-rollback 或旧服务退役升级。                                                           |
| `nitro-h3-auth-audit.md`         | 支持 Nitro/H3 import、无鉴权项目边界和相关 no-auth 约束。                                                                                                                                                  | 不支持 route coverage、runtime manifest coverage、DB_READY、fallback/write/retirement 状态升级。                                                   |
| `db-connection-scope-audit.md`   | 支持 DB 连接创建作用域与 request-scoped DB helper 证据。                                                                                                                                                   | 不支持生产 `DB_READY`、真实库样本、endpoint HTTP gate、browser evidence、写入闭环或旧服务退役。                                                    |
| `schema-wiring-audit.md`         | 支持 schema/repository wiring 的数据源 gap 判断， 可辅助 `dataSourceStatus` 的保守归类。                                                                                                                   | 不支持把 schema 存在或 repository 接线升级为 `db-ready`、生产 `DB_READY`、browser evidence、fallback ready、write complete 或 `delete-candidate`。 |

## Consistency Rules

1. health/ready 只能作为环境与 DB readiness 入口证据， 不能替代 endpoint 级 route/manifest/contract/HTTP/browser 证据。
2. route file 与 runtime manifest 必须分开记录。route file 存在但 manifest 缺失时， 只能是 `canonical-only` 或 `unknown-needs-triage`。
3. runtime manifest 中的 method/path/response contract 必须和 contract tests、HTTP gate、browser/API evidence 指向同一 endpoint identity。
4. admin canonical 与 app legacy 不得交叉升级。`/api/**` 的 `JsonVO` 证据不能升级 `/app/**` 或 `/callComponent/**`; app legacy `{ code, msg, data }` 证据也不能升级 admin canonical row。
5. HTTP 200、测试通过、manifest 存在、route file 存在、repository 存在、schema 存在、fallback proxy 存在， 都只能作为局部证据。任一项单独存在时不得推导完整迁移完成。
6. 缺 browser/API evidence 时， 不得写 caller 已切流或页面已覆盖。缺 fallback evidence 时， 不得写 shadow-off/fallback drill 完成。缺 write-read-rollback evidence 时， 不得写写入闭环完成。
7. 旧服务退役必须依赖完整 endpoint ledger 与独立复核； 本 artifact 不产生退役候选结论。

## Task 120 Conclusion

Task 120 的审计结论是： 当前证据应按 layer 组合使用， 不得把 route existence、manifest entry、contract tests、HTTP gate 或 browser/API evidence 任一单层证据单独升级为完整覆盖。

后续任何 endpoint status 升级， 都必须先证明 health/ready、route file、runtime manifest、contract tests、HTTP gate 和 browser/API evidence 在 endpoint/method/path/response contract 上一致， 并补齐 status evidence 必需字段。route 存在但 runtime manifest 缺失时， 必须保持 `canonical-only` 或 `unknown-needs-triage`, 不能写 `old-path-exact-covered`。
