# property-application 模块 fallback-only 收口报告

> 任务编号：task1200、task1201（property-application 部分）  
> 执行日期：2026-07-08  
> 报告路径：`D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-property-application-fallback-report.md`

## 目标

按参考计划完成 property-application 模块剩余 6 个 fallback-only endpoint 的收口：

- 批次 1：2 个只读 exact
- 批次 2：4 个 POST-only guarded 写入口

## 已收口端点清单

| URL | 方法 | 分类 | 行为 |
| :--- | :--- | :--- | :--- |
| `/app/applyRoomDiscount/queryApplyRoomDiscount` | GET/POST | 只读 exact | 返回 deterministic compat seed 列表/详情；支持 `ardId` 查详情；不修改内存态 |
| `/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord` | GET/POST | 只读 exact | 返回 deterministic compat seed 跟踪记录列表；支持 `communityId`、`applicationId`、`roomId`、`roomName` 筛选 |
| `/app/applyRoomDiscount/updateApplyRoomDiscount` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED`，不执行真实更新 |
| `/app/applyRoomDiscount/updateReviewApplyRoomDiscount` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED`，不执行真实审核 |
| `/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED`，不执行真实新增 |
| `/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED`，不执行真实删除 |

## 文件改动

### 新增/修改模块文件

- `apps/api/server/modules/property-application/types.ts`：新增 `ApplyRoomDiscount`、`ApplyRoomDiscountListQuery`、`ApplyRoomDiscountListResult`、`ApplyRoomDiscountRecord`、`ApplyRoomDiscountRecordQuery`、`ApplyRoomDiscountRecordListResult` 等类型。
- `apps/api/server/modules/property-application/repository.ts`：新增 `applyRoomDiscounts`、`applyRoomDiscountRecords` seed 数据；实现 `getApplicationById`、`getApplicationList`、`getRecordList`。
- `apps/api/server/modules/property-application/service.ts`：暴露 `getApplicationById`、`getApplicationList`、`getRecordList`。
- `apps/api/server/modules/property-application/legacy-adapter.ts`：新增 `queryApplyRoomDiscount`、`queryApplyRoomDiscountRecord`、`guardedWrite`；更新 `propertyApplicationLegacyAdapterEvidence`（`endpoints`、`guardedEndpoints`、`notCovered`）。
- `apps/api/server/modules/property-application/legacy-endpoints.ts`：注册上述 6 个新端点；原有只读端点保持不变。

### 测试文件

- `apps/api/tests/legacy/property-application-legacy-endpoints.test.ts`：新增 12 个测试用例，覆盖：
  - 只读端点 GET/POST 注册
  - guarded 写入口 POST 注册且 GET 未注册
  - 申请列表、详情、404 未知详情、按房间名/状态筛选
  - 跟踪记录列表
  - 全部写入口返回 `409 PHASE7_MUTATION_GUARDED`

## 验证结果

```bash
pnpm -F @01s-11comm/api exec vitest run tests/legacy/property-application-legacy-endpoints.test.ts
```

结果：12 个测试全部通过。

```bash
pnpm -F @01s-11comm/api run typecheck
```

结果：通过，无类型错误。

## 问题与修复

实现过程中遇到 `repository.ts` 中 `query.roomName` 为 `string | undefined`，在 `Array.prototype.filter` 闭包内 TypeScript 无法收窄，导致 `String.prototype.includes` 参数类型错误。修复方式是将 `query.roomName` 提前提取为局部常量，使闭包内类型正确收窄。详细记录见同目录 `agent-findings.md`。

## 未修改共享文件说明

按任务约束，以下共享文件未在本分支修改：

- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/tests/runtime/app-legacy-gap-registry.test.ts`

影响：

- 新注册端点尚未从 `remainingAppLegacyGapPaths` 移除；运行 `app-legacy-gap-registry.test.ts` 会失败，需主代理在合并阶段同步移除。
- `runtimeEndpointManifest` 中 4 个 guarded 写入口的 `cutoverStatus` 仍显示为 `app-shadow-allowlist`，需主代理调整为 `blocked-for-execution`（例如将 property-application 入口改为按 URL 判断 phase/cutoverStatus）。

本模块端点 handler 本身已按规范返回 `409 PHASE7_MUTATION_GUARDED`，功能行为已收敛。

## 后续建议

1. 主代理合并时同步更新 `runtime-endpoints.ts` 与 `app-legacy-gap-registry.test.ts`。
2. 待真实 DB-backed 写入窗口开启后，为 4 个写入口补充 read-back/rollback/residual check 证据，再移出 guarded 状态。
