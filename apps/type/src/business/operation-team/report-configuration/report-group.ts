/**
 * @description 报表组列表数据
 * Report group list item
 */
export interface ReportGroupListItem {
	/** 组ID Group ID */
	groupId: string;
	/** 名称 Name */
	name: string;
	/** URL URL */
	url: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 报表组列表查询参数
 * Report group list query parameters
 */
export interface ReportGroupQueryParams {
	/** 组ID Group ID */
	groupId?: string;
	/** 名称 Name */
	name?: string;
	/** URL URL */
	url?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

