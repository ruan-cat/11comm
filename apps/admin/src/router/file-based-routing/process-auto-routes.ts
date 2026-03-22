import { omit } from "lodash-es";
import type { RouteRecordRaw } from "vue-router";

/**
 * 处理单个自动路由
 * @description
 * Vue Router v5 仍然会保留空路径子路由这一层结构。
 * 这里沿用项目原有清洗逻辑，把空路径子路由的配置抬升到父路由，并补齐嵌套路径。
 */
export function processAutoRoute(route: RouteRecordRaw, parentPath = ""): RouteRecordRaw {
	const processedRoute: RouteRecordRaw = { ...route };

	let fullPath = route.path;
	if (parentPath && !fullPath.startsWith("/")) {
		fullPath = `${parentPath}/${fullPath}`.replace(/\/\//g, "/");
	}
	processedRoute.path = fullPath;

	if (!Array.isArray(route.children) || route.children.length === 0) {
		return processedRoute;
	}

	const emptyPathChild = route.children.find((child) => child.path === "");
	if (emptyPathChild) {
		Object.assign(processedRoute, omit(emptyPathChild, ["path"]));
	}

	const processedChildren = route.children
		.filter((child) => child.path !== "")
		.map((child) => processAutoRoute(child, fullPath));

	if (processedChildren.length > 0) {
		processedRoute.children = processedChildren;
	} else {
		delete processedRoute.children;
	}

	return processedRoute;
}

/**
 * 清洗自动路由树
 * @description
 * 保持项目当前基于文件路由生成后的运行时结构稳定，避免迁移时影响后续排序、菜单和重定向逻辑。
 */
export function disposalAutoRouter(routes: RouteRecordRaw[]): RouteRecordRaw[] {
	if (!Array.isArray(routes) || routes.length === 0) {
		return [];
	}

	return routes.map((route) => processAutoRoute(route));
}
