import { useRequest } from "@/composables/use-request";

/** 添加通用菜单请求参数 */
export interface AddCommonMenuParams {
	/** 菜单名称 */
	name: string;
	/** 菜单图标 */
	icon?: string;
	/** 菜单路径 */
	path?: string;
	/** 菜单组件 */
	component?: string;
	/** 父级菜单ID */
	parentId?: string;
	/** 排序 */
	sort?: number;
	/** 菜单类型 */
	menuType?: string;
	/** 权限标识 */
	permission?: string;
	/** 状态 */
	status?: string;
	/** 描述 */
	description?: string;
}

/** 删除通用菜单请求参数 */
export interface RemoveCommonMenuParams {
	/** 菜单ID */
	menuId: string;
}

/** 通用菜单数据对象 */
export interface CommonMenuData {
	/** 菜单ID */
	menuId: string;
	/** 菜单名称 */
	name: string;
	/** 菜单图标 */
	icon?: string;
	/** 菜单路径 */
	path?: string;
	/** 菜单组件 */
	component?: string;
	/** 父级菜单ID */
	parentId?: string;
	/** 排序 */
	sort?: number;
	/** 菜单类型 */
	menuType?: string;
	/** 权限标识 */
	permission?: string;
	/** 状态 */
	status?: string;
	/** 描述 */
	description?: string;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
}

/** 通用菜单名称数据对象 */
export interface CommonMenuNameData {
	/** 菜单ID */
	menuId: string;
	/** 菜单名称 */
	name: string;
}

/**
 * 添加通用菜单
 * @description 添加新的通用菜单项
 */
export function addCommonMenu<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddCommonMenuParams>({
		url: "/j1-menumana/commonmenu/add",
		httpParamWay: "body",
		options,
		config: {
			method: "POST",
			data: {
				name: "",
				icon: "",
				path: "",
				component: "",
				parentId: "",
				sort: 0,
				menuType: "",
				permission: "",
				status: "",
				description: "",
			},
		},
	});
}

/**
 * 获取所有通用菜单
 * @description 获取所有通用菜单列表
 */
export function queryAllCommonMenu<T = CommonMenuData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/j1-menumana/commonmenu/queryall",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {},
		},
	});
}

/**
 * 获取通用菜单名称列表
 * @description 获取通用菜单名称列表
 */
export function queryCommonMenuName<T = CommonMenuNameData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/j1-menumana/commonmenu/queryname",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {},
		},
	});
}

/**
 * 删除通用菜单
 * @description 删除指定的通用菜单
 */
export function removeCommonMenu<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveCommonMenuParams>({
		url: "/j1-menumana/commonmenu/remove",
		httpParamWay: "query",
		options,
		config: {
			method: "DELETE",
			params: {
				menuId: "",
			},
		},
	});
}