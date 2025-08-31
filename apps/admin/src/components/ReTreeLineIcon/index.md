# ReTreeLineIcon 带图标连接线的树组件

基于 Element Plus Tree 和 ReTreeLine 封装的带图标树组件，支持连接线显示、节点图标、搜索功能等。

## 特性

- ✅ 支持连接线显示 (基于 ReTreeLine)
- ✅ 支持节点图标 (基于 iconify 字符串)
- ✅ 支持搜索功能
- ✅ 支持节点选择和高亮
- ✅ 完整的 TypeScript 支持
- ✅ 丰富的组合式 API

## 基础用法

```vue
<template>
	<ReTreeLineIcon :tree-data="treeData" @node-click="handleNodeClick" @selection-change="handleSelectionChange" />
</template>

<script setup>
import { ReTreeLineIcon } from "@/components/ReTreeLineIcon";

const treeData = [
	{
		id: "1",
		name: "根节点",
		icon: "ep:folder",
		children: [
			{
				id: "1-1",
				name: "子节点",
				icon: "ep:document",
			},
		],
	},
];

function handleNodeClick(event) {
	console.log("节点点击:", event);
}

function handleSelectionChange(node) {
	console.log("选择变化:", node);
}
</script>
```

## Props

| 属性             | 类型                 | 默认值 | 说明             |
| ---------------- | -------------------- | ------ | ---------------- |
| treeData         | TreeNodeWithIcon[]   | []     | 树数据           |
| loading          | boolean              | false  | 加载状态         |
| searchOptions    | TreeSearchOptions    | -      | 搜索配置         |
| expansionOptions | TreeExpansionOptions | -      | 展开折叠配置     |
| defaultExpandAll | boolean              | true   | 默认展开所有节点 |
| nodeKey          | string               | "id"   | 节点唯一标识字段 |

## Events

| 事件名           | 参数                     | 说明         |
| ---------------- | ------------------------ | ------------ |
| node-click       | TreeSelectEvent          | 节点点击事件 |
| selection-change | TreeNodeWithIcon \| null | 选择变化事件 |

## 暴露方法

| 方法名          | 参数    | 返回值                   | 说明             |
| --------------- | ------- | ------------------------ | ---------------- |
| getSelectedNode | -       | TreeNodeWithIcon \| null | 获取当前选中节点 |
| toggleExpansion | boolean | void                     | 控制展开状态     |
| searchNodes     | string  | void                     | 搜索节点         |
| resetTree       | -       | void                     | 重置树状态       |
| getFlatNodes    | -       | TreeNodeWithIcon[]       | 获取扁平化节点   |
| findNodeByName  | string  | TreeNodeWithIcon \| null | 根据名称查找节点 |

## useReTreeLineIcon 组合式 API

`useReTreeLineIcon` 是专为 ReTreeLineIcon 组件设计的组合式 API，允许你在组件外部访问和控制树组件的状态。

### 基本用法

```vue
<template>
	<div>
		<!-- 树组件 -->
		<ReTreeLineIcon
			ref="treeRef"
			:tree-data="treeData"
			@node-click="handleNodeClick"
			@selection-change="handleSelectionChange"
		/>

		<!-- 外部控制按钮 -->
		<div class="controls">
			<el-button @click="expandAll">展开全部</el-button>
			<el-button @click="collapseAll">折叠全部</el-button>
			<el-button @click="clearSelection">清除选择</el-button>
			<el-button @click="showSelectedInfo">显示选中信息</el-button>
		</div>

		<!-- 选中节点信息显示 -->
		<div v-if="hasSelection" class="selection-info">
			<p>选中节点: {{ selectedNodeName }}</p>
			<p>节点ID: {{ selectedNodeId }}</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ReTreeLineIcon } from '@/components/ReTreeLineIcon'
import { useReTreeLineIcon } from '@/components/ReTreeLineIcon/src/use-re-tree-line-icon'
import type { ReTreeLineIconInstance } from '@/components/ReTreeLineIcon/src/types'

// 1. 创建组件实例引用
const treeRef = ref<ReTreeLineIconInstance | null>(null)

// 2. 使用组合式 API
const {
  // 响应式状态（只读）
  selectedNode,      // 当前选中的节点
  searchKeyword,     // 搜索关键字
  isExpanded,        // 展开状态

  // 计算属性
  hasSelection,      // 是否有选中节点
  selectedNodeId,    // 选中节点的ID
  selectedNodeName,  // 选中节点的名称

  // 基础方法
  getSelectedNode,   // 获取选中节点
  selectNode,        // 选择指定节点
  clearSelection,    // 清除选择
  refreshSelection,  // 刷新选择状态

  // 树操作方法
  toggleExpansion,   // 切换展开状态
  searchNodes,       // 搜索节点
  resetTree,         // 重置树
  getFlatNodes,      // 获取扁平化节点
  findNodeByName,    // 根据名称查找
  findNodeById,      // 根据ID查找

  // 高级功能
  expandToNode,      // 展开到指定节点
  getSelectionPath,  // 获取选择路径

  // 生命周期
  onMounted: onTreeMounted,
  onUnmounted: onTreeUnmounted,
} = useReTreeLineIcon(treeRef, {
  watchSelection: true,  // 监听选择变化
  autoSearch: false,     // 禁用自动搜索
})

// 树数据
const treeData = ref([
  {
    id: '1',
    name: '总公司',
    icon: 'ep:office-building',
    children: [
      { id: '1-1', name: '技术部', icon: 'ep:cpu' },
      { id: '1-2', name: '人事部', icon: 'ep:user' }
    ]
  }
])

// 3. 生命周期初始化
onMounted(() => {
  nextTick(() => {
    onTreeMounted()
  })
})

// 4. 外部控制方法
function expandAll() {
  toggleExpansion(true)
}

function collapseAll() {
  toggleExpansion(false)
}

function showSelectedInfo() {
  const node = getSelectedNode()
  if (node) {
    console.log('选中节点详情:', node)
  } else {
    console.log('未选中任何节点')
  }
}

function handleNodeClick(event) {
  console.log('节点点击:', event)
}

function handleSelectionChange(node) {
  console.log('选择变化:', node)
}
</script>
```

### API 参数

#### 函数签名

```typescript
useReTreeLineIcon(
  treeComponentRef: Ref<ReTreeLineIconInstance | null>,
  options?: {
    watchSelection?: boolean; // 是否监听选择变化，默认 true
    autoSearch?: boolean;     // 是否自动搜索，默认 true
  }
)
```

#### 参数说明

| 参数             | 类型                                  | 必填 | 默认值 | 说明                    |
| ---------------- | ------------------------------------- | ---- | ------ | ----------------------- |
| treeComponentRef | `Ref<ReTreeLineIconInstance \| null>` | ✅   | -      | ReTreeLineIcon 组件实例 |
| options          | Object                                | ❌   | -      | 配置选项                |
| watchSelection   | boolean                               | ❌   | true   | 是否监听选择变化        |
| autoSearch       | boolean                               | ❌   | true   | 是否启用自动搜索        |

### 返回值说明

#### 响应式状态

| 属性          | 类型                                      | 说明                   |
| ------------- | ----------------------------------------- | ---------------------- |
| selectedNode  | `Readonly<Ref<TreeNodeWithIcon \| null>>` | 当前选中的节点（只读） |
| searchKeyword | `Readonly<Ref<string>>`                   | 搜索关键字（只读）     |
| isExpanded    | `Readonly<Ref<boolean>>`                  | 展开状态（只读）       |

#### 计算属性

| 属性             | 类型                          | 说明           |
| ---------------- | ----------------------------- | -------------- |
| hasSelection     | `ComputedRef<boolean>`        | 是否有选中节点 |
| selectedNodeId   | `ComputedRef<string \| null>` | 选中节点的 ID  |
| selectedNodeName | `ComputedRef<string>`         | 选中节点的名称 |

#### 基础方法

| 方法名           | 参数                     | 返回值                   | 说明                   |
| ---------------- | ------------------------ | ------------------------ | ---------------------- |
| getSelectedNode  | -                        | TreeNodeWithIcon \| null | 获取当前选中节点       |
| selectNode       | nodeId: string \| number | void                     | 选择指定 ID 的节点     |
| clearSelection   | -                        | void                     | 清除当前选择           |
| refreshSelection | -                        | void                     | 从组件实例刷新选择状态 |

#### 树操作方法

| 方法名          | 参数                 | 返回值                   | 说明               |
| --------------- | -------------------- | ------------------------ | ------------------ |
| toggleExpansion | expand?: boolean     | void                     | 切换或设置展开状态 |
| searchNodes     | keyword: string      | void                     | 搜索节点           |
| resetTree       | -                    | void                     | 重置树状态         |
| getFlatNodes    | -                    | TreeNodeWithIcon[]       | 获取扁平化节点列表 |
| findNodeByName  | name: string         | TreeNodeWithIcon \| null | 根据名称查找节点   |
| findNodeById    | id: string \| number | TreeNodeWithIcon \| null | 根据 ID 查找节点   |

#### 高级功能

| 方法名           | 参数                     | 返回值             | 说明               |
| ---------------- | ------------------------ | ------------------ | ------------------ |
| expandToNode     | nodeId: string \| number | void               | 展开到指定节点     |
| getSelectionPath | -                        | TreeNodeWithIcon[] | 获取选中节点的路径 |

#### 生命周期

| 方法名      | 参数 | 返回值 | 说明           |
| ----------- | ---- | ------ | -------------- |
| onMounted   | -    | void   | 组件挂载时调用 |
| onUnmounted | -    | void   | 组件卸载时调用 |

### 使用场景

#### 1. 外部状态监听

```typescript
// 监听选中状态变化
watch(selectedNode, (newNode) => {
	if (newNode) {
		console.log(`选中了: ${newNode.name}`);
		// 根据选中节点加载相关数据
		loadRelatedData(newNode.id);
	}
});

// 监听搜索状态
watch(searchKeyword, (keyword) => {
	console.log(`搜索关键字: ${keyword}`);
});
```

#### 2. 程序化控制

```typescript
// 程序化选择节点
function selectSpecificNode() {
	selectNode("specific-node-id");
}

// 程序化搜索
function searchSpecificTerm() {
	searchNodes("搜索关键字");
}

// 获取所有节点并处理
function processAllNodes() {
	const flatNodes = getFlatNodes();
	flatNodes.forEach((node) => {
		console.log(node.name);
	});
}
```

#### 3. 表单集成

```typescript
// 在表单中使用选中的节点
const formData = computed(() => ({
	selectedOrgId: selectedNodeId.value,
	selectedOrgName: selectedNodeName.value,
	// 其他表单字段...
}));
```

### 注意事项

1. **组件实例必须存在**: 确保在调用 API 方法前，组件已经完成挂载
2. **生命周期管理**: 建议在 `onMounted` 中调用 `onTreeMounted()`
3. **状态同步**: 使用 `refreshSelection()` 确保状态与组件实例同步
4. **类型安全**: 使用 TypeScript 时，确保正确导入类型定义
