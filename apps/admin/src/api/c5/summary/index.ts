import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取费用汇总列表查询参数
 */
export interface QueryFeeSummaryListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区ID */
	community_id?: string;
	/** 楼栋编号 */
	building_number?: string;
	/** 费用类型 */
	fee_type?: string;
	/** 统计周期 */
	statistics_period?: string;
	/** 统计开始时间 */
	statistics_start_time?: string;
	/** 统计结束时间 */
	statistics_end_time?: string;
}

/**
 * 费用汇总数据模型
 */
export interface FeeSummaryDataModel {
	/** 汇总ID */
	summary_id?: string;
	/** 小区ID */
	community_id?: string;
	/** 小区名称 */
	community_name?: string;
	/** 楼栋编号 */
	building_number?: string;
	/** 费用类型 */
	fee_type?: string;
	/** 费用名称 */
	fee_name?: string;
	/** 统计周期 */
	statistics_period?: string;
	/** 应收总金额 */
	total_receivable_amount?: number;
	/** 实收总金额 */
	total_received_amount?: number;
	/** 欠费总金额 */
	total_arrears_amount?: number;
	/** 退费总金额 */
	total_refund_amount?: number;
	/** 减免总金额 */
	total_discount_amount?: number;
	/** 应收户数 */
	receivable_households?: number;
	/** 实收户数 */
	received_households?: number;
	/** 欠费户数 */
	arrears_households?: number;
	/** 收费率 */
	collection_rate?: number;
	/** 统计时间 */
	statistics_time?: string;
	/** 统计人员 */
	statistician?: string;
	/** 备注 */
	remark?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取费用汇总列表(条件+分页)
 */
export function getFeeSummaryList<T = PageDTO<FeeSummaryDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryFeeSummaryListParams>({
		url: "/c5-summary/list",
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
