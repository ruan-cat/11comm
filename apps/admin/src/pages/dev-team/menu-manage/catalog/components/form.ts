import type { MenuCatalogFormData } from "@01s-11comm/type";

// ==================== 类型别名 ====================

/** 菜单目录表单数据类型（中文别名） */
export type 菜单目录表单_VO = MenuCatalogFormData;

// ==================== Options 导出 ====================

import { 组类型选项, 归属商户选项 } from "@01s-11comm/type";

/** 组类型选项 */
export { 组类型选项 };

/** 归属商户选项 */
export { 归属商户选项 };

// ==================== 默认表单 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
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

// ==================== Props 类型 ====================

/**
 * 菜单目录表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CatalogFormProps {
	/** 表单数据 */
	form: MenuCatalogFormData;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: MenuCatalogFormData;
}
