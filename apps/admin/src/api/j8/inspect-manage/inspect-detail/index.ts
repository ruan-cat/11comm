import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检明细数据模型
 */
export interface InspectDetailData {
	/** 实际巡检时间 */
	actPatrolTime?: string;
	/** 实际巡检人名称 */
	actUserName?: string;
	/** 创建时间 */
	createTime?: string;
	/** 巡检方式 */
	inspectionMethod?: string;
	/** 巡检点名称 */
	inspectionName?: string;
	/** 巡检人结束时间 */
	inspectionPersonEndTime?: string;
	/** 巡检人开始时间 */
	inspectionPersonStartTime?: string;
	/** 巡检照片 */
	inspectionPhoto?: string;
	/** 巡检计划名称 */
	inspectionPlanName?: string;
	/** 计划巡检人名称 */
	inspectionPlanPersonName?: string;
	/** 巡检路线名称 */
	inspectionRouteName?: string;
	/** 实际巡检签到状态 */
	inspectionState?: string;
	/** 巡检任务状态 */
	inspectionTaskStatus?: string;
	/** 位置信息 */
	locationInformation?: string;
	/** 巡检情况 */
	patrolType?: string;
	/** 巡检点结束时间 */
	pointEndTime?: string;
	/** 巡检点开始时间 */
	pointStartTime?: string;
	/** 巡检点状态 */
	state?: string;
	/** 任务明细ID */
	taskDetailId?: string;
}

/**
 * 获取巡检明细列表参数
 */
export interface QueryInspectDetailListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 计划巡检人名称 */
	planUserName?: string;
	/** 巡检点结束时间 */
	pointEndTime?: string;
	/** 巡检点开始时间 */
	pointStartTime?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取巡检明细列表（条件+分页）
 * @description 获取巡检明细列表，支持按条件查询和分页
 */
export function queryInspectDetailList<T = PageDTO<InspectDetailData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectDetailListParams>({
		url: "/j8-patrolmgt/detail/query-detail-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}
