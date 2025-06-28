// ReTreeLineIcon 组件相关类型定义

/** 树节点基础接口 */
export interface TreeNodeWithIcon {
	/** 节点唯一标识 */
	id: string;
	/** 节点名称 */
	name: string;
	/** 节点类型 */
	type?: string;
	/** 图标字符串（iconify格式） */
	icon?: string;
	/** 子节点 */
	children?: TreeNodeWithIcon[];
	/** 其他扩展属性 */
	[key: string]: any;
}

/** 节点选择事件数据 */
export interface TreeSelectEvent {
	/** 选中的节点数据 */
	node: TreeNodeWithIcon;
	/** 是否选中 */
	selected: boolean;
	/** 树节点ID */
	$treeNodeId: string;
}

/** 树展开控制接口 */
export interface TreeExpansionControls {
	/** 展开全部节点 */
	expandAll: () => void;
	/** 折叠全部节点 */
	collapseAll: () => void;
	/** 切换展开状态 */
	toggleExpansion: (status: boolean) => void;
}

/** 树搜索配置 */
export interface TreeSearchOptions {
	/** 是否显示搜索框 */
	searchable?: boolean;
	/** 搜索占位符 */
	searchPlaceholder?: string;
	/** 搜索关键字 */
	searchValue?: string;
}

/** 展开折叠控制配置 */
export interface TreeExpansionOptions {
	/** 是否显示展开折叠控制器 */
	showExpansionControl?: boolean;
	/** 控制器位置 */
	controlPosition?: "inline" | "dropdown";
}

/** 树节点高亮映射 */
export interface HighlightMap {
	[nodeId: string]: {
		id: string;
		highlight: boolean;
	};
}

/** 树组件对外暴露的方法 */
export interface TreeExposedMethods {
	/** 获取当前选中的节点 */
	getSelectedNode: () => TreeNodeWithIcon | null;
	/** 控制展开状态 */
	toggleExpansion: (status: boolean) => void;
	/** 搜索节点 */
	searchNodes: (keyword: string) => void;
	/** 重置树状态 */
	resetTree: () => void;
	/** 获取所有节点（扁平化） */
	getFlatNodes: () => TreeNodeWithIcon[];
	/** 根据名称查找节点 */
	findNodeByName: (name: string) => TreeNodeWithIcon | null;
}

/** ReTreeLineIcon 组件实例类型 */
export interface ReTreeLineIconInstance extends TreeExposedMethods {
	/** 组件的$el元素 */
	$el?: HTMLElement;
	/** 其他Vue组件实例属性 */
	[key: string]: any;
}

/** 树组件Props */
export interface TreeLineIconProps {
	/** 树数据 */
	treeData: TreeNodeWithIcon[];
	/** 加载状态 */
	loading?: boolean;
	/** 搜索配置 */
	searchOptions?: TreeSearchOptions;
	/** 展开折叠配置 */
	expansionOptions?: TreeExpansionOptions;
	/** 默认展开所有节点 */
	defaultExpandAll?: boolean;
	/** 节点属性配置 */
	nodeKey?: string;
	/** 默认属性映射 */
	defaultProps?: {
		children: string;
		label: string;
	};
}

/** 树组件Emits */
export interface TreeLineIconEmits {
	/** 节点点击事件 */
	"node-click": [event: TreeSelectEvent];
	/** 选择变化事件 */
	"selection-change": [node: TreeNodeWithIcon | null];
}
