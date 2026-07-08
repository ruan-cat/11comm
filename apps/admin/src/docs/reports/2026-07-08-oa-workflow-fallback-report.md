# oa-workflow fallback-only 收口执行报告

> 任务编号：task1200、task1201（oa-workflow 部分）
> 执行日期：2026-07-08
> 执行代理：子代理（oa-workflow 模块）
> 参考计划：`D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-fallback-only-scan-plan.md`

## 1. 目标

按小批次完成 oa-workflow 模块剩余 13 个 fallback-only endpoint 的收口：

- 批次 6：3 个只读 exact + 新建模块骨架
- 批次 7：3 个只读 exact
- 批次 8：3 个只读 exact
- 批次 9：2 个 POST-only guarded
- 批次 10：2 个 POST-only guarded

## 2. 完成内容

### 2.1 新建模块

在 `apps/api/server/modules/oa-workflow/` 下创建以下文件：

| 文件 | 职责 |
| :--- | :--- |
| `types.ts` | 工作流、表单、记录、评论、下一任务、审核请求等类型定义 |
| `repository.ts` | 确定性内存 seed 仓储，提供流程、表单、记录、任务、评论、流程图等数据 |
| `service.ts` | 薄 service 层，直接透传 repository 能力 |
| `runtime.ts` | 运行时工厂函数 `createOaWorkflowRuntime` / `getOaWorkflowRuntime` |
| `legacy-adapter.ts` | legacy 适配器，只读接口使用 `legacySuccess` 返回 `{ code, msg, data }`；写入口统一 `409 PHASE7_MUTATION_GUARDED` |
| `legacy-endpoints.ts` | 注册 13 个端点：9 个 GET/POST 只读 + 4 个 POST-only guarded |
| `index.ts` | 统一导出模块 API |

### 2.2 新增测试

创建 `apps/api/tests/legacy/oa-workflow-legacy-endpoints.test.ts`，覆盖：

- 9 个只读端点同时支持 GET 和 POST
- 4 个写端点仅注册 POST，GET 返回 `undefined`
- 只读端点返回 `{ code, msg, data }` 包体，无 `success`/`message`/`timestamp` 字段
- 表单、表单数据、任务列表、评论、流程图、下一任务/下一处理人等业务响应断言
- POST body 覆盖 query 参数
- 4 个写端点均返回 `409 PHASE7_MUTATION_GUARDED`

### 2.3 收口端点清单

| URL | 方法 | 分类 | 状态 |
| :--- | :--- | :--- | :--- |
| `/app/oa/workflow/query` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/form/query` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/form/data/query` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/task/undo/query` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/task/his/query` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/user/query` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/image/run` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/task/next` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/undo/next-deal-user` | GET/POST | 只读 exact | 已实现 |
| `/app/oa/workflow/form/save` | POST | POST-only guarded | 已实现 |
| `/app/oa/workflow/form/update` | POST | POST-only guarded | 已实现 |
| `/app/oa/workflow/audit` | POST | POST-only guarded | 已实现 |
| `/app/oa/workflow/undo/audit` | POST | POST-only guarded | 已实现 |

## 3. 验证结果

### 3.1 模块测试

```bash
pnpm -F @01s-11comm/api exec vitest run tests/legacy/oa-workflow-legacy-endpoints.test.ts
```

结果：

```
Test Files  1 passed (1)
     Tests  9 passed (9)
  Start at  19:23:37
  Duration  662ms
```

### 3.2 类型检查

```bash
pnpm -F @01s-11comm/api run typecheck
```

结果：无错误通过（`tsc --noEmit` 退出码 0）。

### 3.3 未创建 agent-findings.md

本次实现过程中未出现验证失败或需要修复的回归，因此未创建 `agent-findings.md`。

## 4. 设计说明

1. 响应包采用 `{ code, msg, data }` 归一化，与 property-application、repair 等新模块保持一致。
2. 只读 exact 返回确定性内存 seed 数据，不调用旧 app fallback，不修改外部状态。
3. 写入口（表单保存/更新、审批/撤销审批）直接由 `legacy-adapter.guardedWrite` 返回 `409 PHASE7_MUTATION_GUARDED`，不执行真实 CUD，也不调用旧 app 服务。
4. 未修改 `apps/api/server/shared/runtime/runtime-endpoints.ts` 和 `apps/api/tests/runtime/app-legacy-gap-registry.test.ts`；这两个共享文件由主代理统一合并。
5. 参考 `apps/api/server/modules/repair/` 和 `apps/api/server/modules/property-application/` 的分层结构，保持 `types → repository → service → runtime → legacy-adapter → legacy-endpoints → index` 的模块组织。

## 5. 风险与后续事项

1. 当前 oa-workflow 模块为内存 seed 实现，未接入真实数据库；后续真实业务写入需单独设计 read-back/rollback 证据。
2. 旧 app 响应包为 `{ success, code, message, data, timestamp }`，新模块统一为 `{ code, msg, data }`；下游 H5 调用方需确认可兼容。
3. 写入口当前处于 guarded 状态，真实业务上线前需要受控写入窗口与回归验证。
4. 待主代理将 `oaWorkflowLegacyEndpointDefinitions` 并入 `runtime-endpoints.ts` 后，`app-legacy-gap-registry.test.ts` 中的 `remainingAppLegacyGapPaths` 需同步移除对应 13 个路径。

## 6. 相关文件路径

- `D:\code\ruan-cat\01s-11comm\apps\api\server\modules\oa-workflow\types.ts`
- `D:\code\ruan-cat\01s-11comm\apps\api\server\modules\oa-workflow\repository.ts`
- `D:\code\ruan-cat\01s-11comm\apps\api\server\modules\oa-workflow\service.ts`
- `D:\code\ruan-cat\01s-11comm\apps\api\server\modules\oa-workflow\runtime.ts`
- `D:\code\ruan-cat\01s-11comm\apps\api\server\modules\oa-workflow\legacy-adapter.ts`
- `D:\code\ruan-cat\01s-11comm\apps\api\server\modules\oa-workflow\legacy-endpoints.ts`
- `D:\code\ruan-cat\01s-11comm\apps\api\server\modules\oa-workflow\index.ts`
- `D:\code\ruan-cat\01s-11comm\apps\api\tests\legacy\oa-workflow-legacy-endpoints.test.ts`
- `D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-oa-workflow-fallback-report.md`
