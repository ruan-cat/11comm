# task1200/task1201 staff 动态路由 not-candidate 标记报告

> 任务编号：task1200、task1201（staff 部分）
> OpenSpec change：`migrate-superpowers-docs-to-openspec-longtask`
> 参考计划：`apps/admin/src/docs/reports/2026-07-08-fallback-only-scan-plan.md`
> 报告日期：2026-07-08

## 目标

将 `/app/staff/:staffId` 标记为 **not-candidate**，因为当前 `apps/api` 的 endpoint registry 为精确字符串匹配，不支持 `:staffId` 动态路由参数。

## 结论

已完成标记。`/app/staff/:staffId` 未在 `apps/api` 中注册为 exact endpoint，且 `staffLegacyAdapterEvidence.notCovered` 已显式保留该路径并说明原因。

## 文件改动

### 1. `apps/api/server/modules/staff/legacy-adapter.ts`

- 在 `staffLegacyAdapterEvidence.notCovered` 中保留 `/app/staff/:staffId`。
- 新增 `dynamic-route-not-supported-by-exact-string-registry` 说明项。
- 添加注释：当前 endpoint registry 为精确字符串匹配，无法承载参数化路径；现有 `/app/staff/STAFF_001` 仅作为样例 exact endpoint 存在；泛化员工详情需改造 registry 或迁移为 admin-canonical REST 路径。

### 2. `apps/api/server/modules/staff/legacy-endpoints.ts`

- 未改动。已确认该文件仅注册精确路径，无 `/app/staff/:staffId` 精确注册；仅有 `/app/staff/STAFF_001` 样例 endpoint。

### 3. `apps/api/tests/legacy/staff-legacy-endpoints.test.ts`

- 导入 `staffLegacyAdapterEvidence`。
- 新增测试 `marks /app/staff/:staffId as not-candidate because the exact registry cannot match dynamic route parameters`，覆盖：
  - `findEndpointDefinition(registry, "GET", "/app/staff/:staffId")` 返回 `undefined`。
  - `findEndpointDefinition(registry, "POST", "/app/staff/:staffId")` 返回 `undefined`。
  - `staffLegacyAdapterEvidence.notCovered` 包含 `/app/staff/:staffId` 与 `dynamic-route-not-supported-by-exact-string-registry`。
  - `staffLegacyAdapterEvidence.endpoints` 与 `guardedEndpoints` 均不包含 `/app/staff/:staffId`。

## 未改动文件

根据任务约束，以下共享文件未修改：

- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/tests/runtime/app-legacy-gap-registry.test.ts`

## 验证结果

### 必做验证

1. `pnpm -F @01s-11comm/api exec vitest run tests/legacy/staff-legacy-endpoints.test.ts`
   - 结果：**通过**。18 tests passed，1 test file passed。

2. `pnpm -F @01s-11comm/api run typecheck`
   - 结果：**通过**。`tsc --noEmit` 无错误退出。

### 额外健全性检查

额外运行 `pnpm -F @01s-11comm/api exec vitest run tests/infra/phase7-api-contracts.test.ts`，发现 2 个与 staff 无关的预存失败：

- `property-application readonly adapter evidence stays scoped to exact read handlers`：property-application 模块的 evidence scope 与 endpoints 已更新，但 infra 测试断言仍使用旧值。
- `repair adapter evidence separates readonly handlers from blocked write actions`：repair 模块的 endpoints 与 guardedEndpoints 已扩展，但 infra 测试断言仍使用旧清单。

staff 相关断言在该文件中全部通过。

> 详细发现与输出记录见：`D:\code\ruan-cat\01s-11comm\agent-findings.md`

## 后续建议

- `/app/staff/:staffId` 当前由旧 `apps/app/server` 的 fallback 承接；关闭 fallback 时该动态路径会 404 或进入 fail-closed 处理。
- 若后续需要由 `apps/api` 承载员工详情，应优先改造 registry 支持参数化路径匹配，或迁移为 admin-canonical REST 路径（如 `/api/staff/:staffId`），而非在 exact registry 中注册动态表达式。

## 关联引用

- 计划文件：`apps/admin/src/docs/reports/2026-07-08-fallback-only-scan-plan.md`
- 发现记录：`D:\code\ruan-cat\01s-11comm\agent-findings.md`
