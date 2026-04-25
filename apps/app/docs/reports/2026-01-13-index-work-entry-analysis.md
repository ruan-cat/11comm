<!-- 不删除 作为大规模迁移代码用的上下文参考文件 -->

# 2026-01-13 首页/工作台入口补全分析报告

## 1. 概述

本报告分析了 Vue2 旧项目（`gitee-example`）与 Vue3 新项目（`src`）在首页和工作台功能入口方面的差异，明确需要补全的页面和路由。

## 2. 首页（index）需要补全的入口

### 2.1 顶部快捷入口（Header 区域）

| 序号 | 入口名称 | 旧项目路由                             | Vue3 项目应有路由                   | 当前状态        |
| :--: | :------- | :------------------------------------- | :---------------------------------- | :-------------- |
|  1   | 投诉待办 | `/pages/complaintList/complaintList`   | `/pages-sub/complaint/list`         | ✅ 已有页面     |
|  2   | 报修待办 | `/pages/repairDispatch/repairDispatch` | `/pages-sub/repair/dispatch`        | ✅ 已有页面     |
|  3   | 巡检打卡 | `/pages/inspection/inspection`         | `/pages-sub/inspection/task-list`   | ✅ 已有页面     |
|  4   | 设备保养 | `/pages/maintainance/maintainance`     | `/pages-sub/maintainance/task-list` | ❌ 缺失整个模块 |

### 2.2 工作待办区域·

| 序号 | 入口名称 | 旧项目路由                                        | Vue3 项目应有路由                      | 当前状态        |
| :--: | :------- | :------------------------------------------------ | :------------------------------------- | :-------------- |
|  1   | 采购待办 | `/pages/resource/purchaseApplyAuditOrders`        | `/pages-sub/resource/purchase-audit`   | ❌ 缺失整个模块 |
|  2   | 领用待办 | `/pages/resource/itemOutAuditOrders`              | `/pages-sub/resource/item-out-audit`   | ❌ 缺失整个模块 |
|  3   | 调拨待办 | `/pages/resource/allocationStorehouseAuditOrders` | `/pages-sub/resource/allocation-audit` | ❌ 缺失整个模块 |
|  4   | 物品放行 | `/pages/itemRelease/itemRelease`                  | `/pages-sub/item-release/list`         | ❌ 缺失整个模块 |
|  5   | 访客待办 | `/pages/visit/visit`                              | `/pages-sub/visit/list`                | ❌ 缺失整个模块 |

### 2.3 工作单区域

| 序号 | 入口名称 | 旧项目路由              | Vue3 项目应有路由       | 当前状态        |
| :--: | :------- | :---------------------- | :---------------------- | :-------------- |
|  1   | 发工作单 | `/pages/work/startWork` | `/pages-sub/work/start` | ❌ 缺失整个模块 |
|  2   | 办工作单 | `/pages/work/doWork`    | `/pages-sub/work/do`    | ❌ 缺失整个模块 |
|  3   | 抄送我   | `/pages/work/copyWork`  | `/pages-sub/work/copy`  | ❌ 缺失整个模块 |

### 2.4 OA 待办区域（动态加载）

| 序号 | 入口名称    | 旧项目路由                                   | Vue3 项目应有路由             | 当前状态        |
| :--: | :---------- | :------------------------------------------- | :---------------------------- | :-------------- |
|  1   | OA 流程待办 | `/pages/newOaWorkflowUndo/newOaWorkflowUndo` | `/pages-sub/oa/workflow-undo` | ❌ 缺失整个模块 |

## 3. 工作台（work）需要补全的入口

工作台是动态菜单页面，根据后端返回的菜单配置显示功能入口。

### 3.1 常用功能（物业手机版）

| 序号 | 功能名称     | 旧项目路由                                       | Vue3 项目应有路由                       | 当前状态        |
| :--: | :----------- | :----------------------------------------------- | :-------------------------------------- | :-------------- |
|  1   | 维修工单池   | `/pages/repairOrder/repairOrder`                 | `/pages-sub/repair/order-list`          | ✅ 已有页面     |
|  2   | 添加维修记录 | `/pages/repairAdd/repairAdd`                     | `/pages-sub/repair/add-order`           | ✅ 已有页面     |
|  3   | 投诉录单     | `/pages/complaintOrder/complaintOrder`           | `/pages-sub/complaint/order`            | ✅ 已有页面     |
|  4   | 空置房管理   | `/pages/applyRoom/applyRoom`                     | `/pages-sub/property/apply-room`        | ✅ 已有页面     |
|  5   | 装修管理     | `/pages/roomRenovation/roomRenovation`           | `/pages-sub/renovation/list`            | ❌ 缺失整个模块 |
|  6   | 采购申请管理 | `/pages/resource/purchaseApplyManage`            | `/pages-sub/resource/purchase-manage`   | ❌ 缺失整个模块 |
|  7   | 物品领用管理 | `/pages/resource/itemOutManage`                  | `/pages-sub/resource/item-out-manage`   | ❌ 缺失整个模块 |
|  8   | 调拨管理     | `/pages/resource/allocationStorehouseManage`     | `/pages-sub/resource/allocation-manage` | ❌ 缺失整个模块 |
|  9   | 我的物品     | `/pages/resourceStoreManage/resourceStoreManage` | `/pages-sub/resource/my-items`          | ❌ 缺失整个模块 |
|  10  | 收银台       | `/pages/fee/roomPayFee`                          | `/pages-sub/fee/pay`                    | ❌ 缺失整个模块 |
|  11  | 水电抄表     | `/pages/meter/meterReading`                      | `/pages-sub/meter/reading`              | ❌ 缺失整个模块 |
|  12  | 业主管理     | `/pages/owner/owner`                             | `/pages-sub/owner/list`                 | ❌ 缺失整个模块 |
|  13  | 公告管理     | `/pages/notice/notice`                           | `/pages-sub/notice/list`                | ❌ 缺失整个模块 |
|  14  | 小区文化     | `/pages/activityes/activityes`                   | `/pages/activity/index`                 | ✅ 已有页面     |
|  15  | OA 流程      | `/pages/oaWorkflow/oaWorkflow`                   | `/pages-sub/oa/workflow`                | ❌ 缺失整个模块 |

### 3.2 手机工单

| 序号 | 功能名称 | 旧项目路由                                         | Vue3 项目应有路由             | 当前状态    |
| :--: | :------- | :------------------------------------------------- | :---------------------------- | :---------- |
|  1   | 维修已办 | `/pages/repairDispatchFinish/repairDispatchFinish` | `/pages-sub/repair/finish`    | ✅ 已有页面 |
|  2   | 投诉已办 | `/pages/complaintFinish/complaintFinish`           | `/pages-sub/complaint/finish` | ✅ 已有页面 |
|  3   | 回访工单 | `/pages/appraiseRepair/appraiseRepair`             | `/pages-sub/repair/appraise`  | ✅ 已有页面 |

### 3.3 手机停车

| 序号 | 功能名称 | 旧项目路由               | Vue3 项目应有路由             | 当前状态        |
| :--: | :------- | :----------------------- | :---------------------------- | :-------------- |
|  1   | 业主车辆 | `/pages/car/ownerCar`    | `/pages-sub/car/owner-car`    | ❌ 缺失整个模块 |
|  2   | 道闸管理 | `/pages/car/barrierGate` | `/pages-sub/car/barrier-gate` | ❌ 缺失整个模块 |

### 3.4 手机核销

| 序号 | 功能名称   | 旧项目路由                       | Vue3 项目应有路由             | 当前状态        |
| :--: | :--------- | :------------------------------- | :---------------------------- | :-------------- |
|  1   | 预约核销   | `/pages/appointment/appointment` | `/pages-sub/appointment/list` | ❌ 缺失整个模块 |
|  2   | 核销优惠券 | `/pages/coupon/writeOffCoupon`   | `/pages-sub/coupon/write-off` | ❌ 缺失整个模块 |
|  3   | 核销预约   | `/pages/coupon/wirteOffReserve`  | `/pages-sub/coupon/reserve`   | ❌ 缺失整个模块 |

### 3.5 手机报表

| 序号 | 功能名称     | 旧项目路由                         | Vue3 项目应有路由                  | 当前状态        |
| :--: | :----------- | :--------------------------------- | :--------------------------------- | :-------------- |
|  1   | 数据统计     | `/pages/report/dataReport`         | `/pages-sub/report/data`           | ❌ 缺失整个模块 |
|  2   | 缴费明细表   | `/pages/report/reportPayFeeDetail` | `/pages-sub/report/pay-fee-detail` | ❌ 缺失整个模块 |
|  3   | 房屋费用明细 | `/pages/report/reportRoomFee`      | `/pages-sub/report/room-fee`       | ❌ 缺失整个模块 |
|  4   | 费用汇总表   | `/pages/report/reportFeeSummary`   | `/pages-sub/report/fee-summary`    | ❌ 缺失整个模块 |
|  5   | 开门记录     | `/pages/report/openDoorLog`        | `/pages-sub/report/open-door-log`  | ❌ 缺失整个模块 |
|  6   | 充电桩订单   | `/pages/report/chargeMachineOrder` | `/pages-sub/report/charge-order`   | ❌ 缺失整个模块 |

## 4. TabBar 需要补全的页面

| 序号 | Tab 名称 | 旧项目路由                       | Vue3 项目应有路由     | 当前状态                  |
| :--: | :------- | :------------------------------- | :-------------------- | :------------------------ |
|  1   | 首页     | `/pages/index/index`             | `/pages/index/index`  | ✅ 已有（需完善入口跳转） |
|  2   | 工作台   | `/pages/index/work`              | `/pages/work/work`    | ❌ 缺失页面               |
|  3   | 通讯录   | `/pages/addressList/addressList` | `/pages/address/list` | ✅ 已有页面               |
|  4   | 我的     | `/pages/my/my`                   | `/pages/me/me`        | ✅ 已有页面               |

## 5. 模块完成情况汇总

### 5.1 已完成的模块（可从首页/工作台进入）

| 序号 | 模块名称           | 页面数量 | 分包路径                    |
| :--: | :----------------- | :------: | :-------------------------- |
|  1   | 投诉处理流程模块   |    7     | `src/pages-sub/complaint/`  |
|  2   | 维修工单流程模块   |    11    | `src/pages-sub/repair/`     |
|  3   | 巡检管理流程模块   |    8     | `src/pages-sub/inspection/` |
|  4   | 空置房管理流程模块 |    5     | `src/pages-sub/property/`   |
|  5   | 选择器系列页面     |    3     | `src/pages-sub/selector/`   |
|  6   | 活动模块           |    2     | `src/pages/activity/`       |

### 5.2 需要新建的模块（按优先级排序）

| 优先级 | 模块名称          | 预计页面数 | 建议分包路径                  | 说明                 |
| :----: | :---------------- | :--------: | :---------------------------- | :------------------- |
|   P0   | 工作台页面        |     1      | `src/pages/work/`             | TabBar 必需页面      |
|   P1   | 设备保养模块      |     4      | `src/pages-sub/maintainance/` | 首页顶部入口         |
|   P1   | 工作单模块        |     8      | `src/pages-sub/work/`         | 首页工作单区域       |
|   P1   | 采购/资源管理模块 |    20+     | `src/pages-sub/resource/`     | 工作待办区域         |
|   P2   | OA 工作流模块     |     7      | `src/pages-sub/oa/`           | OA 待办区域          |
|   P2   | 装修管理模块      |     5      | `src/pages-sub/renovation/`   | 工作台常用功能       |
|   P2   | 费用管理模块      |     6      | `src/pages-sub/fee/`          | 工作台常用功能       |
|   P2   | 抄表管理模块      |     6      | `src/pages-sub/meter/`        | 工作台常用功能       |
|   P3   | 业主管理模块      |     3      | `src/pages-sub/owner/`        | 工作台常用功能       |
|   P3   | 车辆管理模块      |     5      | `src/pages-sub/car/`          | 手机停车             |
|   P3   | 核销模块          |     5      | `src/pages-sub/coupon/`       | 手机核销             |
|   P3   | 报表统计模块      |     6      | `src/pages-sub/report/`       | 手机报表             |
|   P3   | 访客/物品放行模块 |     4      | `src/pages-sub/visit/`        | 工作待办             |
|   P3   | 公告管理模块      |     2      | `src/pages-sub/notice/`       | 工作台常用功能       |
|   P3   | 个人中心相关      |     4      | `src/pages/me/`               | 切换小区、修改密码等 |

## 6. 首页当前问题

当前首页 `src/pages/index/index.vue` 存在以下问题：

1. **缺少点击跳转功能**：所有入口按钮都是静态展示，没有绑定点击事件和路由跳转
2. **缺少待办数量显示**：没有实现 badge 徽标显示待办数量
3. **缺少 OA 待办区域**：旧项目有动态加载的 OA 待办列表，新项目未实现
4. **缺少数据加载逻辑**：没有调用接口获取待办数量等数据

## 7. 建议实施顺序

### 7.1 第一阶段：基础框架（P0）

1. 新建工作台页面 `src/pages/work/work.vue`
2. 更新 TabBar 配置，添加工作台入口
3. 完善首页的点击跳转功能（跳转到已有页面）

### 7.2 第二阶段：核心功能（P1）

1. 设备保养模块（4 个页面）
2. 工作单模块（8 个页面）
3. 采购/资源管理模块（20+ 个页面）

### 7.3 第三阶段：扩展功能（P2）

1. OA 工作流模块
2. 装修管理模块
3. 费用管理模块
4. 抄表管理模块

### 7.4 第四阶段：辅助功能（P3）

1. 业主管理、车辆管理、核销模块
2. 报表统计模块
3. 访客/物品放行模块
4. 公告管理、个人中心相关

## 8. 附录：旧项目组件参考

### 8.1 首页相关组件

| 组件文件                                                | 功能说明                                         |
| :------------------------------------------------------ | :----------------------------------------------- |
| `gitee-example/components/vc-index/index-header.vue`    | 顶部快捷入口（投诉、报修、巡检、设备保养）       |
| `gitee-example/components/vc-index/index-undo.vue`      | 工作待办区域（采购、领用、调拨、物品放行、访客） |
| `gitee-example/components/vc-index/index-undo-work.vue` | 工作单区域（发、办、抄）                         |
| `gitee-example/components/vc-index/index-undo-oa.vue`   | OA 待办区域（动态加载）                          |

### 8.2 工作台相关组件

| 组件文件                                              | 功能说明                               |
| :---------------------------------------------------- | :------------------------------------- |
| `gitee-example/components/vc-index/work-function.vue` | 工作台功能菜单（动态加载，按分类显示） |

---

**报告生成时间**: 2026-01-13

**分析范围**: 首页（index）、工作台（work）、TabBar 配置

**参考文档**: `docs\vue2-route-navigation-map.md`
