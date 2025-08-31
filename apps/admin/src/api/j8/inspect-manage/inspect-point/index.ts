import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检点数据对象
 */
export interface InspectPointData {
	/** 巡检点ID */
	inspectionId?: string;
	/** 巡检点名称 */
	inspectionName?: string;
	/** 巡检项目 */
	itemName?: string;
	/** NFC编码 */
	nfcCode?: string;
	/** 巡检位置 */
	pointObjName?: string;
	/** 巡检点类型 */
	pointType?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 可选巡检点信息DTO
 */
export interface SelectableInspectPointData {
	/** 巡检点ID */
	inspectionId?: string;
	/** 巡检点名称 */
	inspectionName?: string;
}

/**
 * 添加巡检点参数
 */
export interface AddInspectPointParams {
	/** 小区ID */
	communityId: string;
	/** 巡检点名称 */
	inspectionName: string;
	/** 巡检项目 */
	itemId: string;
	/** 对象ID */
	pointObjId: string;
	/** 位置 */
	pointObjName: string;
	/** 巡检类型 */
	pointObjType: string;
	/** NFC编码 */
	nfcCode?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 修改巡检点参数
 */
export interface ModifyInspectPointParams {
	/** 巡检点ID */
	inspectionId: string;
	/** 巡检点名称 */
	inspectionName?: string;
	/** 巡检项目 */
	itemName?: string;
	/** NFC编码 */
	nfcCode?: string;
	/** 巡检位置 */
	pointObjName?: string;
	/** 巡检点类型 */
	pointType?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 获取巡检点列表参数
 */
export interface QueryInspectPointListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 巡检点ID */
	inspectionId?: string;
	/** 巡检点名称 */
	inspectionName?: string;
	/** 巡检点类型名称 */
	pointTypeName?: string;
}

/**
 * 删除巡检点参数
 */
export interface DeleteInspectPointParams {
	/** 巡检点ID */
	inspectionId: string;
}

/**
 * 获取可选巡检点列表参数
 */
export interface QuerySelectableInspectPointListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 巡检点名称（模糊查询） */
	inspectionName?: string;
}

// ==================== 接口函数 ====================

/**
 * 添加巡检点
 * @description 添加新的巡检点
 */
export function addInspectPoint<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectPointParams>({
		url: "/j8-patrolmgt/point/add-point",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				inspectionName: "",
				itemId: "",
				pointObjId: "",
				pointObjName: "",
				pointObjType: "",
				nfcCode: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 修改巡检点信息
 * @description 修改已有的巡检点信息
 */
export function modifyInspectPoint<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectPointParams>({
		url: "/j8-patrolmgt/point/modify-point",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				inspectionId: "",
				inspectionName: "",
				itemName: "",
				nfcCode: "",
				pointObjName: "",
				pointType: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 获取巡检点列表（条件+分页）
 * @description 获取巡检点列表，支持按条件查询和分页
 */
export function queryInspectPointList<T = PageDTO<InspectPointData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectPointListParams>({
		url: "/j8-patrolmgt/point/query-point-list",
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
 * 删除巡检点
 * @description 删除指定的巡检点
 */
export function deleteInspectPoint<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteInspectPointParams>({
		url: "/j8-patrolmgt/point/remove-point",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				inspectionId: "",
			},
		},
		options,
	});
}

/**
 * 获取可选巡检点列表（条件+分页）
 * @description 获取可选的巡检点列表，支持按条件查询和分页
 */
export function querySelectableInspectPointList<T = PageDTO<SelectableInspectPointData>>(
	options: UseAxiosOptionsJsonVO<T>,
) {
	return useRequest<ParamsQueryKey, T, QuerySelectableInspectPointListParams>({
		url: "/j8-patrolmgt/point/select-points",
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
