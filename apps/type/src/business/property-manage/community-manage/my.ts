import type { OptionsType } from "../../../common";

/**
 * @description 我的小区列表数据项
 * My community list item
 */
export interface MyCommunityListItem {
	/** ID */
	id: string;
	/** 省份 Province */
	province: string;
	/** 市州 City */
	city: string;
	/** 区县 District */
	district: string;
	/** 小区名称 Community name */
	communityName: string;
	/** 小区编码 Community code */
	communityCode: string;
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
 * @description 我的小区列表查询参数
 * My community list query parameters
 */
export interface MyCommunityQueryParams {
	/** 省份 Province */
	province?: string;
	/** 市州 City */
	city?: string;
	/** 区县 District */
	district?: string;
	/** 小区名称 Community name */
	communityName?: string;
	/** 小区编码 Community code */
	communityCode?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
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


// ==================== 兼容旧类型定义 ====================

/**
 * @description MyCommunityTableRow 表格行数据类型（兼容性）
 * My community table row data type (for compatibility)
 */
export type MyCommunityTableRow = MyCommunityListItem;

/**
 * @description 我的小区_列表查询_VO 类型（兼容性）
 * My community list query VO type (for compatibility)
 */
export type 我的小区_列表查询_VO = MyCommunityQueryParams;

/**
 * @description 我的小区_列表Data 类型（兼容性）
 * My community list data type (for compatibility)
 */
export type 我的小区_列表Data = MyCommunityListItem[];

// ==================== 中文字段映射 ====================

/**
 * @description 我的小区数据项（中文字段映射）
 * My community item with Chinese field mapping
 */
export interface 我的小区数据项中文 extends MyCommunityListItem {
	/** 省份（中文字段名） */
	省份: string;
	/** 市州（中文字段名） */
	市州: string;
	/** 区县（中文字段名） */
	区县: string;
	/** 小区名称（中文字段名） */
	小区名称: string;
	/** 小区编码（中文字段名） */
	小区编码: string;
	/** 客服电话（中文字段名） */
	客服电话: string;
	/** 面积（中文字段名） */
	面积: string;
	/** 开始时间（中文字段名） */
	开始时间: string;
	/** 结束时间（中文字段名） */
	结束时间: string;
	/** 状态（中文字段名） */
	状态: string;
}
