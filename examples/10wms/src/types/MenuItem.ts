/**
 * 菜单项
 * @description
 * 前端用的菜单项数据格式 不做更改
 */
export interface MenuItem {
	id: number;
	text: string;
	icon: string;
	href?: string;
	pid?: number;
	children?: MenuItem[];
}

/**
 * 来自后端的菜单项数据格式
 * @description
 * TODO: 后端的数据格式应该在前端这里做一次改名
 */
export interface MenuItemBack {
	id: number;
	functionname: string;
	iconName: string;
	functionurl?: string;
	parentfunctionid?: number;
	children?: MenuItem[];
}
