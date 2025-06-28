import { routesRank } from "@/pages/rank";

import { type RankRouteKeys } from "./rank-route-keys";

/**
 * 根据key值来获取路由排序
 * @description
 * 这个函数预期在需要配置排序的vue页面组件使用
 *
 * 在 definePage 的 mate 中给 rank 字段使用
 *
 * 技术可行性基于以下链接：
 * @see https://github.com/posva/unplugin-vue-router/issues/487
 *
 * @param key 路由路径，如 "devTeam.menuManage.item"
 * @returns 累加后的排序值
 *
 * @example
 * ```ts
 * // 获取一级路由排序
 * getRouteRank("devTeam") // 返回 20000
 *
 * // 获取二级路由排序
 * getRouteRank("devTeam.menuManage") // 返回 20000 + 100 = 20100
 *
 * // 获取三级路由排序
 * getRouteRank("devTeam.menuManage.item") // 返回 20000 + 100 + 30 = 20130
 *
 * // 在 Vue 组件中使用
 * definePage({
 *   meta: {
 *     title: "菜单管理",
 *     icon: "f7:menu",
 *     rank: getRouteRank("devTeam.menuManage"),
 *   },
 * });
 * ```
 *
 * @description
 * 该函数并不需要在 index.ts 中导出，避免出现循环导入
 * 该函数借助全局导入工具 实现全局导入
 */
export function getRouteRank(key: RankRouteKeys): number {
	const pathSegments = key.split(".");
	let currentConfig = routesRank;
	let totalRank = 0;

	for (const segment of pathSegments) {
		// 检查当前层级是否存在该路径
		if (!currentConfig || typeof currentConfig !== "object" || !(segment in currentConfig)) {
			console.warn(`路由路径 "${key}" 不存在，段 "${segment}" 未找到`);
			return totalRank;
		}

		const currentItem = currentConfig[segment];

		// 如果是数字，直接累加
		if (typeof currentItem === "number") {
			totalRank += currentItem;
			break;
		}

		// 如果是对象，累加 rank 并进入 children
		if (typeof currentItem === "object" && currentItem !== null && "rank" in currentItem) {
			totalRank += currentItem.rank;
			currentConfig = currentItem.children || {};
		} else {
			console.warn(`路由配置格式错误：${key} 在段 "${segment}"`);
			break;
		}
	}

	return totalRank;
}
