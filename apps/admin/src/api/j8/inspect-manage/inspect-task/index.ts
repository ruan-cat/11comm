import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检任务数据模型
 */
export interface InspectTaskData {
	/** 任务ID */
	taskId?: string;
	/** 任务名称 */
	taskName?: string;
	/** 计划ID */
	planId?: string;
	/** 巡检人ID */
	inspectorId?: string;
	/** 巡检人姓名 */
	inspectorName?: string;
	/** 任务状态 */
	taskStatus?: string;
	/** 开始时间 */
	startTime?: string;
	/** 结束时间 */
	endTime?: string;
	/** 创建时间 */
	createTime?: string;
	/** 完成度 */
	completionRate?: number;
}

/**
 * 巡检任务详情数据模型
 */
export interface InspectTaskDetailData extends InspectTaskData {
	/** 任务描述 */
	taskDesc?: string;
	/** 巡检路线 */
	routeName?: string;
	/** 巡检项目 */
	projectName?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 获取巡检任务详情参数
 */
export interface QueryInspectTaskDetailParams {
	/** 任务ID */
	taskId: string;
}

/**
 * 获取巡检任务列表参数
 */
export interface QueryInspectTaskListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 任务名称 */
	taskName?: string;
	/** 巡检人姓名 */
	inspectorName?: string;
	/** 任务状态 */
	taskStatus?: string;
	/** 开始时间 */
	startTime?: string;
	/** 结束时间 */
	endTime?: string;
}

/**
 * 流转任务参数
 */
export interface TransferInspectTaskParams {
	/** 任务ID */
	taskId: string;
	/** 操作类型 */
	actionType: string;
	/** 目标状态 */
	targetStatus?: string;
	/** 流转原因 */
	reason?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取巡检任务详情
 * @description 根据任务ID获取巡检任务的详细信息
 */
export function queryInspectTaskDetail<T = InspectTaskDetailData>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectTaskDetailParams>({
		url: "/j8-patrolmgt/task/query-task-detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				taskId: "",
			},
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
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 流转任务
 * @description 对巡检任务进行流转操作（如开始、暂停、完成等）
 */
export function transferInspectTask<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TransferInspectTaskParams>({
		url: "/j8-patrolmgt/task/transfer",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				taskId: "",
				actionType: "",
			},
		},
		options,
	});
}
