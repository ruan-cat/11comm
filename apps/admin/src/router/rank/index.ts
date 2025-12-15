import type { RouteRecordRaw } from "vue-router";
import { isRoutePathDetailPage } from "@/router/utils";

/**
 * 路由排序配置
 * @description
 * 为需要排序的路由 组织好排序变量
 *
 * 这个路由排序 在基于文件目录结构的路由内生效
 *
 * 也为了生成出带有排序的菜单 为生成sql语句做准备
 *
 * ### *`导入配置对象`*
 * 该配置对象，并不是直接给页面导入使用的，还需要其他函数的整理才能生成出具体的排序值
 *
 * ### *`存储位置`*
 * 该配置之所以分散存储在各个页面目录下 是为了便于各个功能模块的专项排序
 */
export type RoutesRankConfig = Record<
	string,
	| {
			children: RoutesRankConfig;
			rank: number;
	  }
	| number
>;

/**
 * 判断路由是否需要手动分配rank值
 * @param routeInfo 路由信息
 * @returns 是否需要手动分配rank
 */
function shouldAssignDefaultRank(routeInfo: any) {
	const { name, path, meta } = routeInfo;
	const isNameValid = name && typeof name === "string" && name.trim() !== "";
	const isPathValid = path && typeof path === "string" && path !== "/";
	const hasRank = meta?.rank && typeof meta.rank === "number";

	// 如果路由有有效的name和path，但没有rank，则需要手动分配
	return isNameValid && isPathValid && !hasRank;
}

/**
 * 对树形路由 根据 `meta.rank` 配置，实现排序
 * @description
 * 几乎全部的页面，都会配置rank菜单排序 本函数实现菜单路由数据的排序
 * 这是一个递归函数，会对多层嵌套的路由树进行深度排序
 *
 * 注意：此函数会直接修改传入的数组，不会创建新的数组副本
 *
 * 本函数是后续添加的 不是原框架的函数
 *
 * @description
 * 这是一个偏后端业务逻辑的函数 在本框架中 是不做前端层面的排序的
 *
 * 这里在获取到自动路由的数据后 就自主地做排序 类似于后端的处理逻辑
 */
export function sortRoutes(autoRoutesParams: RouteRecordRaw[]): RouteRecordRaw[] {
	if (!autoRoutesParams || !Array.isArray(autoRoutesParams)) {
		console.warn("sortRoutes: autoRoutes must be an array");
		return [];
	}

	// 递归排序函数 - 直接修改原数组
	function sortRoutesRecursively(routeArray: RouteRecordRaw[]): void {
		// 1. 为没有rank的路由分配默认rank值
		routeArray.forEach((route, index) => {
			if (shouldAssignDefaultRank(route)) {
				// 确保meta对象存在
				if (!route.meta) {
					route.meta = {
						title: (route.name as string) || "未命名路由",
					};
				}
				// 分配默认rank值，从20000开始递增（避免与已配置的rank冲突）
				route.meta.rank = 20000 + index;
			}
		});

		// 2. 根据meta.rank进行排序 - 直接修改原数组
		routeArray.sort((a, b) => {
			const rankA = a?.meta?.rank ?? Number.MAX_SAFE_INTEGER;
			const rankB = b?.meta?.rank ?? Number.MAX_SAFE_INTEGER;
			return rankA - rankB;
		});

		// 3. 递归处理每个路由的children
		routeArray.forEach((route) => {
			if (route.children && Array.isArray(route.children) && route.children.length > 0) {
				sortRoutesRecursively(route.children);
			}
		});
	}

	// 执行递归排序 - 直接修改传入的数组
	sortRoutesRecursively(autoRoutesParams);

	// 开发环境下输出排序结果
	if (import.meta.env.DEV) {
		// console.log("🚀 路由排序完成:", autoRoutesParams);
	}

	return autoRoutesParams;
}

/**
 * 根据路由的 `meta.rank` 配置 实现重定向配置
 * @description
 * 递归遍历路由数组，为每个父路由设置重定向到第一个非详情页的子路由
 *
 * 核心逻辑：
 * 1. 递归遍历传递进来的路由数组
 * 2. 使用 isRoutePathDetailPage 判断当前路由是否是详情页，如果是则跳过处理
 * 3. 获取当前路由的子路由，如果没有子路由则结束递归
 * 4. 找到第一个非详情页的子路由，设置为当前路由的 redirect
 * 5. 递归处理子路由
 *
 * @param autoRoutesParams 已排序的路由数组
 */
export function setRedirectByRank(autoRoutesParams: RouteRecordRaw[]) {
	/**
	 * 递归处理路由重定向设置
	 * @param routes 当前层级的路由数组
	 */
	function processRoutes(routes: RouteRecordRaw[]): void {
		for (const route of routes) {
			// 1. 判断当前路由是否是详情页
			if (route.path && isRoutePathDetailPage(route.path)) {
				// 如果是详情页，跳过处理
				continue;
			}

			// 2. 获取当前路由的子路由
			if (!route.children || !Array.isArray(route.children) || route.children.length === 0) {
				// 如果没有子路由，结束本次递归
				continue;
			}

			// 3. 找到第一个非详情页的子路由
			let targetChildRoute: RouteRecordRaw | null = null;

			for (const childRoute of route.children) {
				// 子路由必须有有效路径，且不能是详情页
				if (childRoute.path && childRoute.path.trim() !== "" && !isRoutePathDetailPage(childRoute.path)) {
					// 找到第一个非详情页的子路由
					targetChildRoute = childRoute;
					break;
				}
			}

			// 4. 如果找到了合适的子路由，设置重定向
			if (targetChildRoute && targetChildRoute.path) {
				route.redirect = targetChildRoute.path;
			}

			// 5. 递归处理子路由
			processRoutes(route.children);
		}
	}

	// 开始递归处理
	processRoutes(autoRoutesParams);
}
