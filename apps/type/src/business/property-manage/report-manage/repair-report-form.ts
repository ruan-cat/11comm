import type { OptionsType } from "../../../common";

/**
 * @description repair-report-form列表数据
 * RepairReportForm list item
 */
export interface RepairReportFormListItem {
	/** ID */
	id: string;
	/** 小区 Community */
	community: string;
	/** 报修单号 Repair order number */
	repairOrderNumber: string;
	/** 报修类型 Repair type */
	repairType: string;
	/** 紧急程度 Urgency level */
	urgencyLevel: string;
	/** 报修人 Reporter */
	reporter: string;
	/** 报修电话 Reporter phone */
	reporterPhone: string;
	/** 报修地址 Repair address */
	repairAddress: string;
	/** 报修时间 Report time */
	reportTime: string;
	/** 受理人 Handler */
	handler: string;
	/** 处理人 Processor */
	processor: string;
	/** 费用状态 Fee status */
	feeStatus: string;
	/** 报修状态 Repair status */
	repairStatus: string;
}

/**
 * @description repair-report-form列表查询参数
 * RepairReportForm list query parameters
 */
export interface RepairReportFormQueryParams {
	/** 报修类型 Repair type */
	repairType?: string;
	/** 报修状态 Repair status */
	repairStatus?: string;
	/** 紧急程度 Urgency level */
	urgencyLevel?: string;
	/** 报修人 Reporter */
	reporter?: string;
	/** 报修电话 Reporter phone */
	reporterPhone?: string;
	/** 小区 Community */
	community?: string;
	/** 报修时间开始 Report time start */
	reportTimeStart?: string;
	/** 报修时间结束 Report time end */
	reportTimeEnd?: string;
	/** 费用状态 Fee status */
	feeStatus?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
