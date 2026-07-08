# §7C renovation 模块 fallback-only 收口报告

> 任务编号：task1200、task1201（renovation 部分）
> 报告日期：2026-07-08
> 报告路径：`D:\code\ruan-cat\01s-11comm\apps\admin\src\docs\reports\2026-07-08-renovation-fallback-report.md`

## 1. 本次收口范围

按 `2026-07-08-fallback-only-scan-plan.md` 完成 renovation 模块剩余 8 个 fallback-only 端点收口：

| 批次 | 分类 | URL | 方法 |
| :--- | :--- | :--- | :--- |
| 3 | 只读 exact | `/app/roomRenovation/queryRoomRenovation` | GET/POST |
| 3 | 只读 exact | `/app/roomRenovation/queryRoomRenovationRecord` | GET/POST |
| 3 | 只读 exact | `/app/roomRenovation/queryRoomRenovationRecordDetail` | GET/POST |
| 4 | POST-only guarded | `/app/roomRenovation/updateRoomToExamine` | POST |
| 4 | POST-only guarded | `/app/roomRenovation/saveRoomRenovationDetail` | POST |
| 4 | POST-only guarded | `/app/roomRenovation/updateRoomRenovationState` | POST |
| 5 | POST-only guarded | `/app/roomRenovation/updateRoomDecorationRecord` | POST |
| 5 | POST-only guarded | `/app/roomRenovation/deleteRoomRenovationRecord` | POST |

## 2. 新增/修改文件

```
apps/api/server/modules/renovation/
├── types.ts              # RenovationApplication / RenovationRecord / RenovationRecordMedia 等类型
├── repository.ts          # 确定性 compat seed 内存仓储
├── service.ts             # 领域服务透传
├── runtime.ts             # 模块运行时工厂
├── legacy-adapter.ts      # 适配旧 app 协议 `{ code, msg, data }` 与 guarded write
├── legacy-endpoints.ts    # 8 个端点注册
└── index.ts               # 统一导出

apps/api/tests/legacy/renovation-legacy-endpoints.test.ts
```

## 3. 实现要点

### 3.1 只读 exact

- `queryRoomRenovation`：按 `communityId`/`roomName`/`state` 过滤，返回分页列表 `{ list, total, page, pageSize, hasMore }`。
- `queryRoomRenovationRecord`：必须传入 `rId`，再按 `communityId`/`roomName`/`roomId` 过滤，返回分页列表。
- `queryRoomRenovationRecordDetail`：必须传入 `recordId`，返回该记录下的媒体详情列表（图片/视频）。
- 种子数据固定，保证多次调用结果一致，便于回归测试。

### 3.2 POST-only guarded

- 5 个写入口统一返回 `409 PHASE7_MUTATION_GUARDED`。
- 不执行真实 CUD，不调用旧 app fallback，不修改内存态。
- 仅在 `POST` 方法注册，`GET` 未注册（与旧 app 行为收敛）。

### 3.3 响应包

- 统一采用 `{ code, msg, data }` 归一化包。
- 错误场景返回 `code` 与 `msg`；guarded 写入额外带 `errorCode: "PHASE7_MUTATION_GUARDED"`。

## 4. 验证结果

### 4.1 模块级测试

```bash
pnpm -F @01s-11comm/api exec vitest run tests/legacy/renovation-legacy-endpoints.test.ts
```

输出：

```text
RUN vitest v3.2.4 D:/code/ruan-cat/01s-11comm/apps/api
✓ tests/legacy/renovation-legacy-endpoints.test.ts (20 tests) 11ms
Test Files  1 passed (1)
Tests       20 passed (20)
```

### 4.2 类型检查

```bash
pnpm -F @01s-11comm/api run typecheck
```

输出：

```text
$ tsc --noEmit
```

（无错误，退出码 0）

## 5. 问题与修复记录

首次 typecheck 出现以下错误：

```text
server/modules/renovation/repository.ts(258,65): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
server/modules/renovation/repository.ts(287,65): error TS2345: Argument of type 'string | undefined' is not assignable to type 'string'.
```

**原因**：在 `if (params.roomName)` 分支内使用 `item.roomName.includes(params.roomName)` 时，TypeScript 未在闭包中将可选参数收窄为 `string`。

**修复**：将可选属性提取为局部常量后再使用：

```ts
if (params.roomName) {
  const roomName = params.roomName;
  filtered = filtered.filter((item) => item.roomName.includes(roomName));
}
```

`params.state` 同样处理。复测后 typecheck 通过。

详细记录见 `apps/admin/src/docs/reports/agent-findings.md`。

## 6. 约束遵守情况

- **未修改共享文件**：`apps/api/server/shared/runtime/runtime-endpoints.ts` 与 `apps/api/tests/runtime/app-legacy-gap-registry.test.ts` 保持原样， renovation 端点未全局注册、未从 gap registry 移除，由主代理统一合并。
- **未修改旧 app**：`apps/app/server/modules/renovation/` 保持原样。
- **参考模式**：遵循 `property-application`、`resource` 等模块的分层与 adapter 证据模式。

## 7. 结论

renovation 模块剩余 8 个 fallback-only 端点已按批次 3/4/5 完成收口，模块级测试与类型检查均通过。待主代理将 renovation 端点汇入 `runtime-endpoints.ts` 与 gap registry 后，全局 runtime 测试与 manifest 测试将同步收敛。
