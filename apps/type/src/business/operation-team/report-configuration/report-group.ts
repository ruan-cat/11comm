import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 报表组
 */
export interface ReportGroup {
	/** 组ID */
	id: string;
	/** 组名称 */
	groupName: string;
	/** 组编码 */
	groupCode: string;
	/** 组描述 */
	description: string;
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
export interface ReportGroupListQuery extends BaseListQueryParams {
	/** 组名称 */
	groupName?: string;
	/** 组编码 */
	groupCode?: string;
	/** 是否启用 */
	isEnabled?: boolean;
}

/**
 * 启用状态选项
 */
export const reportGroupEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];
