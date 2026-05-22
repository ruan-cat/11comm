# 2026-05-20 apps/api 模块分层审计

## Scope / Non-goals

本 artifact 只审计以下结构边界：

- `apps/api/server/modules/*`
- `apps/api/server/routes/api/**/*.ts`
- `apps/api/server/shared/runtime/**`

本 artifact 不代表 runtime 迁移完成，不代表生产环境 `DB_READY`，不代表已经验证真实数据库样本，不代表 `shadow-off` / fallback 路径已经完成验收，不代表写入闭环已经闭合，也不代表旧服务已经退役。

本 artifact 的结论只用于后续恢复审计上下文：哪些 module layer 已存在，哪些 handler 边界仍偏厚，哪些 manifest / legacy contract 边界还不能作为迁移完成证据。

## Layer legend

- `types`：存在 `types.ts`，并承载该 domain 的 DTO / query / list item 等 TypeScript contract。
- `repository`：存在 `repository.ts`，承载数据读取、内存 fallback seed、Drizzle 查询或实体映射；存在并不等于生产 DB 已可用。
- `service`：存在 `service.ts`，承载 repository 之上的业务入口或校验包装；若仅透传 repository，也仍记为 present。
- `runtime`：存在 `runtime.ts`，负责 `hasDatabaseUrl(event)`、`useDb(event)`、request context cache、fallback runtime 与 adapter 装配；存在并不等于 `DB_READY`。
- `admin-adapter`：存在 `admin-adapter.ts`，把 service 结果转换为 admin canonical `JsonVO` 风格响应。
- `legacy-adapter`：存在 `legacy-adapter.ts` / `legacy-endpoints.ts`，把 app legacy URL 和 `{ code, msg, data }` 响应 contract 接到 module service。
- `index`：存在 `index.ts`，统一导出该 domain 已有 layer。
- `equivalent`：目标 layer 不存在，但同一 domain 有明确替代边界，例如 `floor` 没有 `admin-adapter.ts`，但有 app legacy adapter/endpoints，说明它当前是 legacy-facing 而非 admin-facing。

## Domain layer matrix

| Domain      | types   | repository | service | runtime | admin-adapter | legacy-adapter | index   | Gap notes                                                                                                                                    |
| ----------- | ------- | ---------- | ------- | ------- | ------------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `community` | present | present    | present | present | present       | missing        | present | Admin canonical layer present；未见 app legacy registry 覆盖。                                                                               |
| `contract`  | present | present    | present | present | present       | missing        | present | Admin route layer present，但 `runtimeEndpointManifest` 中 `contract` 条目为 0；upload/list CRUD 的 manifest 覆盖缺口明显。                  |
| `dev`       | present | present    | present | present | present       | missing        | present | Admin canonical layer present；更偏配置/菜单类接口，未见 app legacy registry 覆盖；`runtimeEndpointManifest` 中 `dev` 条目为 0。             |
| `fee`       | present | present    | present | present | present       | present        | present | Admin + app legacy 双边界最完整；但 `repository.ts` 约 2806 行，承担 DB 查询、映射、fallback seed 与报告类聚合，后续需要拆分审计。           |
| `floor`     | present | present    | present | present | equivalent    | present        | present | 缺 `admin-adapter.ts`；当前由 legacy adapter/endpoints 暴露 `/app/floor.*`，属于 app legacy-facing equivalent，不是 admin canonical 完整层。 |
| `house`     | present | present    | present | present | present       | missing        | present | Admin canonical layer present；manifest owner 使用 `house-property`，与 module name `house` 存在命名映射。                                   |
| `operation` | present | present    | present | present | present       | missing        | present | Admin canonical layer present；manifest 覆盖 operation-team 多个 list route，但仍是 caller-not-verified 状态。                               |
| `parking`   | present | present    | present | present | present       | missing        | present | Admin canonical layer present；manifest 覆盖 parking list route，未见 app legacy registry 覆盖。                                             |
| `patrol`    | present | present    | present | present | present       | missing        | present | Admin canonical layer present；manifest 覆盖 patrol list route，未见 app legacy registry 覆盖。                                              |
| `repair`    | present | present    | present | present | present       | present        | present | Admin + app legacy 双边界 present；部分 repairs admin route 绕过 `adminAdapter` 直连 `service` 并做响应映射。                                |
| `setting`   | present | present    | present | present | present       | missing        | present | Admin canonical layer present；未见 `runtimeEndpointManifest` admin canonical 覆盖 setting-manage 路由。                                     |

## Handler boundary findings

- 扫描到 `apps/api/server/routes/api/**/*.ts` 共 160 个 route 文件。
- 其中 158 个 route 文件导入 `modules/`，并调用 `getXRuntime(event)`；2 个例外是 `debug-env.get.ts` 和 `j1-dashboard/center/commonmenu/get.ts`，它们只返回 `adminSuccess(...)`。
- 155 个 route 文件走 `runtime.adminAdapter.*`，整体符合薄 handler 形态：读取 body/query，获取 runtime，调用 adapter，异常时返回 `adminFailure(...)`。
- 3 个 route 文件直接取 `getRepairRuntime(event)` 的 `{ service }` 并在 handler 内做 list 映射与分页响应组装：
  - `apps/api/server/routes/api/property-manage/repairs-manage/return-visit/list.post.ts`
  - `apps/api/server/routes/api/property-manage/repairs-manage/phone-report-repairs/list.post.ts`
  - `apps/api/server/routes/api/property-manage/repairs-manage/mandatory-return-issue/list.post.ts`
- 68 个 route 文件调用 `setResponseStatus(...)`；这本身不是分层错误，但说明 handler 仍承担 HTTP 状态转换职责，后续可评估是否归入 adapter/shared runtime。
- `apps/api/server/routes/api/debug-env.get.ts` 暴露环境调试响应，属于 runtime diagnostics，不应被误读为业务迁移完成证据。
- `apps/api/server/shared/runtime/runtime-endpoints.ts` 约 615 行，集中维护 app legacy definitions 汇总、admin canonical manifest、cutover status 判定，已经成为跨 domain registry 聚合点。
- `apps/api/server/modules/fee/repository.ts` 约 2806 行，既含 Drizzle 查询，也含 in-memory fallback、DTO 映射和大量默认数据，后续若做稳定性审计应单独拆分。

## Contract / legacy boundary findings

- `runtimeEndpointDefinitions` 只由 `feeLegacyEndpointDefinitions`、`repairLegacyEndpointDefinitions`、`floorLegacyEndpointDefinitions` 汇总，当前 app legacy executable registry 覆盖为 21 个 endpoint：
  - `fee`: 12
  - `repair`: 7
  - `floor`: 2
- `runtimeEndpointManifest` 额外包含 admin canonical manifest，共 81 个 `createAdminManifestEntry(...)` 调用；它是审计清单，不等同于 executable registry。
- Admin canonical manifest owner 分布中未发现 `contract`、`dev`、`setting` 条目；这些 module 虽有 route/runtime/service/repository/admin adapter，但仍缺 manifest 覆盖。
- `contract` routes 包括 list/detail/create/update/delete 与 upload init/sign/complete/status/abort 等边界，当前 route 文件存在不能证明 upload contract、R2/object storage、真实 DB 样本或写入闭环已完成。
- app legacy boundary 只覆盖 `fee`、`repair`、`floor` 三个 module；`community`、`contract`、`dev`、`house`、`operation`、`parking`、`patrol`、`setting` 未见 legacy adapter/endpoints。
- `legacy-fallback.ts` 允许 path 前缀 `/app/` 与 `/callComponent/` 代理到 legacy base URL；fallback 能力存在不等于 shadow-off 已验收，也不等于旧服务可退役。
- `runtime-endpoints.ts` 维护 `blocked-for-execution`、`app-shadow-allowlist`、`available-in-apps-api-not-caller-verified` 等状态；这些状态应继续作为审计标签，不应被压缩成单一的 "done"。

## Follow-up guardrails

- 禁止把 route 文件存在写成 `DB_READY`。
- 禁止把 `runtimeEndpointManifest` 存在写成 executable registry 全覆盖。
- 禁止把 HTTP 200 或 `adminSuccess(...)` 写成生产 DB、真实样本、写入闭环或旧服务退役完成。
- 禁止把 `fallbackRuntime` / in-memory repository 的可运行结果写成 Neon production readiness。
- 禁止把 app legacy allowlist 覆盖有限的事实写成 app 全量迁移完成。
- 后续验收 `contract` 时，应补 manifest / contract registry 证据，并单独证明 upload、写入、查询、回滚/fallback 的闭环。
- 后续验收 `repair` 时，应优先处理 3 个直连 `service` 的 repairs route，把响应映射收敛到 adapter 或明确记录例外理由。
- 后续验收 `fee` 时，应避免把大 repository 的 fallback seed 与真实 DB 查询混为一谈；报告必须标明数据来源。
