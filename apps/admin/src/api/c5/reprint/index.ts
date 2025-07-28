import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 查询补打凭据列表查询参数
 */
export interface QueryReprintVoucherListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主姓名 */
	owner_name?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 凭据类型 */
	voucher_type?: string;
	/** 缴费开始时间 */
	payment_start_time?: string;
	/** 缴费结束时间 */
	payment_end_time?: string;
	/** 凭据状态 */
	voucher_status?: string;
}

/**
 * 打印收据参数
 */
export interface PrintReceiptParams {
	/** 缴费记录ID */
	payment_record_id?: string;
	/** 收据编号 */
	receipt_number?: string;
	/** 打印类型 */
	print_type?: string;
}

/**
 * 打印小票参数
 */
export interface PrintTicketParams {
	/** 缴费记录ID */
	payment_record_id?: string;
	/** 小票编号 */
	ticket_number?: string;
	/** 打印类型 */
	print_type?: string;
}

/**
 * 补打凭据数据模型
 */
export interface ReprintVoucherDataModel {
	/** 凭据ID */
	voucher_id?: string;
	/** 业主姓名 */
	owner_name?: string;
	/** 业主电话 */
	owner_phone?: string;
	/** 房屋编号 */
	room_number?: string;
	/** 房屋地址 */
	room_address?: string;
	/** 缴费记录ID */
	payment_record_id?: string;
	/** 凭据类型 */
	voucher_type?: string;
	/** 凭据编号 */
	voucher_number?: string;
	/** 费用项目 */
	fee_items?: string;
	/** 缴费金额 */
	payment_amount?: number;
	/** 缴费方式 */
	payment_method?: string;
	/** 缴费时间 */
	payment_time?: string;
	/** 收银员 */
	cashier?: string;
	/** 凭据状态 */
	voucher_status?: string;
	/** 原始打印时间 */
	original_print_time?: string;
	/** 补打次数 */
	reprint_count?: number;
	/** 最后补打时间 */
	last_reprint_time?: string;
	/** 补打原因 */
	reprint_reason?: string;
	/** 创建时间 */
	create_time?: string;
}

// ==================== 接口函数 ====================

/**
 * 查询补打凭据列表(条件+分页)
 */
export function queryReprintVoucherList<T = PageDTO<ReprintVoucherDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryReprintVoucherListParams>({
		url: "/c5-reprint/voucher-list",
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
 * 打印收据
 */
export function printReceipt<T = ArrayBuffer>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, PrintReceiptParams>({
		url: "/c5-reprint/print-receipt",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
			responseType: "blob",
		},
		options,
	});
}

/**
 * 打印小票
 */
export function printTicket<T = ArrayBuffer>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, PrintTicketParams>({
		url: "/c5-reprint/print-ticket",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
			responseType: "blob",
		},
		options,
	});
}
