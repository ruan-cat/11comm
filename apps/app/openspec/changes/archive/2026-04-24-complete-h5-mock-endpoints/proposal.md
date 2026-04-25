## Why

H5 页面自检时发现多个已迁移页面仍会请求未注册的本地 mock 接口，导致费用、充电桩、报表和工作单页面出现 404 与错误提示。当前项目已经形成 H5 mock 与 Nitro 共用 `server/modules/*` 端点的架构，因此需要把这些接口补齐到共享端点层，避免继续在页面或 mock 包装层做临时兜底。

## What Changes

- 补齐费用模块共享 mock 端点，覆盖费用列表、欠费、催缴、费用创建、二维码支付、充电桩、报表、开门记录和费用配置接口。
- 补齐工作单模块共享 mock 端点，覆盖任务处理人列表、任务项列表和抄送处理提交接口。
- 修复通讯录搜索结果分组逻辑，确保接口返回员工后页面能正确显示按首字母分组的数据。
- 增加 Vitest 覆盖缺失端点和通讯录分组回归，确保 H5 mock 与 Nitro 共享注册表都能命中这些接口。
- 不引入真实登录、鉴权、生产后端或外部数据源。

## Capabilities

### New Capabilities

- `h5-mock-endpoint-coverage`: 覆盖 H5 页面自检暴露的费用、充电桩、报表、工作单和通讯录搜索 mock 行为。

### Modified Capabilities

- None.

## Impact

- 影响 `server/modules/fee`、`server/modules/work-order` 共享仓储与端点定义。
- 影响 `src/api/staff.ts` 中员工列表分组工具函数。
- 影响 `src/tests/nitro-runtime` 下费用、工作单、通讯录相关回归测试。
- 影响 `server/shared/runtime/runtime-endpoints.ts` 中 fee 模块端点注册。
- 不改变前端旧业务 URL，不新增依赖，不运行类型检查命令。
