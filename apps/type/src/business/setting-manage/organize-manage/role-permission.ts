import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * @description 角色状态
 * Role status
 */
export type 角色状态 = "启用" | "禁用";

/**
 * @description 权限项
 * Permission item
 */
export interface 权限项 {
	/** 权限ID Permission ID */
	id: string;
	/** 权限名称 Permission name */
	name: string;
	/** 权限编码 Permission code */
	code: string;
	/** 是否选中 Is selected */
	selected: boolean;
}

/**
 * 角色权限信息
 */
export interface RolePermission {
	/** 角色ID */
	id: string;
	/** 角色名称 */
	name: string;
	/** 角色编码 */
	code: string;
	/** 权限描述 */
	description?: string;
	/** 是否启用 */
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
