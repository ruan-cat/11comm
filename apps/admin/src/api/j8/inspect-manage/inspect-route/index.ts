import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检路线数据模型
 */
export interface InspectRouteData {
	/** 路线id */
	inspectionRouteId?: string;
	/** 路线名称 */
	routeName?: string;
	/** 备注 */
	remark?: string;
	/** 路线顺序 */
	seq?: string;
	/** 创建时间 */
	createTime?: string;
}

/**
 * 巡检路线巡检点数据模型
 */
export interface InspectRoutePointData {
	/** 巡检点id */
	inspectionId?: string;
	/** 巡检点名称 */
	inspectionName?: string;
	/** 巡检位置 */
	pointObjName?: string;
	/** 巡检点类型 */
	pointObjType?: string;
	/** 开始时间 */
	pointStartTime?: string;
	/** 结束时间 */
	pointEndTime?: string;
}

/**
 * 添加巡检路线参数
 */
export interface AddInspectRouteParams {
	/** 小区id */
	communityId: string;
	/** 路线名称 */
	routeName: string;
	/** 顺序 */
	seq: string;
	/** 备注 */
	remark?: string;
}

/**
 * 修改巡检路线参数
 */
export interface ModifyInspectRouteParams {
	/** Route_ID */
	inspectionRouteId: string;
	/** 路线名称 */
	routeName: string;
	/** 顺序 */
	seq: string;
	/** 备注 */
	remark?: string;
}

/**
 * 获取巡检路线名称列表参数
 */
export interface QueryInspectRouteNameListParams {
	/** 社区id */
	communityId: string;
}

/**
 * 获取巡检路线列表参数
 */
export interface QueryInspectRouteListParams {
	/** 社区id */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 路线id */
	inspectionRouteId?: string;
	/** 路线名称 */
	routeName?: string;
	/** 路线顺序 */
	seq?: string;
}

/**
 * 获取巡检路线巡检点列表参数
 */
export interface QueryInspectRoutePointListParams {
	/** 社区id */
	communityId: string;
	/** 巡检路线id */
	inspectionRouteId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 删除巡检路线参数
 */
export interface DeleteInspectRouteParams {
	/** 巡检路线id */
	inspectionRouteId: string;
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
				communityId: "",
				routeName: "",
				seq: "",
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
				inspectionRouteId: "",
				routeName: "",
				seq: "",
			},
		},
		options,
	});
}

/**
 * 获取巡检路线名称列表
 * @description 获取所有巡检路线的名称列表
 */
export function queryInspectRouteNameList<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectRouteNameListParams>({
		url: "/j8-patrolmgt/route/query-name-rout",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
			},
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
		url: "/j8-patrolmgt/route/query-rout-list",
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
				communityId: "",
				inspectionRouteId: "",
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
		url: "/j8-patrolmgt/route/remove-route",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				inspectionRouteId: "",
			},
		},
		options,
	});
}
