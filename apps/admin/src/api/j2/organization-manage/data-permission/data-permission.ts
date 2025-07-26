import { useRequest } from "@/composables/use-request";

/**
 * 添加数据权限数据传输对象
 */
export interface AddDataPermissionParams {
	/** 编号 */
	code: string;
	/** 小区id */
	communityId: string;
	/** 名称 */
	name: string;
	/** 备注 */
	remark: string;
}

/**
 * 数据权限数据传输对象
 */
export interface UpdateDataPermissionParams {
	/** 编号 */
	code: string;
	/** 小区id */
	communityId: string;
	/** 数据权限编号 */
	dpId: string;
	/** 名称 */
	name: string;
	/** 备注 */
	remark: string;
}

/**
 * 获取数据权限列表参数
 */
export interface QueryDataPermissionParams {
	/** 小区id */
	communityId: string;
}

/**
 * 删除数据权限参数
 */
export interface DeleteDataPermissionParams {
	/** 数据权限编号 */
	dpId: string;
}

/**
 * 数据权限数据传输对象
 */
export interface DataPermissionInfo {
	/** 编号 */
	code: string;
	/** 小区id */
	communityId: string;
	/** 数据权限编号 */
	dpId: string;
	/** 名称 */
	name: string;
	/** 备注 */
	remark: string;
}

/**
 * 添加数据权限
 */
export function addDataPermission<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddDataPermissionParams>({
		url: "/j2-orgmanager/data/add",
		httpParamWay: "body",
		options,
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				code: "",
				communityId: "",
				name: "",
				remark: "",
			},
		},
	});
}

/**
 * 修改数据权限
 */
export function updateDataPermission<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateDataPermissionParams>({
		url: "/j2-orgmanager/data/data-privilege",
		httpParamWay: "body",
		options,
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				code: "",
				communityId: "",
				dpId: "",
				name: "",
				remark: "",
			},
		},
	});
}

/**
 * 获取数据权限列表（条件+分页）
 */
export function queryDataPermissionList<T = DataPermissionInfo[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, QueryDataPermissionParams>({
		url: "/j2-orgmanager/data/dataPrivilege/{communityId}",
		httpParamWay: "path",
		options,
		config: {
			method: "GET",
			url: "/j2-orgmanager/data/dataPrivilege/{communityId}",
		},
	});
}

/**
 * 删除数据权限
 */
export function deleteDataPermission<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, DeleteDataPermissionParams>({
		url: "/j2-orgmanager/data/delete/{dpId}",
		httpParamWay: "path",
		options,
		config: {
			method: "DELETE",
			url: "/j2-orgmanager/data/delete/{dpId}",
		},
	});
}
