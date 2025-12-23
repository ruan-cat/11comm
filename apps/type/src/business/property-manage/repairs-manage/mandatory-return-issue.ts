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
