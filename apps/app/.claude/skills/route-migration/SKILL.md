---
name: route-migration
description: |
  专注于 Vue2 传统路由配置到 Vue3 约定式路由的迁移。

  触发条件（满足任意一项即触发）：
  - 任务包含"路由迁移"、"pages.json"、"约定式路由"、"路由配置"等关键词
  - 需要从 pages.json 迁移到文件系统路由
  - 需要添加 definePage 页面配置
  - 需要配置强类型路由系统（TypedRouter）
  - 需要更新路由跳转代码（uni.navigateTo → TypedRouter）
  - 需要处理多平台路由适配
  - 需要查阅路由迁移映射表（docs/prompts/route-migration-map.yml）
  - 从 Vue2 项目迁移页面路由

  必须协同的技能：
  - code-migration（代码迁移）- Vue2 → Vue3 代码写法
  - component-migration（组件迁移）- ColorUI → wot-design-uni
  - style-migration（样式迁移）- ColorUI 类名 → UnoCSS 原子类

  禁止事项：
  - 禁止自行决定路由路径（必须查阅映射表）
  - 禁止使用 uni.navigateTo 字符串拼接（必须使用 TypedRouter）
  - 禁止在 definePage 中添加 name 字段（只使用 style）
  - 禁止跳过 definePage 配置（会导致标题显示为 "unibest"）
  - 禁止不更新映射表状态（完成后必须添加 ✅ 标记）

  覆盖场景：几乎所有从 Vue2 迁移到 Vue3 的页面都需要此技能，包括路由配置、页面跳转、参数传递等。
context: fork
---

# 路由系统迁移专家

从 Vue2 项目的 **传统 pages.json 路由配置** 迁移到 Vue3 项目的 **约定式路由系统 + 自动路由生成** 现代化路由管理模式。

## ⚠️ 多技能协同

完整页面迁移：

- `code-migration` + `component-migration` + `style-migration`

参阅 `.claude/skills/check-trigger.md` 了解完整的技能触发检查流程。

---

## 核心文档与规范

必读文件：

- `docs/prompts/route-migration-map.yml` - 路由映射表（强制查阅）
- `src/router/index.ts` - 强类型路由工具函数

关键要求：

- 所有路由迁移严格按照映射表执行
- 禁止自行决定路由路径，必须查表
- 完成后在映射表添加 ✅ 标记

## 常见错误

|               ❌ 错误写法               |           ✅ 正确写法           |          说明           |
| :-------------------------------------: | :-----------------------------: | :---------------------: |
|            自行决定路由路径             |         查阅映射表执行          |   必须严格按照映射表    |
| `uni.navigateTo({ url: '/pages/...' })` |      `TypedRouter.toXxx()`      |     使用强类型路由      |
|           不看映射表直接迁移            |        先读映射表再迁移         |    映射表是唯一标准     |
|             不标记完成状态              |          完成后添加 ✅          |      必须追踪进度       |
|      **页面缺少 definePage 配置**       | **所有页面必须添加 definePage** | **页面标题和配置必需**  |
|       页面标题显示 "unibest" 或空       |    使用 definePage 设置标题     |      影响用户体验       |
|       `definePage({ name: ... })`       |       **删除 name 字段**        | **name 字段是非法配置** |

## ⚠️ 重要工作原则

**必须严格遵照 `Vue2 到 Vue3 uni-app 路由迁移映射表` 执行所有路由迁移任务**

### 映射表文件位置

```plain
docs\prompts\route-migration-map.yml
```

### 工作流程

1. **任务开始前**: 必须首先读取完整的路由迁移映射表
2. **路径查询**: 根据旧路径在映射表中查找对应的新路径
3. **严格执行**: 所有迁移必须按照映射表的路径执行,不允许自行决定路径
4. **进度追踪**: 映射表文件本身作为进度表,完成迁移后需要标记状态
5. **映射表优先**: 如有冲突,一切以映射表为准

### 映射表使用方法

```bash
# 1. 首先读取映射表文件
Read: docs\prompts\route-migration-map.yml

# 2. 在 route_mappings 中查找对应的路径映射
# 例如：examples/gitee-exampl-app/pages/repairOrder/repairOrder.vue → src/pages-sub/repair/order-list.vue

# 3. 严格按照映射表执行迁移
# 4. 完成后在映射表相应模块添加 ✅ 标记
```

## 路由架构对比

### Vue2 项目路由架构

```plain
传统路由配置模式 (pages.json)
├── pages.json                    # 手动维护的集中式路由配置
│   ├── pages[]                   # 主包页面配置数组
│   ├── subPackages[]             # 分包配置
│   ├── globalStyle{}             # 全局样式配置
│   ├── tabBar{}                  # 底部导航配置
│   └── networkTimeout{}          # 网络超时配置
├── 页面文件                       # 页面文件与路由配置分离
└── 手动同步                       # 需要手动保持文件与配置同步
```

**特点**:

- **集中式配置**: 所有路由在 pages.json 中手动维护
- **手动同步**: 新增页面需同时修改文件和配置
- **配置冗余**: 页面路径和标题分散配置
- **维护成本高**: 大项目中配置文件过长难以维护

### Vue3 项目路由架构

```plain
约定式路由系统 (文件系统路由)
├── pages.config.ts               # 全局配置和组件自动导入
├── src/pages/                    # 页面目录结构即路由结构
│   ├── index/                    # /pages/index/index
│   │   └── index.vue            # 页面文件
│   ├── login/                    # /pages/login/
│   │   ├── login.vue            # 登录页面
│   │   └── register.vue         # 注册页面
│   └── about/                    # /pages/about/
│       ├── about.vue            # 关于页面
│       └── components/          # 页面级组件
├── src/pages-sub/                # 分包页面 (自动识别为分包)
├── src/tabbar/                   # 底部导航配置
│   └── config.ts                # TabBar 配置
└── 自动生成                       # 路由配置自动生成到 pages.json
```

**特点**:

- **约定优于配置**: 文件路径即路由路径
- **自动生成**: 路由配置自动从文件结构生成
- **definePage**: 页面级配置直接写在 Vue 文件中
- **TypeScript 支持**: 完整的类型检查和智能提示

## 路由配置差异分析

### 1. 页面路由定义方式对比

**Vue2 项目 - 集中式配置**:

```json
// pages.json
{
	"pages": [
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "首页"
			}
		},
		{
			"path": "pages/login/login",
			"style": {
				"navigationBarTitleText": "登录",
				"navigationStyle": "custom"
			}
		}
	]
}
```

**Vue3 项目 - 约定式路由**:

```vue
<!-- src/pages/index/index.vue -->
<script setup lang="ts">
// 使用 definePage API
definePage({
	style: {
		navigationBarTitleText: "首页",
	},
});
</script>

<template>
	<view>首页内容</view>
</template>
```

### 2. 分包配置迁移对比

**Vue2 项目 - 手动分包配置**:

```json
// pages.json
{
	"subPackages": [
		{
			"root": "pages-sub/maintenance",
			"pages": [
				{
					"path": "maintainance",
					"style": {
						"navigationBarTitleText": "设备保养"
					}
				}
			]
		}
	]
}
```

**Vue3 项目 - 自动分包识别**:

```plain
src/pages-sub/                    # 自动识别为分包目录
├── maintenance/                  # 分包名称
│   ├── maintainance.vue         # 自动生成路径: pages-sub/maintenance/maintainance
│   └── excuteMaintainance.vue   # 自动生成路径: pages-sub/maintenance/excuteMaintainance
└── complaint/                    # 其他分包
    ├── complaint.vue
    └── detail.vue
```

## 完整迁移工作流程（⭐ 重要）

当接到路由迁移任务时，必须按照以下完整流程执行：

### 阶段 1：前期准备

#### 1.1 读取路由迁移映射表

```bash
# 必须首先执行
Read: docs\prompts\route-migration-map.yml
```

#### 1.2 确认迁移目标

- 确定要迁移的页面路径（旧项目路径）
- 在映射表中查找对应的新项目路径
- 确认该页面是否已经迁移完成（检查映射表标记）

### 阶段 2：搜索旧项目中的路由跳转

在开始迁移页面之前，**必须先搜索旧项目中所有跳转到该页面的代码**：

#### 2.1 搜索旧路由路径

```bash
# 示例：搜索所有跳转到 repairOrder 页面的代码
Grep: pattern="pages/repairOrder/repairOrder" path="../../examples/gitee-exampl-app/" output_mode="content"

# 常见的跳转方式：
# - uni.navigateTo({ url: '/pages/repairOrder/repairOrder' })
# - uni.redirectTo({ url: '/pages/repairOrder/repairOrder' })
# - uni.switchTab({ url: '/pages/repairOrder/repairOrder' })
# - 字符串拼接：`/pages/repairOrder/repairOrder?id=${id}`
```

#### 2.2 记录所有跳转点

记录以下信息：

- 跳转的源文件路径
- 跳转代码所在行号
- 跳转时传递的参数
- 跳转方式（navigateTo/redirectTo/switchTab）

### 阶段 3：页面迁移实施

#### 3.1 创建新页面文件

```bash
# 根据映射表创建新文件
# 旧路径: examples/gitee-exampl-app/pages/repairOrder/repairOrder.vue
# 新路径: src/pages-sub/repair/order-list.vue

Write: src/pages-sub/repair/order-list.vue
```

#### 3.2 迁移页面内容

按照其他技能的要求迁移：

- 使用 `code-migration` 技能迁移 Vue 代码
- 使用 `component-migration` 技能迁移组件
- 使用 `style-migration` 技能迁移样式
- 使用 `api-migration` 技能迁移接口调用

#### 3.3 添加 definePage 配置（⚠️ 必须执行）

**重要性**: definePage 是页面配置的核心，缺少它会导致页面标题显示为 "unibest" 或空白，严重影响用户体验。

**执行时机**: 在创建页面文件后，必须立即添加 definePage 配置，这是**不可跳过的强制步骤**。

**最小配置示例**:

```vue
<script setup lang="ts">
// ✅ 所有页面必须添加 definePage，至少包含页面标题
definePage({
	style: {
		navigationBarTitleText: "维修工单池", // 导航栏标题（必需）
		enablePullDownRefresh: false, // 是否启用下拉刷新
	},
});
</script>
```

**常见页面配置**:

```vue
<script setup lang="ts">
definePage({
	style: {
		navigationBarTitleText: "维修工单池", // 导航栏标题
		enablePullDownRefresh: true, // 启用下拉刷新
		onReachBottomDistance: 50, // 触底距离
		backgroundColor: "#f5f5f5", // 背景色
		navigationBarBackgroundColor: "#368CFE", // 导航栏背景色
		navigationBarTextStyle: "white", // 导航栏文字颜色
	},
});
</script>
```

### 阶段 4：强类型路由配置

#### 4.1 添加路由类型定义

在 `src/types/routes.ts` 中添加：

```typescript
// 1. 添加到 PageRoute 类型
export type PageRoute = "/pages/index/index" | "/pages-sub/repair/order-list"; // ✅ 新增

// 2. 添加参数类型
export interface PageParams {
	"/pages-sub/repair/order-list": {
		status?: string;
		page?: number;
	};
}
```

#### 4.2 在 TypedRouter 中添加跳转方法

在 `src/router/helpers.ts` 中添加：

```typescript
export class TypedRouter {
	/** 跳转到维修工单池 */
	static toRepairList(params?: PageParams["/pages-sub/repair/order-list"]) {
		return navigateToTyped("/pages-sub/repair/order-list", params);
	}
}
```

#### 4.3 导出新方法

在 `src/router/index.ts` 中导出：

```typescript
export const {
	toRepairList, // ✅ 导出新方法
	// ... 其他方法
} = TypedRouter;
```

#### 4.4 更新路由验证函数

在 `src/router/helpers.ts` 的 `isValidRoute` 中添加：

```typescript
const validRoutes: PageRoute[] = [
	"/pages-sub/repair/order-list", // ✅ 添加
	// ...
];
```

### 阶段 5：更新所有跳转代码

根据阶段 2 记录的跳转点，逐一更新：

#### 5.1 在新项目中搜索跳转代码

```bash
# 搜索新项目中是否有使用旧路径的跳转（理论上不应该有）
Grep: pattern="pages/repairOrder/repairOrder" path="src/" output_mode="content"

# 搜索是否有使用新路径但未使用 TypedRouter 的跳转
Grep: pattern="pages-sub/repair/order-list" path="src/" output_mode="content"
```

#### 5.2 替换跳转代码

**迁移前（Vue2 旧代码）**：

```typescript
// ❌ 旧代码
uni.navigateTo({
	url: `/pages/repairOrder/repairOrder?status=${status}&page=${page}`,
});
```

**迁移后（Vue3 新代码）**：

```typescript
// ✅ 新代码
import { TypedRouter } from "@/router";

TypedRouter.toRepairList({ status, page });
```

#### 5.3 处理不同的跳转方式

```typescript
// navigateTo → TypedRouter.toXxx()
TypedRouter.toRepairList(params);

// redirectTo → redirectToTyped()
redirectToTyped("/pages-sub/repair/order-list", params);

// switchTab → switchTabTyped()（仅用于 Tab 页面）
switchTabTyped("/pages/index/index");
```

### 阶段 6：验证与测试

#### 6.1 TypeScript 编译检查

```bash
# 检查类型错误
pnpm type-check
```

#### 6.2 搜索验证

```bash
# 确保新项目中没有旧路径的引用
Grep: pattern="pages/repairOrder" path="src/" output_mode="files_with_matches"

# 确保所有新路径跳转都使用了 TypedRouter
Grep: pattern="pages-sub/repair/order-list" path="src/" glob="*.vue" output_mode="content"
```

#### 6.3 功能测试

- [ ] 页面可以正常访问
- [ ] 所有跳转功能正常
- [ ] 参数传递正确
- [ ] 页面展示正常

### 阶段 7：更新映射表状态

完成迁移后，更新映射表：

```yaml
route_mappings:
  repair_module:
    - old: examples/gitee-exampl-app/pages/repairOrder/repairOrder.vue
      new: src/pages-sub/repair/order-list.vue
      status: ✅ # 标记为已完成
```

## 实际操作示例

### 示例：迁移维修工单详情页

#### 步骤 1：搜索旧项目跳转

```bash
Grep: pattern="pages/repairDispatch/repairDispatch" path="../../examples/gitee-exampl-app/" output_mode="content"
```

**搜索结果**：

```plain
../../examples/gitee-exampl-app/pages/repairOrder/repairOrder.vue:120: uni.navigateTo({ url: '/pages/repairDispatch/repairDispatch?id=' + item.id })
../../examples/gitee-exampl-app/pages/index/index.vue:45: uni.navigateTo({ url: '/pages/repairDispatch/repairDispatch' })
```

#### 步骤 2：分析参数

从搜索结果分析：

- 页面需要接收 `id` 参数（有时没有参数）
- 使用 `navigateTo` 跳转

#### 步骤 3：定义类型

```typescript
// src/types/routes.ts
export interface PageParams {
	"/pages-sub/repair/dispatch": {
		id?: string; // 可选参数
	};
}
```

#### 步骤 4：创建 TypedRouter 方法

```typescript
// src/router/helpers.ts
static toRepairDispatch(id?: string) {
  return navigateToTyped('/pages-sub/repair/dispatch', { id })
}
```

#### 步骤 5：替换跳转代码

在新项目中找到对应位置，替换为：

```typescript
// 原来：uni.navigateTo({ url: '/pages/repairDispatch/repairDispatch?id=' + item.id })
// 现在：
TypedRouter.toRepairDispatch(item.id);
```

## 常见错误与避免方法

### 错误 1：忘记读取映射表

❌ **错误做法**：直接按照自己的理解创建路径

✅ **正确做法**：必须先读取映射表，严格按照映射表执行

### 错误 2：只迁移页面，不更新跳转代码

❌ **错误做法**：只创建了新页面，但忘记更新其他页面中的跳转代码

✅ **正确做法**：迁移前先搜索所有跳转点，迁移后逐一更新

### 错误 3：未添加强类型路由支持

❌ **错误做法**：直接使用 `uni.navigateTo` 跳转到新路径

✅ **正确做法**：完整配置强类型路由系统（类型定义 + TypedRouter 方法）

### 错误 4：参数类型定义不准确

❌ **错误做法**：所有参数都定义为可选

✅ **正确做法**：根据实际使用情况，正确区分必填和可选参数

### 错误 5：未验证迁移完整性

❌ **错误做法**：迁移完就认为完成了

✅ **正确做法**：搜索验证，确保没有遗漏的旧路径引用

## 迁移步骤

### 步骤 1: 创建页面文件

根据映射表,在新项目中创建对应的页面文件:

```bash
# 旧路径: pages/repairOrder/repairOrder.vue
# 新路径: src/pages-sub/repair/order-list.vue

# 创建文件
Write: src/pages-sub/repair/order-list.vue
```

### 步骤 2: 添加 definePage 配置

在页面文件中使用 `definePage` 定义页面配置:

```vue
<script setup lang="ts">
definePage({
	style: {
		navigationBarTitleText: "维修工单池",
		enablePullDownRefresh: true,
		onReachBottomDistance: 50,
	},
});
</script>
```

### 步骤 3: 迁移页面内容

迁移页面的模板、脚本和样式:

- 使用 Vue3 Composition API
- 使用 TypeScript
- 使用 UnoCSS 样式
- 使用 wot-design-uni 组件

### 步骤 4: 更新路由跳转

更新所有跳转到该页面的路由路径:

```typescript
// 旧代码
uni.navigateTo({
	url: "/pages/repairOrder/repairOrder",
});

// 新代码
uni.navigateTo({
	url: "/pages-sub/repair/order-list",
});
```

## 常用 definePage 配置

### ⚠️ definePage 字段规范（严禁使用 name 字段）

`definePage` **不支持** `name` 字段。使用 `name` 字段会导致类型错误或运行时警告。

**❌ 错误示例**：

```ts
definePage({
	name: "test-z-paging-loading", // ❌ 错误：name 是非法字段
	style: {
		navigationBarTitleText: "z-paging-loading 组件测试",
	},
});
```

**✅ 有效配置项**：

- `style`: 页面样式配置 (对象)
  - `navigationBarTitleText`: 导航栏标题
  - `enablePullDownRefresh`: 是否启用下拉刷新
  - `onReachBottomDistance`: 触底距离
  - `navigationBarBackgroundColor`: 导航栏背景色
  - `navigationBarTextStyle`: 导航栏文字颜色 (black/white)
  - `navigationStyle`: 导航栏样式 (default/custom)
  - `backgroundColor`: 背景色
- `middlewares`: 中间件 (数组)

### 典型配置示例

```vue
<script setup lang="ts">
definePage({
	style: {
		// 导航栏标题（必需）
		navigationBarTitleText: "维修工单",

		// 下拉刷新
		enablePullDownRefresh: true,

		// 触底距离
		onReachBottomDistance: 50,

		// 导航栏背景色
		navigationBarBackgroundColor: "#368CFE",

		// 导航栏标题颜色
		navigationBarTextStyle: "white",

		// 自定义导航栏（谨慎使用）
		navigationStyle: "custom",

		// 背景色
		backgroundColor: "#f5f5f5",
	},
});
</script>
```

## 强类型路由跳转系统（⭐ 重点）

Vue3 项目采用了**完整的强类型路由跳转系统**，通过 TypeScript 提供编译时类型检查，避免路由错误和参数错误。

### 1. 核心文件结构

```plain
src/
├── types/
│   └── routes.ts                 # 路由类型定义文件
│       ├── PageRoute            # 所有页面路由的联合类型
│       ├── TabRoute             # Tab页面路由类型
│       └── PageParams           # 页面参数类型映射
├── router/
│   ├── index.ts                 # 路由管理中心（导出所有工具）
│   ├── helpers.ts               # 强类型路由跳转工具实现
│   │   ├── navigateToTyped()   # 类型安全的页面跳转
│   │   ├── redirectToTyped()   # 类型安全的重定向
│   │   ├── switchTabTyped()    # 类型安全的Tab切换
│   │   └── TypedRouter         # 封装业务逻辑的路由类
│   ├── examples.ts              # 路由使用示例代码
│   ├── guards.ts                # 路由守卫
│   └── interceptor.ts           # 路由拦截器
```

### 2. 路由类型定义系统

#### 2.1 定义页面路由类型 (`src/types/routes.ts`)

```typescript
/** 页面路由类型（完整版本，包含主包和分包） */
export type PageRoute =
	/** 主包页面 */
	| "/pages/index/index"
	| "/pages/about/about"
	| "/pages/me/me"
	/** 维修管理模块 (10个页面) */
	| "/pages-sub/repair/order-list" // 维修工单池
	| "/pages-sub/repair/dispatch" // 维修待办单
	| "/pages-sub/repair/finish" // 维修已办
	| "/pages-sub/repair/order-detail" // 维修详情
	| "/pages-sub/repair/add-order" // 添加维修记录
	| "/pages-sub/repair/handle"; // 订单处理
// ... 更多路由

/** Tab页面路由类型 */
export type TabRoute = "/pages/index/index" | "/pages/address/list" | "/pages/me/me";
```

#### 2.2 定义页面参数类型映射

```typescript
/** 页面参数类型映射（强类型约束） */
export interface PageParams {
	"/pages/index/index": {};

	"/pages/login/login": {
		redirect?: string;
	};

	/** 维修工单详情页参数 */
	"/pages-sub/repair/order-detail": {
		repairId: string; // 必填参数
		storeId: string; // 必填参数
	};

	/** 维修工单列表页参数 */
	"/pages-sub/repair/order-list": {
		status?: string; // 可选参数
		page?: number;
		row?: number;
		repairName?: string;
		state?: string;
	};

	/** 订单处理页面参数 */
	"/pages-sub/repair/handle": {
		/** 操作类型: DISPATCH-派单, TRANSFER-转单, BACK-退单, FINISH-办结 */
		action: "DISPATCH" | "TRANSFER" | "BACK" | "FINISH"; // 联合类型约束
		repairId: string;
		repairType: string;
		preStaffId?: string;
		preStaffName?: string;
		repairObjType?: string;
		publicArea?: string;
		repairChannel?: string;
	};
}
```

### 3. 强类型跳转工具使用

#### 3.1 TypedRouter 类（推荐使用）

`TypedRouter` 是封装了业务逻辑的路由工具类，提供语义化的跳转方法：

```typescript
import { TypedRouter } from "@/router";

// ✅ 推荐：使用 TypedRouter 进行跳转

// 跳转到维修工单详情（自动类型检查）
TypedRouter.toRepairDetail("repair123", "store456");

// 跳转到维修工单列表（可选参数）
TypedRouter.toRepairList({ status: "pending", page: 1 });

// 跳转到订单处理页面（复杂参数对象）
TypedRouter.toRepairHandle({
	action: "DISPATCH", // TypeScript 会检查值必须是允许的类型
	repairId: "R001",
	repairType: "TYPE_01",
	preStaffId: "STAFF_123",
});

// 跳转到首页（Tab切换）
TypedRouter.toHome();

// 跳转到选择器页面（级联跳转）
TypedRouter.toSelectFloor(); // 第一步：选择楼栋
TypedRouter.toSelectUnit("F001"); // 第二步：选择单元
TypedRouter.toSelectRoom("F001", "U001"); // 第三步：选择房屋
```

#### 3.2 基础类型安全函数

```typescript
import { navigateToTyped, redirectToTyped, switchTabTyped } from "@/router";

// 类型安全的页面跳转
navigateToTyped("/pages-sub/repair/order-detail", {
	repairId: "repair123", // TypeScript 会检查参数类型是否匹配
	storeId: "store456",
});

// 类型安全的重定向
redirectToTyped("/pages/login/login", {
	redirect: "/pages/me/me",
});

// 类型安全的Tab切换
switchTabTyped("/pages/index/index");
```

### 4. 迁移旧路由跳转代码

#### 4.1 基础跳转迁移

**Vue2 旧代码**：

```typescript
// ❌ 旧代码：字符串拼接，无类型检查，容易出错
uni.navigateTo({
	url: `/pages/repairOrder/repairOrder?repairId=${repairId}&status=${status}`,
});
```

**Vue3 新代码**：

```typescript
// ✅ 新代码：使用 TypedRouter，类型安全
import { TypedRouter } from "@/router";

TypedRouter.toRepairDetail(repairId, storeId);
```

#### 4.2 带参数跳转迁移

**Vue2 旧代码**：

```typescript
// ❌ 旧代码：手动拼接URL，参数类型不安全
const url = `/pages/repairDispatch/repairDispatch?action=DISPATCH&repairId=${id}`;
uni.navigateTo({ url });
```

**Vue3 新代码**：

```typescript
// ✅ 新代码：参数对象，TypeScript 自动检查
TypedRouter.toRepairHandle({
	action: "DISPATCH",
	repairId: id,
	repairType: type,
});
```

### 5. 为新页面添加强类型路由支持

当迁移完成一个新页面后，需要将其加入强类型路由系统。

#### 5.1 步骤 1：添加路由类型定义

在 `src/types/routes.ts` 中添加页面路由和参数类型：

```typescript
// 1. 在 PageRoute 类型中添加新路由
export type PageRoute = "/pages/index/index" | "/pages-sub/repair/new-page"; // ✅ 新增路由

// 2. 在 PageParams 接口中定义参数类型
export interface PageParams {
	"/pages-sub/repair/new-page": {
		repairId: string; // 必填参数
		status?: string; // 可选参数
	};
}
```

#### 5.2 步骤 2：在 TypedRouter 中添加跳转方法

在 `src/router/helpers.ts` 的 `TypedRouter` 类中添加对应方法：

```typescript
export class TypedRouter {
	/** 跳转到新页面 */
	static toNewPage(repairId: string, status?: string) {
		return navigateToTyped("/pages-sub/repair/new-page", { repairId, status });
	}
}
```

#### 5.3 步骤 3：导出新方法（可选）

在 `src/router/index.ts` 中导出新方法（便于外部使用）：

```typescript
export const {
	toRepairList,
	toRepairDetail,
	toNewPage, // ✅ 导出新方法
	// ... 其他方法
} = TypedRouter;
```

#### 5.4 步骤 4：更新 `isValidRoute` 验证函数

在 `src/router/helpers.ts` 的 `isValidRoute` 函数中添加新路由：

```typescript
export function isValidRoute(path: string): path is PageRoute {
	const validRoutes: PageRoute[] = [
		"/pages/index/index",
		"/pages-sub/repair/new-page", // ✅ 添加到验证列表
		// ... 其他路由
	];

	return validRoutes.includes(path as PageRoute);
}
```

### 6. 实际使用示例（repair 模块参考）

#### 6.1 维修工单列表页跳转示例

```vue
<script setup lang="ts">
import { TypedRouter } from "@/router";
import type { RepairOrder } from "@/types/repair";

/** 查看工单详情 */
function handleViewDetail(item: RepairOrder) {
	// ✅ 类型安全的跳转，参数自动推断和检查
	TypedRouter.toRepairDetail(item.repairId!, userInfo.storeId);
}

/** 派单 */
function handleDispatch(item: RepairOrder) {
	TypedRouter.toRepairHandle({
		action: "DISPATCH", // 类型约束为 'DISPATCH' | 'TRANSFER' | 'BACK' | 'FINISH'
		repairId: item.repairId!,
		repairType: item.repairType,
	});
}

/** 结束工单 */
function handleEndOrder(item: RepairOrder) {
	TypedRouter.toEndRepair(item.repairId!, item.communityId);
}
</script>
```

#### 6.2 选择器级联跳转示例

```vue
<script setup lang="ts">
import { TypedRouter } from "@/router";
import { useSelectorStore } from "@/stores/useSelectorStore";

const selectorStore = useSelectorStore();

/** 选择楼栋 */
function handleSelectFloor() {
	TypedRouter.toSelectFloor(); // 无参数
}

/** 选择单元 */
function handleSelectUnit() {
	// ✅ 参数类型自动检查
	TypedRouter.toSelectUnit(selectorStore.selectedFloor.floorId);
}

/** 选择房屋 */
function handleSelectRoom() {
	// ✅ 多个参数的类型安全
	TypedRouter.toSelectRoom(selectorStore.selectedFloor.floorId, selectorStore.selectedUnit.unitId);
}
</script>
```

### 7. 类型安全的好处

#### 7.1 编译时错误检查

```typescript
// ❌ 错误：路由路径拼写错误，TypeScript 会报错
TypedRouter.toRepairDetial("R001", "S001"); // 方法名拼写错误

// ❌ 错误：参数类型不匹配
TypedRouter.toRepairDetail("R001", 123); // storeId 应该是 string，不是 number

// ❌ 错误：缺少必填参数
TypedRouter.toRepairHandle({
	action: "DISPATCH",
	// repairId 是必填的，会报错
});

// ❌ 错误：参数值不在允许范围内
TypedRouter.toRepairHandle({
	action: "INVALID_ACTION", // action 必须是 'DISPATCH' | 'TRANSFER' | 'BACK' | 'FINISH'
	repairId: "R001",
	repairType: "TYPE_01",
});
```

#### 7.2 智能代码提示

```typescript
// ✅ IDE 会自动提示所有可用的跳转方法
TypedRouter.to; // 输入 "to" 后会显示所有 toXxx 方法

// ✅ 参数对象的智能提示
TypedRouter.toRepairHandle({
	action: "", // 输入时会提示 'DISPATCH' | 'TRANSFER' | 'BACK' | 'FINISH'
	// 光标移到这里会提示所有可用参数
});
```

### 8. 迁移检查清单（强类型路由部分）

完成页面迁移后，必须完成以下强类型路由相关的配置：

- [ ] **类型定义**
  - [ ] 在 `PageRoute` 中添加了新路由路径
  - [ ] 在 `PageParams` 中定义了参数类型
  - [ ] 参数类型准确（必填/可选、类型约束）

- [ ] **TypedRouter 方法**
  - [ ] 在 `TypedRouter` 类中添加了对应的跳转方法
  - [ ] 方法命名符合规范（`toXxxXxx` 格式）
  - [ ] 方法参数设计合理（区分必填/可选）
  - [ ] 添加了 JSDoc 注释说明

- [ ] **路由验证**
  - [ ] 在 `isValidRoute` 函数中添加了新路由

- [ ] **代码迁移**
  - [ ] 将所有 `uni.navigateTo` 改为使用 `TypedRouter`
  - [ ] 参数传递方式已更新为对象形式
  - [ ] 移除了字符串拼接的 URL 构建方式

- [ ] **测试验证**
  - [ ] TypeScript 编译无错误
  - [ ] 所有跳转功能正常
  - [ ] 参数传递正确

### 9. 常见问题与解决方案

#### 问题 1：新页面如何快速添加路由支持？

**解决方案**：按照"步骤 5"依次完成四步配置即可。

#### 问题 2：参数太多，TypedRouter 方法签名太长怎么办？

**解决方案**：使用参数对象形式：

```typescript
// ❌ 不推荐：参数太多
static toRepairHandle(action, repairId, repairType, preStaffId, preStaffName, ...)

// ✅ 推荐：使用参数对象
static toRepairHandle(params: PageParams['/pages-sub/repair/handle'])
```

#### 问题 3：如何处理动态路由参数？

**解决方案**：在类型定义中使用可选参数：

```typescript
export interface PageParams {
	"/pages-sub/repair/order-list": {
		status?: string; // 可选参数
		page?: number;
	};
}
```

## 路由跳转方式

### 普通跳转

```typescript
// ⚠️ 不推荐：直接使用 uni.navigateTo（无类型检查）
uni.navigateTo({
	url: "/pages-sub/repair/order-list",
});

// ✅ 推荐：使用 TypedRouter（类型安全）
TypedRouter.toRepairList();

// 带参数跳转
TypedRouter.toRepairDetail("repair123", "store456");
```

### 接收路由参数

```vue
<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";

const orderId = ref("");
const status = ref("");

onLoad((options) => {
	orderId.value = options.orderId as string;
	status.value = options.status as string;
});
</script>
```

## 迁移检查清单

- [ ] **映射表检查**
  - [ ] 已读取完整的路由迁移映射表
  - [ ] 路径映射准确无误
  - [ ] 完成后已标记迁移状态

- [ ] **文件创建**
  - [ ] 页面文件已创建在正确的目录
  - [ ] 文件命名符合约定式路由规范

- [ ] **definePage 配置**
  - [ ] 页面标题已配置
  - [ ] 必要的页面配置已迁移
  - [ ] TypeScript 类型正确

- [ ] **路由跳转**
  - [ ] 所有跳转到该页面的路由已更新
  - [ ] 路由参数传递正确
  - [ ] 路由参数接收正确

- [ ] **功能验证**
  - [ ] 页面可以正常访问
  - [ ] 路由跳转正常
  - [ ] 参数传递正常

通过约定式路由系统,实现路由配置的自动化管理,提升开发效率和代码可维护性！
