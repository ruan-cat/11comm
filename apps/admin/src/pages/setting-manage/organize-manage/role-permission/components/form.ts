import type { RolePermission } from "@01s-11comm/type";

/** 角色权限表单 */
export interface RolePermissionFormVO extends Partial<RolePermission> {
	/** 角色名称 */
	name: string;
	/** 角色编码 */
	code: string;
	/** 状态 */
	enabled: boolean;
	/** 描述 */
	description: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: RolePermissionFormVO = {
	name: "",
	code: "",
	enabled: true,
	description: "",
};

/**
 * 角色权限表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RolePermissionFormProps {
	/** 表单数据 */
	form: RolePermissionFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: RolePermissionFormVO;
}
