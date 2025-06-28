import { useRequest } from "@/composables/use-request";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";

/** 业主费用明细导出参数 */
export interface OwnerFeeDetaileExportParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主姓名 */
	name?: string;
	/** 房间号 */
	room_name?: string;
	/** 手机号 */
	link?: string;
}

/** 合同费用明细导出参数 */
export interface ContractFeeDetaileExportParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 合同编号 */
	contract_name?: string;
	/** 业主姓名 */
	name?: string;
	/** 手机号 */
	link?: string;
}

/** 房屋费用明细导出参数 */
export interface BuildingFeeDetaileExportParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 房屋编号 */
	room_name?: string;
	/** 业主姓名 */
	name?: string;
	/** 手机号 */
	link?: string;
}

/**
 * 导出业主费用明细接口
 * @description 导出业主费用明细信息
 */
export function exportOwnerFeeDetaile(params?: OwnerFeeDetaileExportParams) {
	return useRequest<ParamsQueryKey, void, OwnerFeeDetaileExportParams>({
		url: "/c6-repomanage/expedet/ownerFeeDetaileExport",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: params || {
				pageIndex: 1,
				pageSize: 10,
			},
			responseType: "blob",
		},
	});
}

/**
 * 导出合同费用明细接口
 * @description 导出合同费用明细信息
 */
export function exportContractFeeDetaile(params?: ContractFeeDetaileExportParams) {
	return useRequest<ParamsQueryKey, void, ContractFeeDetaileExportParams>({
		url: "/c6-repomanage/expedet/contractFeeDetaileExport",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: params || {
				pageIndex: 1,
				pageSize: 10,
			},
			responseType: "blob",
		},
	});
}

/**
 * 导出房屋费用明细接口
 * @description 导出房屋费用明细信息
 */
export function exportBuildingFeeDetaile(params?: BuildingFeeDetaileExportParams) {
	return useRequest<ParamsQueryKey, void, BuildingFeeDetaileExportParams>({
		url: "/c6-repomanage/expedet/buildingFeeDetaileExport",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: params || {
				pageIndex: 1,
				pageSize: 10,
			},
			responseType: "blob",
		},
	});
} 