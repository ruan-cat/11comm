import type { OptionsType } from "../../../common";

/**
 * @description outstanding-fees-analysis列表数据
 * OutstandingFeesAnalysis list item
 */
export interface OutstandingFeesAnalysisListItem {
	/** ID */
	id: string;
	/** 小区 Community */
	community: string;
	/** 楼栋 Building */
	building: string;
	/** 单元 Unit */
	unit: string;
	/** 房屋编号/合同名称 House number/Contract name */
	houseNumberContractName: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 业主手机号 Owner phone */
	ownerPhone: string;
	/** 费用项 Fee item */
	feeItem: string;
	/** 总未收金额 Total uncollected amount */
	totalUncollectedAmount: string;
	/** 当期未收金额 Current uncollected amount */
	currentUncollectedAmount: string;
	/** 历史未收金额 Historical uncollected amount */
	historicalUncollectedAmount: string;
	/** 最近应收月份 Latest receivable month */
	latestReceivableMonth: string;
	/** 统计时间 Statistics time */
	statisticsTime: string;
}

/**
 * @description outstanding-fees-analysis列表查询参数
 * OutstandingFeesAnalysis list query parameters
 */
export interface OutstandingFeesAnalysisQueryParams {
	/** 房屋编号/合同名称 House number/Contract name */
	houseNumberContractName?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 业主手机号 Owner phone */
	ownerPhone?: string;
	/** 费用项 Fee item */
	feeItem?: string;
	/** 小区 Community */
	community?: string;
	/** 楼栋 Building */
	building?: string;
	/** 单元 Unit */
	unit?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
