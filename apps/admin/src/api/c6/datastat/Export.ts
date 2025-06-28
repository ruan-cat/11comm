import { useRequest } from "@/composables/use-request";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { JsonVO } from "@/composables/use-request/useRequestIn01s/types/JsonVO";

/** 欠费明细导出查询参数 */
export interface FeeDetailExportQueryParams {
	pageIndex: number;
	pageSize: number;
	room_name?: string;
	name?: string;
	link?: string;
}

/** 收缴情况导出查询参数 */
export interface ChargeDetailExportQueryParams {
	pageIndex: number;
	pageSize: number;
	fee_name: string;
}

/** 月度明细导出查询参数 */
export interface MonthDetailExportQueryParams {
	startDate?: string;
	endDate?: string;
	communityId: string;
	communityName?: string;
	exportType: 1 | 2;
}

/** 收款统计导出查询参数 */
export interface ReceiptsExportQueryParams {
	startDate?: string;
	endDate?: string;
	communityId: string;
	communityName?: string;
}

/** 收款明细导出查询参数 */
export interface ReceiptsDetailExportQueryParams {
	startDate?: string;
	endDate?: string;
	communityId: string;
	communityName?: string;
}

/** 缴费方式统计导出查询参数 */
export interface MethodExportQueryParams {
	startDate?: string;
	endDate?: string;
	communityId: string;
	communityName?: string;
}

/** 月欠费明细查询参数 */
export interface MonthFeeQueryParams {
	pageIndex: number;
	pageSize: number;
	fee_name: string;
	building?: string;
	start_time?: string;
	end_time?: string;
}

/**
 * 欠费明细导出接口
 */
export function exportFeeDetail<T = void>(
	params: FeeDetailExportQueryParams,
	options?: UseAxiosOptionsJsonVO<T>
) {
	return useRequest<ParamsQueryKey, T, FeeDetailExportQueryParams>({
		url: "/c6-repomanage/datastat/feeDetaileExport",
		httpParamWay: "query",
		config: { 
			method: "GET",
			params: params,
			responseType: "blob",
		},
		options,
	});
}

/**
 * 收缴情况导出接口
 */
export function exportChargeDetail<T = void>(
	params: ChargeDetailExportQueryParams,
	options?: UseAxiosOptionsJsonVO<T>
) {
	return useRequest<ParamsQueryKey, T, ChargeDetailExportQueryParams>({
		url: "/c6-repomanage/datastat/chargeDetaileExport",
		httpParamWay: "query",
		config: { 
			method: "GET",
			params: params,
			responseType: "blob",
		},
		options,
	});
}

/**
 * 月度明细导出接口
 */
export function exportMonthDetail<T = void>(
	params: MonthDetailExportQueryParams,
	options?: UseAxiosOptionsJsonVO<T>
) {
	return useRequest<ParamsQueryKey, T, MonthDetailExportQueryParams>({
		url: "/c6-repomanage/datastat/monthDetaileExport",
		httpParamWay: "query",
		config: { 
			method: "GET",
			params: params,
			responseType: "blob",
		},
		options,
	});
}

/**
 * 收款统计导出接口
 */
export function exportReceiptsStat<T = void>(
	params: ReceiptsExportQueryParams,
	options?: UseAxiosOptionsJsonVO<T>
) {
	return useRequest<ParamsQueryKey, T, ReceiptsExportQueryParams>({
		url: "/c6-repomanage/datastat/receiptsExport",
		httpParamWay: "query",
		config: { 
			method: "GET",
			params: params,
			responseType: "blob",
		},
		options,
	});
}

/**
 * 收款明细导出接口
 */
export function exportReceiptsDetail<T = void>(
	params: ReceiptsDetailExportQueryParams,
	options?: UseAxiosOptionsJsonVO<T>
) {
	return useRequest<ParamsQueryKey, T, ReceiptsDetailExportQueryParams>({
		url: "/c6-repomanage/datastat/receiptsDetailExport",
		httpParamWay: "query",
		config: { 
			method: "GET",
			params: params,
			responseType: "blob",
		},
		options,
	});
}

/**
 * 缴费方式统计导出接口
 */
export function exportPaymentMethod<T = void>(
	params: MethodExportQueryParams,
	options?: UseAxiosOptionsJsonVO<T>
) {
	return useRequest<ParamsQueryKey, T, MethodExportQueryParams>({
		url: "/c6-repomanage/datastat/methodExport",
		httpParamWay: "query",
		config: { 
			method: "GET",
			params: params,
			responseType: "blob",
		},
		options,
	});
}

/**
 * 导出欠费统计
 */
export function exportArrearsStat<T = void>(
	options?: UseAxiosOptionsJsonVO<T>
) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/c6-repomanage/datastat/arrearsExport",
		httpParamWay: "query",
		config: { 
			method: "GET",
			params: {},
			responseType: "blob",
		},
		options,
	});
}

/**
 * 导出月欠费明细
 */
export function exportMonthFee<T = void>(
	params: MonthFeeQueryParams,
	options?: UseAxiosOptionsJsonVO<T>
) {
	return useRequest<ParamsQueryKey, T, MonthFeeQueryParams>({
		url: "/c6-repomanage/datastat/monthFeeExport",
		httpParamWay: "query",
		config: { 
			method: "GET",
			params: params,
			responseType: "blob",
		},
		options,
	});
}