# 2026-01-06 维修工单列表 statusCd 参数分析报告

## 1. 问题背景

在从 Vue2 (gitee-example) 向 Vue3 (本项目) 进行代码迁移的过程中，物业员工工作台（Workbench）的功能复刻遇到了参数传递的问题。

旧版系统中，工作台菜单是通过后端接口动态返回的，其中"维修工单池"等菜单项配置了带有 `statusCd` 参数的跳转链接（如 `?statusCd=10001`）。在新版 Vue3 系统中，点击该菜单跳转到维修工单列表页后，未能自动筛选出对应状态的工单，导致用户体验不一致。

本报告旨在分析该参数的传递逻辑、新旧代码差异及当前存在的缺陷，并提出改进方案。

## 2. URL 参数传递逻辑分析

### 2.1. 传递源头：物业员工工作台

- **组件位置**：`src/pages-sub/property/work.vue` (参考旧版 `work-function.vue`)
- **逻辑**：菜单数据由 API 返回，每个菜单项包含 `href` 字段。
- **参数格式**：`/pages/repairOrder/repairOrder?statusCd=10001`
- **业务含义**：`statusCd` 代表工单的状态（如待派单、已派单、处理中等）。

### 2.2. 接收目标：维修工单列表

- **页面位置**：`src/pages-sub/repair/order-list.vue`
- **期望行为**：
  1. 页面加载 (`onLoad`) 时读取 URL 中的 `statusCd` 参数。
  2. 将该参数传递给搜索栏组件 (`repair-list-search-bar`)。
  3. 搜索栏初始化时选中对应的状态标签。
  4. 触发 API 请求，加载筛选后的数据。

## 3. 新旧代码对比

### 3.1. 参数命名混淆

在迁移过程中，发现了三种不同的参数命名：

|   参数名   |    来源    |             说明              |
| :--------: | :--------: | :---------------------------: |
| `statusCd` |  字典/URL  | 数据库字典表及 URL 参数中使用 |
|  `state`   |  Vue2 API  |     旧版后端接口入参使用      |
|  `status`  | Vue3 Route |  部分新版路由类型定义中使用   |

### 3.2. 状态码映射

| 旧状态码 | 新状态码 | 状态名称 |
| :------: | :------: | :------: |
|  `1000`  | `10001`  |  待派单  |
|  `1100`  | `10002`  |  已派单  |
|  `1200`  | `10003`  |  处理中  |
|  `1300`  | `10006`  |  已暂停  |
|  `1700`  | `10004`  |  已完成  |
|  `1800`  | `10005`  |  已关闭  |

## 4. 当前缺陷分析

经过代码审查，发现新版代码存在以下具体缺陷：

1. **缺少参数读取逻辑**：`src/pages-sub/repair/order-list.vue` 的 `onLoad` 生命周期中未编写读取 `options.statusCd` 的代码。
2. **路由类型定义不统一**：`src/types/routes.ts` 中关于维修工单列表的路由定义可能缺失 `statusCd` 字段，或错误地定义为 `status`。
3. **组件通信缺失**：父页面获取到参数后，缺乏机制将其传递给 `repair-list-search-bar` 组件进行初始化。

## 5. 数据流详解

以下日志模拟了当前（异常）与期望（正常）的数据流过程：

```log
[Current - 异常流]
1. User Click Menu -> Navigate to /pages-sub/repair/order-list?statusCd=10001
2. Page onLoad -> options = { statusCd: "10001" }
3. Page Init -> 忽略 options
4. SearchBar Init -> default status = "" (All)
5. API Request -> params = { page: 1, row: 10, statusCd: "" }
6. Result -> 显示所有状态工单 (不符合预期)

[Expected - 正常流]
1. User Click Menu -> Navigate to /pages-sub/repair/order-list?statusCd=10001
2. Page onLoad -> options = { statusCd: "10001" }
3. Page Init -> 将 "10001" 赋值给 queryParams.statusCd
4. SearchBar Init -> 接收 prop modelValue = "10001" -> 激活"待派单"Tab
5. API Request -> params = { page: 1, row: 10, statusCd: "10001" }
6. Result -> 仅显示待派单工单 (符合预期)
```

## 6. 相关文件清单

|                         文件路径                         |           说明           |
| :------------------------------------------------------: | :----------------------: |
|          `src/pages-sub/repair/order-list.vue`           | 维修工单列表页（主逻辑） |
| `src/components/common/repair-list-search-bar/index.vue` |    搜索与状态筛选组件    |
|                  `src/types/routes.ts`                   |     路由参数类型定义     |
|                 `src/router/helpers.ts`                  |     路由跳转辅助函数     |

## 7. 建议的改进方案

### 7.1. 统一参数命名

建议全链路统一使用 `statusCd` 作为标准命名，与后端数据库及 URL 保持一致。

### 7.2. 修改路由类型定义

在 `src/types/routes.ts` 中，为维修工单列表路由添加 `statusCd` 可选参数定义。

### 7.3. 完善列表页逻辑

在 `order-list.vue` 中：

- `onLoad` 钩子中解析 `options.statusCd`。
- 定义响应式变量 `currentStatusCd` 并传递给搜索组件。

### 7.4. 升级搜索组件

在 `repair-list-search-bar/index.vue` 中：

- 增加 `modelValue` 或 `defaultStatus` prop。
- 在 `onMounted` 或 `watch` 中响应外部传入的状态值，自动切换激活的 Tab。

---

**报告生成时间**：2026-01-06
**分析人员**：Gemini (报告编写) + Claude Code (代码分析)
**文档版本**：v1.0
