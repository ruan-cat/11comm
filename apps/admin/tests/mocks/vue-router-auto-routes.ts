import type { Router, RouteRecordRaw } from "vue-router";

/** Vitest 默认 jsdom 测试不扫描文件路由，避免单测依赖开发期自动路由插件。 */
export const routes: RouteRecordRaw[] = [];

/** 测试环境没有 Vite hot update，保留空实现满足路由模块导入。 */
export function handleHotUpdate(_router: Router, _hotUpdateCallback?: (newRoutes: RouteRecordRaw[]) => void) {}
