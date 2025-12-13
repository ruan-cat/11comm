import type { 角色状态, 权限项 } from "@01s-11comm/type";

// ========== 表单业务类型定义 ==========

/** 角色权限表单数据接口 */
export interface 角色权限表单_VO {
	/** 角色ID */
	id: string;
	/** 角色名称 */
	角色名称: string;
	/** 角色编码 */
	角色编码: string;
	/** 角色状态 */
	状态: 角色状态;
	/** 角色描述 */
	描述: string;
	/** 权限列表 */
	权限列表: 权限项[];
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 角色权限表单_VO = {
	id: "",
	角色名称: "",
	角色编码: "",
	状态: "启用",
	描述: "",
	权限列表: [],
};

/**
 * 角色权限表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RolePermissionFormProps {
	/** 表单数据 */
	form: 角色权限表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 角色权限表单_VO;
}
