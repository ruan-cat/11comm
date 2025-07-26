import { useRequest } from "@/composables/use-request";

/**
 * 添加数据权限请求参数
 */
export interface AddDataPermissionParams {
	/** 权限名称 */
	name: string;
	/** 权限描述 */
	description?: string;
	/** 权限范围 */
	scope?: string;
	/** 排序 */
	seq?: number;
	/** 状态 */
	status?: number;
}

/**
 * 修改数据权限请求参数
 */
export interface UpdateDataPermissionParams {
	/** 数据权限ID */
	id: string;
	/** 权限名称 */
	name: string;
	/** 权限描述 */
	description?: string;
	/** 权限范围 */
	scope?: string;
	/** 排序 */
	seq?: number;
	/** 状态 */
	status?: number;
}

/**
 * 获取数据权限列表请求参数
 */
export interface QueryDataPermissionParams {
	/** 页码 */
	pageIndex: number;
	/** 页大小 */
	pageSize: number;
	/** 权限名称（模糊查询） */
	name?: string;
	/** 状态 */
	status?: number;
}

/**
 * 删除数据权限请求参数
 */
export interface DeleteDataPermissionParams {
	/** 数据权限ID */
	id: string;
}

/**
 * 数据权限信息
 */
export interface DataPermissionInfo {
	/** 数据权限ID */
	id: string;
	/** 权限名称 */
	name: string;
	/** 权限描述 */
	description?: string;
	/** 权限范围 */
	scope?: string;
	/** 排序 */
	seq?: number;
	/** 状态 */
	status: number;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
}

/**
 * 添加数据权限
 */
export function addDataPermission<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddDataPermissionParams>({
		url: "/j2-orgmanager/data-permission/add",
		httpParamWay: "body",
		options,
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				name: "",
				description: "",
				scope: "",
				seq: 0,
				status: 1,
			},
		},
	});
}

/**
 * 修改数据权限
 * @description 修改数据权限信息
 */
export function updateDataPermission<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateDataPermissionParams>({
		url: "/j2-orgmanager/data-permission/update",
		httpParamWay: "body",
		options,
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				id: "",
				name: "",
				description: "",
				scope: "",
				seq: 0,
				status: 1,
			},
		},
	});
}

/**
 * 获取数据权限列表（条件+分页）
 * @description 根据条件分页查询数据权限列表
 */
export function queryDataPermissionList<T = PageDTO<DataPermissionInfo>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryDataPermissionParams>({
		url: "/j2-orgmanager/data-permission/query",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				name: "",
				status: 1,
			},
		},
	});
}

/**
 * 删除数据权限
 * @description 根据ID删除指定数据权限
 */
export function deleteDataPermission<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteDataPermissionParams>({
		url: "/j2-orgmanager/data-permission/delete",
		httpParamWay: "query",
		options,
		config: {
			method: "DELETE",
			params: {
				id: "",
			},
		},
	});
}
