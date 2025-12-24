/**
 * @file 菜单项表单类型定义
 * @description Menu item form types
 */

import type { Mode } from "@/composables/use-mode";
import type { MenuItemFormVO } from "@01s-11comm/type";

/** 菜单项表单 VO */
export type { MenuItemFormVO };

import {
	menuTypeOptions,
	menuItemStatusOptions,
	booleanOptions,
} from "@01s-11comm/type";


/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: MenuItemFormVO = {
	menuId: "",
	menuName: "",
	parentMenu: "根菜单",
	menuType: "menu",
	routePath: "",
	componentPath: "",
	permissionKey: "",
	sortNo: 1,
	status: "enabled",
	icon: "",
	isExternal: "false",
	isCached: "false",
	isHidden: "false",
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
	/** 表单模式 Form mode */
	mode?: Mode;
}

/** 导出选项供表单使用 Export options for form use */
export { menuTypeOptions, menuItemStatusOptions, booleanOptions };
