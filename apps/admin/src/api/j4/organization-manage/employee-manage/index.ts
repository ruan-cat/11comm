import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加员工参数
 */
export interface AddEmployeeParams {
	/** 地址 */
	address: string;
	/** 关联组织 */
	associatedOrg: string;
	/** 邮箱 */
	email?: string;
	/** 岗位 */
	job: string;
	/** 名称 */
	name: string;
	/** 性别 */
	sex: string;
	/** 电话 */
	tel: string;
}

/**
 * 员工列表查询参数
 */
export interface GetEmployeeListParams {
	/** 名称 */
	name?: string;
	/** 组织id */
	orgId?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 手机号 */
	tel?: string;
	/** 员工编号 */
	userID?: string;
}

/**
 * 员工列表数据传输对象
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

/**
 * 修改员工参数
 */
export interface ModifyEmployeeParams {
	/** 员工编号 */
	userID: string;
	/** 地址 */
	address?: string;
	/** 关联组织 */
	associatedOrg?: string;
	/** 邮箱 */
	email?: string;
	/** 岗位 */
	job?: string;
	/** 名称 */
	name?: string;
	/** 性别 */
	sex?: string;
	/** 电话 */
	tel?: string;
}

/**
 * 删除员工参数
 */
export interface DeleteEmployeeParams {
	/** 员工编号 */
	userId: string;
}

/**
 * 员工基础信息
 */
export interface EmployeeBaseInfo {
	/** 员工编号 */
	userID?: string;
	/** 名称 */
	name?: string;
	/** 地址 */
	address?: string;
	/** 邮箱 */
	email?: string;
	/** 岗位 */
	job?: string;
	/** 性别 */
	sex?: string;
	/** 电话 */
	tel?: string;
	/** 组织信息 */
	orgInfo?: string;
}

/**
 * 员工组织权限信息
 */
export interface EmployeeOrgPermissionInfo {
	/** 员工编号 */
	userID?: string;
	/** 组织权限列表 */
	orgPermissions?: string[];
	/** 角色信息 */
	roleInfo?: string[];
}

/**
 * 员工排班信息
 */
export interface EmployeeScheduleInfo {
	/** 员工编号 */
	userID?: string;
	/** 排班信息 */
	scheduleInfo?: string[];
	/** 当前班次 */
	currentShift?: string;
}

/**
 * 重置密码参数
 */
export interface ResetPasswordParams {
	/** 员工编号 */
	userID: string;
}

// ==================== 接口函数 ====================

/**
 * 添加员工接口
 * @description 添加新的员工信息
 */
export function addEmployee<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, AddEmployeeParams>({
		url: "/j4-orgmanager/employee/add-emp",
		httpParamWay: "query",
		config: {
			method: "POST",
			params: {
				address: "",
				associatedOrg: "",
				email: "",
				job: "",
				name: "",
				sex: "",
				tel: "",
			},
		},
		options,
	});
}

/**
 * 删除员工接口
 * @description 删除指定员工
 */
export function deleteEmployee<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteEmployeeParams>({
		url: "/j4-orgmanager/employee/delete-emp",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				userId: "",
			},
		},
		options,
	});
}

/**
 * 获得员工排班信息接口
 * @description 获取指定员工的排班信息
 */
export function getEmployeeScheduleInfo<T = EmployeeScheduleInfo>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { userID: string }>({
		url: "/j4-orgmanager/employee/get-emp-schedule",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				userID: "",
			},
		},
		options,
	});
}

/**
 * 获取员工列表接口
 * @description 获取员工列表，支持条件查询和分页
 */
export function getEmployeeList<T = PageDTO<EmployeeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetEmployeeListParams>({
		url: "/j4-orgmanager/employee/get-empList",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				name: "",
				orgId: "",
				pageIndex: 1,
				pageSize: 10,
				tel: "",
				userID: "",
			},
		},
		options,
	});
}

/**
 * 修改员工接口
 * @description 修改员工信息
 */
export function modifyEmployee<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyEmployeeParams>({
		url: "/j4-orgmanager/employee/modify-emp",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				userID: "",
				address: "",
				associatedOrg: "",
				email: "",
				job: "",
				name: "",
				sex: "",
				tel: "",
			},
		},
		options,
	});
}

/**
 * 获取员工基础信息接口
 * @description 获取指定员工的基础信息
 */
export function getEmployeeBaseInfo<T = EmployeeBaseInfo>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { userID: string }>({
		url: "/j4-orgmanager/employee/get-emp-base-info",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				userID: "",
			},
		},
		options,
	});
}

/**
 * 获取员工组织权限信息接口
 * @description 获取指定员工的组织权限信息
 */
export function getEmployeeOrgPermissionInfo<T = EmployeeOrgPermissionInfo>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { userID: string }>({
		url: "/j4-orgmanager/employee/get-emp-org-permission",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				userID: "",
			},
		},
		options,
	});
}

/**
 * 重置密码接口
 * @description 重置指定员工的密码
 */
export function resetEmployeePassword<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ResetPasswordParams>({
		url: "/j4-orgmanager/employee/reset-password",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				userID: "",
			},
		},
		options,
	});
}
