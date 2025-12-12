import type { OptionsType } from "../../../common";

/**
 * @description 菜单组状态
 * Menu group status
 */
export type MenuGroupStatus = "启用" | "禁用";

/**
 * @description 菜单组类型名称
 * Menu group type name
 */
export type MenuGroupTypeName = "系统菜单" | "用户菜单" | "商户菜单";

/**
 * @description 菜单组列表数据
 * Menu group list item
 */
export interface MenuGroupListItem {
	/** 组编号 Group ID */
	groupId: string;
	/** 组名称 Group name */
	groupName: string;
	/** 组编码 Group code */
	groupCode: string;
	/** 组类型 Group type */
	groupType: MenuGroupTypeName;
	/** 归属商户 Store name */
	storeName: string;
	/** 排序 Sort number */
	sortNo: number;
	/** 图标 Icon */
	icon: string;
	/** 状态 Status */
	status: MenuGroupStatus;
	/** 描述 Description */
	description: string;
	/** 创建时间 Creation time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * @description 菜单组列表查询参数
 * Menu group list query parameters
 */
export interface MenuGroupQueryParams {
	/** 组编号 Group ID */
	groupId?: string;
	/** 组名称 Group name */
	groupName?: string;
	/** 组编码 Group code */
	groupCode?: string;
	/** 状态 Status */
	status?: MenuGroupStatus;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const menuGroupStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

