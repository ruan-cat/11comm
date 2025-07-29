import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加组织参数
 */
export interface AddOrganizationParams {
	/** 描述 */
	description?: string;
	/** 组织名称 */
	orgname: string;
	/** 上级组织 */
	parentOrgId?: string;
}

/**
 * 修改组织参数
 */
export interface ModifyOrganizationParams {
	/** 组织ID */
	orgId: string;
	/** 描述 */
	description?: string;
	/** 组织名称 */
	orgname?: string;
	/** 上级组织 */
	parentOrgId?: string;
}

/**
 * 删除组织参数
 */
export interface DeleteOrganizationParams {
	/** 组织ID */
	orgId: string;
}

/**
 * 组织名称树节点
 */
export interface OrganizationTreeNode {
	/** 组织ID */
	orgId?: string;
	/** 组织名称 */
	orgname?: string;
	/** 上级组织ID */
	parentOrgId?: string;
	/** 子节点 */
	children?: OrganizationTreeNode[];
}

/**
 * 关联员工参数
 */
export interface AssociateEmployeeParams {
	/** 组织ID */
	orgId: string;
	/** 员工ID列表 */
	userIds: string[];
}

/**
 * 获取组织员工列表参数
 */
export interface GetOrgEmployeeListParams {
	/** 组织ID */
	orgId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 员工名称 */
	name?: string;
}

/**
 * 关联员工前查询参数
 */
export interface QueryBeforeAssociateParams {
	/** 组织ID */
	orgId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 员工名称 */
	name?: string;
}

/**
 * 员工信息数据传输对象
 */
export interface EmployeeDTO {
	/** 地址 */
	address?: string;
	/** 邮箱 */
	email?: string;
	/** 名称 */
	name?: string;
	/** 组织名称 */
	orgName?: string;
	/** 组织ID */
	orgId?: string;
	/** 岗位 */
	job?: string;
	/** 性别 */
	sex?: string;
	/** 电话 */
	tel?: string;
	/** 员工编号 */
	userID?: string;
	/** 状态 */
	status?: string;
}

// ==================== 接口函数 ====================

/**
 * 添加组织接口
 * @description 添加新的组织
 */
export function addOrganization<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddOrganizationParams>({
		url: "/j4-orgmanager/organization/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				description: "",
				orgname: "",
				parentOrgId: "",
			},
		},
		options,
	});
}

/**
 * 关联员工接口
 * @description 将员工关联到组织
 */
export function associateEmployee<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AssociateEmployeeParams>({
		url: "/j4-orgmanager/organization/associate-employee",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				orgId: "",
				userIds: [],
			},
		},
		options,
	});
}

/**
 * 删除组织接口
 * @description 删除指定组织
 */
export function deleteOrganization<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteOrganizationParams>({
		url: "/j4-orgmanager/organization/delete",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: {
				orgId: "",
			},
		},
		options,
	});
}

/**
 * 获取组织名称树接口
 * @description 获取组织结构树
 */
export function getOrganizationTree<T = OrganizationTreeNode[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j4-orgmanager/organization/get-org-tree",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 修改组织接口
 * @description 修改组织信息
 */
export function modifyOrganization<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyOrganizationParams>({
		url: "/j4-orgmanager/organization/modify",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				orgId: "",
				description: "",
				orgname: "",
				parentOrgId: "",
			},
		},
		options,
	});
}

/**
 * 关联员工之前要查询接口
 * @description 关联员工前查询可用员工列表
 */
export function queryBeforeAssociate<T = PageDTO<EmployeeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryBeforeAssociateParams>({
		url: "/j4-orgmanager/organization/query-before-associate",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				orgId: "",
				pageIndex: 1,
				pageSize: 10,
				name: "",
			},
		},
		options,
	});
}

/**
 * 获取组织员工列表接口
 * @description 获取指定组织的员工列表
 */
export function getOrgEmployeeList<T = PageDTO<EmployeeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetOrgEmployeeListParams>({
		url: "/j4-orgmanager/organization/get-org-employee-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				orgId: "",
				pageIndex: 1,
				pageSize: 10,
				name: "",
			},
		},
		options,
	});
}
