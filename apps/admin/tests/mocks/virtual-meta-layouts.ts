import type { RouteRecordRaw } from "vue-router";

/** Vitest 默认 jsdom 测试不加载 Vite 页面布局插件，这里只保持路由数组原样返回。 */
export function setupLayouts(routes: RouteRecordRaw[]) {
	return routes;
}
