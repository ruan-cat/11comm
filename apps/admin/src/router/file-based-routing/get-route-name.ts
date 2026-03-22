import type { Options } from "vue-router/unplugin";

type GetRouteName = NonNullable<Options["getRouteName"]>;

/**
 * 自主生成路由名称
 * @description
 * 保持当前后台项目既有的具名路由命名规则，避免迁移到 Vue Router v5 后出现大面积路由名漂移。
 */
export const getRouteName: GetRouteName = function _getRouteName(node): ReturnType<GetRouteName> {
	if (!node.parent) {
		return "";
	}

	const previousRouteName = _getRouteName(node.parent);
	const connector = previousRouteName === "" ? "" : "-";
	const currentRouteName = node.value.rawSegment === "index" ? "" : `${connector}${node.value.rawSegment}`;

	return previousRouteName + currentRouteName;
};
