import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加折扣参数
 */
export interface AddDiscountParams {
	/** 打折名称 */
	discount_name?: string;
	/** 折扣类型 */
	discount_type?: string;
	/** 规则ID */
	rule_id?: string;
	/** 打折说明 */
	discount_desc?: string;
	/** 规格名称 */
	spec_name?: string[];
	/** 规格值 */
	spec_value?: string[];
}

/**
 * 修改折扣参数
 */
export interface ModifyDiscountParams {
	/** 打折ID */
	discount_id?: string;
	/** 规则ID */
	rule_id?: string;
	/** 打折名称 */
	discount_name?: string;
	/** 折扣类型 */
	discount_type?: string;
	/** 打折说明 */
	discount_desc?: string;
	/** 规格名称 */
	spec_name?: string[];
	/** 规格值 */
	spec_value?: string[];
}

/**
 * 删除折扣参数
 */
export interface DeleteDiscountParams {
	/** 打折ID */
	discount_id: string;
}

/**
 * 查询折扣参数
 */
export interface QueryDiscountParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 打折ID */
	discount_id?: string;
	/** 打折名称 */
	discount_name?: string;
	/** 折扣类型 */
	discount_type?: string;
}

/**
 * 折扣数据模型
 */
export interface DiscountDataModel {
	/** 打折ID */
	discount_id?: string;
	/** 打折名称 */
	discount_name?: string;
	/** 折扣类型 */
	discount_type?: string;
	/** 规则ID */
	rule_id?: string;
	/** 规则名称 */
	rule_name?: string;
	/** 规格名称 */
	spec_name?: string[];
	/** 规格值 */
	spec_value?: string[];
	/** 创建时间 */
	create_time?: string;
}

// ==================== 接口函数 ====================

/**
 * 添加折扣
 */
export function addDiscount<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddDiscountParams>({
		url: "/c4-discount/add-discount",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 修改折扣
 */
export function modifyDiscount<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyDiscountParams>({
		url: "/c4-discount/modify-discount",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 删除折扣
 */
export function deleteDiscount<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteDiscountParams>({
		url: "/c4-discount/delete-discount",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				discount_id: "",
			},
		},
		options,
	});
}

/**
 * 查询折扣
 */
export function queryDiscount<T = PageDTO<DiscountDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryDiscountParams>({
		url: "/c4-discount/list-discount",
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
