# §7C resource 模块 fallback-only 收口报告

> 任务编号：task1200、task1201（resource 部分）  
> 执行日期：2026-07-08  
> 报告路径：`D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-resource-fallback-report.md`

## 1. 完成范围

按参考计划完成 resource 模块剩余 **11 个 fallback-only endpoint** 的收口，对应批次 15–18。

### 1.1 只读 exact（批次 15）

| URL | 注册方法 | 行为 |
| :--- | :--- | :--- |
| `/app/resourceStore.listUserStorehouses` | GET + POST | 返回 deterministic compat seed 用户仓库列表 |
| `/app/resourceStoreType.listResourceStoreTypes` | GET + POST | 返回 deterministic compat seed 仓库类型列表 |

### 1.2 POST-only guarded（批次 16–18）

| URL | 注册方法 | 行为 |
| :--- | :--- | :--- |
| `/app/collection/resourceOut` | POST | 返回 `409 PHASE7_MUTATION_GUARDED`，不执行真实 CUD |
| `/app/purchase/resourceEnter` | POST | 同上 |
| `/app/purchaseApply.deletePurchaseApply` | POST | 同上 |
| `/app/resourceStore.allocationStoreEnter` | POST | 同上 |
| `/app/resourceStore.deleteAllocationStorehouse` | POST | 同上 |
| `/app/resourceStore.saveAllocationUserStorehouse` | POST | 同上 |
| `/app/resourceStore.saveResourceReturn` | POST | 同上 |
| `/app/resourceStore.saveResourceScrap` | POST | 同上 |

## 2. 修改文件

- `apps/api/server/modules/resource/types.ts`  
  新增 `ResourceStoreType`、`ResourceUserStorehouseQuery`、`ResourceUserStorehouseResult`。

- `apps/api/server/modules/resource/repository.ts`  
  新增 `resourceStoreTypes` 种子数据；实现 `listUserStorehouses`、`listResourceStoreTypes`；保留 `getResourceGuardDecision`。

- `apps/api/server/modules/resource/service.ts`  
  暴露 `listUserStorehouses`、`listResourceStoreTypes` 到 service 层。

- `apps/api/server/modules/resource/legacy-adapter.ts`  
  新增 `listUserStorehouses`、`listResourceStoreTypes` adapter；复用 `guardedWrite`；更新 `resourceLegacyAdapterEvidence` 的 `endpoints`、`guardedEndpoints`、`notCovered`。

- `apps/api/server/modules/resource/legacy-endpoints.ts`  
  注册 2 个只读 exact 端点（GET + POST）和 8 个 POST-only guarded 写入口。

- `apps/api/tests/legacy/resource-legacy-endpoints.test.ts`  
  覆盖新增端点的注册边界、只读成功 envelope、 guarded 失败 envelope。

## 3. 未修改的共享文件

按任务约束，**未修改**以下由主代理统一合并的共享文件：

- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/tests/runtime/app-legacy-gap-registry.test.ts`

因此当前阶段 `runtimeEndpointManifest` 对新端点的 `cutoverStatus` 可能仍显示 `app-shadow-allowlist`，需在主代理合并批次 16–18 的 blocked URL 集合后收敛为 `blocked-for-execution`。

## 4. 验证结果

### 4.1 资源模块 legacy 测试

```bash
pnpm -F @01s-11comm/api exec vitest run tests/legacy/resource-legacy-endpoints.test.ts
```

输出：

```
✓ tests/legacy/resource-legacy-endpoints.test.ts (24 tests) 15ms
Test Files  1 passed (1)
Tests  24 passed (24)
```

### 4.2 类型检查

```bash
pnpm -F @01s-11comm/api run typecheck
```

输出：

```
$ tsc --noEmit
```

无类型错误。

### 4.3 行尾检查

```bash
git diff --check -- apps/api/server/modules/resource apps/api/tests/legacy/resource-legacy-endpoints.test.ts
```

无输出，表示无 CRLF/LF 漂移问题。

## 5. 发现与修复

本次实现未遇到测试失败或类型错误，无需写入 `agent-findings.md` 修复记录。若主代理合并共享文件后需要运行更广泛的 runtime/infra 测试，请留意 `runtime-endpoints.ts` 中 `phase7BlockedAppLegacyMutationUrls` 需补充 8 条 POST-only guarded URL。

## 6. 结论

resource 模块 11 个 fallback-only endpoint 已按 §7C 计划收口完成：只读 exact 返回 deterministic compat seed 数据，写入口统一返回 `409 PHASE7_MUTATION_GUARDED`，相关测试与类型检查均已通过。共享清单的合并留给主代理统一处理。
