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

/**
 * 添加对应菜单组
 * @description 添加对应菜单组
 */
export function addGroupCatalog<T = AddGroupCatalogResponse>(options?: UseAxiosOptionsJsonVO<T>) {
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
export function deleteGroupCatalog<T = DeleteGroupCatalogResponse>(options?: UseAxiosOptionsJsonVO<T>) {
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
export function queryGroupCatalog<T = PageDTO<QueryGroupCatalogResponse>>(options?: UseAxiosOptionsJsonVO<T>) {
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
