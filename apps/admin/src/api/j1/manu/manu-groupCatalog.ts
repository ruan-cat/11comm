import { useRequest } from "@/composables/use-request";

/** 添加对应菜单组请求参数 */
export interface AddGroupCatalogParams {
	/** 菜单目录编号 */
	caId: string;
	/** 菜单组编号 */
	gid: string;
	/** 商户类型 */
	storeType: string;
}

/** 添加对应菜单组响应参数 */
export interface AddGroupCatalogResponse {
	/** 菜单组目录编号 */
	gcId: string;
	/** 创建时间 */
	createTime: string;
}

/** 删除对应菜单组请求参数 */
export interface DeleteGroupCatalogParams {
	/** 菜单组目录编号 */
	gcId: string;
}

/** 删除对应菜单组响应参数 */
export interface DeleteGroupCatalogResponse {
	/** 菜单组目录编号 */
	gcId: string;
}

/** 获取对应菜单组请求参数 */
export interface QueryGroupCatalogParams {
	/** 菜单目录编号 */
	caId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 商户类型 */
	storeType: string;
}

/** 获取对应菜单组响应参数 */
export interface QueryGroupCatalogResponse {
	/** 菜单组目录编号 */
	gcId: string;
	/** 菜单组编号 */
	gid: string;
}

/** 添加菜单目录请求参数 */
export interface AddMenuCatalogParams {
	/** 图标 */
	icon: string;
	/** 是否显示 */
	isShow: string;
	/** 菜单组名称 */
	name: string;
	/** 顺序 */
	seq: number;
	/** 商户类型 */
	storeType: string;
	/** 页面 */
	url: string;
	/** 权限编号 */
	privId?: string;
}

/** 修改菜单目录请求参数 */
export interface ModifyMenuCatalogParams {
	/** 编号 */
	caId: string;
	/** 图标 */
	icon: string;
	/** 是否显示 */
	isShow: string;
	/** 菜单组名称 */
	name: string;
	/** 顺序 */
	seq: number;
	/** 商户类型 */
	storeType: string;
	/** 页面 */
	url: string;
	/** 权限编号 */
	privId?: string;
}

/** 分页查询菜单目录请求参数 */
export interface QueryMenuCatalogPageParams {
	/** 页码 */
	pageIndex: number;
	/** 每页数量 */
	pageSize: number;
	/** 商户类型 */
	storeType: string;
	/** 是否显示 */
	isShow?: string;
	/** 菜单目录名称 */
	name?: string;
}

/** 菜单目录数据对象 */
export interface MenuCatalogDataObject {
	/** 菜单目录编号 */
	caId: string;
	/** 图标 */
	icon: string;
	/** 是否显示 */
	isShow: string;
	/** 菜单组名称 */
	name: string;
	/** 顺序 */
	seq: number;
	/** 商户类型 */
	storeType: string;
	/** 页面 */
	url: string;
	/** 权限编号 */
	privId?: string;
}

/** 删除菜单目录请求参数 */
export interface RemoveMenuCatalogParams {
	/** id */
	id: string;
}

/**
 * 添加对应菜单组
 * @description 添加对应菜单组
 */
export function addGroupCatalog<T = AddGroupCatalogResponse>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddGroupCatalogParams>({
		url: "/j1-manumana/groupCatalog/add",
		httpParamWay: "body",
		options,
		config: {
			method: "POST",
			data: {
				caId: "",
				gid: "",
				storeType: "",
			},
		},
	});
}

/**
 * 删除对应菜单组
 * @description 删除对应菜单组
 */
export function deleteGroupCatalog<T = DeleteGroupCatalogResponse>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteGroupCatalogParams>({
		url: "/j1-manumana/groupCatalog/delete",
		httpParamWay: "body",
		options,
		config: {
			method: "DELETE",
			data: {
				gcId: "",
			},
		},
	});
}

/**
 * 获取对应菜单组
 * @description 获取对应菜单组列表(条件+分页)
 */
export function queryGroupCatalog<T = PageDTO<QueryGroupCatalogResponse>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryGroupCatalogParams>({
		url: "/j1-manumana/groupCatalog/query",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				caId: "",
				pageIndex: 1,
				pageSize: 10,
				storeType: "",
			},
		},
	});
}

/**
 * 添加菜单目录
 * @description 添加菜单目录
 */
export function addMenuCatalog<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddMenuCatalogParams>({
		url: "/j1-menumana/add-menucatalog",
		httpParamWay: "body",
		options,
		config: {
			method: "POST",
			data: {
				icon: "",
				isShow: "",
				name: "",
				seq: 0,
				storeType: "",
				url: "",
			},
		},
	});
}

/**
 * 修改菜单目录
 * @description 修改菜单目录
 */
export function modifyMenuCatalog<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyMenuCatalogParams>({
		url: "/j1-menumana/modify-menucatalog",
		httpParamWay: "body",
		options,
		config: {
			method: "PUT",
			data: {
				caId: "",
				icon: "",
				isShow: "",
				name: "",
				seq: 0,
				storeType: "",
				url: "",
			},
		},
	});
}

/**
 * 分页查询菜单目录
 * @description 分页查询菜单目录
 */
export function queryMenuCatalogPage<T = PageDTO<MenuCatalogDataObject>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryMenuCatalogPageParams>({
		url: "/j1-menumana/query-menucatalogpage",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				storeType: "",
			},
		},
	});
}

/**
 * 删除菜单目录
 * @description 删除菜单目录
 */
export function removeMenuCatalog<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, RemoveMenuCatalogParams>({
		url: "/j1-menumana/remove-menucatalog/{id}",
		httpParamWay: "path",
		options,
		config: {
			url: "/j1-menumana/remove-menucatalog/{id}",
			method: "DELETE",
		},
	});
}
