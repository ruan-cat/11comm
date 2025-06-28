import { useRequest } from "@/composables/use-request";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";

/** 报修汇总列表查询参数 */
export interface RepairReportSummaryQueryParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 创建开始时间 */
	createStartTime?: string;
	/** 创建结束时间 */
	createEndTime?: string;
	/** 完结开始时间 */
	finishStartTime?: string;
	/** 完结结束时间 */
	finishEndTime?: string;
	/** 选择小区 */
	communityName?: string;
	/** 选择员工姓名 */
	staffName?: string;
	/** 选择状态 */
	state?: string;
}

/** 报修汇总列表项 */
export interface RepairReportSummaryDTO {
	/** 报修编号 */
	summaryId: number;
	/** 员工ID */
	staffId: string;
	/** 员工姓名 */
	staffName: string;
	/** 处理中(条) */
	deal: number;
	/** 派单(条) */
	sendList: number;
	/** 转单(条) */
	transferList: number;
	/** 退单(条) */
	chargeback: number;
	/** 已回访(条) */
	returnVisit: number;
	/** 已完结(条) */
	finish: number;
	/** 员工评分 */
	examineValue: string;
}

/** 报修汇总列表分页数据 */
export interface RepairReportSummaryPageDTO {
	/** 当前页码 */
	pageIndex: number;
	/** 每页数据条数 */
	pageSize: number;
	/** 数据的总条数 */
	total: number;
	/** 数据的总页数 */
	pages: number;
	/** 当前页数据列表 */
	rows: RepairReportSummaryDTO[];
}

/** 报修汇总列表响应 */
export interface RepairReportSummaryResponse {
	/** 状态码 */
	code: number;
	/** 提示信息 */
	message: string;
	/** 数据对象 */
	data: RepairReportSummaryPageDTO;
}

/**
 * 获取报修汇总列表
 * @description 获取报修汇总列表
 */
export function queryRepairReportSummary(params: RepairReportSummaryQueryParams) {
	return useRequest<ParamsQueryKey, RepairReportSummaryResponse, RepairReportSummaryQueryParams>({
		url: "/c7-repomanage/repair-report-summary/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: params,
		},
	});
} 