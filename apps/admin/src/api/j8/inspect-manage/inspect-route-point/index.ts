import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加巡检路线巡检点参数
 */
export interface AddInspectRoutePointParams {
	/** 巡检点id */
	inspectionId: string;
	/** 巡检路线id */
	inspectionRouteId: string;
	/** 巡检点状态 */
	statusCd: string;
}

/**
 * 修改巡检路线巡检点参数
 */
export interface ModifyInspectRoutePointParams {
	/** 巡检点id */
	inspectionId: string;
	/** 巡检路线id */
	inspectionRouteId: string;
	/** 巡检点开始的时间 */
	pointStartTime: string;
	/** 巡检点结束时间 */
	pointEndTime: string;
	/** 排序 */
	sortNumber: string;
}

/**
 * 删除巡检路线巡检点参数
 */
export interface DeleteInspectRoutePointParams {
	/** 巡检点id */
	inspectionId: string;
	/** 巡检路线id */
	inspectionRouteId: string;
}

// ==================== 接口函数 ====================

/**
 * 新增巡检路线巡检点
 * @description 为巡检路线批量添加巡检点
 */
export function addInspectRoutePoint<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectRoutePointParams[]>({
		url: "/j8-patrolmgt/route/addpointlist-routepointrel",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: [
				{
					inspectionId: "",
					inspectionRouteId: "",
					statusCd: "",
				},
			],
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
		url: "/j8-patrolmgt/route/modify-routepointrel",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				inspectionId: "",
				inspectionRouteId: "",
				pointStartTime: "",
				pointEndTime: "",
				sortNumber: "",
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
		url: "/j8-patrolmgt/route/remove-routepointrel",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				inspectionId: "",
				inspectionRouteId: "",
			},
		},
		options,
	});
}
