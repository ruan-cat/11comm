import { useRequest } from "@/composables/use-request";

/** 获取菜单名称树响应数据 */
export interface MenuPrivilegeTreeDTO {
	/** 菜单编号 */
	mid: string;
	/** 菜单名称 */
	menuName: string;
	/** 权限列表 */
	privilegeList: PrivilegeInfo[];
	/** 子菜单列表 */
	children?: MenuPrivilegeTreeDTO[];
}

/** 权限信息 */
export interface PrivilegeInfo {
	/** 权限编号 */
	privId: string;
	/** 权限名称 */
	name: string;
	/** 权限类型 */
	type: string;
	/** 状态 */
	status: string;
}

/** 添加权限请求参数 */
export interface AddPrivilegeParams {
	/** 菜单编号 */
	mid: string;
	/** 权限名称 */
	name: string;
	/** 权限类型 */
	type: string;
	/** 商户类型 */
	storeType?: string;
	/** 描述 */
	description?: string;
	/** 状态 */
	status?: string;
}

/** 删除权限请求参数 */
export interface DeletePrivilegeParams {
	/** 权限编号 */
	privId: string;
}

/** 修改权限请求参数 */
export interface ModifyPrivilegeParams {
	/** 权限编号 */
	privId: string;
	/** 权限名称 */
	name: string;
	/** 权限类型 */
	type: string;
	/** 菜单编号 */
	mid?: string;
	/** 商户类型 */
	storeType?: string;
	/** 描述 */
	description?: string;
	/** 状态 */
	status?: string;
}

/** 权限查询请求参数 */
export interface QueryPrivilegeParams {
	/** 菜单编号 */
	mid?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 权限名称 */
	name?: string;
	/** 商户类型 */
	storeType?: string;
}

/** 权限传输数据对象 */
export interface PrivilegeDTO {
	/** 权限编号 */
	privId: string;
	/** 权限名称 */
	name: string;
	/** 权限类型 */
	type: string;
	/** 菜单编号 */
	mid: string;
	/** 商户类型 */
	storeType: string;
	/** 描述 */
	description: string;
	/** 状态 */
	status: string;
	/** 创建时间 */
	createTime?: string;
	/** 修改时间 */
	updateTime?: string;
}

/**
 * 获取菜单名称树
 * @description 获取菜单名称树
 */
export function getMenuPrivilegeTree<T = MenuPrivilegeTreeDTO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j1-manumana/meunmana/get-menuprivilegetree",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {},
		},
	});
}

/**
 * 添加权限
 * @description 添加权限
 */
export function addPrivilege<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddPrivilegeParams>({
		url: "/j1-menumana/privilege/add-privilege",
		httpParamWay: "body",
		options,
		config: {
			method: "POST",
			data: {
				mid: "",
				name: "",
				type: "",
			},
		},
	});
}

/**
 * 删除权限
 * @description 删除权限
 */
export function deletePrivilege<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeletePrivilegeParams>({
		url: "/j1-menumana/privilege/delete-privilege",
		httpParamWay: "body",
		options,
		config: {
			method: "DELETE",
			data: {
				privId: "",
			},
		},
	});
}

/**
 * 修改权限
 * @description 修改权限
 */
export function modifyPrivilege<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyPrivilegeParams>({
		url: "/j1-menumana/privilege/modify-privilege",
		httpParamWay: "body",
		options,
		config: {
			method: "PUT",
			data: {
				privId: "",
				name: "",
				type: "",
			},
		},
	});
}

/**
 * 权限查询（条件与分页）
 * @description 权限查询（条件与分页）
 */
export function queryPrivilegeCondition<T = PageDTO<PrivilegeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPrivilegeParams>({
		url: "/j1-menumana/privilege/query-condition",
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
