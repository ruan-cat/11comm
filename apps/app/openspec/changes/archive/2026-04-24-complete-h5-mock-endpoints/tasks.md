## 1. 规格与测试

- [x] 1.1 [新增] `openspec/changes/complete-h5-mock-endpoints/proposal.md` - 记录 H5 mock 缺口补齐的变更动机、范围和影响
- [x] 1.2 [新增] `openspec/changes/complete-h5-mock-endpoints/specs/h5-mock-endpoint-coverage/spec.md` - 定义费用、工作单和通讯录搜索回归需求
- [x] 1.3 [新增] `openspec/changes/complete-h5-mock-endpoints/design.md` - 记录共享端点实现设计和风险
- [x] 1.4 [修改] `src/tests/nitro-runtime/fee-endpoints.test.ts` - 增加费用、充电桩、报表、支付、开门记录端点测试
- [x] 1.5 [修改] `src/tests/nitro-runtime/work-order-endpoints.test.ts` - 增加工作单任务列表、任务项和抄送完成端点测试
- [x] 1.6 [修改] `src/tests/nitro-runtime/staff-endpoints.test.ts` - 增加通讯录同首字母分组回归测试

## 2. 费用共享端点

- [x] 2.1 [修改] `server/modules/fee/repository.ts` - 增加费用列表、欠费、催缴、费用配置、充电桩、报表和开门记录 mock 数据与查询方法
- [x] 2.2 [修改] `server/modules/fee/endpoints.ts` - 注册 `src/api/fee.ts` 缺失的旧业务路径端点
- [x] 2.3 [确认] `server/shared/runtime/runtime-endpoints.ts` - 通过既有 `feeRuntimeEndpointDefinitions` 导入纳入 fee 非冲突端点

## 3. 工作单共享端点

- [x] 3.1 [修改] `server/modules/work-order/repository.ts` - 增加任务列表、任务项查询和抄送完成仓储方法
- [x] 3.2 [修改] `server/modules/work-order/endpoints.ts` - 注册工作单任务和抄送完成端点

## 4. 通讯录搜索修复

- [x] 4.1 [修改] `src/api/staff.ts` - 修复 `formatStaffList` 首组初始化，确保搜索结果不丢失

## 5. 验证

- [x] 5.1 [运行] `pnpm vitest run src/tests/nitro-runtime/fee-endpoints.test.ts src/tests/nitro-runtime/work-order-endpoints.test.ts src/tests/nitro-runtime/staff-endpoints.test.ts` - 验证 targeted tests
- [x] 5.2 [运行] H5 mock dev server - 验证页面运行环境可访问
- [x] 5.3 [MCP] Chrome 回归费用、充电桩、报表、工作单任务和通讯录搜索页面 - 确认不再出现本轮缺失接口 404
