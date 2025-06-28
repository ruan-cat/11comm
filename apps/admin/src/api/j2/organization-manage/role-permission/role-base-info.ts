import { useRequest } from "composables/use-request";

/**
 * 添加角色请求参数
 */
export interface AddRoleRequest {
	/** 角色描述 */
	description?: string;
	/** 角色名称 */
	name: string;
	/** 顺序 */
	seq?: string;
}

/**
 * 删除角色请求参数
 */
export interface DeleteRoleRequest {
	/** 角色id */
	pg_id: string;
}

/**
 * 角色权限信息
 */
export interface RolePermissionInfo {
	/** 角色描述 */
	description?: string;
	/** 角色名称 */
	name: string;
	/** 角色权限组id */
	pg_id: string;
	/** 顺序 */
	seq?: string;
}

/**
 * 修改角色请求参数
 */
export interface UpdateRoleRequest {
	/** 角色描述 */
	description?: string;
	/** 角色名称 */
	name: string;
	/** 角色权限组id */
	pg_id: string;
	/** 顺序 */
	seq?: string;
}

/**
 * 添加角色
 */
export function addRole<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddRoleRequest>({
		url: "/j2-orgmanager/role-manage/add",
		options,
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				name: "",
				description: "",
				seq: "",
			},
		},
	});
}

/**
 * 删除角色
 * @description
 * 根据角色id删除指定角色
 */
export function deleteRole<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteRoleRequest>({
		url: "/j2-orgmanager/role-manage/delete",
		options,
		httpParamWay: "query",
		config: {
			method: "DELETE",
			data: {
				pg_id: "",
			},
		},
	});
}

/**
 * 获取角色列表
 * @description
 * 获取所有角色权限信息列表
 */
export function queryAllRole<T = RolePermissionInfo[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/j2-orgmanager/role-manage/query",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {},
		},
	});
}

/**
 * 修改角色
 * @description
 * 修改角色权限信息
 */
export function updateRole<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateRoleRequest>({
		url: "/j2-orgmanager/role-manage/update",
		options,
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				name: "",
				pg_id: "",
				description: "",
				seq: "",
			},
		},
	});
}
