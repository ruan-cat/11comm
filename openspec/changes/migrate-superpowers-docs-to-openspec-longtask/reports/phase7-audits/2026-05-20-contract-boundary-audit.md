# Task 117 Admin/App Contract Boundary Audit

## 审计范围

本 artifact 只审计 task 117 的契约边界：同一业务同时服务 admin 与 app 时，允许共用 repository/service，但 admin canonical contract 与 app legacy contract 必须通过 adapter、runtime manifest 和 legacy dispatch 分开输出，不得用 admin `JsonVO` / `PageDTO` / DTO 覆盖 app 旧 envelope。

只读范围：

- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`
- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/specs/unified-nitro-api-consolidation/spec.md`
- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/specs/app-legacy-cutover/spec.md`
- `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/module-layering-audit.md`
- `apps/api/server/modules/fee/**`
- `apps/api/server/modules/repair/**`
- `apps/api/server/modules/floor/**`
- `apps/api/server/shared/runtime/response-builder.ts`
- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/server/shared/runtime/endpoint-registry.ts`
- `apps/api/server/shared/runtime/legacy-fallback.ts`
- `apps/api/server/handlers/legacy-dispatch.ts`
- `apps/api/server/routes/api/property-manage/repairs-manage/**`

## 有效命令

```log
rg -n -C 8 "117|Admin canonical|App legacy|dual|envelope|契约|canonical|legacy" openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md
rg -n -C 5 "Admin canonical|App legacy|双契约|canonical|legacy|envelope|Contract|contract|response" openspec/changes/migrate-superpowers-docs-to-openspec-longtask/specs/unified-nitro-api-consolidation/spec.md
Get-Content -Raw -Encoding UTF8 openspec/changes/migrate-superpowers-docs-to-openspec-longtask/specs/app-legacy-cutover/spec.md
Get-Content -Raw -Encoding UTF8 openspec/changes/migrate-superpowers-docs-to-openspec-longtask/module-layering-audit.md
rg --files apps/api/server/modules/fee apps/api/server/modules/repair apps/api/server/modules/floor apps/api/server/shared/runtime apps/api/server/handlers
rg -n "runtimeEndpointDefinitions|runtimeEndpointManifest|createAdminManifestEntry|targetClient|responseContract|legacy|admin" apps/api/server/shared/runtime/runtime-endpoints.ts apps/api/server/shared/runtime/endpoint-registry.ts apps/api/server/handlers/legacy-dispatch.ts apps/api/server/shared/runtime/legacy-fallback.ts
rg -n "getFeeRuntime\(event\)\.legacyAdapter|getRepairRuntime\(event\)\.legacyAdapter|getFloorRuntime\(event\)\.legacyAdapter" apps/api/server/modules/fee/legacy-endpoints.ts apps/api/server/modules/repair/legacy-endpoints.ts apps/api/server/modules/floor/legacy-endpoints.ts
rg -n "createFee|adminAdapter|legacyAdapter|legacySuccess|adminSuccess|legacyMutationGuarded" apps/api/server/modules/fee apps/api/server/shared/runtime/response-builder.ts
rg -n "createRepair|adminAdapter|legacyAdapter|legacySuccess|adminSuccess|legacyMutationGuarded|getRepairRuntime\(event\)|service\." apps/api/server/modules/repair apps/api/server/routes/api/property-manage/repairs-manage apps/api/server/shared/runtime/response-builder.ts
rg -n "createFloor|legacyAdapter|legacySuccess|floorLegacyEndpointDefinitions|floorId|admin-adapter" apps/api/server/modules/floor apps/api/server/shared/runtime/runtime-endpoints.ts
```

## 结论

`fee` 与 `repair` 当前同时服务 admin canonical 与 app legacy。两者都共用同一 runtime 内的 repository/service，再分别装配 `adminAdapter` 和 `legacyAdapter`，契约输出在源码层面是分开的：admin adapter 返回 `adminSuccess(...)` 包装的 `JsonVO`，app legacy adapter 返回 `legacySuccess(...)` / `legacyFailure(...)` 包装的 `{ code, msg, data }`。

`floor` 当前只支持 app legacy-facing equivalent。它有 repository/service/runtime/legacy-adapter/legacy-endpoints，但没有 `admin-adapter.ts`，runtime 也没有 `adminAdapter`。因此 `floor` 不能被写成 admin canonical 已完成，只能作为 app legacy 兼容边界审计。

其他 module 如 `community`、`contract`、`dev`、`house`、`operation`、`parking`、`patrol`、`setting` 在 `module-layering-audit.md` 中已记录为 admin canonical layer present 但未见 app legacy adapter/endpoints。它们不能被 app legacy registry 的结论覆盖。

本轮未发现 app legacy endpoint 直接返回 admin `JsonVO` 的证据。相反，`runtimeEndpointManifest` 明确把 app legacy manifest 标记为 `targetClient: "app"`、`routeKind: "app-legacy"`、`responseContract: "{ code, msg, data }"`，admin canonical manifest 标记为 `targetClient: "admin"`、`routeKind: "admin-canonical"`、`responseContract: "JsonVO"`。

## 文件级证据

### OpenSpec 任务与规范

- `tasks.md:117` 明确 task 117：admin canonical contract 与 app legacy contract 必须分开，同一业务可共用 service/repository，但不得用 admin DTO 覆盖 app 旧响应 envelope。
- `specs/unified-nitro-api-consolidation/spec.md:17` 要求 admin legacy Nitro stream 与 app legacy/mock Nitro stream 独立跟踪，任一源流完成不得推导另一源流完成。
- `specs/unified-nitro-api-consolidation/spec.md:45` 定义 Admin canonical 与 App legacy 双契约输出；`spec.md:47` 要求 admin 返回 `JsonVO`、`PageDTO` 或统一 DTO，app 保留 `/app/**`、`/callComponent/**` 旧路径、旧字段、旧 envelope、GET/POST 兼容和旧错误语义。
- `specs/unified-nitro-api-consolidation/spec.md:49` 至 `spec.md:56` 要求同一业务共用核心 service/repository，再由 adapter 做契约转换；若 app legacy endpoint 直接返回 admin canonical DTO 或丢失旧 envelope，必须保持未完成。
- `specs/app-legacy-cutover/spec.md:12` 至 `spec.md:24` 要求每个 app legacy endpoint 记录旧路径、method、adapter、response contract、guard、fallback、browser/HTTP evidence 等字段，manifest 存在但仍走 fallback 时不能标记 DB 完成。
- `specs/app-legacy-cutover/spec.md:78` 至 `spec.md:85` 要求 floor 记录合成 `floorId` 兼容语义，不得误写为真实 floor 主键。
- `specs/app-legacy-cutover/spec.md:87` 至 `spec.md:99` 要求 repair 区分只读、字典、设置和写入；写入口未开启窗口时必须保持 `409 PHASE7_MUTATION_GUARDED`。
- `specs/app-legacy-cutover/spec.md:101` 至 `spec.md:113` 要求 fee/report legacy 区分只读、高风险写入口和数据源 gap，不得把部分字段来源写成完整语义迁移。
- `specs/app-legacy-cutover/spec.md:115` 至 `spec.md:128` 明确 admin 收费/缴费证据不能升级 `/app/fee/**`、`/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable` 或 `/app/fee.saveRoomCreateFee`。
- `specs/app-legacy-cutover/spec.md:166` 至 `spec.md:171` 要求 app legacy readiness 独立于 admin readiness。

### Shared runtime contract

- `apps/api/server/shared/runtime/response-builder.ts:3` 至 `response-builder.ts:17` 定义 app legacy envelope：`LegacyResponse<T>` 包含 `code`、`msg`、`data`，`legacySuccess` 返回 `code: 0`。
- `apps/api/server/shared/runtime/response-builder.ts:33` 至 `response-builder.ts:39` 定义 admin canonical envelope：`adminSuccess` 返回 `JsonVO<T>`，包含 `success: true`、`code: 200`、`message`、`data`。
- `apps/api/server/shared/runtime/runtime-endpoints.ts:6` 至 `runtime-endpoints.ts:24` 定义 manifest 字段，显式区分 `targetClient`、`routeKind` 和 `responseContract`。
- `apps/api/server/shared/runtime/runtime-endpoints.ts:42` 至 `runtime-endpoints.ts:60` 只把 `feeLegacyEndpointDefinitions`、`repairLegacyEndpointDefinitions`、`floorLegacyEndpointDefinitions` 放入 app legacy executable entries。
- `apps/api/server/shared/runtime/runtime-endpoints.ts:554` 至 `runtime-endpoints.ts:565` 把 app legacy entries 标记为 `targetClient: "app"`、`routeKind: "app-legacy"`、`responseContract: "{ code, msg, data }"`。
- `apps/api/server/shared/runtime/runtime-endpoints.ts:568` 至 `runtime-endpoints.ts:582` 的 `createAdminManifestEntry` 把 admin entries 标记为 `method: "POST"`、`targetClient: "admin"`、`routeKind: "admin-canonical"`、`responseContract: "JsonVO"`。
- `apps/api/server/handlers/legacy-dispatch.ts:12` 只用 `runtimeEndpointDefinitions` 创建 executable registry；`legacy-dispatch.ts:19` dispatch 到该 registry；`legacy-dispatch.ts:55` 在错误路径仍返回 `legacyFailure(...)`，不返回 `adminFailure(...)`。
- `apps/api/server/shared/runtime/endpoint-registry.ts:21` 至 `endpoint-registry.ts:30` 按 method + url 建 registry；`endpoint-registry.ts:41` 至 `endpoint-registry.ts:51` 未命中时抛 404，避免 fallback 前把 admin manifest 当成 app executable route。
- `apps/api/server/shared/runtime/legacy-fallback.ts:15` 至 `legacy-fallback.ts:17` 只允许 `/app/` 与 `/callComponent/` 作为 legacy fallback path；`legacy-fallback.ts:36` 至 `legacy-fallback.ts:66` 是 proxy 能力，不等同于 app legacy 已完成或旧服务可退役。

### Fee

- `apps/api/server/modules/fee/runtime.ts:8` 至 `runtime.ts:13` 的 `FeeRuntime` 同时暴露 `repository`、`service`、`adminAdapter`、`legacyAdapter`。
- `apps/api/server/modules/fee/runtime.ts:32` 至 `runtime.ts:39` 用同一 `FeeRepository` 创建 `FeeService`，再分别创建 `createAdminFeeAdapter(service)` 与 `createLegacyFeeAdapter(service)`。
- `apps/api/server/modules/fee/admin-adapter.ts:39` 至 `admin-adapter.ts:68` 是 admin canonical list 样例，返回 `adminSuccess({ list, total, pageIndex, pageSize, totalPages })`。
- `apps/api/server/modules/fee/admin-adapter.ts:733` 至 `admin-adapter.ts:764` 的 owner payment details 也返回 admin `JsonVO<PageDTO<...>>` 风格分页。
- `apps/api/server/modules/fee/legacy-adapter.ts:4` 至 `legacy-adapter.ts:19` 定义 app `/app/fee.listFee` 适配器，使用 `page` / `row` / `communityId` 等旧参数并返回 `legacySuccess(result, "查询费用列表成功")`。
- `apps/api/server/modules/fee/legacy-adapter.ts:40` 至 `legacy-adapter.ts:80` 对 `payment.nativeQrcodePayment`、`oweFeeCallable.writeOweFeeCallable`、`fee.saveRoomCreateFee` 先检查 `isLegacyMutationAllowed()`，未开启写入窗口时返回 guarded legacy response。
- `apps/api/server/modules/fee/legacy-endpoints.ts:4` 至 `legacy-endpoints.ts:67` 定义 12 个 fee app legacy endpoint，路径均为 `/app/**` 且 handler 调用 `getFeeRuntime(event).legacyAdapter.*`。
- `apps/api/server/modules/fee/repository.ts:311` 至 `repository.ts:323` 同时支持 DB repository 与 in-memory repository；`repository.ts:395` 至 `repository.ts:396` 明确部分 legacy 参数不推入 UUID 列，说明仍有兼容 gap；`repository.ts:1691` 至 `repository.ts:1745` 展示报告类 DB snapshot 映射；`repository.ts:1908` 至 `repository.ts:1919` 展示 in-memory fallback filter。该 repository 很大且混合 DB/fallback/映射，不能把存在 repository 误写成 app legacy 全面 DB-ready。

### Repair

- `apps/api/server/modules/repair/runtime.ts:8` 至 `runtime.ts:13` 的 `RepairRuntime` 同时暴露 `repository`、`service`、`adminAdapter`、`legacyAdapter`。
- `apps/api/server/modules/repair/runtime.ts:32` 至 `runtime.ts:39` 用同一 `RepairRepository` 创建 `RepairService`，再分别创建 admin 与 legacy adapter。
- `apps/api/server/modules/repair/admin-adapter.ts:16` 至 `admin-adapter.ts:35`、`admin-adapter.ts:79` 至 `admin-adapter.ts:94` 通过 `adminSuccess(toPageResult(...))` 输出 admin canonical `JsonVO<PageDTO<...>>`。
- `apps/api/server/modules/repair/legacy-adapter.ts:4` 至 `legacy-adapter.ts:25` 通过 `legacySuccess({ ownerRepairs: ... })`、`legacySuccess({ ownerRepair: ... })` 保留 app 旧 envelope 和旧字段容器。
- `apps/api/server/modules/repair/legacy-adapter.ts:27` 至 `legacy-adapter.ts:47`、`legacy-adapter.ts:71` 至 `legacy-adapter.ts:87` 对 app 维修写入和评价写入使用 `legacyMutationGuarded(...)`，未开启 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 时不执行真实写。
- `apps/api/server/modules/repair/legacy-endpoints.ts:4` 至 `legacy-endpoints.ts:43` 定义 7 个 repair app legacy endpoint，覆盖 `/app/ownerRepair.*`、`/app/repairSetting.*`、`/app/dict.*` 和 `/callComponent/**`。
- `apps/api/server/routes/api/property-manage/repairs-manage/return-visit/list.post.ts:9` 至 `list.post.ts:45`、`phone-report-repairs/list.post.ts:9` 至 `list.post.ts:44`、`mandatory-return-issue/list.post.ts:9` 至 `list.post.ts:44` 是风险边界：这些 admin route 直取 `getRepairRuntime(event)` 的 `service` 并在 handler 内拼装 `adminSuccess(...)`，没有污染 app legacy envelope，但属于 admin handler 偏厚，应后续收敛到 adapter 或记录例外。

### Floor

- `apps/api/server/modules/floor/runtime.ts:7` 至 `runtime.ts:11` 的 `FloorRuntime` 只有 `repository`、`service`、`legacyAdapter`，没有 `adminAdapter`。
- `apps/api/server/modules/floor/runtime.ts:30` 至 `runtime.ts:36` 只创建 `createLegacyFloorAdapter(service)`。
- `apps/api/server/modules/floor/legacy-adapter.ts:4` 至 `legacy-adapter.ts:33` 只输出 app legacy envelope：list/detail 都返回 `legacySuccess(...)` 或 `legacyFailure(...)`。
- `apps/api/server/modules/floor/legacy-endpoints.ts:4` 至 `legacy-endpoints.ts:15` 只注册 `/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail` 两个 app legacy endpoint。
- `apps/api/server/modules/floor/repository.ts:97` 至 `repository.ts:113` 从 `hpHouses` 行聚合出 floor 兼容视图，并用 `encodeDbFloorId(...)` 生成兼容 `floorId`；`repository.ts:136` 至 `repository.ts:141` 解析 `DB_{communityId}_...` 格式。该 `floorId` 是兼容 ID，不应写成真实 floor 专表主键或 admin canonical 完成。
- `rg --files apps/api/server/modules/floor | rg "admin-adapter"` 未返回文件，进一步确认 `floor` 当前没有 admin adapter。

## 风险 / 误报边界

- `repair` 的 3 个 admin route 直连 service 做 DTO 拼装与分页返回，仍返回 admin `JsonVO`，没有覆盖 app legacy envelope；但这不是理想分层，应保留为 handler 偏厚风险。
- `floor` 只有 legacy-facing equivalent，不支持 admin canonical；不得因为它有 repository/service/runtime 就标为 admin/app 双契约完成。
- `fee` repository 体积大，混合 DB 查询、fallback seed、DTO 映射和报告聚合。它能支撑 admin 与 app adapter 分离，但不能证明真实 DB 样本、字段语义、写入闭环或 app 全量缴费 legacy 完成。
- `runtimeEndpointDefinitions` 当前只汇总 `fee`、`repair`、`floor` 的 21 个 app legacy executable endpoint；这只代表当前 apps/api app legacy registry 覆盖面，不代表 app legacy 全量完成。
- `runtimeEndpointManifest` 含 81 条 admin canonical manifest entry；它是审计清单，不等同于 app executable registry，也不能作为 app legacy 完成证据。
- `legacy-fallback.ts` 的 `/app/` 与 `/callComponent/` proxy 能力只说明存在保护路径；fallback 可用不等于 shadow-off 已验收，也不等于旧 app 服务可退役。
- guarded 写入口返回 `409 PHASE7_MUTATION_GUARDED` 只能证明保护逻辑正常，不代表真实写入能力完成。
- app legacy spec 中 repair、fee、floor 的已有 DB 分支、HTTP gate 或本地 H5 证据仍必须独立补 production、真实库样本、fallback/shadow-off、调用端和 retirement decision。

## No-Go 边界

本项只代表 contract boundary audit，不代表：

- 生产 `DB_READY`
- Neon main 真实库样本
- fallback / shadow-off 验收完成
- app H5 或 admin H5 页面切流完成
- 写入口 read-back / rollback / cleanup / residual check 闭环完成
- fee / repair / floor 任一 endpoint production-ready
- app legacy 全量迁移完成
- admin old path 全量完成
- runtime manifest 与 route 文件树全量一致
- 旧 `apps/admin/server`、`apps/app/server` 或旧 app 项目可退役
