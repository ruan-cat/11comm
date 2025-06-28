import type { RoutesRankConfig } from "router/rank";

export const routesRank: RoutesRankConfig = {
	/** 菜单管理 */
	menuManage: {
		rank: 100,
		children: {
			/** 菜单目录 */
			catalog: 10,

			/** 菜单组 */
			group: 20,

			/** 菜单项 */
			item: 30,
		},
	},

	/** 缓存管理 */
	cacheManage: {
		rank: 200,
		children: {
			/** 刷新缓存 */
			refreshCache: 10,
		},
	},

	/** 配置管理 */
	configManage: {
		rank: 300,
		children: {
			/** 配置项 */
			item: 10,

			/** 配置中心 */
			center: 20,

			/** 字典类型 */
			type: 30,

			/** 字典 */
			dictionary: 40,
		},
	},
};
