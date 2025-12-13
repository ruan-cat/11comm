import type { OptionsType } from "../../../common";

/**
 * @description my列表数据
 * My list item
 */
export interface MyListItem {
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
 * @description my列表查询参数
 * My list query parameters
 */
export interface MyQueryParams {
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
export const myStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 中文名称导出 ====================

/** 省份选项（中文名称） */
export const 省份选项: OptionsType = [
	{ label: "北京市", value: "北京市" },
	{ label: "上海市", value: "上海市" },
	{ label: "广东省", value: "广东省" },
	{ label: "江苏省", value: "江苏省" },
	{ label: "浙江省", value: "浙江省" },
];

/** 小区状态选项（中文名称） */
export const 小区状态选项 = myStatusOptions;
