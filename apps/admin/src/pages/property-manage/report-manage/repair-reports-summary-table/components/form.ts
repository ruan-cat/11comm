/**
 * @file 报修汇总表表单类型
 * @description Repair reports summary table form types
 */

import type { RepairReportsSummaryTableListItem } from "@01s-11comm/type";

/**
 * 报修汇总表表单数据
 * Repair reports summary table form data
 */
export interface RepairReportsSummaryTableFormData extends Partial<RepairReportsSummaryTableListItem> {
	/** 报修类型 Repair type */
	repairType?: string;
	/** 报修状态 Repair status */
	repairStatus?: string;
	/** 紧急程度 Urgency level */
	urgencyLevel?: string;
	/** 小区 Community */
	community?: string;
	/** 统计开始时间 Statistics start time */
	statisticsStartTime?: string;
	/** 统计结束时间 Statistics end time */
	statisticsEndTime?: string;
}

/**
 * 报修汇总表表单验证规则
 * Repair reports summary table form validation rules
 */
export const repairReportsSummaryTableFormRules = {
	repairType: [{ required: true, message: "请选择报修类型", trigger: "change" }],
	repairStatus: [{ required: true, message: "请选择报修状态", trigger: "change" }],
	urgencyLevel: [{ required: true, message: "请选择紧急程度", trigger: "change" }],
	community: [{ required: true, message: "请选择小区", trigger: "change" }],
	statisticsStartTime: [{ required: true, message: "请选择统计开始时间", trigger: "change" }],
	statisticsEndTime: [{ required: true, message: "请选择统计结束时间", trigger: "change" }],
};
