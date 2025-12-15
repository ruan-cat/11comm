/**
 * @file 菜单目录表单类型定义
 * @description Menu catalog form types
 */

import type { MenuCatalogFormData } from "@01s-11comm/type";
import { groupTypeOptions, storeTypeOptions } from "@01s-11comm/type";

/** 默认表单 Default form */
export const defaultForm: MenuCatalogFormData = {
	gid: "",
	icon: "",
	name: "",
	seq: 0,
	description: "",
	groupType: "system",
	label: "",
	storeType: "property",
};

/**
 * 菜单目录表单 props
 * @description Menu catalog form props
 */
export interface CatalogFormProps {
	/** 表单数据 Form data */
	form: MenuCatalogFormData;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: MenuCatalogFormData;
}

/** 导出选项和类型供表单使用 Export options and types for form use */
export { groupTypeOptions, storeTypeOptions };
export type { MenuCatalogFormData };
