import { useRequest } from "@/composables/use-request";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";

// ==================== 预缴费用提醒列表 ====================

/** 预缴费用提醒列表查询参数 */
export interface PreExperemQueryParams {
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

/** 预缴费用提醒数据项 */
export interface ExpeRemDTO {
	/** 费用编号 */
	feeId: string;
	/** 房号/车辆/合同 */
	payerObjType: string;
	/** 费用项 */
	feeName: string;
	/** 费用开始时间 */
	startTime: string;
	/** 距离费用开始时间（天） */
	endTime: number;
}

/** 预缴费用提醒分页数据 */
export interface ExpeRemPageDTO {
	/** 当前页码 */
	pageIndex: number;
	/** 每页数据条数 */
	pageSize: number;
	/** 数据的总条数 */
	total: number;
	/** 数据的总页数 */
	pages: number;
	/** 当前页数据列表 */
	rows: ExpeRemDTO[];
}

/** 预缴费用提醒接口响应 */
export interface ExpeRemPageJsonVO {
	/** 状态码 */
	code: number;
	/** 提示信息 */
	message: string;
	/** 数据对象 */
	data: ExpeRemPageDTO;
}

/**
 * 获取预缴费用提醒列表
 * @description 获取预缴费用提醒列表（条件+分页）
 */
export function queryPreExperemList(params?: PreExperemQueryParams) {
	return useRequest<ParamsQueryKey, ExpeRemPageJsonVO, PreExperemQueryParams>({
		url: "/c6-repomanage/experem/preExperemQuery",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: params || {
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

// ==================== 到期费用提醒列表 ====================

/** 到期费用提醒列表查询参数 */
export interface OverExperemQueryParams {
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
}

/** 到期费用提醒数据项 */
export interface OverExpeRemDTO {
	/** 费用ID */
	Feeid: string;
	/** 房屋编号/合同 */
	BuildingNo: string;
	/** 费用项 */
	Expenses: string;
	/** 结束时间 */
	EndTime: string;
	/** 剩余时间 */
	RemainingTime: string;
}

/** 分页数据对象 */
export interface OverExpeRemPageDTO {
	/** 当前页码 */
	pageIndex: number;
	/** 每页数据条数 */
	pageSize: number;
	/** 数据的总条数 */
	total: number;
	/** 数据的总页数 */
	pages: number;
	/** 当前页数据列表 */
	rows: OverExpeRemDTO[];
}

/** 接口响应 */
export interface OverExpeRemPageJsonVO {
	/** 状态码 */
	code: number;
	/** 提示信息 */
	message: string;
	/** 数据对象 */
	data: OverExpeRemPageDTO;
}

/**
 * 获取到期费用提醒列表
 * @description 获取到期费用提醒列表（条件+分页）
 */
export function queryOverExperemList(params: OverExperemQueryParams) {
	return useRequest<ParamsQueryKey, OverExpeRemPageJsonVO, OverExperemQueryParams>({
		url: "/c6-repomanage/experem/overExperemQuery",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: params,
		},
	});
}

