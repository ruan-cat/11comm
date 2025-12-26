import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 角色权限信息
 * Role permission information
 */
export interface RolePermission {
	/** 角色ID Role ID */
	id: string;
	/** 角色名称 Role name */
	name: string;
	/** 角色编码 Role code */
	code: string;
	/** 权限描述 Permission description */
	description?: string;
	/** 是否启用 Is enabled */
	enabled?: boolean;
}

/**
 * 角色权限列表查询参数
 */
export interface RolePermissionListQuery extends BaseListQueryParams {
	/** 角色名称 */
	name?: string;
	/** 角色编码 */
	code?: string;
}

/**
 * 角色权限选项
 */
export const rolePermissionOptions: OptionsType = [];

/**
 * 权限类型选项
 */
export const permissionTypeOptions: OptionsType = [
	{ label: "菜单权限", value: "menu" },
	{ label: "数据权限", value: "data" },
	{ label: "功能权限", value: "function" },
];

/**
 * 角色权限表单数据对象
 * Role permission form data object
 */
export interface RolePermissionFormVO extends Partial<RolePermission> {
	/** 角色名称 Role name */
	name: string;
	/** 角色编码 Role code */
	code: string;
	/** 是否启用 Is enabled */
	enabled: boolean;
	/** 角色描述 Role description */
	description: string;
}
