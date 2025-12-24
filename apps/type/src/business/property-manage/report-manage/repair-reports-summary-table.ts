/**
 * @file 报修汇总表类型定义
 * @description Repair reports summary table types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";
import {
	repairStatusOptions as commonRepairStatusOptions,
	repairTypeOptions as commonRepairTypeOptions,
	urgencyLevelOptions,
	communityOptions,
} from "../../../common/business-options";

// 重导出通用选项
export { urgencyLevelOptions, communityOptions };
// 重导出通用报修选项（用于页面）
export { commonRepairTypeOptions as repairTypeOptions, commonRepairStatusOptions as repairStatusOptions };

/**
 * 报修汇总表列表数据
 * Repair reports summary table list item
 */
export interface RepairReportsSummaryTableListItem {
	/** ID */
	id: string;
	/** 小区 Community */
	community: string;
	/** 报修类型 Repair type */
	repairType: string;
	/** 报修数量 Repair count */
	repairCount: number;
	/** 处理中 Processing count */
	processingCount: number;
	/** 已完成 Completed count */
	completedCount: number;
	/** 未完成 Unfinished count */
	unfinishedCount: number;
	/** 待回访 Pending revisit count */
	pendingRevisitCount: number;
	/** 不满意 Dissatisfied count */
	dissatisfiedCount: number;
	/** 紧急工单 Emergency work order count */
	emergencyCount: number;
	/** 统计时间 Statistics time */
	statisticsTime: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * 报修汇总表查询参数
 * Repair reports summary table query parameters
 */
export interface RepairReportsSummaryTableQueryParams extends BaseListQueryParams {
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
 * 报修汇总表报修类型选项
 * Repair reports summary table repair type options
 */
export const summaryRepairTypeOptions: OptionsType = [
	{ label: "水电维修", value: "水电维修" },
	{ label: "电梯维修", value: "电梯维修" },
	{ label: "门禁维修", value: "门禁维修" },
	{ label: "消防维修", value: "消防维修" },
	{ label: "保洁维修", value: "保洁维修" },
	{ label: "绿化维修", value: "绿化维修" },
	{ label: "其他维修", value: "其他维修" },
];

/**
 * 报修汇总表报修状态选项
 * Repair reports summary table repair status options
 */
export const summaryRepairStatusOptions: OptionsType = [
	{ label: "待处理", value: "待处理" },
	{ label: "处理中", value: "处理中" },
	{ label: "已完成", value: "已完成" },
	{ label: "已关闭", value: "已关闭" },
];

/**
 * 报修汇总表表单数据
 * Repair reports summary table form data
 */
export interface RepairReportsSummaryTableFormData extends Record<string, any> {
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
 * 报修汇总表表单属性
 * Repair reports summary table form props
 */
export interface RepairReportsSummaryTableFormProps {
	/** 表单数据 Form data */
	form: RepairReportsSummaryTableFormData;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: RepairReportsSummaryTableFormData;
	/** 表单模式 Form mode */
	mode?: "add" | "edit" | "info";
}
