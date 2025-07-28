import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取优惠类型名称列表参数
 */
export interface QueryDiscountTypeNameParams {
	// 通常名称列表查询不需要特殊参数，但保留空对象以满足类型约束
}

/**
 * 获取优惠类型列表查询参数
 */
export interface QueryDiscountTypeListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 优惠类型名称 */
	discount_type_name?: string;
	/** 优惠类型编码 */
	discount_type_code?: string;
	/** 状态 */
	status?: string;
}

/**
 * 添加优惠类型参数
 */
export interface AddDiscountTypeParams {
	/** 优惠类型名称 */
	discount_type_name?: string;
	/** 优惠类型编码 */
	discount_type_code?: string;
	/** 优惠描述 */
	discount_desc?: string;
	/** 优惠比例 */
	discount_rate?: number;
	/** 优惠金额 */
	discount_amount?: number;
	/** 优惠类型 */
	discount_type?: string;
	/** 状态 */
	status?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 修改优惠类型参数
 */
export interface ModifyDiscountTypeParams {
	/** 优惠类型ID */
	discount_type_id?: string;
	/** 优惠类型名称 */
	discount_type_name?: string;
	/** 优惠类型编码 */
	discount_type_code?: string;
	/** 优惠描述 */
	discount_desc?: string;
	/** 优惠比例 */
	discount_rate?: number;
	/** 优惠金额 */
	discount_amount?: number;
	/** 优惠类型 */
	discount_type?: string;
	/** 状态 */
	status?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 删除优惠类型参数
 */
export interface DeleteDiscountTypeParams {
	/** 优惠类型ID */
	discount_type_id: string;
}

/**
 * 优惠类型名称数据模型
 */
export interface DiscountTypeNameDataModel {
	/** 优惠类型ID */
	discount_type_id?: string;
	/** 优惠类型名称 */
	discount_type_name?: string;
	/** 优惠类型编码 */
	discount_type_code?: string;
}

/**
 * 优惠类型数据模型
 */
export interface DiscountTypeDataModel {
	/** 优惠类型ID */
	discount_type_id?: string;
	/** 优惠类型名称 */
	discount_type_name?: string;
	/** 优惠类型编码 */
	discount_type_code?: string;
	/** 优惠描述 */
	discount_desc?: string;
	/** 优惠比例 */
	discount_rate?: number;
	/** 优惠金额 */
	discount_amount?: number;
	/** 优惠类型 */
	discount_type?: string;
	/** 状态 */
	status?: string;
	/** 备注 */
	remark?: string;
	/** 创建时间 */
	create_time?: string;
	/** 创建人 */
	create_user?: string;
	/** 修改时间 */
	update_time?: string;
	/** 修改人 */
	update_user?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取优惠类型名称列表
 */
export function getDiscountTypeNameList<T = DiscountTypeNameDataModel[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryDiscountTypeNameParams>({
		url: "/c5-discount-type/name-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 获取优惠类型列表（条件 + 分页）
 */
export function getDiscountTypeList<T = PageDTO<DiscountTypeDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryDiscountTypeListParams>({
		url: "/c5-discount-type/list",
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
 * 添加优惠类型
 */
export function addDiscountType<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddDiscountTypeParams>({
		url: "/c5-discount-type/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 修改优惠类型
 */
export function modifyDiscountType<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyDiscountTypeParams>({
		url: "/c5-discount-type/modify",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {},
		},
		options,
	});
}

/**
 * 删除优惠类型
 */
export function deleteDiscountType<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteDiscountTypeParams>({
		url: "/c5-discount-type/delete",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				discount_type_id: "",
			},
		},
		options,
	});
}
