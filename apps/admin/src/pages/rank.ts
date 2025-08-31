import { routesRank as devTeamRoutesRank } from "./dev-team/rank";
import { routesRank as operationTeamRoutesRank } from "./operation-team/rank";
import { routesRank as settingManageRoutesRank } from "./setting-manage/rank";
import { routesRank as propertyManageRoutesRank } from "./property-manage/rank";

export const routesRank = {
	/** 设置 */
	settingManage: { children: settingManageRoutesRank, rank: 10000 },

	/** 开发团队 */
	devTeam: { children: devTeamRoutesRank, rank: 20000 },

	/** 运营团队 */
	operationTeam: { children: operationTeamRoutesRank, rank: 30000 },

	/** 物业菜单 */
	propertyManage: { children: propertyManageRoutesRank, rank: 40000 },
};
