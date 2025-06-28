/**
 * getRouteRank 函数使用示例
 * @description 展示如何在实际项目中使用路由排序函数
 */

import { getRouteRank } from "@/router/rank/getRouteRank";

// ========== 在 Vue 组件中的使用示例 ==========

/**
 * 示例1：在 definePage 中使用
 * 这是最常见的使用场景
 */
export const exampleDefinePage = () => {
	definePage({
		meta: {
			title: "菜单管理",
			icon: "f7:menu",
			// 使用函数获取排序值，支持类型推导和自动补全
			rank: getRouteRank("devTeam.menuManage"),
		},
	});
};

/**
 * 示例2：动态获取排序值
 * 可以在运行时动态计算排序值
 */
export const exampleDynamicRank = () => {
	// 一级路由排序
	const devTeamRank = getRouteRank("devTeam"); // 20000

	// 二级路由排序
	const menuManageRank = getRouteRank("devTeam.menuManage"); // 20100

	// 三级路由排序
	const catalogRank = getRouteRank("devTeam.menuManage.catalog"); // 20110
	const groupRank = getRouteRank("devTeam.menuManage.group"); // 20120
	const itemRank = getRouteRank("devTeam.menuManage.item"); // 20130

	console.log("路由排序值:", {
		devTeamRank,
		menuManageRank,
		catalogRank,
		groupRank,
		itemRank,
	});
};

/**
 * 示例3：在路由配置中使用
 * 可以用于动态生成路由配置
 */
export const exampleRouteConfig = () => {
	const routes = [
		{
			path: "/dev-team",
			name: "devTeam",
			meta: {
				rank: getRouteRank("devTeam"),
			},
			children: [
				{
					path: "menu-manage",
					name: "menuManage",
					meta: {
						rank: getRouteRank("devTeam.menuManage"),
					},
					children: [
						{
							path: "catalog",
							name: "catalog",
							meta: {
								rank: getRouteRank("devTeam.menuManage.catalog"),
							},
						},
						{
							path: "group",
							name: "group",
							meta: {
								rank: getRouteRank("devTeam.menuManage.group"),
							},
						},
					],
				},
			],
		},
	];

	return routes;
};

/**
 * 示例4：类型安全使用
 * TypeScript 会提供自动补全和类型检查
 */
export const exampleTypeSafety = () => {
	// ✅ 正确：这些路径都存在于配置中
	const validPaths = [
		getRouteRank("devTeam"),
		getRouteRank("devTeam.menuManage"),
		getRouteRank("devTeam.menuManage.catalog"),
		getRouteRank("settingManage.organizeManage.orgInfo"),
		getRouteRank("operationTeam.dataManage.communityInformation"),
	];

	// ❌ 错误：TypeScript 会在编译时报错
	// const invalidPath = getRouteRank("nonExistent.path");

	return validPaths;
};

/**
 * 示例5：排序比较工具函数
 * 基于排序值对菜单项进行排序
 */
export const sortMenuItems = (menuItems: Array<{ key: string; [key: string]: any }>) => {
	return menuItems.sort((a, b) => {
		const rankA = getRouteRank(a.key as Parameters<typeof getRouteRank>[0]);
		const rankB = getRouteRank(b.key as Parameters<typeof getRouteRank>[0]);
		return rankA - rankB;
	});
};

/**
 * 示例6：获取路由层级排序信息
 * 可以分析路由的层级结构
 */
export const analyzeRouteRank = (routeKey: Parameters<typeof getRouteRank>[0]) => {
	const totalRank = getRouteRank(routeKey);
	const segments = routeKey.split(".");

	const analysis = {
		totalRank,
		depth: segments.length,
		segments,
		isLeaf: segments.length === 3, // 假设最多3层
	};

	return analysis;
};

// ========== 实际使用场景 ==========

/**
 * 场景：在页面组件中定义排序
 */
export const PageComponentExample = () => `
<script lang="ts" setup>
import { getRouteRank } from "@/router/rank";

definePage({
	meta: {
		title: "菜单管理",
		icon: "f7:menu",
		rank: getRouteRank("devTeam.menuManage"), // TypeScript 支持自动补全
	},
});
</script>
`;

/**
 * 预期的排序结果示例
 */
export const expectedResults = {
	// 一级路由
	settingManage: 10000,
	devTeam: 20000,
	operationTeam: 30000,
	propertyManage: 40000,

	// 二级路由
	"devTeam.menuManage": 20100,
	"devTeam.cacheManage": 20200,
	"settingManage.organizeManage": 10100,
	"settingManage.systemManage": 10200,

	// 三级路由
	"devTeam.menuManage.catalog": 20110,
	"devTeam.menuManage.group": 20120,
	"devTeam.menuManage.item": 20130,
	"devTeam.cacheManage.refreshCache": 20210,
};
