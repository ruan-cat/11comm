<!-- 不删除 作为大规模迁移代码用的上下文参考文件 -->

# 2026-01-13 首页与工作台迁移分析报告

## 1. 概述

本报告对比了 Vue2 旧项目 (`gitee-example`) 与 Vue3 新项目 (`src`) 的首页及工作台模块，旨在明确当前迁移进度，识别缺失的入口文件及路由映射关系，为后续开发提供实施指南。

## 2. 首页 (Home) 分析

### 2.1 当前状态

- **文件位置**: `src/pages/index/index.vue`
- **状态**: 仅包含静态 UI 布局，**完全缺失**业务逻辑、点击跳转事件及数据交互。
- **缺失板块**: 界面上缺少 "OA 待办" 板块的展示。

### 2.2 头部导航栏 (Header Menus) 映射

| 功能名称     | 旧项目路由                             | 新项目建议路由                    | 状态          | 说明             |
| :----------- | :------------------------------------- | :-------------------------------- | :------------ | :--------------- |
| **投诉待办** | `/pages/complaintList/complaintList`   | `/pages-sub/complaint/list`       | ✅ **已存在** | 需绑定跳转事件   |
| **报修待办** | `/pages/repairDispatch/repairDispatch` | `/pages-sub/repair/dispatch`      | ✅ **已存在** | 需绑定跳转事件   |
| **巡检打卡** | `/pages/inspection/inspection`         | `/pages-sub/inspection/task-list` | ✅ **已存在** | 需绑定跳转事件   |
| **设备保养** | `/pages/maintainance/maintainance`     | `/pages-sub/maintenance/index`    | ❌ **缺失**   | 需新建分包及页面 |

### 2.3 工作待办 (Work Todo) 映射

| 功能名称     | 旧项目路由                                        | 新项目建议路由                         | 状态        | 说明               |
| :----------- | :------------------------------------------------ | :------------------------------------- | :---------- | :----------------- |
| **采购待办** | `/pages/resource/purchaseApplyAuditOrders`        | `/pages-sub/resource/purchase-audit`   | ❌ **缺失** | 资源管理模块未迁移 |
| **领用待办** | `/pages/resource/itemOutAuditOrders`              | `/pages-sub/resource/item-out-audit`   | ❌ **缺失** | 资源管理模块未迁移 |
| **调拨待办** | `/pages/resource/allocationStorehouseAuditOrders` | `/pages-sub/resource/allocation-audit` | ❌ **缺失** | 资源管理模块未迁移 |
| **物品放行** | `/pages/itemRelease/itemRelease`                  | `/pages-sub/release/index`             | ❌ **缺失** | 需新建模块         |
| **访客待办** | `/pages/visit/visit`                              | `/pages-sub/visit/index`               | ❌ **缺失** | 需新建模块         |

### 2.4 工作单 (Work Orders) 映射

| 功能名称       | 旧项目路由              | 新项目建议路由          | 状态        | 说明             |
| :------------- | :---------------------- | :---------------------- | :---------- | :--------------- |
| **发工作单**   | `/pages/work/startWork` | `/pages-sub/work/start` | ❌ **缺失** | 工作单模块未迁移 |
| **办工作单**   | `/pages/work/doWork`    | `/pages-sub/work/do`    | ❌ **缺失** | 工作单模块未迁移 |
| **抄送工作单** | `/pages/work/copyWork`  | `/pages-sub/work/copy`  | ❌ **缺失** | 工作单模块未迁移 |

### 2.5 OA 待办 (OA Undo) 映射

| 功能名称        | 旧项目路由                                   | 新项目建议路由       | 状态        | 说明                       |
| :-------------- | :------------------------------------------- | :------------------- | :---------- | :------------------------- |
| **OA 流程待办** | `/pages/newOaWorkflowUndo/newOaWorkflowUndo` | `/pages-sub/oa/undo` | ❌ **缺失** | OA 模块未迁移，UI 暂未实现 |

## 3. 工作台 (Workbench) 分析

### 3.1 当前状态

- **文件位置**: `src/pages/index/work.vue` (预期位置)
- **状态**: ❌ **完全缺失**。
- **说明**: 该页面为 TabBar 页面之一，目前新项目中尚未创建。

### 3.2 功能需求

旧版工作台 (`gitee-example/pages/index/work.vue`) 主要基于后台接口 `loadCategoryMenus` 动态加载菜单。主要包含以下业务板块：

1.  **常用功能**: 聚合首页高频功能。
2.  **工单业务**: 同首页 "工作单" 模块。
3.  **停车业务**: 包括道闸管理、手工进出场等 (旧路由 `/pages/car/*`) -> **新项目缺失**。
4.  **核销业务**: 包括优惠券核销、预约核销等 (旧路由 `/pages/coupon/*`) -> **新项目缺失**。
5.  **报表业务**: 各类数据报表 (旧路由 `/pages/report/*`) -> **新项目缺失**。

## 4. 实施建议

1.  **完善首页交互**:
    - 修改 `src/pages/index/index.vue`，为已存在的模块（投诉、维修、巡检）添加点击跳转逻辑。
    - 对于缺失模块，暂时添加 "功能开发中" 的提示或 Toast。

2.  **创建工作台页面**:
    - 新建 `src/pages/index/work.vue` 文件。
    - 在 `pages.config.ts` 中配置路由及 TabBar。
    - 初步实现 UI 结构，预留动态菜单加载接口。

3.  **制定后续迁移计划**:
    - **P1 优先级**: 资源管理 (Resource)、工作单 (Work)。
    - **P2 优先级**: 设备保养 (Maintenance)、OA 工作流。
    - **P3 优先级**: 停车 (Car)、核销 (Coupon)、报表 (Report)、物品放行/访客。

## 5. 变更日志

```log
2026-01-13 分析完成首页与工作台的路由映射关系，生成迁移分析报告。
```
