import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

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
	/** 创建时间 */
	createTime?: string;
}

/**
 * 新增巡检路线巡检点参数
 */
export interface AddInspectRoutePointParams {
	/** 路线ID */
	routeId: string;
	/** 巡检点ID */
	inspectionId: string;
	/** 顺序号 */
	orderNum: number;
	/** 预计时长（分钟） */
	estimatedTime?: number;
}

/**
 * 修改巡检路线巡检点参数
 */
export interface ModifyInspectRoutePointParams {
	/** 路线点ID */
	routePointId: string;
	/** 顺序号 */
	orderNum?: number;
	/** 预计时长（分钟） */
	estimatedTime?: number;
}

/**
 * 删除巡检路线巡检点参数
 */
export interface DeleteInspectRoutePointParams {
	/** 路线点ID */
	routePointId: string;
}

// ==================== 接口函数 ====================

/**
 * 新增巡检路线巡检点
 * @description 为巡检路线添加新的巡检点
 */
export function addInspectRoutePoint<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectRoutePointParams>({
		url: "/j8-patrolmgt/route-point/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				routeId: "",
				inspectionId: "",
				orderNum: 1,
			},
		},
		options,
	});
}

/**
 * 修改巡检路线巡检点
 * @description 修改巡检路线中的巡检点信息
 */
export function modifyInspectRoutePoint<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectRoutePointParams>({
		url: "/j8-patrolmgt/route-point/modify",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				routePointId: "",
			},
		},
		options,
	});
}

/**
 * 删除巡检路线巡检点
 * @description 从巡检路线中删除指定的巡检点
 */
export function deleteInspectRoutePoint<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteInspectRoutePointParams>({
		url: "/j8-patrolmgt/route-point/delete",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				routePointId: "",
			},
		},
		options,
	});
}
