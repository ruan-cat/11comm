/**
 * 添加用户接口
 * @description
 * 添加新用户
 */
export interface AddUserDTO {
	/**
	 * 部门对象数组
	 */
	departmentIds: string[];
	/**
	 * 邮箱
	 */
	email?: string;
	/**
	 * 手机号码
	 */
	mobilePhone?: string;
	/**
	 * 办公电话
	 */
	officePhone?: string;
	/**
	 * 密码
	 */
	password: string;
	/**
	 * 用户姓名
	 */
	realname?: string;
	/**
	 * 角色对象数组
	 */
	roleIds: string[];
	/**
	 * 用户类型
	 * 1-4 1代表 系统用户, 2代表接口用户, 3代表公司权限 4代表当前用户接口
	 */
	userType?: string;
	/**
	 * 用户账号
	 */
	username: string;
}

/**
 * 添加用户接口
 * @description
 * 添加新用户
 */
export function sysManagerAddUser<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddUserDTO>({
		url: "/sys-manager/adduser",
		options,
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				departmentIds: [],
				password: "",
				roleIds: [],
				username: "",
			},
		},
	});
}

/**
 * 删除用户接口
 * @description
 * 删除指定用户
 */
export function sysManagerDeleteUser<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, { userId: string }>({
		url: "/sys-manager/{userId}",
		options,
		httpParamWay: "path",
		config: {
			method: "DELETE",
			url: "/sys-manager/{userId}",
		},
	});
}

/**
 * 重置密码接口参数
 * @description
 * 重置用户密码
 */
export interface ResetPasswordDTO {
	/**
	 * 用户ID
	 */
	userId: string;
	/**
	 * 新密码
	 */
	newPassword: string;
}

/**
 * 重置用户密码接口
 * @description
 * 重置指定用户的密码
 */
export function sysManagerResetPassword<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ResetPasswordDTO>({
		url: "/sys-manager/reset-password",
		options,
		httpParamWay: "query",
		config: {
			method: "POST",
			data: {
				userId: "",
				newPassword: "",
			},
		},
	});
}

/**
 * 组织机构显示数据对象
 */
export interface DepartmentDisplayDTO {
	/**
	 * 组织机构名称
	 */
	departname: string;

	/**
	 * 组织机构id
	 */
	id: string;

	/**
	 * 组织机构类型
	 */
	orgType: string;
}

/**
 * 获取组织名称树接口
 * @description
 * 获取组织机构的层级结构数据
 */
export function sysManagerQueryDepartmentAll<T = PageDTO<DepartmentDisplayDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/sys-manager/query-department-all",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {},
		},
	});
}
