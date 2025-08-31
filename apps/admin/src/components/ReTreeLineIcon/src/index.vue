<script lang="ts" setup>
import { ref, computed, watchEffect, watch, getCurrentInstance } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import ElTreeLine from "@/components/ReTreeLine";
import { IconifyIconOnline } from "@/components/ReIcon";
import type {
	TreeNodeWithIcon,
	TreeSelectEvent,
	TreeLineIconProps,
	TreeLineIconEmits,
	TreeSearchOptions,
	TreeExpansionOptions,
	HighlightMap,
} from "./types";

import More2Fill from "~icons/ri/more-2-fill?width=18&height=18";
import ExpandIcon from "@/views/system/user/svg/expand.svg?component";
import UnExpandIcon from "@/views/system/user/svg/unexpand.svg?component";

// 组件Props
const props = withDefaults(defineProps<TreeLineIconProps>(), {
	loading: false,
	defaultExpandAll: true,
	nodeKey: "id",
	defaultProps: () => ({
		children: "children",
		label: "name",
	}),
	searchOptions: () => ({
		searchable: true,
		searchPlaceholder: "请输入名称搜索",
		searchValue: "",
	}),
	expansionOptions: () => ({
		showExpansionControl: true,
		controlPosition: "dropdown",
	}),
});

// 组件Emits
const emit = defineEmits<TreeLineIconEmits>();

// ========== 内部状态管理 ==========
const { proxy } = getCurrentInstance();
const treeRef = ref();
const treeData = ref<TreeNodeWithIcon[]>(props.treeData);
const searchValue = ref(props.searchOptions?.searchValue || "");
const isExpand = ref(props.defaultExpandAll);
const highlightMap = ref<HighlightMap>({});
const selectedNode = ref<TreeNodeWithIcon | null>(null);

// 默认属性配置
const defaultProps = {
	children: "children",
	label: "name",
};

// ========== 核心方法 ==========

/**
 * 树节点过滤函数
 */
const filterNode = (value: string, data: TreeNodeWithIcon) => {
	if (!value) return true;
	return data.name.includes(value);
};

/**
 * 节点点击事件处理
 */
function handleNodeClick(value: TreeNodeWithIcon & { $treeNodeId: string }) {
	const nodeId = value.$treeNodeId;

	// 更新高亮状态
	highlightMap.value[nodeId] = highlightMap.value[nodeId]?.highlight
		? Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
				highlight: false,
			})
		: Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
				highlight: true,
			});

	// 清除其他节点的高亮状态
	Object.values(highlightMap.value).forEach((v: any) => {
		if (v.id !== nodeId) {
			v.highlight = false;
		}
	});

	// 设置选中的节点
	selectedNode.value = highlightMap.value[nodeId]?.highlight ? value : null;

	const event: TreeSelectEvent = {
		node: value,
		selected: highlightMap.value[nodeId]?.highlight || false,
		$treeNodeId: nodeId,
	};

	// 触发事件
	emit("node-click", event);
	emit("selection-change", event.selected ? event.node : null);

	return event;
}

/**
 * 展开/折叠所有节点
 */
function toggleRowExpansionAll(status: boolean) {
	isExpand.value = status;
	const nodes = treeRef.value?.store._getAllNodes() || [];
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].expanded = status;
	}
}

/**
 * 重置树状态
 */
function resetTree() {
	highlightMap.value = {};
	searchValue.value = "";
	selectedNode.value = null;
	toggleRowExpansionAll(true);
}

/**
 * 搜索节点
 */
function searchNodes(keyword: string) {
	searchValue.value = keyword;
	treeRef.value?.filter(keyword);
}

/**
 * 获取当前选中的节点
 */
function getSelectedNode(): TreeNodeWithIcon | null {
	return selectedNode.value;
}

/**
 * 扁平化树数据
 */
function getFlatNodes(): TreeNodeWithIcon[] {
	const flatNodes: TreeNodeWithIcon[] = [];

	function traverse(nodes: TreeNodeWithIcon[]) {
		nodes.forEach((node) => {
			flatNodes.push(node);
			if (node.children && node.children.length > 0) {
				traverse(node.children);
			}
		});
	}

	traverse(treeData.value);
	return flatNodes;
}

/**
 * 根据名称查找节点
 */
function findNodeByName(name: string): TreeNodeWithIcon | null {
	const flatNodes = getFlatNodes();
	return flatNodes.find((node) => node.name === name) || null;
}

// ========== 监听器 ==========
// 监听props变化更新内部数据
watchEffect(() => {
	treeData.value = props.treeData;
});

// 监听搜索值变化
watch(searchValue, (val) => {
	treeRef.value?.filter(val);
});

// ========== 计算属性 ==========
// 搜索配置
const searchConfig = computed(() => ({
	searchable: true,
	searchPlaceholder: "请输入名称搜索",
	...props.searchOptions,
}));

// 展开折叠配置
const expansionConfig = computed(() => ({
	showExpansionControl: true,
	controlPosition: "dropdown" as const,
	...props.expansionOptions,
}));

// 按钮样式配置
const buttonClass = computed(() => [
	"h-[20px]!",
	"text-sm!",
	"reset-margin",
	"text-(--el-text-color-regular)!",
	"dark:text-white!",
	"dark:hover:text-primary!",
]);

// 对外暴露方法
defineExpose({
	getSelectedNode,
	toggleExpansion: toggleRowExpansionAll,
	searchNodes,
	resetTree,
	getFlatNodes,
	findNodeByName,
});
</script>

<template>
	<div v-loading="props.loading" class="re-tree-line-icon">
		<!-- 搜索框和控制按钮 -->
		<div v-if="searchConfig.searchable || expansionConfig.showExpansionControl" class="search-container">
			<div class="flex items-center">
				<!-- 搜索框 -->
				<el-input
					v-if="searchConfig.searchable"
					v-model="searchValue"
					:placeholder="searchConfig.searchPlaceholder"
					clearable
					class="flex-1"
				>
					<template #suffix>
						<el-icon class="el-input__icon">
							<IconifyIconOnline v-show="searchValue.length === 0" icon="ri:search-line" />
						</el-icon>
					</template>
				</el-input>

				<!-- 展开折叠控制器 -->
				<div v-if="expansionConfig.showExpansionControl" class="expansion-controls ml-2">
					<!-- 下拉菜单方式 -->
					<el-dropdown v-if="expansionConfig.controlPosition === 'dropdown'" :hide-on-click="false">
						<More2Fill class="w-[28px] cursor-pointer" />
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item>
									<el-button
										:class="buttonClass"
										link
										type="primary"
										:icon="useRenderIcon(isExpand ? ExpandIcon : UnExpandIcon)"
										@click="toggleRowExpansionAll(!isExpand)"
									>
										{{ isExpand ? "折叠全部" : "展开全部" }}
									</el-button>
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>

					<!-- 内联按钮方式 -->
					<el-button
						v-else
						:class="buttonClass"
						link
						type="primary"
						:icon="useRenderIcon(isExpand ? ExpandIcon : UnExpandIcon)"
						@click="toggleRowExpansionAll(!isExpand)"
					>
						{{ isExpand ? "折叠全部" : "展开全部" }}
					</el-button>
				</div>
			</div>
		</div>

		<el-divider v-if="searchConfig.searchable || expansionConfig.showExpansionControl" class="!my-2" />

		<!-- 树组件 -->
		<el-scrollbar class="tree-scroll-container">
			<el-tree
				ref="treeRef"
				:data="treeData"
				:node-key="props.nodeKey"
				:props="defaultProps"
				:default-expand-all="props.defaultExpandAll"
				:expand-on-click-node="false"
				:filter-node-method="filterNode"
				@node-click="handleNodeClick"
			>
				<template #default="{ node, data }">
					<div
						:class="[
							'tree-node-content',
							'rounded-sm',
							'flex',
							'items-center',
							'select-none',
							'hover:text-primary',
							'w-full',
							'py-1',
							searchValue.trim().length > 0 && node.label.includes(searchValue) && 'text-red-500',
							highlightMap[node.id]?.highlight ? 'dark:text-primary' : '',
						]"
						:style="{
							color: highlightMap[node.id]?.highlight ? 'var(--el-color-primary)' : '',
							background: highlightMap[node.id]?.highlight ? 'var(--el-color-primary-light-7)' : 'transparent',
						}"
					>
						<el-tree-line :node="node" :showLabelLine="true">
							<template #node-label>
								<div class="flex items-center">
									<!-- 动态渲染图标 -->
									<component :is="useRenderIcon(data.icon || 'ep:folder')" class="mr-2" />
									<span class="text-sm truncate" :title="node.label">
										{{ node.label }}
									</span>
								</div>
							</template>
						</el-tree-line>
					</div>
				</template>
			</el-tree>
		</el-scrollbar>
	</div>
</template>

<style lang="scss" scoped>
.re-tree-line-icon {
	height: 100%;
	display: flex;
	flex-direction: column;

	.search-container {
		flex-shrink: 0;
	}

	.tree-scroll-container {
		flex: 1;
		overflow: hidden;
	}

	:deep(.el-divider) {
		margin: 8px 0;
	}

	:deep(.el-tree) {
		--el-tree-node-hover-bg-color: transparent;
	}

	.tree-node-content {
		transition: all 0.2s ease;

		&:hover {
			background-color: var(--el-color-primary-light-9);
		}
	}
}
</style>
