/**
 * @file 菜单项表单类型定义
 * @description Menu item form types
 */

import type {
	MenuItemFormVO as FormVO,
	MenuItemFormProps,
} from "@01s-11comm/type";
import {
	menuItemDefaultForm as defaultFormValues,
	menuTypeOptions,
	menuItemStatusOptions,
	booleanOptions,
} from "@01s-11comm/type";

/** 向后兼容的类型别名 */
export type MenuItemFormVO_Original = FormVO;

/** 默认表单 Default form */
export const defaultForm = defaultFormValues;

/**
 * 菜单项表单 props
 * @description Menu item form props
 */
export { MenuItemFormProps };

/** 导出选项供表单使用 Export options for form use */
export { menuTypeOptions, menuItemStatusOptions, booleanOptions };

// 为了向后兼容，重新导出原始类型
export { FormVO as MenuItemFormVO };
