import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 报表信息列表项
 */
export interface ReportInfoListItem {
	/** 报表ID */
	id: string;
	/** 报表名称 */
	reportName: string;
	/** 报表编码 */
	reportCode: string;
	/** 所属组ID */
	groupId: string;
	/** 所属组名称 */
	groupName: string;
	/** 报表类型 */
	reportType: string;
	/** 数据源 */
	dataSource: string;
	/** SQL查询语句 */
	sqlQuery: string;
	/** 报表描述 */
	description: string;
	/** 字段配置 */
	fieldConfig: string;
	/** 参数配置 */
	parameterConfig: string;
	/** 是否缓存 */
	isCache: boolean;
	/** 缓存时长（秒） */
	cacheDuration: number;
	/** 是否启用 */
	isEnabled: boolean;
	/** 排序号 */
	sortOrder: number;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 报表信息列表查询参数
 */
export interface ReportInfoQueryParams extends BaseListQueryParams {
	/** 报表名称 */
	reportName?: string;
	/** 报表编码 */
	reportCode?: string;
	/** 所属组ID */
	groupId?: string;
	/** 报表类型 */
	reportType?: string;
	/** 数据源 */
	dataSource?: string;
	/** 是否启用 */
	isEnabled?: boolean;
}

/**
 * 报表信息
 * @deprecated 请使用 ReportInfoListItem
 */
export interface ReportInfo extends ReportInfoListItem {}

/**
 * 报表信息列表查询参数
 * @deprecated 请使用 ReportInfoQueryParams
 */
export interface ReportInfoListQuery extends ReportInfoQueryParams {}

/**
 * 报表类型选项
 */
export const reportInfoTypeOptions: OptionsType = [
	{ label: "统计报表", value: "统计报表" },
	{ label: "明细报表", value: "明细报表" },
	{ label: "汇总报表", value: "汇总报表" },
	{ label: "图表报表", value: "图表报表" },
	{ label: "复合报表", value: "复合报表" },
];

/**
 * 数据源选项
 */
export const reportInfoDataSourceOptions: OptionsType = [
	{ label: "主数据库", value: "主数据库" },
	{ label: "从数据库", value: "从数据库" },
	{ label: "Redis缓存", value: "Redis缓存" },
	{ label: "第三方API", value: "第三方API" },
	{ label: "文件数据", value: "文件数据" },
];

/**
 * 启用状态选项
 */
export const reportInfoEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];
