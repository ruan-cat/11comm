## Context

当前 H5 页面通过 `src/api/*.ts` 调用旧业务路径，开发态由 `vite-plugin-mock-dev-server` 提供 mock，Nitro 运行态由 `server/handlers/legacy-dispatch.ts` 分发到共享 endpoint registry。项目规范要求已共享化模块把业务数据和行为放在 `server/modules/*/{repository,endpoints}.ts`，`src/api/mock/*.mock.ts` 只作为 Vite mock 薄包装层。

本次 Chrome MCP 自检暴露的 404 集中在 `src/api/fee.ts` 和 `src/api/work-order.ts`，同时通讯录搜索接口已返回数据但页面显示为空，属于前端分组工具函数的行为缺陷。

## Goals / Non-Goals

**Goals:**

- 补齐 H5 自检暴露的费用、充电桩、报表、工作单任务相关 mock 端点。
- 顺手补齐同一 API 文件中页面后续操作才会触发的费用相关端点，避免本轮修复后继续出现相邻 404。
- 保持 H5 mock 与 Nitro runtime 共用同一份 server module 实现。
- 修复通讯录搜索结果分组，确保接口返回员工后页面能显示结果。
- 增加针对性 Vitest 回归，并用 Chrome MCP 做 H5 页面回归。

**Non-Goals:**

- 不接入真实后端、真实支付、真实 IoT 或真实鉴权。
- 不改写前端旧业务 URL 为 `/api/**`。
- 不调整页面 UI 视觉设计。
- 不运行 `pnpm type-check`。

## Decisions

1. 使用共享端点方案，而不是直接扩写 `src/api/mock/*.mock.ts`。

   原因：`api-migration` 技能明确要求 H5 mock 与 Nitro 复用 `server/modules/*` 业务逻辑，避免形成双份实现。直接写 mock 文件虽然更快，但会让 Nitro 运行态继续缺口。

2. 以 `server/modules/fee` 承载费用、充电桩、报表和开门记录 mock。

   原因：这些接口都已经由 `src/api/fee.ts` 聚合到费用模块，页面也围绕费用/报表业务使用。单独拆 `iot` 或 `report` 模块会增加文件数量，但当前没有明确的独立前端 API 边界。

3. `feeRuntimeEndpointDefinitions` 从空数组改为 fee 非冲突端点集合。

   原因：新增接口均无 legacy 冲突，原有 `/app/fee.queryFeeDetail` 已由 `legacy-endpoints.ts` 负责兼容合并。因此 runtime 优先层只注册排除 `/app/fee.queryFeeDetail` 的 fee 端点，避免破坏 property-application 与 fee detail 的合并兼容逻辑。

4. 工作单任务数据复用现有工作单仓储。

   原因：任务列表与任务项属于工作单详情的派生信息，放在同一 repository 内可以复用已有 `orderDetails`，避免为测试数据维护第二套工作单 ID。

5. 通讯录修复落在 `formatStaffList`。

   原因：接口已经能按“张”返回员工，页面空态来自首组初始化时未提前 `push` 分组。修复工具函数比在页面 watcher 中兜底更小、更可复用。

## Risks / Trade-offs

- `feeRuntimeEndpointDefinitions` 注册方式可能影响 `/app/fee.queryFeeDetail` 兼容合并。缓解：增加 runtime 注册和 fee detail 结构测试，必要时导出排除冲突 URL 的集合。
- mock 数据不代表真实业务完整语义。缓解：只保证当前页面需要的字段与筛选可用，不模拟真实支付、真实 IoT 设备状态机。
- 费用模块职责变宽。缓解：本次按现有 `src/api/fee.ts` 聚合边界实现，后续若拆分 `report` 或 `iot` API，再迁移 repository 子域。

## Migration Plan

1. 先补测试：费用端点、工作单任务端点、通讯录分组工具函数均先写失败用例。
2. 实现费用仓储与 endpoint。
3. 实现工作单任务仓储与 endpoint。
4. 修复通讯录 `formatStaffList`。
5. 运行针对性 Vitest。
6. 启动 H5 mock 开发服务并用 Chrome MCP 回归页面与网络 404。

## Open Questions

- 无需用户继续确认。真实支付、真实 IoT 与真实鉴权明确不在本次范围内。
