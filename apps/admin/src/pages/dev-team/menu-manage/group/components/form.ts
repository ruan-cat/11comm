/**
 * @file 菜单组表单类型定义
 * @description Menu group form types
 */

import type { MenuGroupFormVO } from "@01s-11comm/type";

/** 默认表单 Default form */
export const defaultForm: MenuGroupFormVO = {
	groupId: "",
	groupName: "",
	groupCode: "",
	groupType: "系统菜单",
	storeName: "系统默认",
	sortNo: 1,
	icon: "mdi:menu",
	status: "启用",
	description: "",
};

/**
 * 菜单组表单 props
 * @description Menu group form props
 */
export interface MenuGroupFormProps {
	/** 表单数据 Form data */
	form: MenuGroupFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: MenuGroupFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
