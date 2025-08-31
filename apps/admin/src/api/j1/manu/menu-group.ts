import { useRequest } from "@/composables/use-request";

/** 添加菜单组请求参数 */
export interface AddMenuGroupParams {
	/** 图标 */
	icon: string;
	/** 组名称 */
	name: string;
	/** 序列 */
	seq: number;
	/** 描述 */
	description?: string;
	/** 组类型 */
	groupType?: string;
	/** 标签 */
	label?: string;
	/** 归属商户 */
	storeType?: string;
}

/** 删除菜单组请求参数 */
export interface DeleteMenuGroupParams {
	/** 菜单组id */
	gid: string;
}

/** 获取菜单组列表请求参数 */
export interface ListMenuGroupParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 菜单组Id */
	gid?: string;
	/** 菜单组名称 */
	name?: string;
	/** 商户类型 */
	storeType?: string;
}

/** 菜单组数据对象 */
export interface MenuGroupData {
	/** 组ID */
	gid: string;
	/** 类型 */
	groupType: string;
	/** 图标 */
	icon: string;
	/** 标签 */
	label: string;
	/** 名称 */
	name: string;
	/** 列序 */
	seq: string;
	/** 归属商户 */
	storeType: string;
}

/** 获取菜单组名称列表请求参数 */
export interface ListMenuGroupNameParams {
	/** 商户类型 */
	storeType: string;
}

/** 菜单组名称数据对象 */
export interface MenuGroupNameData {
	/** 菜单组编号 */
	gid: string;
	/** 菜单组名称 */
	name: string;
}

/** 修改菜单组请求参数 */
export interface UpdateMenuGroupParams {
	/** 菜单组编号 */
	gid: string;
	/** 图标 */
	icon: string;
	/** 组名称 */
	name: string;
	/** 序列 */
	seq: number;
	/** 描述 */
	description?: string;
	/** 组类型 */
	groupType?: string;
	/** 标签 */
	label?: string;
	/** 归属商户 */
	storeType?: string;
}

/**
 * 添加菜单组
 * @description 添加菜单组
 */
export function addMenuGroup<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddMenuGroupParams>({
		url: "/j1-manumana/menu-group/add-menu-group",
		httpParamWay: "body",
		options,
		config: {
			method: "POST",
			data: {
				icon: "",
				name: "",
				seq: 0,
			},
		},
	});
}

/**
 * 删除菜单组
 * @description 删除菜单组
 */
export function deleteMenuGroup<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, DeleteMenuGroupParams>({
		url: "/j1-manumana/menu-group/delete-menu-group/{gid}",
		httpParamWay: "path",
		options,
		config: {
			url: "/j1-manumana/menu-group/delete-menu-group/{gid}",
			method: "DELETE",
		},
	});
}

/**
 * 获取菜单组列表
 * @description 获取菜单组列表
 */
export function listMenuGroup<T = PageDTO<MenuGroupData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ListMenuGroupParams>({
		url: "/j1-manumana/menu-group/list-menu-group",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

/**
 * 获取菜单组名称列表
 * @description 获取菜单组名称列表
 */
export function listMenuGroupName<T = MenuGroupNameData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, ListMenuGroupNameParams>({
		url: "/j1-manumana/menu-group/list-menu-group-name/{storeType}",
		httpParamWay: "path",
		options,
		config: {
			url: "/j1-manumana/menu-group/list-menu-group-name/{storeType}",
			method: "GET",
		},
	});
}

/**
 * 修改菜单组
 * @description 修改菜单组
 */
export function updateMenuGroup<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateMenuGroupParams>({
		url: "/j1-manumana/menu-group/update-menu-group",
		httpParamWay: "body",
		options,
		config: {
			method: "PUT",
			data: {
				gid: "",
				icon: "",
				name: "",
				seq: 0,
			},
		},
	});
}
