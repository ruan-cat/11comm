import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检计划数据模型
 */
export interface InspectPlanData {
	/** 任务提前 */
	beforeTime?: string;
	/** 创建时间 */
	createTime?: string;
	/** 创建人名称 */
	createUserName?: string;
	/** 日期范围 */
	dateRange?: string;
	/** 结束日期 */
	endDate?: string;
	/** 结束时间 */
	endTime?: string;
	/** 巡检计划名称 */
	inspectionPlanName?: string;
	/** 巡检计划周期 */
	inspectionPlanPeriod?: string;
	/** 路线名称 */
	routeName?: string;
	/** 签到方式 */
	signType?: string;
	/** 开始日期 */
	startDate?: string;
	/** 开始时间 */
	startTime?: string;
	/** 状态 */
	state?: string;
	/** 时间范围 */
	timeRange?: string;
}

/**
 * 巡检计划详情数据模型
 */
export interface InspectPlanDetailData extends InspectPlanData {
	/** 巡检计划ID */
	inspectionPlanId?: string;
}

/**
 * 添加巡检计划参数
 */
export interface AddInspectPlanParams {
	/** 任务提前 */
	beforeTime: string;
	/** 允许补检 1000不允许 2000允许 */
	canReexamine: string;
	/** 小区ID */
	communityId: string;
	/** 制定人员ID */
	createUserId: string;
	/** 制定人员姓名 */
	createUserName: string;
	/** 结束日期 */
	endDate: string;
	/** 结束时间 */
	endTime: string;
	/** 天 */
	inspectionDay: string;
	/** 月份 */
	inspectionMonth: string;
	/** 巡检计划名称 */
	inspectionPlanName: string;
	/** 执行周期 */
	inspectionPlanPeriod: string;
	/** 巡检路线ID */
	inspectionRouteId: string;
	/** 周 */
	inspectionWorkday: string;
	/** 签到方式 */
	signType: string;
	/** 巡检人ID */
	staffId: string;
	/** 巡检人名称 */
	staffName: string;
	/** 开始日期 */
	startDate: string;
	/** 开始时间 */
	startTime: string;
	/** 当前状态 */
	state: string;
}

/**
 * 修改巡检计划参数
 */
export interface ModifyInspectPlanParams extends AddInspectPlanParams {
	/** 巡检计划ID */
	inspectionPlanId: string;
}

/**
 * 停用巡检计划参数
 */
export interface ModifyInspectPlanStateParams {
	/** 巡检计划ID */
	inspectionPlanId: string;
	/** 状态 */
	state: string;
}

/**
 * 获取巡检计划详情参数
 */
export interface QueryInspectPlanDetailParams {
	/** 计划ID */
	planId?: string;
}

/**
 * 获取巡检计划列表参数
 */
export interface QueryInspectPlanListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 巡检计划ID */
	inspectionPlanId?: string;
	/** 巡检计划名称 */
	inspectionPlanName?: string;
	/** 巡检计划状态 */
	state?: string;
}

/**
 * 删除巡检计划参数
 */
export interface DeleteInspectPlanParams {
	/** 巡检计划ID */
	inspectionPlanId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加巡检计划
 * @description 添加新的巡检计划
 */
export function addInspectPlan<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectPlanParams>({
		url: "/j8-patrolmgt/plan/add-inspection-plan",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				beforeTime: "",
				canReexamine: "",
				communityId: "",
				createUserId: "",
				createUserName: "",
				endDate: "",
				endTime: "",
				inspectionDay: "",
				inspectionMonth: "",
				inspectionPlanName: "",
				inspectionPlanPeriod: "",
				inspectionRouteId: "",
				inspectionWorkday: "",
				signType: "",
				staffId: "",
				staffName: "",
				startDate: "",
				startTime: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 修改巡检计划
 * @description 修改已有的巡检计划
 */
export function modifyInspectPlan<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectPlanParams>({
		url: "/j8-patrolmgt/plan/modify-inspection-plan",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				inspectionPlanId: "",
				beforeTime: "",
				canReexamine: "",
				communityId: "",
				createUserId: "",
				createUserName: "",
				endDate: "",
				endTime: "",
				inspectionDay: "",
				inspectionMonth: "",
				inspectionPlanName: "",
				inspectionPlanPeriod: "",
				inspectionRouteId: "",
				inspectionWorkday: "",
				signType: "",
				staffId: "",
				staffName: "",
				startDate: "",
				startTime: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 停用巡检计划
 * @description 修改巡检计划状态（启用/停用）
 */
export function modifyInspectPlanState<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ModifyInspectPlanStateParams>({
		url: "/j8-patrolmgt/plan/modify-inspection-plan-state",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				inspectionPlanId: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 获取巡检计划详情
 * @description 根据计划ID获取巡检计划详情
 */
export function queryInspectPlanDetail<T = InspectPlanDetailData>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectPlanDetailParams>({
		url: "/j8-patrolmgt/plan/query-plan-detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 获取巡检计划列表（条件+分页）
 * @description 获取巡检计划列表，支持按条件查询和分页
 */
export function queryInspectPlanList<T = PageDTO<InspectPlanData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectPlanListParams>({
		url: "/j8-patrolmgt/plan/query-plan-list",
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
 * 删除巡检计划
 * @description 删除指定的巡检计划
 */
export function deleteInspectPlan<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, DeleteInspectPlanParams>({
		url: "/j8-patrolmgt/plan/remove-inspection-plan/{inspectionPlanId}",
		httpParamWay: "path",
		config: {
			method: "DELETE",
			params: {
				inspectionPlanId: "",
			},
		},
		options,
	});
}
