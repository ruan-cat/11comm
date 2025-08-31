import { withInstall } from "@pureadmin/utils";
import treeLineIcon from "./src/index.vue";

/** 带图标连接线的树组件 */
export const ReTreeLineIcon = withInstall(treeLineIcon);

export default ReTreeLineIcon;

// 导出类型
export type {
	TreeNodeWithIcon,
	TreeSelectEvent,
	TreeSearchOptions,
	TreeLineIconProps,
	TreeLineIconEmits,
	TreeExposedMethods,
} from "./src/types";

// 导出组合式API
export { useReTreeLineIcon } from "./src/use-re-tree-line-icon";
