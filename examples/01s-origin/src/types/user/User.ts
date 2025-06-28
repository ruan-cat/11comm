/**
 * 用户信息类型定义
 */
export interface UserInfo {
	/** 唯一id */
	id: string;
	/** 用户名 */
	username: string;
	/** 角色 */
	roles?: Array<string>;
}

/**
 * 菜单类型定义
 */
export interface Menu {
	/** 菜单唯一标识 */
	id: string;
	/** 菜单名称 */
	text: string;
	/** 菜单图标 */
	icon: string;
	/** 菜单路径 */
	href?: string;
	/** 菜单父节点 */
	pid?: string;
	/** 子菜单 */
	children?: Array<Menu>;
}
