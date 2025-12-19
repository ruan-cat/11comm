import type { OptionsType } from "../../../common";

/**
 * @description site-management列表数据
 * SiteManagement list item
 */
export interface SiteManagementListItem {
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
 * @description site-management列表查询参数
 * SiteManagement list query parameters
 */
export interface SiteManagementQueryParams {
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
export const siteManagementStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
	{ label: "可预约", value: "可预约" },
];

// ==================== 表单相关类型 ====================

/**
 * @description 场地管理表单数据类型
 * Site management form data type
 */
export interface SiteManagementFormVO {
	/** 编号 ID/Number */
	id: string;
	/** 名称 Name */
	name: string;
	/** 开场时间 Opening time */
	openingTime: string;
	/** 关场时间 Closing time */
	closingTime: string;
	/** 每小时费用 Hourly fee */
	hourlyFee: string;
	/** 管理员 Administrator */
	administrator: string;
	/** 管理员电话 Administrator phone */
	administratorPhone: string;
	/** 状态 Status */
	status: string;
}

// ==================== 兼容旧中文名称 ====================

/**
 * @description 场地管理表单数据类型（兼容旧版本）
 * @deprecated 请使用 SiteManagementFormVO
 */
export type 场地管理_VO = SiteManagementFormVO;
