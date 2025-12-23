/**
 * @file 菜单项表单类型定义
 * @description Menu item form types
 */

import type { Mode } from "@/composables/use-mode";
import type { MenuItemFormVO as FormVO } from "@01s-11comm/type";
import {
	menuTypeOptions,
	menuItemStatusOptions,
	booleanOptions,
} from "@01s-11comm/type";

/** 向后兼容的类型别名 */
export type MenuItemFormVO_Original = FormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: FormVO = {
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
	form: FormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: FormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

/** 导出选项供表单使用 Export options for form use */
export { menuTypeOptions, menuItemStatusOptions, booleanOptions };

// 为了向后兼容，重新导出原始类型
export { FormVO as MenuItemFormVO };
