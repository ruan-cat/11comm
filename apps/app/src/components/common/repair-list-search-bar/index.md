# 维修列表搜索栏组件使用文档

## 1. 文件存储结构

```plain
src/components/common/repair-list-search-bar/
├── index.vue      # 组件主文件
├── types.ts       # TypeScript 类型定义
└── index.md       # 组件使用文档
```

### 1.1 文件说明

|  文件名   |                     说明                      |
| :-------: | :-------------------------------------------: |
| index.vue |  组件主文件，实现维修列表搜索和筛选工具栏 UI  |
| types.ts  | TypeScript 类型定义文件，对外导出组件属性类型 |
| index.md  |               组件使用文档说明                |

## 2. 组件简介

`repair-list-search-bar` 是一个专门用于维修列表页的搜索栏组件，集成了搜索输入、状态筛选和记录统计功能。

### 2.1 设计特点

- **业务专用**：专为维修工单列表页设计，减少重复代码
- **灵活配置**：支持开启/关闭状态筛选功能
- **内部封装**：自动加载维修状态字典，无需外部管理
- **双向绑定**：支持 `v-model` 和 `v-model:selectedState` 双向绑定
- **统一样式**：维持所有维修列表页搜索栏的一致性

### 2.2 核心功能

- ✅ 搜索输入框（支持清空）
- ✅ 状态筛选器（可配置是否启用）
- ✅ 自动加载状态字典
- ✅ 显示总记录数
- ✅ 搜索按钮

## 3. 基础用法

### 3.1 手动导入方式

```vue
<script setup lang="ts">
import { ref } from "vue";
import RepairListSearchBar from "@/components/common/repair-list-search-bar/index.vue";

// ✅ 页面中使用必须添加 definePage 配置
definePage({
	style: {
		navigationBarTitleText: "示例页面",
	},
});

const searchName = ref("");
const selectedState = ref("");
const total = ref(100);

/** 搜索处理 */
function handleSearch() {
	console.log("搜索:", searchName.value, selectedState.value);
	// 触发列表刷新逻辑
}

/** 清空处理 */
function handleClear() {
	console.log("清空搜索");
	// 清空后触发列表刷新
}

/** 状态改变处理 */
function handleStateChange(value: string) {
	console.log("状态改变:", value);
	// 触发列表刷新逻辑
}
</script>

<template>
	<repair-list-search-bar
		v-model="searchName"
		v-model:selected-state="selectedState"
		:total="total"
		@search="handleSearch"
		@clear="handleClear"
		@state-change="handleStateChange"
	/>
</template>
```

### 3.2 自动导入方式（推荐）

```vue
<script setup lang="ts">
import { ref } from "vue";

const searchName = ref("");
const selectedState = ref("");
const total = ref(100);

function handleSearch() {
	console.log("搜索:", searchName.value, selectedState.value);
}
</script>

<template>
	<repair-list-search-bar
		v-model="searchName"
		v-model:selected-state="selectedState"
		:total="total"
		@search="handleSearch"
	/>
</template>
```

## 4. Props 参数

|      参数名       |  类型   | 默认值         |                    说明                    |
| :---------------: | :-----: | :------------- | :----------------------------------------: |
|    modelValue     | string  | `''`           |         搜索关键词（支持 v-model）         |
|   selectedState   | string  | `''`           | 选中的状态值（支持 v-model:selectedState） |
| isUseStateOptions | boolean | `true`         |            是否使用状态筛选功能            |
|    placeholder    | string  | `'输入报修人'` |                搜索框占位符                |
|     maxlength     | number  | `20`           |                最大输入长度                |
|       total       | number  | `0`            |     总记录数（用于显示"共 X 条记录"）      |

## 5. Events 事件

|        事件名        |     参数类型     |             说明             |
| :------------------: | :--------------: | :--------------------------: |
|  update:modelValue   |     `string`     |      更新搜索关键词事件      |
| update:selectedState |     `string`     |       更新选中状态事件       |
|        search        |       `-`        | 触发搜索事件（点击搜索按钮） |
|        clear         |       `-`        | 清空搜索事件（点击清空按钮） |
|     state-change     | `string` (value) |         状态改变事件         |

## 6. 使用场景

### 6.1 场景 1：完整功能（带状态筛选）

适用于：维修工单池、维修待办单等需要状态筛选的列表页

```vue
<script setup lang="ts">
import { ref } from "vue";

const searchName = ref("");
const selectedState = ref("");
const total = ref(100);

function handleSearch() {
	// 触发列表刷新
	pagingRef.value?.reload();
}
</script>

<template>
	<z-paging ref="pagingRef" v-model="repairList" @query="handleQuery">
		<template #top>
			<repair-list-search-bar
				v-model="searchName"
				v-model:selected-state="selectedState"
				:total="total"
				:is-use-state-options="true"
				@search="handleSearch"
				@clear="handleSearch"
				@state-change="handleSearch"
			/>
		</template>

		<!-- 列表内容 -->
	</z-paging>
</template>
```

### 6.2 场景 2：仅搜索（不带状态筛选）

适用于：维修已办单等不需要状态筛选的列表页

```vue
<script setup lang="ts">
import { ref } from "vue";

const searchName = ref("");
const total = ref(50);

function handleSearch() {
	// 触发列表刷新
	pagingRef.value?.reload();
}
</script>

<template>
	<z-paging ref="pagingRef" v-model="repairList" @query="handleQuery">
		<template #top>
			<repair-list-search-bar
				v-model="searchName"
				:total="total"
				:is-use-state-options="false"
				@search="handleSearch"
			/>
		</template>

		<!-- 列表内容 -->
	</z-paging>
</template>
```

### 6.3 场景 3：自定义占位符

```vue
<template>
	<repair-list-search-bar v-model="searchName" placeholder="输入工单编号" :maxlength="30" @search="handleSearch" />
</template>
```

## 7. 完整示例

详细的使用示例和各种配置效果，请查看：

- **测试页面**：`src/pages/test-use/repair-list-search-bar.vue`
- **业务页面**：
  - `src/pages-sub/repair/order-list.vue`（维修工单池）
  - `src/pages-sub/repair/dispatch.vue`（维修待办单）
  - `src/pages-sub/repair/finish.vue`（维修已办单）

## 8. 注意事项

1. **状态字典加载**：组件内部会自动调用 `getRepairStates()` 加载状态字典，无需外部管理
2. **immediate 控制**：当 `isUseStateOptions` 为 `true` 时，组件会立即加载状态字典；为 `false` 时不会发起请求
3. **双向绑定**：
   - 使用 `v-model` 绑定搜索关键词
   - 使用 `v-model:selected-state` 绑定选中的状态值
4. **事件监听**：建议同时监听 `search`、`clear`、`state-change` 事件以实现完整的搜索逻辑
5. **z-paging 集成**：通常放在 `<z-paging>` 的 `#top` 插槽中，作为吸顶工具栏使用
6. **total 属性**：需要从列表 API 响应中获取总记录数并传入，组件会自动显示"共 X 条记录"

## 9. TypeScript 类型

如需导入类型定义：

```typescript
import type { RepairListSearchBarProps, StateOption } from "@/components/common/repair-list-search-bar/types";
```

### 9.1 类型说明

```typescript
/** 维修列表搜索栏组件属性 */
export interface RepairListSearchBarProps {
	/** 搜索关键词（v-model） */
	modelValue: string;
	/** 选中的状态值（v-model:selectedState） */
	selectedState: string;
	/** 是否使用状态筛选功能 */
	isUseStateOptions?: boolean;
	/** 搜索框占位符 */
	placeholder?: string;
	/** 最大输入长度 */
	maxlength?: number;
	/** 总记录数（用于显示"共 X 条记录"） */
	total?: number;
}

/** 状态选项接口 */
export interface StateOption {
	/** 显示标签 */
	label: string;
	/** 选项值 */
	value: string;
}
```

## 10. 常见问题

### 10.1 Q: 状态字典加载失败怎么办？

A: 组件会自动使用默认状态选项（从 `REPAIR_STATUSES` 常量生成），保证组件正常使用。

### 10.2 Q: 如何禁用状态筛选功能？

A: 设置 `is-use-state-options="false"` 即可，组件会隐藏状态筛选器并不发起字典请求。

### 10.3 Q: 如何获取搜索关键词和选中状态？

A: 使用 `v-model` 和 `v-model:selected-state` 双向绑定即可自动同步。

### 10.4 Q: 总记录数不显示怎么办？

A: 检查是否传入了 `total` 属性，且值大于 0。
