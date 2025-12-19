import type { OptionsType } from "../../../common";
import { repairStatusOptions, repairSourceOptions } from "../../../common/business-options";


/**
 * @description mandatory-return-issue列表数据
 * MandatoryReturnIssue list item
 */
export interface MandatoryReturnIssueListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description mandatory-return-issue列表查询参数
 * MandatoryReturnIssue list query parameters
 */
export interface MandatoryReturnIssueQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const mandatoryReturnIssueStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 强制退单列表数据 (向后兼容)
 * Mandatory return issue list data (backward compatibility)
 */
export interface 强制退单_列表数据 extends MandatoryReturnIssueListItem {
	/** 工单编号 */
	工单编号: string;
	/** 位置 */
	位置: string;
	/** 报修类型 */
	报修类型: string;
	/** 维修类型 */
	维修类型: string;
	/** 报修人 */
	报修人: string;
	/** 联系方式 */
	联系方式: string;
	/** 预约时间 */
	预约时间: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}

/**
 * @description 强制退单搜索 VO (向后兼容)
 * Mandatory return issue search VO (backward compatibility)
 */
export interface 强制退单_搜索_VO extends MandatoryReturnIssueQueryParams {}
