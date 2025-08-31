import type { RoutesRankConfig } from "router/rank";

export const routesRank: RoutesRankConfig = {
	/** 组织管理 */
	organizeManage: {
		rank: 100,
		children: {
			/** 组织信息 */
			orgInfo: 10,

			/** 员工信息 */
			staffInfo: 20,

			/** 角色权限 */
			rolePermission: 30,

			/** 数据权限 */
			dataPermission: 40,

			/** 班次设置 */
			shiftSetting: 50,

			/** 排班设置 */
			schedulingSetting: 60,

			/** 排班表 */
			workingSchedule: 70,
		},
	},

	/** 系统管理 */
	systemManage: {
		rank: 200,
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
};
