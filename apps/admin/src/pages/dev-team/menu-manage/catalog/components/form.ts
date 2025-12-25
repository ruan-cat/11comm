import type { Mode } from "@/composables/use-mode";
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
	/** 表单模式 Form mode */
	mode?: Mode;
}

export type { MenuCatalogFormData };
export { groupTypeOptions, storeTypeOptions };
