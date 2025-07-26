import { useRequest } from "@/composables/use-request";

/**
 * 添加关联单元参数
 */
export interface AddRelatedUnitParams {
	/** 小区ID */
	communityId?: string;
	/** 创建时间 */
	createTime?: string;
	/** 数据权限ID */
	dpId: string;
	/** 主键ID */
	dpUnitId?: string;
	/** 楼栋ID */
	floorId?: string;
	/** 楼栋编号 */
	floorNum: string;
	/** 数据状态 */
	statusCd?: string;
	/** 单元ID */
	unitId?: string;
	/** 单元编号 */
	unitNum: string;
	/** BId */
	BId?: string;
}

/**
 * 获取已关联单元列表参数
 */
export interface QueryRelatedUnitListParams {
	/** 数据权限ID */
	dpId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 数据状态 */
	statusCd?: string;
}

/**
 * 获取未关联单元列表参数
 */
export interface QueryNoRelatedUnitListParams {
	/** 小区ID */
	communityId?: string;
	/** 数据权限ID */
	dpId: string;
	/** 楼栋编号 */
	floorNum: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 数据状态 */
	statusCd?: string;
	/** 单元编号 */
	unitNum: string;
}

/**
 * 删除关联单元参数
 */
export interface RemoveRelatedUnitParams {
	/** 主键ID */
	dpUnitId?: string;
}

/**
 * 关联单元显示模型
 */
export interface RelatedUnitDisplayModel {
	/** 主键ID */
	dpUnitId: string;
	/** 楼栋编号 */
	floorNum: string;
	/** 单元编号 */
	unitNum: string;
}

/**
 * 添加关联单元
 * @description 根据单元id来添加关联单元
 */
export function addRelatedUnit<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, AddRelatedUnitParams>({
		url: "/j2-orgmanager/data/unit/add-related-unit",
		httpParamWay: "query",
		options,
		config: {
			method: "PUT",
			params: {
				communityId: "",
				createTime: "",
				dpId: "",
				dpUnitId: "",
				floorId: "",
				floorNum: "",
				statusCd: "",
				unitId: "",
				unitNum: "",
				BId: "",
			},
		},
	});
}

/**
 * 获取已关联单元列表（条件+分页）
 * @description 根据楼栋编号，单元编号以及数据状态来查询已关联单元列表
 */
export function queryRelatedUnitList<T = PageDTO<RelatedUnitDisplayModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRelatedUnitListParams>({
		url: "/j2-orgmanager/data/unit/has-related-unit",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				dpId: "",
				pageIndex: 1,
				pageSize: 10,
				statusCd: "",
			},
		},
	});
}

/**
 * 获取未关联单元列表（条件+分页）
 * @description 根据数据状态来查询未关联单元列表
 */
export function queryNoRelatedUnitList<T = PageDTO<RelatedUnitDisplayModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryNoRelatedUnitListParams>({
		url: "/j2-orgmanager/data/unit/no-related-unit",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				communityId: "",
				dpId: "",
				floorNum: "",
				pageIndex: 1,
				pageSize: 10,
				statusCd: "",
				unitNum: "",
			},
		},
	});
}

/**
 * 删除关联单元
 * @description 根据单元id来删除关联单元
 */
export function removeRelatedUnit<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveRelatedUnitParams>({
		url: "/j2-orgmanager/data/unit/remove-related-unit",
		httpParamWay: "query",
		options,
		config: {
			method: "DELETE",
			params: {
				dpUnitId: "",
			},
		},
	});
}
