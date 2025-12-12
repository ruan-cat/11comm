/**
 * @description 报表信息列表数据
 * Report info list item
 */
export interface ReportInfoListItem {
	/** 报表编号 Report ID */
	reportId: string;
	/** 报表组 Report group */
	reportGroup: string;
	/** 选项标题 Option title */
	optionTitle: string;
	/** 排序 Sort order */
	sortOrder: string;
	/** 描述 Description */
	description: string;
}

/**
 * @description 报表信息列表查询参数
 * Report info list query parameters
 */
export interface ReportInfoQueryParams {
	/** 报表编号 Report ID */
	reportId?: string;
	/** 报表组 Report group */
	reportGroup?: string;
	/** 选项标题 Option title */
	optionTitle?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

