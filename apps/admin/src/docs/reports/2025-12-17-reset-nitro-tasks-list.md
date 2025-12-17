# 2025-12-17 清空重设任务清单 - 实施计划

## 任务概述

根据用户需求，需要完成以下核心任务：

1. 更新 openspec 规范文件，添加严格的步骤顺序要求
2. 清空并重做 `openspec\changes\migrate-static-data-to-nitro-query\tasks.md` 任务清单
3. 为全部 133 个三级路由创建详细的迁移任务清单（每个路由 9-12 个子任务）

## 用户需求确认

### 迁移范围

- ✅ 全部 133 个三级路由都需要迁移

### 任务粒度

- ✅ 详细拆分（每个路由 9-12 个子任务）
- 每个列表页按照以下严格步骤迁移：
  1. 新建 `apps\type\src\*` 对应目录的业务类型和下拉选择用的数组
  2. 新建 `apps\admin\server\*` 对应业务目录的 `mock-data.ts` 固定假数据
  3. 新建 `apps\admin\server\*` 对应业务目录的 `list.post.ts` nitro 接口
  4. 新建 `apps\admin\src\api\*` 对应目录的封装 `useListQuery` 的 hooks 钩子函数
  5. 改写改造对应业务目录的 index.vue 列表页
  6. 删除对应业务目录的 `test-data.ts` 假数据文件
  7. 更新对应的 form.ts 文件（类型迁移）
  8. 更新对应的 form.vue 文件（使用类型库）

### 规范更新

- ✅ 添加更严格的步骤顺序要求

### 特殊情况

- ✅ 统一按标准列表页处理

## 探索结果总结

### 1. OpenSpec 规范文件结构

```plain
openspec/changes/migrate-static-data-to-nitro-query/
├── proposal.md                 # 变更提案（已完成）
├── design.md                   # 技术设计（已完成）
├── tasks.md                    # 任务清单（当前为空，需要重做）
└── specs/                      # 增量规范
    ├── nitro-api/spec.md       # Nitro API 规范
    ├── type-system/spec.md     # 类型系统规范
    ├── data-fetching/spec.md   # 数据获取规范
    ├── list-page-pattern/spec.md  # 列表页模式规范
    └── common-business-options/spec.md  # 公共业务选项规范
```

### 2. RANK_ROUTE_KEYS 路由统计

- **一级路由**：4 个（settingManage, devTeam, operationTeam, propertyManage）
- **二级路由**：12 个
- **三级路由**：133 个（需要全部迁移）

路由分布：

- settingManage: 12 个三级路由
- devTeam: 8 个三级路由
- operationTeam: 12 个三级路由
- propertyManage: 101 个三级路由

### 3. 迁移示例参考

已探索的完整迁移示例：商户信息列表页 (operation-team/merchant-manage/merchant-info)

文件结构：

```plain
apps/type/src/business/operation-team/merchant-manage/merchant-info.ts
apps/admin/server/api/operation-team/merchant-manage/merchant-info/mock-data.ts
apps/admin/server/api/operation-team/merchant-manage/merchant-info/list.post.ts
apps/admin/src/api/operation-team/merchant-manage/merchant-info/index.ts
apps/admin/src/pages/operation-team/merchant-manage/merchant-info/index.vue
apps/admin/src/pages/operation-team/merchant-manage/merchant-info/components/form.ts
apps/admin/src/pages/operation-team/merchant-manage/merchant-info/components/form.vue
```

## 实施计划

### 阶段 1：更新规范文件（添加步骤顺序要求）

#### 1.1 更新 `specs/nitro-api/spec.md`

**目标**：在 Nitro API 规范中添加明确的步骤顺序标识

**文件路径**：`openspec\changes\migrate-static-data-to-nitro-query\specs\nitro-api\spec.md`

**修改内容**：
在文件开头（第 2 行之前）添加"实施顺序"章节：

```markdown
## 实施顺序说明

**CRITICAL**: 在实施 Nitro API 相关任务时，必须严格按照以下顺序执行，不允许跳步。

### 执行顺序

1. **Step 1**: Nitro 服务端启用（前置条件）
2. **Step 2**: 接口命名和路径规范（创建文件）
3. **Step 3**: 假数据文件规范（准备数据）
4. **Step 4**: 接口返回格式规范（定义响应）
5. **Step 5**: 请求参数处理（读取请求）
6. **Step 6**: 数据筛选逻辑（过滤数据）
7. **Step 7**: 分页处理（分页计算）
8. **Step 8**: 接口实现模板（完整代码）
9. **Step 9**: Nitro v3 代码写法规范（代码质量）
10. **Step 10**: Nitro 代码写法检查（验证修复）

### 步骤依赖关系

- Step 1 是所有步骤的前置条件
- Step 2-3 必须在 Step 4-8 之前完成
- Step 4-7 是 Step 8 的组成部分
- Step 9-10 是质量检查步骤，在所有接口编写完成后统一执行

### 验收标准

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---
```

**关键 Requirements 步骤标注**：
在每个 Requirement 标题后添加步骤编号，例如：

- `### Requirement: Nitro 服务端启用` → `### Requirement: Nitro 服务端启用 (Step 1)`
- `### Requirement: 接口命名和路径规范` → `### Requirement: 接口命名和路径规范 (Step 2)`
- 以此类推...

#### 1.2 更新 `specs/type-system/spec.md`

**目标**：在类型系统规范中添加明确的步骤顺序标识

**修改内容**：

- 添加"实施顺序"章节
- 为每个 Requirement 添加步骤编号
- 明确类型定义的优先级和顺序

**关键 Requirements 步骤顺序**：

1. Step 1: apps/type 包初始化
2. Step 2: 类型库基础类型文件
3. Step 3: 英文字段命名规范
4. Step 4: 类型文件组织结构
5. Step 5: 类型定义完整性
6. Step 6: 类型与原数据兼容

#### 1.3 更新 `specs/data-fetching/spec.md`

**目标**：在数据获取规范中添加明确的步骤顺序标识

**修改内容**：

- 添加"实施顺序"章节
- 明确 TanStack Query 的配置顺序
- 标注 Hook 的创建顺序

**关键 Requirements 步骤顺序**：

1. Step 1: TanStack Query 安装和配置
2. Step 2: 通用列表查询 Hook (useListQuery)
3. Step 3: 业务专用查询 Hook
4. Step 4: 缓存策略
5. Step 5: 错误处理
6. Step 6: 列表页数据获取方式
7. Step 7: 搜索功能实现
8. Step 8: 分页功能实现
9. Step 9: Loading 状态显示
10. Step 10: 本地假数据过滤逻辑移除

#### 1.4 更新 `specs/list-page-pattern/spec.md`

**目标**：在列表页模式规范中添加明确的步骤顺序标识

**修改内容**：

- 添加"实施顺序"章节
- 明确列表页改造的详细步骤
- 添加每个步骤的验收标准

**关键 Requirements 步骤顺序**：

1. Step 1: 列表页数据获取模式（导入类型和 Hook）
2. Step 2: 定义 queryParams
3. Step 3: 调用业务专用 Hook
4. Step 4: 监听 data 变化
5. Step 5: 搜索表单集成
6. Step 6: 分页组件集成
7. Step 7: 表格 Loading 状态
8. Step 8: 错误状态处理
9. Step 9: 初始化加载
10. Step 10: 响应式参数管理
11. Step 11: 代码组织和注释
12. Step 12: 类型安全的查询参数
13. Step 13: Options 常量使用
14. Step 14: 删除旧的 test-data.ts 文件和相关代码

#### 1.5 更新 `specs/common-business-options/spec.md`

**目标**：在公共业务选项规范中添加明确的步骤顺序标识

**修改内容**：

- 添加"实施顺序"章节
- 明确公共选项的识别和迁移流程

### 阶段 2：生成任务清单文件

#### 2.1 所有 133 个三级路由清单

基于 `RANK_ROUTE_KEYS` 数组，以下是完整的 133 个三级路由列表：

**settingManage（设置管理）- 12 个三级路由：**

1. `settingManage.organizeManage.staffInfo` - 员工信息
2. `settingManage.organizeManage.orgInfo` - 组织信息
3. `settingManage.organizeManage.workingSchedule` - 排班表
4. `settingManage.organizeManage.schedulingSetting` - 排班设置
5. `settingManage.organizeManage.shiftSetting` - 班次设置
6. `settingManage.organizeManage.rolePermission` - 角色权限
7. `settingManage.organizeManage.dataPermission` - 数据权限
8. `settingManage.systemManage.changePassword` - 修改密码
9. `settingManage.systemManage.systemConfig` - 系统配置
10. `settingManage.systemManage.registerProtocol` - 注册协议
11. `settingManage.systemManage.initializeCell` - 初始化小区
12. `settingManage.systemManage.communityConfiguration` - 小区配置

**devTeam（开发团队）- 8 个三级路由：**

1. `devTeam.menuManage.catalog` - 菜单目录
2. `devTeam.menuManage.group` - 菜单组
3. `devTeam.menuManage.item` - 菜单项
4. `devTeam.cacheManage.refreshCache` - 刷新缓存
5. `devTeam.configManage.type` - 字典类型
6. `devTeam.configManage.item` - 配置项
7. `devTeam.configManage.dictionary` - 字典
8. `devTeam.configManage.center` - 配置中心

**operationTeam（运营团队）- 12 个三级路由：**

1. `operationTeam.systemManage.changePassword` - 修改密码
2. `operationTeam.systemManage.systemConfig` - 系统配置
3. `operationTeam.systemManage.registerProtocol` - 注册协议
4. `operationTeam.systemManage.initializeCell` - 初始化小区
5. `operationTeam.systemManage.communityConfiguration` - 小区配置
6. `operationTeam.dataManage.communityInformation` - 小区信息
7. `operationTeam.dataManage.propertyManagementCompany` - 物业公司
8. `operationTeam.merchantManage.merchantInfo` - 商户信息
9. `operationTeam.merchantManage.merchantAdmin` - 商户管理员
10. `operationTeam.reportConfiguration.reportGroup` - 报表组
11. `operationTeam.reportConfiguration.reportInfo` - 报表信息
12. `operationTeam.reportConfiguration.reportComponent` - 报表组件

**propertyManage（物业管理）- 101 个三级路由：**

_propertyManage.communityManage（7 个）：_

1. `propertyManage.communityManage.houseDecoration` - 房屋装修
2. `propertyManage.communityManage.buildingSpaceStructureDiagram` - 楼栋结构图
3. `propertyManage.communityManage.notice` - 小区公示
4. `propertyManage.communityManage.propertyRegister` - 产权登记
5. `propertyManage.communityManage.handingBusiness` - 业务受理
6. `propertyManage.communityManage.my` - 我的
7. `propertyManage.communityManage.parkingSpaceStructureDiagram` - 车位结构图

_propertyManage.contractManage（5 个）：_

1. `propertyManage.contractManage.change` - 合同变更
2. `propertyManage.contractManage.draftContract` - 起草合同
3. `propertyManage.contractManage.expire` - 到期合同
4. `propertyManage.contractManage.firstParty` - 合同甲方
5. `propertyManage.contractManage.type` - 合同类型

_propertyManage.expenseManage（16 个）：_

1. `propertyManage.expenseManage.waterAndElectricityMeterReading` - 水电抄表
2. `propertyManage.expenseManage.vehicleCharge` - 车辆收费
3. `propertyManage.expenseManage.reminderForOverduePayments` - 欠费催缴
4. `propertyManage.expenseManage.reprintVoucher` - 补打收据
5. `propertyManage.expenseManage.overduePaymentInformation` - 欠费信息
6. `propertyManage.expenseManage.paymentReview` - 缴费审核
7. `propertyManage.expenseManage.refundReview` - 退费审核
8. `propertyManage.expenseManage.houseCharge` - 房屋收费
9. `propertyManage.expenseManage.meterReadingType` - 抄表类型
10. `propertyManage.expenseManage.discountType` - 优惠类型
11. `propertyManage.expenseManage.expenseSummaryTable` - 费用汇总表
12. `propertyManage.expenseManage.discountApply` - 优惠申请
13. `propertyManage.expenseManage.discountSetting` - 折扣设置
14. `propertyManage.expenseManage.contracteCharge` - 合同收费
15. `propertyManage.expenseManage.expenseItemSetting` - 费用项目设置
16. `propertyManage.expenseManage.cancelFee` - 取消费用

_propertyManage.housePropertyManage（10 个）：_

1. `propertyManage.housePropertyManage.house` - 房屋管理
2. `propertyManage.housePropertyManage.invoice` - 发票
3. `propertyManage.housePropertyManage.invoiceTitle` - 发票抬头
4. `propertyManage.housePropertyManage.ownerAccount` - 业主账户
5. `propertyManage.housePropertyManage.ownerInformation` - 业主信息
6. `propertyManage.housePropertyManage.ownerMember` - 业主成员
7. `propertyManage.housePropertyManage.ownersCommittee` - 业委会
8. `propertyManage.housePropertyManage.reserveVenue` - 场地预约
9. `propertyManage.housePropertyManage.reserveVenueOrder` - 预约场馆订单
10. `propertyManage.housePropertyManage.siteManagement` - 场地管理

_propertyManage.parkingManage（4 个）：_

1. `propertyManage.parkingManage.carportApply` - 车位申请
2. `propertyManage.parkingManage.carportInfo` - 车位信息
3. `propertyManage.parkingManage.ownerVehicle` - 业主车辆
4. `propertyManage.parkingManage.parkingLot` - 停车场管理

_propertyManage.patrolManage（6 个）：_

1. `propertyManage.patrolManage.detail` - 巡检明细
2. `propertyManage.patrolManage.item` - 巡检项目
3. `propertyManage.patrolManage.path` - 巡检路线
4. `propertyManage.patrolManage.plan` - 巡检计划
5. `propertyManage.patrolManage.point` - 巡检点
6. `propertyManage.patrolManage.task` - 巡检任务

_propertyManage.repairsManage（7 个）：_

1. `propertyManage.repairsManage.issues` - 工单池
2. `propertyManage.repairsManage.mandatoryReturnIssue` - 强制回单
3. `propertyManage.repairsManage.phoneReportRepairs` - 电话报修
4. `propertyManage.repairsManage.repairsHaveDone` - 报修已办
5. `propertyManage.repairsManage.repairsSetting` - 报修设置
6. `propertyManage.repairsManage.repairsTodo` - 报修待办
7. `propertyManage.repairsManage.returnVisit` - 报修回访

_propertyManage.reportManage（13 个）：_

1. `propertyManage.reportManage.arrearsDetailsList` - 欠费明细表
2. `propertyManage.reportManage.dataStatistics` - 数据统计
3. `propertyManage.reportManage.depositReport` - 押金报表
4. `propertyManage.reportManage.expenseSummaryTable` - 费用汇总表
5. `propertyManage.reportManage.feeReminder` - 费用提醒
6. `propertyManage.reportManage.noChargeHouse` - 未收费房屋
7. `propertyManage.reportManage.outstandingFeesAnalysis` - 欠费分析
8. `propertyManage.reportManage.ownerPaymentDetails` - 业主缴费明细
9. `propertyManage.reportManage.patrolReport` - 巡检报表
10. `propertyManage.reportManage.paymentDetailsForm` - 缴费明细表
11. `propertyManage.reportManage.repairReportForm` - 维修报告表
12. `propertyManage.reportManage.repairReportsSummaryTable` - 报修汇总表
13. `propertyManage.reportManage.statementExpenses` - 费用明细表

**总计：133 个三级路由**

#### 2.2 任务清单文件结构设计

**文件路径**：`openspec\changes\migrate-static-data-to-nitro-query\tasks.md`

**文件结构概述**：
由于任务清单非常庞大（133 个路由 × 10 个任务 = 1330 个任务），将采用分层结构组织，并使用详细的任务模板。

**任务模板（每个三级路由）**：
每个三级路由包含 10 个标准任务，严格按顺序执行：

```markdown
#### X.Y 路由名称（中文说明）

**路由路径**：`module.subModule.page`

- [ ] Task X.Y.1: 创建类型定义文件
  - **文件路径**：`apps/type/src/business/{module}/{sub-module}/{page}.ts`
  - **任务内容**：
    - 定义 {Page}ListItem 接口（所有字段英文+JSDoc 注释）
    - 定义 {Page}QueryParams 接口（包含分页参数）
    - 定义相关枚举类型（如 Status、Type 等）
    - 导出 Options 常量（下拉选择用）
  - **验收标准**：
    - 所有字段名为英文驼峰命名
    - 每个字段有 JSDoc 注释（中文+英文）
    - 枚举值保持中文
    - Options 导出正确

- [ ] Task X.Y.2: 创建 Mock 数据文件
  - **文件路径**：`apps/admin/server/api/{module}/{sub-module}/{page}/mock-data.ts`
  - **任务内容**：
    - 导入 {Page}ListItem 类型
    - 创建 mock{Page}Data 数组
    - 数据量：至少 20-50 条
    - 数据类型约束满足 {Page}ListItem
  - **验收标准**：
    - 类型约束正确
    - 数据字段名为英文
    - 数据量充足

- [ ] Task X.Y.3: 创建 Nitro 接口文件
  - **文件路径**：`apps/admin/server/api/{module}/{sub-module}/{page}/list.post.ts`
  - **任务内容**：
    - 导入必要的类型（JsonVO、PageDTO、{Page}ListItem、{Page}QueryParams）
    - 使用 defineHandler 和 readBody（从 nitro/h3 导入）
    - 实现筛选逻辑（字符串模糊匹配、枚举精确匹配）
    - 实现分页逻辑（slice）
    - 返回 JsonVO<PageDTO<{Page}ListItem>> 格式
    - 添加 JSDoc 注释
  - **验收标准**：
    - 使用 Nitro v3 写法
    - 返回值有完整类型约束
    - 筛选和分页逻辑正确
    - 有 JSDoc 注释

- [ ] Task X.Y.4: 创建前端 API Hook
  - **文件路径**：`apps/admin/src/api/{module}/{sub-module}/{page}/index.ts`
  - **任务内容**：
    - 定义 use{Page}ListQuery Hook
    - 调用通用 useListQuery
    - 配置 queryKeyPrefix（完整路径）
    - 配置 apiUrl（对应 Nitro 接口路径）
  - **验收标准**：
    - queryKeyPrefix 格式正确
    - apiUrl 路径正确
    - 类型泛型参数正确

- [ ] Task X.Y.5: 改写列表页
  - **文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/index.vue`
  - **任务内容**：
    - 导入类型和 Hook
    - 使用 use{Page}ListQuery 获取数据
    - 移除本地 test-data 导入
    - 配置搜索和分页
    - 使用 isLoading 控制 loading 状态
    - 监听 data 变化更新 tableData
  - **验收标准**：
    - 无 test-data 导入
    - 使用 TanStack Query Hook
    - 搜索和分页功能正常
    - loading 状态正确

- [ ] Task X.Y.6: 删除旧的假数据文件
  - **文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/test-data.ts`
  - **任务内容**：
    - 删除文件
    - 确保无任何文件引用
  - **验收标准**：
    - 文件已删除
    - 无导入引用报错

- [ ] Task X.Y.7: 更新表单类型文件
  - **文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/components/form.ts`
  - **任务内容**：
    - 从 @01s-11comm/type 导入类型
    - 移除本地类型定义
    - 使用类型库提供的 Options
    - 字段名改为纯英文
  - **验收标准**：
    - 所有类型从类型库导入
    - 无本地类型定义
    - Options 从类型库导入

- [ ] Task X.Y.8: 更新表单组件
  - **文件路径**：`apps/admin/src/pages/{module}/{sub-module}/{page}/components/form.vue`
  - **任务内容**：
    - 导入类型库的 Options
    - 更新表单项配置
    - 使用纯英文类型
    - prop 字段名更新为英文
  - **验收标准**：
    - Options 从类型库导入
    - 表单项配置正确
    - 类型约束正确

- [ ] Task X.Y.9: 运行类型检查
  - **命令**：`pnpm typecheck`
  - **任务内容**：
    - 运行类型检查
    - 修复所有类型报错
    - 确保类型库和 admin 项目无报错
  - **验收标准**：
    - typecheck 通过
    - 无类型报错

- [ ] Task X.Y.10: 测试验证
  - **任务内容**：
    - 启动开发服务器测试列表加载
    - 测试搜索功能
    - 测试分页功能
    - 测试新增/编辑/删除功能
    - 测试 loading 状态
    - 测试错误处理
  - **验收标准**：
    - 所有功能正常
    - 无 console 报错
    - 数据加载正确
```

## 任务执行规范

### 严格的执行顺序

对于每个三级路由，**必须严格按照以下顺序执行任务，不允许跳步**：

1. **类型定义层**（Task X.X.1）
   - 必须首先完成
   - 确保类型安全的基础

2. **数据层**（Task X.X.2）
   - 依赖类型定义
   - 创建 Mock 数据

3. **API 层**（Task X.X.3）
   - 依赖类型定义和数据层
   - 创建 Nitro 接口

4. **前端 Hook 层**（Task X.X.4）
   - 依赖 API 层
   - 封装数据查询逻辑

5. **列表页改造**（Task X.X.5）
   - 依赖 Hook 层
   - 使用新的数据获取方式

6. **清理旧代码**（Task X.X.6）
   - 删除旧的假数据文件

7. **表单类型迁移**（Task X.X.7 和 Task X.X.8）
   - 更新表单相关文件
   - 使用类型库

8. **类型检查**（Task X.X.9）
   - 确保无类型报错

9. **测试验证**（Task X.X.10）
   - 功能测试
   - 验收标准检查

### 验收标准

每个三级路由完成后，必须满足以下验收标准：

- ✅ 类型检查无报错（`pnpm typecheck`）
- ✅ 列表页初始加载正常
- ✅ 搜索功能正常
- ✅ 分页功能正常
- ✅ Loading 状态显示正确
- ✅ 错误处理正常
- ✅ 新增/编辑/删除功能正常
- ✅ 无旧的 test-data.ts 文件残留
- ✅ 所有类型从 @01s-11comm/type 导入
- ✅ 所有 Options 从类型库导入

## 进度追踪

### 总体进度

- [ ] settingManage: 0/12 (0%)
- [ ] devTeam: 0/8 (0%)
- [ ] operationTeam: 0/12 (0%)
- [ ] propertyManage: 0/101 (0%)
- **总计**: 0/133 (0%)

### 里程碑

- [ ] Milestone 1: 完成 settingManage 模块（12 个路由）
- [ ] Milestone 2: 完成 devTeam 模块（8 个路由）
- [ ] Milestone 3: 完成 operationTeam 模块（12 个路由）
- [ ] Milestone 4: 完成 propertyManage 模块（101 个路由）
- [ ] Milestone 5: 全部验证通过

## 参考文档

- [proposal.md](./proposal.md) - 变更提案
- [design.md](./design.md) - 技术设计
- [specs/nitro-api/spec.md](./specs/nitro-api/spec.md) - Nitro API 规范
- [specs/type-system/spec.md](./specs/type-system/spec.md) - 类型系统规范
- [specs/data-fetching/spec.md](./specs/data-fetching/spec.md) - 数据获取规范
- [specs/list-page-pattern/spec.md](./specs/list-page-pattern/spec.md) - 列表页模式规范
- [specs/common-business-options/spec.md](./specs/common-business-options/spec.md) - 公共业务选项规范

```plain

#### 2.2 任务清单生成策略

由于任务清单非常庞大（133 个路由 × 10 个任务 = 1330+ 个任务），建议采用以下策略：

1. **手动编写模板**：为每个一级模块编写一个详细的任务模板
2. **复制扩展**：基于模板为每个三级路由复制并调整任务
3. **分段生成**：分 4 次生成，每次处理一个一级模块

## 关键文件清单

### 需要修改的规范文件

1. `D:\code\github-desktop-store\01s-11comm\openspec\changes\migrate-static-data-to-nitro-query\specs\nitro-api\spec.md`
2. `D:\code\github-desktop-store\01s-11comm\openspec\changes\migrate-static-data-to-nitro-query\specs\type-system\spec.md`
3. `D:\code\github-desktop-store\01s-11comm\openspec\changes\migrate-static-data-to-nitro-query\specs\data-fetching\spec.md`
4. `D:\code\github-desktop-store\01s-11comm\openspec\changes\migrate-static-data-to-nitro-query\specs\list-page-pattern\spec.md`
5. `D:\code\github-desktop-store\01s-11comm\openspec\changes\migrate-static-data-to-nitro-query\specs\common-business-options\spec.md`

### 需要创建/重写的任务清单文件

1. `D:\code\github-desktop-store\01s-11comm\openspec\changes\migrate-static-data-to-nitro-query\tasks.md`

## 预计工作量

### 阶段 1：更新规范文件
- 预计时间：2-3 小时
- 难度：中等
- 工作内容：为 5 个规范文件添加步骤顺序标识和说明

### 阶段 2：生成任务清单
- 预计时间：6-8 小时
- 难度：高（工作量大）
- 工作内容：为 133 个三级路由编写详细的任务清单（1330+ 个任务）

### 总计
- 预计总时间：8-11 小时
- 关键风险：任务清单工作量巨大，需要保持格式一致性

## 实施注意事项

1. **保持格式一致性**：所有任务的描述格式必须保持一致
2. **准确的路径映射**：确保每个任务的文件路径都是正确的
3. **清晰的步骤顺序**：明确标注每个步骤的依赖关系
4. **完整的验收标准**：每个路由都要有明确的验收标准
5. **易于追踪进度**：提供进度追踪机制

## 后续执行建议

1. **分批执行**：建议按模块分批执行，先完成小模块验证流程
2. **持续验证**：每完成一个路由就进行类型检查和测试
3. **及时反馈**：发现规范问题及时反馈和更新
4. **自动化考虑**：如果迁移过程中发现高度重复的模式，考虑编写脚本辅助

## 成功标准

- ✅ 所有 5 个规范文件都添加了明确的步骤顺序要求
- ✅ tasks.md 包含了全部 133 个三级路由的详细任务清单
- ✅ 每个路由都有 9-12 个详细的子任务
- ✅ 每个任务都有清晰的描述和验收标准
- ✅ 任务清单易于追踪和管理
- ✅ 符合 OpenSpec 的格式要求
```
