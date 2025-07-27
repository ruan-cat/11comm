import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 查询已关联员工列表参数
 */
export interface QueryRelatedStaffParams {
	/** 员工名称 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 权限组id */
	pgId?: string;
	/** 数据状态 */
	statusCd?: string;
}

/**
 * 员工列表传输数据模型
 */
export interface StaffListDataModel {
	/** 地址 */
	address?: string;
	/** 邮箱 */
	email?: string;
	/** 主键ID */
	id: string;
	/** 名称 */
	name: string;
	/** 性别 */
	sex?: string;
	/** 手机号 */
	tel: string;
	/** 用户ID */
	userId: string;
}

// ==================== 接口函数 ====================

/**
 * 获取已关联员工列表（条件+分页）
 * @description 根据角色查询列表
 */
export function queryRelatedStaffList<T = PageDTO<StaffListDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRelatedStaffParams>({
		url: "/j2-orgmanager/group/role/emplist",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				name: "",
				pageIndex: 1,
				pageSize: 10,
				pgId: "",
				statusCd: "",
			},
		},
		options,
	});
}

/**
 * 新增关联
 * @description 根据ID新增关联
 */
export function addRelatedStaff<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string>({
		url: "/j2-orgmanager/group/role/emplist",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: "",
		},
		options,
	});
}

/**
 * 删除关联
 * @description 根据ID删除关联
 */
export function removeRelatedStaff<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string>({
		url: "/j2-orgmanager/group/role/emplist",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: "",
		},
		options,
	});
}
