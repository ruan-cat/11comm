---
name: add-new-component
description: |
  新建公共组件规范专家 - 指导在 src/components/common 目录下创建符合项目规范的公共组件，包括文件结构、TypeScript 类型、Vue 组件、文档和测试页面。

  触发条件（满足任意一项即触发）：
  - 任务包含"新建组件"、"公共组件"、"common 组件"、"创建组件"等关键词
  - 需要在 src/components/common 目录下创建新组件
  - 需要创建可复用的业务组件（如表单分区标题、操作按钮组、信息展示卡片）
  - 需要编写组件的 TypeScript 类型定义
  - 需要编写组件使用文档（index.md）
  - 需要创建组件测试页面（src/pages/test-use/）
  - 用户提及"组件规范"、"组件文档"、"组件测试"等关键词

  必须协同的技能：
  - beautiful-component-design（组件美化时）- 图标、响应式设计、表单分区标题
  - component-migration（从旧组件迁移时）- ColorUI → wot-design-uni
  - use-wd-form（组件内包含表单时）- 表单结构、wd-picker、校验规则

  禁止事项：
  - 禁止在 components 目录外创建公共组件
  - 禁止不编写组件文档（index.md）
  - 禁止不提供使用示例和测试页面
  - 禁止组件命名不规范（必须使用短横线命名法）
  - 禁止不定义 TypeScript 类型（types.ts）
  - 禁止在组件文件顶部不添加说明注释
  - 禁止不使用 withDefaults 设置 props 默认值

  覆盖场景：所有需要跨页面复用的业务组件，包括表单分区标题（FormSectionTitle）、操作按钮组（ActivityActions）、信息展示卡片（ActivityInfo）、加载状态组件（ZPagingLoading）等。
---

# 新建公共组件规范

本技能用于指导创建新的公共组件，存放在 `src/components/common` 目录下。

## ⚠️ 多技能协同

常见组合场景：

- 新建美化类组件：`add-new-component` + `beautiful-component-design`
- 新建带表单的组件：`add-new-component` + `use-wd-form`
- 新建带接口的组件：`add-new-component` + `api-migration`

参阅 `.claude/skills/check-trigger.md` 了解完整的技能触发检查流程。

---

## 1. 组件文件存储结构

每个组件必须存放在独立文件夹内，遵循以下标准结构：

```plain
src/components/common/
└── [组件名]/
    ├── index.vue      # 组件主文件（必需）
    ├── types.ts       # TypeScript 类型定义（必需）
    └── index.md       # 组件使用文档（必需）
```

### 1.1 文件说明

|  文件名   |                   说明                    | 必需性 |
| :-------: | :---------------------------------------: | :----: |
| index.vue |      组件主文件，实现 UI 逻辑和交互       |   ✅   |
| types.ts  | TypeScript 类型定义，对外导出组件属性类型 |   ✅   |
| index.md  |             组件使用文档说明              |   ✅   |

---

## 2. 组件命名规范

### 2.1 文件夹命名

- **必须使用**：短横杠命名法（kebab-case）
- **示例**：`z-paging-loading`、`form-section-title`、`my-custom-component`

### 2.2 组件名命名

- **Vue 组件名**：使用短横杠命名法，与文件夹名称一致
- **TypeScript 类型名**：使用 PascalCase（大驼峰）
- **示例**：

```typescript
// 文件夹名：z-paging-loading
// 组件类型名：ZPagingLoadingProps
// 导入方式：import type { ZPagingLoadingProps } from './types'
```

---

## 3. TypeScript 类型定义规范

### 3.1 文件结构要求

`types.ts` 文件必须：

1. 导出组件属性类型接口（以 `Props` 结尾）
2. 导出组件相关的子类型（如枚举、选项类型等）
3. 使用 JSDoc 注释说明类型用途

### 3.2 类型定义模板

```typescript
/**
 * [组件名] 组件类型定义
 */

/** [组件名] 组件属性 */
export interface [ComponentName]Props {
  /** 属性1的说明 */
  prop1: string
  /** 属性2的说明（可选） */
  prop2?: number
  /** 属性3的说明（带默认值） */
  prop3?: boolean
}

/** 可选：子类型定义 */
export interface [ComponentName]Config {
  // ...
}
```

### 3.3 类型定义示例

```typescript
/**
 * form-section-title 组件类型定义
 */

/** 表单分区标题组件属性 */
export interface FormSectionTitleProps {
	/** 标题文本 */
	title: string;
	/** 是否显示必填标记 */
	required?: boolean;
	/** 是否启用呼吸动效 */
	animated?: boolean;
	/** 图标名称 */
	icon?: string;
	/** 图标的自定义类名 */
	iconClass?: string;
	/** 副标题/描述文本 */
	subtitle?: string;
}
```

---

## 4. Vue 组件编写规范

### 4.1 文件顶部注释

每个组件文件顶部必须提供 HTML 注释，说明组件的用途和功能：

```vue
<!--
  [组件名] 组件
  功能：简要说明组件的主要功能

  功能点：
  - 功能1
  - 功能2
  - 功能3
-->
```

**示例**：

```vue
<!--
  表单分区标题组件
  用于表单页面的分区标题，提供统一美观的标题样式

  功能：
  - 提供统一的标题样式
  - 支持呼吸动效
  - 支持图标和必填标记
  - 淡灰色背景与白色表单项形成对比
-->
```

### 4.2 `<script setup>` 规范

```vue
<script setup lang="ts">
// 1. 导入类型定义（从 ./types）
import type { [ComponentName]Props } from './types'

// 2. 使用 withDefaults 定义 props（设置默认值）
const props = withDefaults(defineProps<[ComponentName]Props>(), {
  // 默认值配置
  prop1: 'default-value',
  prop2: 0,
  prop3: true,
})

// 3. 如有需要，定义 emit
// const emit = defineEmits<{ (e: 'eventName', value: Type): void }>()

// 4. 如有需要，定义组件暴露的方法
// defineExpose({ methodName })
</script>
```

### 4.3 `<template>` 规范

- 使用 UnoCSS 原子类进行样式编写
- 如需自定义样式，在 `<style scoped>` 中定义
- 组件内部可使用 wot-design-uni 基础组件

### 4.4 完整组件示例

```vue
<!--
  [组件名] 组件
  功能：简要说明组件的主要功能

  功能点：
  - 功能1
  - 功能2
-->

<script setup lang="ts">
import type { [ComponentName]Props } from './types'

const props = withDefaults(defineProps<[ComponentName]Props>(), {
  prop1: 'default-value',
  prop2: 0,
})
</script>

<template>
	<view class="custom-component">
		<!-- 组件内容 -->
	</view>
</template>

<style lang="scss" scoped>
.custom-component {
	// 样式定义
}
</style>
```

---

## 5. 组件文档编写规范

### 5.1 文档结构

`index.md` 文件必须包含以下章节：

1. **文件存储结构** - 说明文件目录结构
2. **组件简介** - 简要介绍组件用途和特点
3. **基础用法** - 提供手动导入和自动导入两种示例
4. **Props 参数** - 完整的参数表格
5. **使用场景** - 多个典型使用示例
6. **完整示例** - 指向测试页面或业务页面的参考链接
7. **注意事项** - 使用时需要注意的事项
8. **TypeScript 类型** - 类型导入说明

### 5.2 文档模板

````markdown
# [组件名] 组件使用文档

## 1. 文件存储结构

```plain
src/components/common/[组件名]/
├── index.vue      # 组件主文件
├── types.ts       # TypeScript 类型定义
└── index.md       # 组件使用文档
```
````

### 1.1 文件说明

|  文件名   |                 说明                  |
| :-------: | :-----------------------------------: |
| index.vue |     组件主文件，实现 [XX] UI 逻辑     |
| types.ts  | TypeScript 类型定义文件，对外导出类型 |
| index.md  |           组件使用文档说明            |

## 2. 组件简介

`[组件名]` 是一个[简要描述组件用途]。

### 2.1 设计特点

- 特点 1
- 特点 2
- 特点 3

## 3. 基础用法

### 3.1 手动导入方式

```vue
<script setup lang="ts">
import [ComponentName] from "@/components/common/[组件名]/index.vue";

// ✅ 页面中使用必须添加 definePage 配置
definePage({
	style: {
		navigationBarTitleText: "示例页面",
	},
});
</script>

<template><[component-name] prop1="value" /></template>
```

### 3.2 自动导入方式（推荐）

```vue
<template><[component-name] prop1="value" /></template>
```

## 4. Props 参数

| 参数名 |  类型  | 默认值 |     说明     |
| :----: | :----: | :----: | :----------: |
| prop1  | string |   -    | prop1 的说明 |
| prop2  | number |   0    | prop2 的说明 |

## 5. 使用场景

### 5.1 场景 1

```vue
<template><[component-name] prop1="example1" /></template>
```

### 5.2 场景 2

```vue
<template><[component-name] prop1="example2" prop2="10" /></template>
```

## 6. 完整示例

详细的使用示例和各种配置效果，请查看：

- **测试页面**：`src/pages/test-use/[组件名].vue`
- **业务页面**：`src/pages-sub/xxx/xxx.vue`

## 7. 注意事项

1. 注意事项 1
2. 注意事项 2

## 8. TypeScript 类型

如需导入类型定义：

```typescript
import type { [ComponentName]Props } from "@/components/common/[组件名]/types";
```

````plain

---

## 6. 测试页面创建规范

### 6.1 文件位置

测试页面必须创建在 `src/pages/test-use/` 目录下：

```plain
src/pages/test-use/
└── [组件名].vue
````

### 6.2 测试页面结构

```vue
<!--
  [组件名] 组件演示页
  功能：演示 [组件名] 组件的各种用法和效果

  访问地址: http://localhost:3000/#/pages/test-use/[组件名]
-->

<script setup lang="ts">
import [ComponentName] from '@/components/common/[组件名]/index.vue'
// 如有需要，导入类型
// import type { [ComponentName]Props } from '@/components/common/[组件名]/types'

definePage({
  style: {
    navigationBarTitleText: '[组件名] 组件演示',
  },
})

// 测试数据和方法
</script>

<template>
	<wd-navbar title="[组件名]组件演示" placeholder fixed />

	<view class="page-container">
		<!-- 用法1 -->
		<wd-cell-group title="用法1"> <[component-name] prop1="value1" /> </wd-cell-group>

		<!-- 用法2 -->
		<wd-cell-group title="用法2"> <[component-name] prop1="value2" prop2="10" /> </wd-cell-group>
	</view>
</template>

<style scoped>
.page-container {
	padding-bottom: 40px;
}
</style>
```

### 6.3 测试页面要求

1. **顶部注释**：必须包含组件名、功能说明、访问地址
2. **definePage 配置**：设置页面标题
3. **导入组件**：从 `@/components/common/[组件名]/index.vue` 导入
4. **分类演示**：使用 `wd-cell-group` 分类展示不同用法
5. **覆盖全面**：演示组件的所有 props 和使用场景

---

## 7. 完整创建流程检查清单

### 7.1 阶段 1：创建组件文件夹

- [ ] 在 `src/components/common/` 下创建组件文件夹
- [ ] 文件夹名称使用短横杠命名法

### 7.2 阶段 2：创建 types.ts

- [ ] 定义 `XXXProps` 接口
- [ ] 添加 JSDoc 注释
- [ ] 包含所有 props 的类型定义

### 7.3 阶段 3：创建 index.vue

- [ ] 添加顶部 HTML 注释
- [ ] 使用 `<script setup lang="ts">`
- [ ] 从 `./types` 导入类型
- [ ] 使用 `withDefaults(defineProps<PropsType>(), {})` 设置默认值
- [ ] 编写组件模板
- [ ] 如有需要，添加 scoped style

### 7.4 阶段 4：创建 index.md

- [ ] 包含文件存储结构说明
- [ ] 包含组件简介和设计特点
- [ ] 提供手动和自动导入示例
- [ ] 提供完整的 Props 参数表格
- [ ] 提供多个使用场景示例
- [ ] 提供 TypeScript 类型导入说明

### 7.5 阶段 5：创建测试页面

- [ ] 在 `src/pages/test-use/` 下创建测试页面
- [ ] 添加顶部注释说明访问地址
- [ ] 使用 `definePage` 配置页面
- [ ] 演示组件的所有 props 用法
- [ ] 按功能分类展示不同场景

---

## 8. 参考示例

### 8.1 简单组件示例：`form-section-title`

- **组件文件**：`src/components/common/form-section-title/index.vue`
- **类型文件**：`src/components/common/form-section-title/types.ts`
- **使用文档**：`src/components/common/form-section-title/index.md`
- **测试页面**：`src/pages/test-use/form-section-title.vue`

### 8.2 复杂组件示例：`z-paging-loading`

- **组件文件**：`src/components/common/z-paging-loading/index.vue`
- **类型文件**：`src/components/common/z-paging-loading/types.ts`
- **使用文档**：`src/components/common/z-paging-loading/index.md`
- **测试页面**：`src/pages/test-use/z-paging-loading.vue`

---

## 9. 常见错误与避免方法

|        ❌ 错误写法        |         ✅ 正确写法          |            说明             |
| :-----------------------: | :--------------------------: | :-------------------------: |
|    组件文件夹使用大写     |       使用短横杠命名法       |      如 `my-component`      |
|    types.ts 不导出类型    |     必须导出 Props 接口      |   `export interface XXX`    |
| props 不使用 withDefaults | 使用 withDefaults 设置默认值 | `withDefaults(defineProps)` |
|    缺少顶部 HTML 注释     |     必须添加组件说明注释     |     说明组件用途和功能      |
|   测试页面放在其他目录    |  放在 `src/pages/test-use/`  |       便于管理和访问        |
|  组件文档缺少 Props 表格  |    必须提供完整的参数表格    |       便于使用者查阅        |

---

## 10. 组件注册与使用

### 10.1 自动注册

本项目使用 `@uni-helper/vite-plugin-uni-components` 自动注册组件，创建后无需手动导入即可在模板中使用：

```vue
<!-- 自动导入（推荐） -->
<template>
	<form-section-title title="分组标题" />
</template>
```

### 10.2 手动导入

如需显式导入，可使用以下方式：

```vue
<script setup lang="ts">
import FormSectionTitle from "@/components/common/form-section-title/index.vue";

// ✅ 页面中使用必须添加 definePage 配置
definePage({
	style: {
		navigationBarTitleText: "示例页面",
	},
});
</script>

<template>
	<FormSectionTitle title="分组标题" />
</template>
```
