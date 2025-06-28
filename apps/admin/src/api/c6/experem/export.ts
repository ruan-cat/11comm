import { useRequest } from "@/composables/use-request";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";

/** 导出到期费用提醒参数 */
export interface OverExperemExportParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 房屋编号/合同 */
	BuildingNo?: string;
	/** 业主名称 */
	Name?: string;
	/** 业主手机号 */
	Telephone?: string;
	/** 费用项 */
	Expenses?: string;
	/** 导出文件名 */
	FileName: string;
}

/** 导出预缴费用提醒参数 */
export interface PreExperemExportParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 房屋编号/合同名称 */
	objName?: string;
	/** 业主名称 */
	ownerName?: string;
	/** 业主手机号 */
	link?: string;
	/** 费用项 */
	feeName?: string;
}

/**
 * 导出到期费用提醒
 * @description 导出到期费用提醒
 */
export function exportOverExperem(params: OverExperemExportParams) {
	return useRequest<ParamsQueryKey, void, OverExperemExportParams>({
		url: "/c6-repomanage/experem/overExperemExport",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: params,
			responseType: "blob",
		},
	});
}

/**
 * 导出预缴费用提醒
 * @description 导出预缴费用提醒
 */
export function exportPreExperem(params: PreExperemExportParams) {
	return useRequest<ParamsQueryKey, void, PreExperemExportParams>({
		url: "/c6-repomanage/experem/preExperemExport",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: params,
			responseType: "blob",
		},
	});
}

