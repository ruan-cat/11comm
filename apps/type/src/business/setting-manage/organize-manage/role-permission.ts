import type { OptionsType } from "../../../common";

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
