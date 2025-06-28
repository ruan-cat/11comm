import { ref, computed, watch, readonly, getCurrentInstance, type Ref } from "vue";
import type {
	TreeNodeWithIcon,
	TreeSelectEvent,
	TreeSearchOptions,
	TreeExpansionOptions,
	HighlightMap,
	TreeExposedMethods,
	ReTreeLineIconInstance,
} from "./types";

/**
 * ReTreeLineIcon 组合式API
 * 用于从组件实例中获取树相关的状态和方法
 * @param treeComponentRef - ReTreeLineIcon 组件实例的ref
 * @param options - 配置选项
 */
export function useReTreeLineIcon(
	treeComponentRef: Ref<ReTreeLineIconInstance | null>,
	options?: {
		watchSelection?: boolean; // 是否监听选择变化
		autoSearch?: boolean; // 是否自动搜索
	},
) {
	const defaultOptions = {
		watchSelection: true,
		autoSearch: true,
		...options,
	};

	// ========== 响应式状态 ==========
	const selectedNode = ref<TreeNodeWithIcon | null>(null);
	const searchKeyword = ref("");
	const isExpanded = ref(true);

	// ========== 计算属性 ==========
	const hasSelection = computed(() => selectedNode.value !== null);
	const selectedNodeId = computed(() => selectedNode.value?.id || null);
	const selectedNodeName = computed(() => selectedNode.value?.name || "");

	// ========== 组件实例方法代理 ==========

	/**
	 * 获取当前选中的节点
	 */
	function getSelectedNode(): TreeNodeWithIcon | null {
		if (treeComponentRef.value) {
			return treeComponentRef.value.getSelectedNode();
		}
		return selectedNode.value;
	}

	/**
	 * 切换展开状态
	 */
	function toggleExpansion(expand?: boolean): void {
		if (treeComponentRef.value) {
			const targetState = expand ?? !isExpanded.value;
			treeComponentRef.value.toggleExpansion(targetState);
			isExpanded.value = targetState;
		}
	}

	/**
	 * 搜索节点
	 */
	function searchNodes(keyword: string): void {
		if (treeComponentRef.value) {
			treeComponentRef.value.searchNodes(keyword);
			searchKeyword.value = keyword;
		}
	}

	/**
	 * 重置树状态
	 */
	function resetTree(): void {
		if (treeComponentRef.value) {
			treeComponentRef.value.resetTree();
			selectedNode.value = null;
			searchKeyword.value = "";
			isExpanded.value = true;
		}
	}

	/**
	 * 获取扁平化的节点列表
	 */
	function getFlatNodes(): TreeNodeWithIcon[] {
		if (treeComponentRef.value) {
			return treeComponentRef.value.getFlatNodes();
		}
		return [];
	}

	/**
	 * 根据名称查找节点
	 */
	function findNodeByName(name: string): TreeNodeWithIcon | null {
		if (treeComponentRef.value) {
			return treeComponentRef.value.findNodeByName(name);
		}
		return null;
	}

	/**
	 * 根据ID查找节点
	 */
	function findNodeById(id: string | number): TreeNodeWithIcon | null {
		const flatNodes = getFlatNodes();
		return flatNodes.find((node) => node.id === id) || null;
	}

	/**
	 * 选择指定节点
	 */
	function selectNode(nodeId: string | number): void {
		const node = findNodeById(nodeId);
		if (node) {
			selectedNode.value = node;
		}
	}

	/**
	 * 取消选择
	 */
	function clearSelection(): void {
		selectedNode.value = null;
	}

	/**
	 * 刷新选中状态（从组件实例同步）
	 */
	function refreshSelection(): void {
		selectedNode.value = getSelectedNode();
	}

	// ========== 高级功能 ==========

	/**
	 * 展开到指定节点
	 */
	function expandToNode(nodeId: string | number): void {
		const node = findNodeById(nodeId);
		if (node && treeComponentRef.value) {
			// 这里可以扩展实现展开路径的逻辑
			selectNode(nodeId);
		}
	}

	/**
	 * 获取选中节点的完整路径
	 */
	function getSelectionPath(): TreeNodeWithIcon[] {
		if (!selectedNode.value) return [];

		const flatNodes = getFlatNodes();
		const path: TreeNodeWithIcon[] = [];
		let currentNode = selectedNode.value;

		// 简化版路径查找，实际可以更复杂
		path.unshift(currentNode);
		return path;
	}

	// ========== 监听器 ==========
	if (defaultOptions.watchSelection) {
		watch(selectedNode, (newNode, oldNode) => {
			if (newNode !== oldNode) {
				// 可以在这里触发自定义事件或回调
				console.log("选中节点变化:", { from: oldNode?.name, to: newNode?.name });
			}
		});
	}

	if (defaultOptions.autoSearch) {
		watch(searchKeyword, (keyword) => {
			if (keyword.trim()) {
				searchNodes(keyword);
			}
		});
	}

	// ========== 生命周期钩子 ==========
	function onMounted(): void {
		// 组件挂载后的初始化逻辑
		refreshSelection();
	}

	function onUnmounted(): void {
		// 组件卸载前的清理逻辑
		clearSelection();
	}

	// ========== 返回API ==========
	return {
		// 响应式状态
		selectedNode: readonly(selectedNode),
		searchKeyword: readonly(searchKeyword),
		isExpanded: readonly(isExpanded),

		// 计算属性
		hasSelection,
		selectedNodeId,
		selectedNodeName,

		// 基础方法
		getSelectedNode,
		selectNode,
		clearSelection,
		refreshSelection,

		// 树操作方法
		toggleExpansion,
		searchNodes,
		resetTree,
		getFlatNodes,
		findNodeByName,
		findNodeById,

		// 高级功能
		expandToNode,
		getSelectionPath,

		// 生命周期
		onMounted,
		onUnmounted,
	};
}
