import type { RoutesRankConfig } from "router/rank";

export const routesRank: RoutesRankConfig = {
	/** 系统管理 */
	systemManage: {
		rank: 100,
		children: {
			/** 修改密码 */
			changePassword: 10,
			/** 系统配置 */
			systemConfig: 20,
			/** 注册协议 */
			registerProtocol: 30,
			/** 初始化小区 */
			initializeCell: 40,
			/** 小区配置 */
			communityConfiguration: 50,
		},
	},

	/** 数据管理 */
	dataManage: {
		rank: 200,
		children: {
			/** 小区信息 */
			communityInformation: 10,
			/** 物业公司 */
			propertyManagementCompany: 20,
		},
	},

	/** 商户管理 */
	merchantManage: {
		rank: 300,
		children: {
			/** 商户信息 */
			merchantInfo: 10,
			/** 商户管理员 */
			merchantAdmin: 20,
		},
	},

	/** 报表配置 */
	reportConfiguration: {
		rank: 400,
		children: {
			/** 报表组 */
			reportGroup: 10,
			/** 报表信息 */
			reportInfo: 20,
			/** 报表组件 */
			reportComponent: 30,
		},
	},
};
