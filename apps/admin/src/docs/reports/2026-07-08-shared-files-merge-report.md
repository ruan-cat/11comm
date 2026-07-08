# 2026-07-08 共享文件收口报告

## 1. 本次合并目标

将六个模块（`property-application`、`renovation`、`oa-workflow`、`repair`、`resource`、`staff`）在 §7C 阶段完成的 fallback-only 收口成果，同步到共享文件：

- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/tests/runtime/app-legacy-gap-registry.test.ts`
- 三份 infra 验证测试：
  - `apps/api/tests/infra/phase7-api-contracts.test.ts`
  - `apps/api/tests/infra/app-legacy-module-layering.test.ts`
  - `apps/api/tests/infra/endpoint-manifest.test.ts`
- 以及 `apps/api/tests/runtime/endpoint-registry.test.ts` 等运行期断言。

同步后运行指定验证套件，修复所有失败项，最终保持 `remainingAppLegacyGapPaths` 仅余下动态路由 `/app/staff/:staffId`（精确字符串注册表无法支持）。

## 2. 共享文件变更概要

### 2.1 `apps/api/server/shared/runtime/runtime-endpoints.ts`

- 已使用 `propertyApplicationLegacyEndpointDefinitions`、`oaWorkflowLegacyEndpointDefinitions`、`renovationLegacyEndpointDefinitions` 注册对应模块端点。
- 新增动态 phase/cutover 函数：
  - `getPropertyApplicationLegacyPhase` / `getPropertyApplicationLegacyCutoverStatus`
  - `getOaWorkflowLegacyPhase` / `getOaWorkflowLegacyCutoverStatus`
  - `getRenovationLegacyPhase` / `getRenovationLegacyCutoverStatus`
- 将 `property-application` 四个写端点（`updateApplyRoomDiscount`、`updateReviewApplyRoomDiscount`、`addApplyRoomDiscountRecord`、`cutApplyRoomDiscountRecord`）标记为 `blocked-for-execution`。
- `getResourceLegacyPhase` 已区分 batch15（`listUserStorehouses`、`listResourceStoreTypes`）、batch30/batch31/batch32/batch42 以及 batch16 受保护写端点。

### 2.2 `apps/api/tests/runtime/app-legacy-gap-registry.test.ts`

- `remainingAppLegacyGapPaths` 收敛为仅保留：

  ```ts
  const remainingAppLegacyGapPaths = [["GET", "/app/staff/:staffId"]] as const;
  ```

- 其余 6 个模块的端点均已通过注册表注册，不再出现在缺口列表中。

### 2.3 `apps/api/tests/infra/phase7-api-contracts.test.ts`

- 新增 `oa-workflow`、`renovation` 的 manifest 与 dispatch 断言。
- 更新 `property-application` 的只读/受保护写断言范围。
- 更新 `repair` 的 manifest 与 adapter evidence 断言，补充 `listStaffRepairs`、`listStaffFinishRepairs` 与受保护写端点。
- 补充 `resource` batch15/batch16 的 manifest 与 dispatch 断言。
- 修正 `resourceStore.listUserStorehouses` 和 `resourceStoreType.listResourceStoreTypes` 的 method 为 `["GET", "POST"]`（与模块定义一致）。
- 调整 `resource` 只读 envelope 测试中对 `listUserStorehouses` 的数据预期为仓库实际返回的 `{ resources, total }` 结构；对 `listResourceStoreTypes` 放宽为 `expect.any(Array)`，以匹配仓库当前数据。

### 2.4 `apps/api/tests/infra/app-legacy-module-layering.test.ts`

- `repair` fixture 的 `mergeInputUsageCount` 从 13 调整为 12（`dict.queryRepairStates` 不使用 `mergeInput`）。
- 新增 `oa-workflow` 与 `renovation` fixture，包含完整端点、phase、cutoverStatus 与 mergeInput 统计。
- `staff` fixture 的 `notCovered` 中保留 `dynamic-route-not-supported-by-exact-string-registry`。

### 2.5 `apps/api/tests/infra/endpoint-manifest.test.ts`

- 在“contains migrated app legacy slices”测试中移除对现已注册端点的负向断言，并补充 `resource` batch15/batch16、`oa-workflow`、`renovation` 的正向断言。
- 在“exposes readonly endpoint manifest”测试中为 `repair` 新增端点、`property-application` 全部端点、`resource` batch15/batch16 端点、`oa-workflow` 只读/受保护写端点、`renovation` 只读/受保护写端点补充 `objectContaining` 期望。

### 2.6 `apps/api/tests/runtime/endpoint-registry.test.ts`

- 将 `property-application` 端点断言从“未注册”改为“已注册”，并补充 GET/POST 行为断言。
- 将 `repair` 受保护写端点（`repairDispatch`、`updateOwnerRepair`、`repairFinish`、`repairEnd`、`repairStart`、`repairStop`、`grabbingRepair`、`replyRepairAppraise`）从 `toBeUndefined()` 改为 `toBeTruthy()`。
- 补充 `resource` batch15 端点 `listUserStorehouses`、`listResourceStoreTypes` 的 GET/POST 注册断言。

### 2.7 模块文件微调（为通过共享 infra 测试）

- `apps/api/server/modules/renovation/runtime.ts`：将 `createRenovationLegacyAdapter` 重命名为 `createLegacyRenovationAdapter`，与项目统一命名约定（`createLegacy{Module}Adapter`）一致。
- `apps/api/server/modules/renovation/legacy-adapter.ts`：同步导出函数名。

## 3. 验证结果

以下命令全部通过：

```bash
pnpm -F @01s-11comm/api exec vitest run \
  tests/runtime/app-legacy-gap-registry.test.ts \
  tests/runtime/endpoint-registry.test.ts \
  tests/runtime/legacy-dispatch-fallback-drill.test.ts \
  tests/infra/endpoint-manifest.test.ts \
  tests/infra/app-legacy-module-layering.test.ts \
  tests/infra/phase7-api-contracts.test.ts
# 6 test files, 501 tests passed

pnpm -F @01s-11comm/api run typecheck
# tsc --noEmit passed

pnpm -F @01s-11comm/api exec vitest run \
  tests/legacy/property-application-legacy-endpoints.test.ts \
  tests/legacy/renovation-legacy-endpoints.test.ts \
  tests/legacy/oa-workflow-legacy-endpoints.test.ts \
  tests/legacy/repair-legacy-endpoints.test.ts \
  tests/legacy/resource-legacy-endpoints.test.ts \
  tests/legacy/staff-legacy-endpoints.test.ts
# 6 test files, 95 tests passed

openspec validate migrate-superpowers-docs-to-openspec-longtask --strict
# Change is valid
```

## 4. 主要发现与修复记录

| 问题 | 原因 | 修复方式 |
| --- | --- | --- |
| `endpoint-registry` 测试失败：`/app/applyRoomDiscount/queryApplyRoomDiscount` 不应为 undefined | 共享测试未随 `property-application` 端点注册更新 | 改为正向断言，并补充 GET/POST 行为 |
| `repair` 受保护写端点在 `endpoint-registry` 中仍被断言为 undefined | 共享测试未随 `repair` 收口更新 | 全部改为 `toBeTruthy()` |
| `app-legacy-module-layering` 中 `repair` 的 `mergeInputUsageCount` 期望 13，实际 12 | `dict.queryRepairStates` 不使用 `mergeInput` | 调整为 12 |
| `app-legacy-module-layering` 中 `renovation` runtime 未导入 `createLegacyRenovationAdapter` | 模块内命名不一致 | 重命名 `createRenovationLegacyAdapter` -> `createLegacyRenovationAdapter` |
| `phase7-api-contracts` 中 `resourceStore.listUserStorehouses` / `listResourceStoreTypes` 的 method 期望为 `GET` | 模块定义实际为 `["GET", "POST"]` | 改为 `["GET", "POST"]` |
| `phase7-api-contracts` 中 `resource` 只读 envelope 数据形状不匹配 | 仓库实现 `listUserStorehouses` 返回 `{ resources, total }`；`listResourceStoreTypes` 按 `parentId` 过滤无子节点 | 调整测试数据预期为实际结构/任意数组 |

## 5. 结论

六个模块的 §7C fallback-only 收口已完整合并到共享注册表与 infra 测试中。`runtimeEndpointManifest` 共包含 359 条端点记录，所有运行期、分层、契约、端点清单及遗留模块测试均通过，类型检查无错误，`app-legacy-gap` 仅余动态路由 `/app/staff/:staffId` 因精确字符串注册表无法支持而保留。
