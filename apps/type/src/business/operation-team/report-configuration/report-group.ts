import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 报表组列表项
 */
export interface ReportGroupListItem {
	/** 组ID */
	id: string;
	/** 组名称 */
	name: string;
	/** 组编码 */
	groupCode: string;
	/** 组描述 */
	description: string;
	/** URL */
	url: string;
	/** 备注 */
	remark: string;
	/** 排序号 */
	sortOrder: number;
	/** 是否启用 */
	isEnabled: boolean;
	/** 报表数量 */
	reportCount: number;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 报表组列表查询参数
 */
export interface ReportGroupQueryParams extends BaseListQueryParams {
	/** 组名称 */
	groupName?: string;
	/** 组编码 */
	groupCode?: string;
	/** 是否启用 */
	isEnabled?: boolean;
}

/**
 * 报表组
 * @deprecated 请使用 ReportGroupListItem
 */
export interface ReportGroup extends ReportGroupListItem {}

/**
 * 报表组列表查询参数
 * @deprecated 请使用 ReportGroupQueryParams
 */
export interface ReportGroupListQuery extends ReportGroupQueryParams {}

/**
 * 启用状态选项
 */
export const reportGroupEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];

/**
 * 报表组类型
 */
export type ReportGroupType = "groupName" | "groupUrl" | "description";

/**
 * 报表组表单 VO
 */
export interface ReportGroupFormVO {
	groupName: string;
	groupUrl: string;
	description: string;
}
