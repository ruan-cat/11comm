import { useRequest } from "@/composables/use-request";

/**
 * 获取关联员工列表参数
 */
export interface QueryStaffParams {
	/** 数据权限ID */
	dpId?: string;
	/** 查询页码 */
	pageIndex?: string;
	/** 查询条数 */
	pageSize: number;
	/** 员工姓名 */
	staffName?: string;
	/** 员工手机号 */
	tel?: string;
}

/**
 * 添加关联员工数据传输模型
 */
export interface AddStaffDTO {
	/** 数据权限ID */
	dpId: string;
	/** 员工ID数组 */
	staffIds: string[];
}

/**
 * 删除关联员工参数
 */
export interface RemoveStaffParams {
	/** 关联员工ID */
	staffId: string;
}

/**
 * 关联员工数据传输模型
 */
export interface StaffDTO {
	/** 关联员工地址 */
	address: string;
	/** 关联员工邮箱 */
	email: string;
	/** 关联员工手机号 */
	mobile: string;
	/** 关联员工性别 */
	sex: number;
	/** 关联员工姓名 */
	staffname: string;
}

/**
 * 获取关联员工列表（条件+分页）
 */
export function queryStaff<T = PageDTO<StaffDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryStaffParams>({
		url: "/orgmanager/dataprivilege/staff",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				dpId: "",
				pageIndex: "",
				pageSize: 10,
				staffName: "",
				tel: "",
			},
		},
	});
}

/**
 * 新增关联员工
 */
export function addStaff<T = number>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddStaffDTO>({
		url: "/orgmanager/dataprivilege/staff",
		httpParamWay: "body",
		options,
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				dpId: "",
				staffIds: [],
			},
		},
	});
}

/**
 * 删除关联员工
 */
export function removeStaff<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, RemoveStaffParams>({
		url: "/orgmanager/dataprivilege/staff/{staffId}",
		httpParamWay: "path",
		options,
		config: {
			method: "DELETE",
			url: "/orgmanager/dataprivilege/staff/{staffId}",
		},
	});
}
