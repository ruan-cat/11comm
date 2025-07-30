import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检路线数据模型
 */
export interface InspectRouteData {
	/** 路线ID */
	routeId?: string;
	/** 路线名称 */
	routeName?: string;
	/** 路线描述 */
	routeDesc?: string;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
	/** 状态 */
	status?: string;
	/** 小区ID */
	communityId?: string;
}

/**
 * 巡检路线名称数据模型
 */
export interface InspectRouteNameData {
	/** 路线ID */
	routeId?: string;
	/** 路线名称 */
	routeName?: string;
}

/**
 * 巡检路线巡检点数据模型
 */
export interface InspectRoutePointData {
	/** 路线点ID */
	routePointId?: string;
	/** 路线ID */
	routeId?: string;
	/** 巡检点ID */
	inspectionId?: string;
	/** 巡检点名称 */
	inspectionName?: string;
	/** 顺序号 */
	orderNum?: number;
	/** 预计时长（分钟） */
	estimatedTime?: number;
}

/**
 * 添加巡检路线参数
 */
export interface AddInspectRouteParams {
	/** 路线名称 */
	routeName: string;
	/** 路线描述 */
	routeDesc?: string;
	/** 小区ID */
	communityId: string;
	/** 状态 */
	status?: string;
}

/**
 * 修改巡检路线参数
 */
export interface ModifyInspectRouteParams {
	/** 路线ID */
	routeId: string;
	/** 路线名称 */
	routeName?: string;
	/** 路线描述 */
	routeDesc?: string;
	/** 状态 */
	status?: string;
}

/**
 * 获取巡检路线列表参数
 */
export interface QueryInspectRouteListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 路线名称 */
	routeName?: string;
	/** 状态 */
	status?: string;
}

/**
 * 获取巡检路线巡检点列表参数
 */
export interface QueryInspectRoutePointListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 路线ID */
	routeId?: string;
	/** 巡检点名称 */
	inspectionName?: string;
}

/**
 * 删除巡检路线参数
 */
export interface DeleteInspectRouteParams {
	/** 路线ID */
	routeId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加巡检路线，返回添加成功的ID
 * @description 添加新的巡检路线
 */
export function addInspectRoute<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectRouteParams>({
		url: "/j8-patrolmgt/route/add-route",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				routeName: "",
				communityId: "",
			},
		},
		options,
	});
}

/**
 * 修改巡检路线
 * @description 修改已有的巡检路线
 */
export function modifyInspectRoute<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectRouteParams>({
		url: "/j8-patrolmgt/route/modify-route",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				routeId: "",
			},
		},
		options,
	});
}

/**
 * 获取巡检路线名称列表
 * @description 获取所有巡检路线的名称列表
 */
export function queryInspectRouteNameList<T = InspectRouteNameData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j8-patrolmgt/route/query-route-name-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 获取巡检路线列表（条件+分页）
 * @description 获取巡检路线列表，支持按条件查询和分页
 */
export function queryInspectRouteList<T = PageDTO<InspectRouteData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectRouteListParams>({
		url: "/j8-patrolmgt/route/query-route-list",
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
 * 获取巡检路线巡检点列表（条件+分页）
 * @description 获取指定路线的巡检点列表
 */
export function queryInspectRoutePointList<T = PageDTO<InspectRoutePointData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectRoutePointListParams>({
		url: "/j8-patrolmgt/route/query-route-point-list",
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
 * 删除巡检路线
 * @description 删除指定的巡检路线
 */
export function deleteInspectRoute<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteInspectRouteParams>({
		url: "/j8-patrolmgt/route/delete-route",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				routeId: "",
			},
		},
		options,
	});
}
