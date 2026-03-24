import type { OptionsType } from "../../../common";

/**
 * @description 菜单项类型
 * Menu item type
 */
export type MenuItemType = "catalog" | "menu" | "button" | "interface";

/**
 * @description 菜单项状态
 * Menu item status
 */
export type MenuItemStatus = "enabled" | "disabled";

/**
 * @description 是否选项值
 * Boolean option value
 */
export type BooleanOption = "true" | "false";

/**
 * @description 菜单项列表数据
 * Menu item list item
 */
export interface MenuItemListItem {
	/** 菜单编号 Menu ID */
	menuId: string;
	/** 菜单名称 Menu name */
	menuName: string;
	/** 父级菜单 Parent menu */
	parentMenu: string;
	/** 菜单类型 Menu type */
	menuType: MenuItemType;
	/** 路由路径 Route path */
	routePath: string;
	/** 组件路径 Component path */
	componentPath: string;
	/** 权限标识 Permission key */
	permissionKey: string;
	/** 排序 Sort number */
	sortNo: number;
	/** 状态 Status */
	status: MenuItemStatus;
	/** 是否外链 Is external link */
	isExternal: BooleanOption;
	/** 是否缓存 Is cached */
	isCached: BooleanOption;
	/** 是否隐藏 Is hidden */
	isHidden: BooleanOption;
	/** 创建时间 Creation time */
	createTime: string;
	/** 图标 Icon */
	icon: string;
}

/**
 * @description 菜单项列表查询参数
 * Menu item list query parameters
 */
export interface MenuItemQueryParams {
	/** 菜单编号 Menu ID */
	menuId?: string;
	/** 菜单名称 Menu name */
	menuName?: string;
	/** 父级菜单 Parent menu */
	parentMenu?: string;
	/** 菜单类型 Menu type */
	menuType?: MenuItemType;
	/** 状态 Status */
	status?: MenuItemStatus;
	/** 是否外链 Is external link */
	isExternal?: BooleanOption;
	/** 是否缓存 Is cached */
	isCached?: BooleanOption;
	/** 是否隐藏 Is hidden */
	isHidden?: BooleanOption;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 菜单类型选项
 * Menu type options
 */
export const menuTypeOptions: OptionsType = [
	{ label: "目录", value: "catalog" },
	{ label: "菜单", value: "menu" },
	{ label: "按钮", value: "button" },
];

/**
 * @description 状态选项
 * Status options
 */
export const menuItemStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/**
 * @description 是否选项
 * Boolean options
 */
export const booleanOptions: OptionsType = [
	{ label: "是", value: "true" },
	{ label: "否", value: "false" },
];

/**
 * @description 菜单项表单数据类型 Menu item form data type
 */
export interface MenuItemFormVO {
	/** 菜单编号 Menu ID */
	menuId: string;
	/** 菜单名称 Menu name */
	menuName: string;
	/** 父级菜单 Parent menu */
	parentMenu: string;
	/** 菜单类型 Menu type */
	menuType: string;
	/** 路由路径 Route path */
	routePath: string;
	/** 组件路径 Component path */
	componentPath: string;
	/** 权限标识 Permission key */
	permissionKey: string;
	/** 排序 Sort number */
	sortNo: number | string;
	/** 状态 Status */
	status: string;
	/** 图标 Icon */
	icon: string;
	/** 是否外链 Is external link */
	isExternal: string;
	/** 是否缓存 Is cached */
	isCached: string;
	/** 是否隐藏 Is hidden */
	isHidden: string;
	/** 描述 Description */
	description: string;
}
