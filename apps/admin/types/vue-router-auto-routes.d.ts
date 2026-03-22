import type { Router, RouteRecordRaw } from "vue-router";

declare module "vue-router/auto-routes" {
	/** 由文件路由插件生成的自动路由数组 */
	export const routes: RouteRecordRaw[];

	/**
	 * 为自动路由设置 HMR
	 * @description
	 * 当前 TypeScript 配置下需要显式补充运行时导出声明，避免 `tsc` 丢失该虚拟模块的值类型。
	 */
	export function handleHotUpdate(router: Router, hotUpdateCallback?: (newRoutes: RouteRecordRaw[]) => void): void;
}
