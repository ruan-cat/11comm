# §7C repair fallback-only 收口执行报告

> 任务编号：task1200、task1201（repair 部分）
> 批次：11–14
> 执行日期：2026-07-08
> 报告路径：`D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-repair-fallback-report.md`

## 1. 本次收口范围

按参考计划，本次完成 repair 模块剩余 10 个 fallback-only endpoint 的收口：

### 批次 11：只读 exact（2 个）

| URL | 方法 | 分类 | 实现说明 |
| :--- | :--- | :--- | :--- |
| `/app/ownerRepair.listStaffRepairs` | GET/POST | 只读 exact | 返回师傅已派单工单，默认状态 `10002`（已派单），支持 statusCd 覆盖 |
| `/app/ownerRepair.listStaffFinishRepairs` | GET/POST | 只读 exact | 返回师傅已完成工单，固定状态 `10004`（已完成） |

### 批次 12：POST-only guarded（3 个）

| URL | 方法 | 分类 | 实现说明 |
| :--- | :--- | :--- | :--- |
| `/app/ownerRepair.updateOwnerRepair` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED` |
| `/app/ownerRepair.repairDispatch` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED` |
| `/app/ownerRepair.repairFinish` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED` |

### 批次 13：POST-only guarded（3 个）

| URL | 方法 | 分类 | 实现说明 |
| :--- | :--- | :--- | :--- |
| `/app/ownerRepair.repairEnd` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED` |
| `/app/ownerRepair.repairStart` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED` |
| `/app/ownerRepair.repairStop` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED` |

### 批次 14：POST-only guarded（2 个）

| URL | 方法 | 分类 | 实现说明 |
| :--- | :--- | :--- | :--- |
| `/app/ownerRepair.grabbingRepair` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED` |
| `/app/repair.replyRepairAppraise` | POST | guarded | 返回 `409 PHASE7_MUTATION_GUARDED` |

## 2. 文件改动

### 2.1 repair 模块实现

| 文件 | 改动摘要 |
| :--- | :--- |
| `apps/api/server/modules/repair/types.ts` | 新增 `StaffRepairListQuery`、`StaffFinishRepairListQuery`（继承 `RepairListQuery`） |
| `apps/api/server/modules/repair/repository.ts` | 接口新增 `listStaffRepairs`、`listStaffFinishRepairs`；内存仓库实现按状态过滤并分页 |
| `apps/api/server/modules/repair/service.ts` | 暴露 `listStaffRepairs`、`listStaffFinishRepairs` 方法 |
| `apps/api/server/modules/repair/legacy-adapter.ts` | 新增只读 adapter 与 8 个 guarded 写入口；更新 `repairLegacyAdapterEvidence` |
| `apps/api/server/modules/repair/legacy-endpoints.ts` | 注册 10 个新端点（2 个 GET/POST，8 个 POST-only） |

### 2.2 测试

| 文件 | 改动摘要 |
| :--- | :--- |
| `apps/api/tests/legacy/repair-legacy-endpoints.test.ts` | 新增模块注册断言、staff 列表只读响应断言、guarded 写入口 409 断言 |

### 2.3 共享文件（按任务要求未修改）

- `apps/api/server/shared/runtime/runtime-endpoints.ts`：未修改，由主代理统一合并。
- `apps/api/tests/runtime/app-legacy-gap-registry.test.ts`：未修改，由主代理统一合并。

### 2.4 过程中修复的无关类型错误

| 文件 | 问题 | 修复 |
| :--- | :--- | :--- |
| `apps/api/server/modules/oa-workflow/runtime.ts` | `OaWorkflowRepository` 类型从 `./repository` 导入，但该类型实际导出在 `./types` | 改为从 `./types` 导入类型 |

## 3. 验证结果

### 3.1 模块 legacy 测试

```bash
pnpm -F @01s-11comm/api exec vitest run tests/legacy/repair-legacy-endpoints.test.ts
```

结果：

```
Test Files  1 passed (1)
     Tests  12 passed (12)
  Duration  19ms
```

### 3.2 类型检查

```bash
pnpm -F @01s-11comm/api run typecheck
```

结果：

```
$ tsc --noEmit
```

（无错误，通过）

## 4. 关键设计说明

### 4.1 只读 exact 响应包

所有只读端点均按现有模块约定返回 `{ code, msg, data }`：

```ts
{
  code: 0,
  msg: "查询成功",
  data: {
    ownerRepairs: RepairItem[],
    total: number,
    page: number,
    row: number,
  }
}
```

数据为 deterministic compat seed，由 `InMemoryRepairRepository` 提供；DB 模式下因 `Object.assign(fallback, {...})` 结构自动复用内存实现，符合当前仓库混合 fallback 策略。

### 4.2 POST-only guarded 行为

8 个写入口均直接返回：

```ts
legacyFailure(
  `Phase7 mutation guard blocked ${action}; set PHASE7_ALLOW_LEGACY_MUTATIONS=1 only for controlled rollback evidence runs.`,
  409,
  { errorCode: "PHASE7_MUTATION_GUARDED" },
);
```

不执行真实 CUD、不调用旧 app fallback、不依赖 `PHASE7_ALLOW_LEGACY_MUTATIONS` 环境变量。

### 4.3 Evidence 更新

`repairLegacyAdapterEvidence` 已更新：

- `endpoints` 新增 `/app/ownerRepair.listStaffRepairs`、`/app/ownerRepair.listStaffFinishRepairs`
- `guardedEndpoints` 新增 8 个 POST-only 写入口
- `notCovered` 移除已收口的 8 个 URL 与 2 个只读 URL，仅保留 `db-backed-repair-statistics-data`、`production-app-h5-repair-network`

## 5. 风险与后续

1. 共享文件 `runtime-endpoints.ts` 和 `app-legacy-gap-registry.test.ts` 需由主代理合并，将新端点纳入 `phase7RepairReadonlyAppShadowUrls`、`phase7BlockedAppLegacyMutationUrls` 和 gap 清单移除。
2. 真实写入仍受控于 `PHASE7_ALLOW_LEGACY_MUTATIONS`，本批次未开启真实 CUD。
3. 只读数据为 seed 数据，非生产 DB 数据。
