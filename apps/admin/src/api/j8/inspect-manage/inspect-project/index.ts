import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检项目数据模型
 */
export interface InspectItemData {
	/** 巡检项目编号 */
	itemId?: string;
	/** 巡检项目名称 */
	itemName?: string;
	/** 巡检项目备注 */
	remark?: string;
	/** 项目创建时间 */
	createTime?: string;
}

/**
 * 巡检题目数据模型
 */
export interface InspectTitleData {
	/** 巡检题目编号 */
	titleId?: string;
	/** 巡检题目名称 */
	itemTitle?: string;
	/** 题目顺序 */
	seq?: string;
	/** 题目类型 */
	titleType?: string;
	/** 题目创建时间 */
	createTime?: string;
}

/**
 * 巡检项目选项DTO
 */
export interface InspectItemOptionDTO {
	/** 小区ID */
	communityId: string;
	/** 选项说明 */
	itemValue: string;
	/** 选项顺序 */
	seq: number;
	/** 题目ID */
	titleId?: string;
	/** 选项ID */
	valueId?: string;
}

/**
 * 添加巡检项目参数
 */
export interface AddInspectItemParams {
	/** 小区ID */
	communityId: string;
	/** 巡检项目名称 */
	itemName: string;
	/** 备注 */
	remark: string;
}

/**
 * 修改巡检项目参数
 */
export interface ModifyInspectItemParams {
	/** 小区ID */
	communityId: string;
	/** 巡检项目的主键id */
	itemId: string;
	/** 巡检项目名称 */
	itemName: string;
	/** 备注 */
	remark: string;
}

/**
 * 添加巡检题目参数
 */
export interface AddInspectTitleParams {
	/** 小区ID */
	communityId: string;
	/** 关联项目ID */
	itemId: string;
	/** 巡检题目 */
	itemTitle: string;
	/** 显示顺序，显示顺序最小值为0 */
	seq: number;
	/** 题目类型，1001单选，2002多选，3003简答题 */
	titleType: string;
	/** 题目ID */
	titleId?: string;
	/** 选项列表(简答题可为空) */
	values?: InspectItemOptionDTO[];
}

/**
 * 修改巡检题目参数
 */
export interface ModifyInspectTitleParams {
	/** 小区ID */
	communityId: string;
	/** 关联项目ID */
	itemId: string;
	/** 巡检题目 */
	itemTitle: string;
	/** 显示顺序，显示顺序最小值为0 */
	seq: number;
	/** 题目ID */
	titleId: string;
	/** 题目类型，1001单选，2002多选，3003简答题 */
	titleType: string;
	/** 选项列表(简答题可为空) */
	values?: InspectItemOptionDTO[];
}

/**
 * 获取巡检项目列表参数
 */
export interface QueryInspectItemListParams {
	/** 小区编号 */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 巡检项目编号 */
	itemId?: string;
	/** 巡检项目名称 */
	itemName?: string;
}

/**
 * 获取巡检项目名称列表参数
 */
export interface QueryInspectItemNameListParams {
	/** 小区编号 */
	communityId: string;
}

/**
 * 获取巡检题目列表参数
 */
export interface QueryInspectTitleListParams {
	/** 小区编号 */
	communityId: string;
	/** 巡检项目编号 */
	itemId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 巡检题目编号 */
	titleId?: string;
	/** 巡检题目名称 */
	itemTitle?: string;
	/** 题目类型 */
	titleType?: string;
}

/**
 * 删除巡检项目参数
 */
export interface DeleteInspectItemParams {
	/** 巡检项目的主键id */
	itemId: string;
}

/**
 * 删除巡检题目参数
 */
export interface DeleteInspectTitleParams {
	/** 题目id */
	titleId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加巡检项目
 * @description 添加新的巡检项目
 */
export function addInspectItem<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectItemParams>({
		url: "/j8-patrolmgt/item/add-item",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				itemName: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 修改巡检项目
 * @description 修改已有的巡检项目
 */
export function modifyInspectItem<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectItemParams>({
		url: "/j8-patrolmgt/item/modify-item",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
				itemId: "",
				itemName: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 删除巡检项目
 * @description 删除指定的巡检项目
 */
export function deleteInspectItem<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, DeleteInspectItemParams>({
		url: "/j8-patrolmgt/item/remove-item/{itemId}",
		httpParamWay: "path",
		config: {
			method: "DELETE",
			url: "/j8-patrolmgt/item/remove-item/{itemId}",
		},
		options,
	});
}

/**
 * 获取巡检项目列表（条件+分页）
 * @description 获取巡检项目列表，支持按条件查询和分页
 */
export function queryInspectItemList<T = PageDTO<InspectItemData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectItemListParams>({
		url: "/j8-patrolmgt/item/query-item-list",
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
 * 获取巡检项目名称列表
 * @description 获取所有巡检项目的名称列表
 */
export function queryInspectItemNameList<T = PageDTO<InspectItemData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectItemNameListParams>({
		url: "/j8-patrolmgt/item/query-item-name-list",
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
 * 增加巡检题目
 * @description 为指定项目添加新的巡检题目
 */
export function addInspectTitle<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectTitleParams>({
		url: "/j8-patrolmgt/item/add-inspection-item",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				itemId: "",
				itemTitle: "",
				seq: 0,
				titleType: "",
			},
		},
		options,
	});
}

/**
 * 修改巡检题目
 * @description 修改已有的巡检题目
 */
export function modifyInspectTitle<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectTitleParams>({
		url: "/j8-patrolmgt/item/modify-inspection-item",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
				itemId: "",
				itemTitle: "",
				seq: 0,
				titleId: "",
				titleType: "",
			},
		},
		options,
	});
}

/**
 * 删除巡检题目
 * @description 删除指定的巡检题目
 */
export function deleteInspectTitle<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, DeleteInspectTitleParams>({
		url: "/j8-patrolmgt/item/remove-inspection-item/{titleId}",
		httpParamWay: "path",
		config: {
			method: "DELETE",
			url: "/j8-patrolmgt/item/remove-inspection-item/{titleId}",
		},
		options,
	});
}

/**
 * 获取巡检题目列表（条件+分页）
 * @description 获取巡检题目列表，支持按条件查询和分页
 */
export function queryInspectTitleList<T = PageDTO<InspectTitleData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectTitleListParams>({
		url: "/j8-patrolmgt/item/query-inspection-item-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				itemId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}
