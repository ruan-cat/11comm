import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取催缴列表查询参数
 */
export interface QueryCollectionListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主姓名 */
	owner_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 催缴类型 */
	collection_type?: string;
	/** 催缴状态 */
	collection_status?: string;
	/** 催缴开始时间 */
	collection_start_time?: string;
	/** 催缴结束时间 */
	collection_end_time?: string;
}

/**
 * 催缴登记参数
 */
export interface CollectionRegisterParams {
	/** 业主姓名 */
	owner_name?: string;
	/** 业主电话 */
	owner_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 欠费金额 */
	arrears_amount?: number;
	/** 催缴类型 */
	collection_type?: string;
	/** 催缴方式 */
	collection_method?: string;
	/** 催缴内容 */
	collection_content?: string;
	/** 催缴备注 */
	collection_remark?: string;
}

/**
 * 新增催缴参数
 */
export interface AddCollectionParams {
	/** 业主姓名 */
	owner_name?: string;
	/** 业主电话 */
	owner_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 欠费项目 */
	arrears_items?: string;
	/** 欠费金额 */
	arrears_amount?: number;
	/** 催缴方式 */
	collection_method?: string;
	/** 催缴内容 */
	collection_content?: string;
	/** 预期缴费时间 */
	expected_payment_time?: string;
	/** 催缴备注 */
	collection_remark?: string;
}

/**
 * 删除催缴参数
 */
export interface DeleteCollectionParams {
	/** 催缴ID */
	collection_id: string;
}

/**
 * 导出催缴参数
 */
export interface ExportCollectionParams {
	/** 业主姓名 */
	owner_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 催缴类型 */
	collection_type?: string;
	/** 催缴状态 */
	collection_status?: string;
	/** 催缴开始时间 */
	collection_start_time?: string;
	/** 催缴结束时间 */
	collection_end_time?: string;
}

/**
 * 催缴数据模型
 */
export interface CollectionDataModel {
	/** 催缴ID */
	collection_id?: string;
	/** 业主姓名 */
	owner_name?: string;
	/** 业主电话 */
	owner_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 房屋地址 */
	room_address?: string;
	/** 欠费项目 */
	arrears_items?: string;
	/** 欠费金额 */
	arrears_amount?: number;
	/** 催缴类型 */
	collection_type?: string;
	/** 催缴方式 */
	collection_method?: string;
	/** 催缴内容 */
	collection_content?: string;
	/** 催缴时间 */
	collection_time?: string;
	/** 催缴人 */
	collector?: string;
	/** 催缴状态 */
	collection_status?: string;
	/** 预期缴费时间 */
	expected_payment_time?: string;
	/** 实际缴费时间 */
	actual_payment_time?: string;
	/** 催缴备注 */
	collection_remark?: string;
	/** 创建时间 */
	create_time?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取催缴列表(条件+分页)
 */
export function getCollectionList<T = PageDTO<CollectionDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCollectionListParams>({
		url: "/c5-collection/list",
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
 * 催缴登记
 */
export function registerCollection<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CollectionRegisterParams>({
		url: "/c5-collection/register",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 新增催缴
 */
export function addCollection<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddCollectionParams>({
		url: "/c5-collection/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 删除催缴
 */
export function deleteCollection<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteCollectionParams>({
		url: "/c5-collection/delete",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				collection_id: "",
			},
		},
		options,
	});
}

/**
 * 导出催缴
 */
export function exportCollection<T = ArrayBuffer>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ExportCollectionParams>({
		url: "/c5-collection/export",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
			responseType: "blob",
		},
		options,
	});
}
