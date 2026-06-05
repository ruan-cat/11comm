import type { RolePermissionFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

/**
 * 默认表单数据对象
 * Default form data object
 * @description 对外导出用于其他场景使用
 */
export const defaultForm: RolePermissionFormVO = {
	name: "",
	code: "",
	enabled: true,
	description: "",
};

/**
 * 角色权限表单组件 Props
 * Role permission form component props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 * To avoid global type conflicts, a longer type name is designed
 */
export interface RolePermissionFormProps {
	/** 表单数据 Form data */
	form: RolePermissionFormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: RolePermissionFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
