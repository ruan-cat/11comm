# 2026-04-25 H5 Mock 端点覆盖设计

## 1. 背景

H5 页面自检发现费用、充电桩、报表和工作单任务页面存在本地 mock 404。项目当前 API 迁移规范要求使用 `server/modules/*/{repository,endpoints}.ts` 承载共享业务逻辑，再由 `src/api/mock/*.mock.ts` 适配给 Vite mock，不能继续在 mock 包装层堆业务实现。

## 2. 范围

本次补齐 `src/api/fee.ts` 中缺失的费用、欠费、催缴、费用创建、二维码支付、充电桩、报表、开门记录和费用配置接口；补齐 `src/api/work-order.ts` 中工作单任务和抄送处理接口；修复通讯录搜索结果分组为空的问题。

## 3. 推荐实现

采用共享端点补全方案：

- `server/modules/fee/repository.ts` 增加费用相关 mock 数据与查询方法。
- `server/modules/fee/endpoints.ts` 注册旧业务路径，保持前端 URL 不变。
- `server/modules/work-order/repository.ts` 从已有工作单数据派生任务和任务项。
- `server/modules/work-order/endpoints.ts` 注册任务列表、任务项和抄送完成。
- `src/api/staff.ts` 修复 `formatStaffList` 分组初始化。
- `src/tests/nitro-runtime/*.test.ts` 增加红绿回归测试。

## 4. 验证策略

先写 Vitest 失败用例，再实现端点和工具函数。实现后运行费用、工作单和员工三组 targeted tests。最后启动 H5 mock 服务，用 Chrome MCP 回归本次出现 404 的页面路径和通讯录搜索。
