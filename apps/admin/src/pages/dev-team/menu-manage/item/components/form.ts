/**
 * @file 菜单项表单类型定义
 * @description Menu item form types
 */

import { menuTypeOptions, menuItemStatusOptions, booleanOptions } from "@01s-11comm/type";

/**
 * 菜单项表单数据类型
 * Menu item form data type
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

/** 默认表单 Default form */
export const defaultForm: MenuItemFormVO = {
	menuId: "",
	menuName: "",
	parentMenu: "根菜单",
	menuType: "菜单",
	routePath: "",
	componentPath: "",
	permissionKey: "",
	sortNo: 1,
	status: "启用",
	icon: "",
	isExternal: "否",
	isCached: "否",
	isHidden: "否",
	description: "",
};

/**
 * 菜单项表单 props
 * @description Menu item form props
 */
export interface MenuItemFormProps {
	/** 表单数据 Form data */
	form: MenuItemFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: MenuItemFormVO;
}

/** 导出选项供表单使用 Export options for form use */
export { menuTypeOptions, menuItemStatusOptions, booleanOptions };
