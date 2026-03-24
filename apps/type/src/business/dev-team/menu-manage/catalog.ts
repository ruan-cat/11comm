import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * @description 菜单组类型
 * Menu group type
 */
export type MenuGroupType = "system" | "merchant" | "custom" | "temp";

/**
 * @description 商户类型
 * Store type
 */
export type StoreType = "property" | "merchant" | "owner" | "common";

/**
 * @description 菜单目录列表数据
 * Menu catalog list item
 */
export interface MenuCatalogListItem {
	/** 组ID Group ID */
	gid: string;
	/** 组类型 Group type */
	groupType: MenuGroupType;
	/** 图标 Icon */
	icon: string;
	/** 标签 Label */
	label: string;
	/** 名称 Name */
	name: string;
	/** 排序号 Sequence number */
	seq: string;
	/** 归属商户类型 Store type */
	storeType: StoreType;
	/** 类型文本 Type text */
	typeText: string;
	/** 归属商户文本 Store type text */
	storeTypeText: string;
	/** 创建时间 Creation time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * @description 菜单目录列表查询参数
 * Menu catalog list query parameters
 */
export interface MenuCatalogQueryParams extends BaseListQueryParams {
	/** 菜单组名称 Menu group name */
	name?: string;
	/** 商户类型 Store type */
	storeType?: StoreType;
	/** 组类型 Group type */
	groupType?: MenuGroupType;
}

/**
 * @description 菜单目录表单数据
 * Menu catalog form data
 */
export interface MenuCatalogFormData {
	/** 菜单组编号 Menu group ID */
	gid: string;
	/** 图标 Icon */
	icon: string;
	/** 组名称 Group name */
	name: string;
	/** 序列 Sequence */
	seq: number;
	/** 描述 Description */
	description: string;
	/** 组类型 Group type */
	groupType: MenuGroupType;
	/** 标签 Label */
	label: string;
	/** 归属商户 Store type */
	storeType: StoreType;
}

/**
 * @description 组类型选项
 * Group type options
 */
export const groupTypeOptions: OptionsType = [
	{ label: "系统菜单", value: "system" },
	{ label: "商户菜单", value: "merchant" },
	{ label: "自定义菜单", value: "custom" },
	{ label: "临时菜单", value: "temp" },
];

/**
 * @description 归属商户选项
 * Store type options
 */
export const storeTypeOptions: OptionsType = [
	{ label: "物业平台", value: "property" },
	{ label: "商户平台", value: "merchant" },
	{ label: "业主平台", value: "owner" },
	{ label: "通用平台", value: "common" },
];
