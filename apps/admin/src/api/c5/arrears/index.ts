import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取欠费列表查询参数
 */
export interface QueryArrearsListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主姓名 */
	owner_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 欠费类型 */
	arrears_type?: string;
	/** 欠费状态 */
	arrears_status?: string;
	/** 欠费开始时间 */
	arrears_start_time?: string;
	/** 欠费结束时间 */
	arrears_end_time?: string;
	/** 最小欠费金额 */
	min_arrears_amount?: number;
	/** 最大欠费金额 */
	max_arrears_amount?: number;
}

/**
 * 导出欠费列表参数
 */
export interface ExportArrearsListParams {
	/** 业主姓名 */
	owner_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 欠费类型 */
	arrears_type?: string;
	/** 欠费状态 */
	arrears_status?: string;
	/** 欠费开始时间 */
	arrears_start_time?: string;
	/** 欠费结束时间 */
	arrears_end_time?: string;
	/** 最小欠费金额 */
	min_arrears_amount?: number;
	/** 最大欠费金额 */
	max_arrears_amount?: number;
}

/**
 * 欠费数据模型
 */
export interface ArrearsDataModel {
	/** 欠费ID */
	arrears_id?: string;
	/** 业主姓名 */
	owner_name?: string;
	/** 业主电话 */
	owner_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 房屋地址 */
	room_address?: string;
	/** 欠费类型 */
	arrears_type?: string;
	/** 费用项目 */
	fee_items?: string;
	/** 欠费金额 */
	arrears_amount?: number;
	/** 应缴金额 */
	should_pay_amount?: number;
	/** 已缴金额 */
	paid_amount?: number;
	/** 欠费期间 */
	arrears_period?: string;
	/** 欠费开始时间 */
	arrears_start_time?: string;
	/** 欠费结束时间 */
	arrears_end_time?: string;
	/** 欠费天数 */
	arrears_days?: number;
	/** 滞纳金 */
	late_fee?: number;
	/** 欠费状态 */
	arrears_status?: string;
	/** 最后催缴时间 */
	last_collection_time?: string;
	/** 催缴次数 */
	collection_count?: number;
	/** 备注 */
	remark?: string;
	/** 创建时间 */
	create_time?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取欠费列表(条件+分页)
 */
export function getArrearsList<T = PageDTO<ArrearsDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryArrearsListParams>({
		url: "/c5-arrears/list",
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
 * 导出欠费列表
 */
export function exportArrearsList<T = ArrayBuffer>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ExportArrearsListParams>({
		url: "/c5-arrears/export",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
			responseType: "blob",
		},
		options,
	});
}
