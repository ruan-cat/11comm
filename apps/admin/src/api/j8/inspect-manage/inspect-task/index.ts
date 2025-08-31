import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检任务传输对象
 */
export interface InspectTaskData {
	/** 实际巡检时间 */
	actInsTime?: string;
	/** 实际巡检人姓名 */
	actUserName?: string;
	/** 计划结束时间 */
	planEndTime?: string;
	/** 巡检计划id */
	planId?: string;
	/** 计划开始时间 */
	planInsTime?: string;
	/** 巡检计划名称 */
	planName?: string;
	/** 计划巡检人姓名 */
	planUserName?: string;
	/** 巡检方式 */
	signType?: string;
	/** 巡检状态 */
	state?: string;
	/** 巡检任务id */
	taskId?: string;
	/** 转移描述 */
	transferDesc?: string;
}

/**
 * 获取巡检任务详情参数
 */
export interface QueryInspectTaskDetailParams {
	/** 巡检任务id */
	taskId: string;
}

/**
 * 获取巡检任务列表参数
 */
export interface QueryInspectTaskListParams {
	/** 小区id */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 实际巡检人姓名 */
	actUserName?: string;
	/** 结束时间 */
	planEndTime?: string;
	/** 巡检计划id */
	planId?: string;
	/** 开始时间 */
	planInsTime?: string;
	/** 计划巡检人姓名 */
	planUserName?: string;
	/** 巡检状态 */
	state?: string;
}

/**
 * 流转巡检任务参数
 */
export interface TransferInspectTaskParams {
	/** 被转移人id */
	newUserId: string;
	/** 巡检任务id */
	taskId: string;
	/** 转移描述 */
	transferDesc: string;
}

// ==================== 接口函数 ====================

/**
 * 获取巡检任务详情
 * @description 根据任务ID获取巡检任务的详细信息
 */
export function queryInspectTaskDetail<T = InspectTaskData>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, QueryInspectTaskDetailParams>({
		url: "/j8-patrolmgt/task/query-task-detail/{taskId}",
		httpParamWay: "path",
		config: {
			method: "GET",
			url: "/j8-patrolmgt/task/query-task-detail/{taskId}",
		},
		options,
	});
}

/**
 * 获取巡检任务列表（条件+分页）
 * @description 获取巡检任务列表，支持按条件查询和分页
 */
export function queryInspectTaskList<T = PageDTO<InspectTaskData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectTaskListParams>({
		url: "/j8-patrolmgt/task/query-task-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 流转任务
 * @description 将巡检任务转移给其他用户
 */
export function transferInspectTask<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TransferInspectTaskParams>({
		url: "/j8-patrolmgt/task/user",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				newUserId: "",
				taskId: "",
				transferDesc: "",
			},
		},
		options,
	});
}
