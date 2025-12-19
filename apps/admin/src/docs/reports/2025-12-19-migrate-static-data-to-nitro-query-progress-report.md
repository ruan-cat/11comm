# 2025-12-19 静态数据迁移到 Nitro Query 进度报告

## 任务概述

本次任务是将项目中的 98-100 个列表页从本地假数据迁移到 Nitro 后端 + TanStack Query 体系。迁移涉及创建类型定义、Nitro 接口、API Hook 和改写列表页等 10 个步骤。

## 完成情况统计

### 已完成的模块（100% 完成）

| 模块                      | 路由数量 | 完成状态    |
| ------------------------- | -------- | ----------- |
| settingManage（设置管理） | 12       | ✅ 全部完成 |
| devTeam（开发团队）       | 8        | ✅ 全部完成 |
| operationTeam（运营团队） | 12       | ✅ 全部完成 |

**已完成模块小计：32 个路由**

### 部分完成的模块

#### 1. propertyManage.communityManage.houseDecoration（房屋装修）

- ✅ 类型定义文件
- ✅ Mock 数据文件
- ✅ Nitro 接口文件
- ✅ 前端 API Hook
- ✅ 列表页改写
- ✅ 表单类型和组件更新
- ✅ 类型检查通过
- ✅ 测试验证完成

**状态：100% 完成** ✅

#### 2. propertyManage.expenseManage（费用管理）

- ⚠️ **类型文件**：17 个文件已存在，但使用通用模板，不符合业务需求
- ⚠️ **API Hook**：16 个文件已存在，需要完善
- ❌ **Nitro 接口**：完全缺失（server）
  -/api 目录不存在 ❌ **列表页改写**：大量页面仍在使用旧的手动管理模式

**已创建的类型文件和 API Hook：**

1. water-and-electricity-meter-reading（水电抄表）
2. vehicle-charge（车辆收费）
3. reminder-for-overdue-payments（欠费催缴）
4. reprint-voucher（补打收据）
5. overdue-payment-information（欠费信息）
6. payment-review（缴费审核）
7. refund-review（退费审核）
8. house-charge（房屋收费）
9. meter-reading-type（抄表类型）
10. expense-summary-table（费用汇总表）
11. discount-apply（优惠申请）
12. discount-setting（折扣设置）
13. contracte-charge（合同收费）
14. expense-item-setting（费用项目设置）
15. cancel-fee（取消费物）
16. discount-type（优惠类型）

**状态：约 30% 完成（类型和 API 层完成，缺少接口层和页面改写）**

### 待完成的模块

#### propertyManage 其他子模块（约 52 个路由）

| 子模块                          | 路由数量 | 完成状态  |
| ------------------------------- | -------- | --------- |
| contractManage（合同管理）      | 15       | ❌ 未开始 |
| housePropertyManage（房产管理） | 10       | ❌ 未开始 |
| parkingManage（车位管理）       | 8        | ❌ 未开始 |
| patrolManage（巡检管理）        | 5        | ❌ 未开始 |
| repairsManage（报修管理）       | 10       | ❌ 未开始 |
| reportManage（报表管理）        | 4        | ❌ 未开始 |

**待完成模块小计：52 个路由**

## 技术问题分析

### 当前类型检查错误：433 个

主要错误类型：

1. **API Hook 缺少 initialParams 参数** - 约 50 个错误
2. **页面仍在使用手动管理模式**（pageSize, pageIndex, total 等变量）- 约 300 个错误
3. **缺少 TanStack Query 相关的变量和函数**（tableData, isFetching, updateParams 等）- 约 80 个错误

### 根本原因

1. **server/api 目录不存在** - Nitro 接口层完全缺失
2. **类型定义不符合业务需求** - 虽然文件存在，但使用通用模板
3. **列表页未完成迁移** - 仍在使用 loadTableData 等旧模式

## 下一步行动计划

### 阶段一：创建 Nitro 接口层（紧急）

**任务**：为 expense-manage 模块创建 server/api 目录和所有接口文件

**步骤**：

1. 创建 `apps/admin/server/api/property-manage/expense-manage/*` 目录结构
2. 为每个页面创建 `mock-data.ts` 文件
3. 为每个页面创建 `list.post.ts` 文件
4. 严格遵循 Nitro v3 规范和 OpenSpec 要求

**预计时间**：2-3 天

### 阶段二：完善类型定义（高优先级）

**任务**：将通用模板类型定义改为符合业务需求的类型

**步骤**：

1. 参考 house-decoration 的成功实现
2. 为每个页面定义业务相关的字段
3. 添加 JSDoc 注释和 Options 常量
4. 确保类型与 Mock 数据兼容

**预计时间**：3-4 天

### 阶段三：改写列表页（中优先级）

**任务**：将剩余页面从手动管理模式迁移到 TanStack Query

**步骤**：

1. 导入正确的类型和 API Hook
2. 替换搜索和分页逻辑
3. 使用固定写法的 handleReSearch 和 handleSearch
4. 删除 test-data.ts 和 loadTableData 函数

**预计时间**：5-7 天

### 阶段四：完善其他模块（低优先级）

**任务**：完成剩余 52 个路由的迁移

**步骤**：

1. 逐个模块进行迁移
2. 每完成一个模块进行类型检查
3. 及时更新任务进度

**预计时间**：10-15 天

## 推荐执行策略

### 并行处理方案

建议启动多个子代理并行工作：

1. **API 创建代理** - 负责创建 Nitro 接口层
2. **类型定义代理** - 负责完善业务类型定义
3. **页面改写代理** - 负责改写列表页
4. **测试验证代理** - 负责类型检查和测试

### 优先级排序

1. **P0（紧急）**：创建 Nitro 接口层，解决 433 个类型错误
2. **P1（高）**：完善 expense-manage 模块的类型定义
3. **P2（中）**：改写 expense-manage 模块的列表页
4. **P3（低）**：完成剩余模块的迁移

## 成功案例参考

**house-decoration 页面**是成功的迁移案例，完全符合规范要求：

- ✅ 使用 `@01s-11comm/type` 导入类型
- ✅ 使用 TanStack Query Hook（`useHouseDecorationListQuery`）
- ✅ 固定写法的搜索和分页函数
- ✅ 使用 `isFetching` 而不是手动 loading
- ✅ 直接使用 `pureTableProps` 从 Hook 导出
- ✅ 删除所有 test-data.ts 和 loadTableData 相关代码

**关键学习点**：

- 必须严格遵循 OpenSpec 规范
- 不能使用通用模板，必须符合业务需求
- 列表页的变量声明顺序很重要
- 使用固定写法的搜索和分页函数

## 结论

目前项目已完成 32/100 个路由的迁移（32%），还有 68 个路由待完成。expense-manage 模块已有部分基础文件，但需要大量完善工作。

**关键行动项**：

1. 立即创建 Nitro 接口层（server/api 目录）
2. 完善类型定义，使其符合业务需求
3. 改写列表页，从手动管理模式迁移到 TanStack Query
4. 启动并行子代理加速完成剩余工作

**预计总完成时间**：20-30 天（需要大量人工工作）

---

**报告生成时间**：2025-12-19
**报告人**：Claude Code 助手
