import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 排班详情子对象
 */
export interface ScheduleDetailItem {
	/** 班次id */
	classesId?: string;
	/** 一周的第几天 */
	day: number;
	/** 周标识（一个月的第几周） */
	weekFlag: number;
	/** 工作日类型 */
	workdayType: string;
}

/**
 * 排班添加数据传输对象
 */
export interface AddScheduleParams {
	/** 排班详情数组 */
	details: ScheduleDetailItem[];
	/** 排班名称 */
	name: string;
	/** 排班周期 */
	scheduleCycle: string;
	/** 排班类型 */
	scheduleType: string;
	/** 店铺ID */
	storeId: string;
}

/**
 * 修改排班设置参数
 */
export interface ModifyScheduleParams {
	/** 排班ID */
	scheduleId: string;
	/** 排班详情数组 */
	details?: ScheduleDetailItem[];
	/** 排班名称 */
	name?: string;
	/** 排班周期 */
	scheduleCycle?: string;
	/** 排班类型 */
	scheduleType?: string;
	/** 店铺ID */
	storeId?: string;
}

/**
 * 删除排班设置参数
 */
export interface DeleteScheduleParams {
	/** 排班ID */
	scheduleId: number;
}

/**
 * 查询排班设置列表参数
 */
export interface QueryScheduleListParams {
	/** 班次名称（模糊查询） */
	name?: string;
	/** 页码（从1开始） */
	pageIndex: number;
	/** 每页数量 */
	pageSize: number;
	/** 状态 */
	state?: string;
}

/**
 * 排班信息视图对象
 */
export interface ScheduleInfoDTO {
	/** 生效时间 */
	computeTime?: string;
	/** 创建时间 */
	createTime?: string;
	/** 班次名称 */
	name?: string;
	/** 排班周期 */
	scheduleCycle?: string;
	/** 排班ID */
	scheduleId?: string;
	/** 排班类型 */
	scheduleType?: string;
	/** 状态 */
	state?: string;
	/** 店铺ID */
	storeId?: string;
}

/**
 * 添加关联员工参数
 */
export interface AddAssociatedPersonnelParams {
	/** 创建时间 */
	createTime?: string;
	/** 班次ID */
	scheduleId: string;
	/** 员工ID */
	staffId: string;
	/** 员工姓名 */
	staffName: string;
	/** 状态 */
	statusCd?: number;
	/** 组织ID */
	storeId: string;
}

/**
 * 删除排班关联人员参数
 */
export interface DeleteAssociatedPersonnelParams {
	/** 关联人员ID */
	associatedId: string;
}

/**
 * 获取排班设置详情参数
 */
export interface GetScheduleDetailParams {
	/** 排班ID */
	scheduleId: string;
}

/**
 * 获取关联人员列表参数
 */
export interface GetAssociatedPersonnelListParams {
	/** 排班ID */
	scheduleId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 员工名称 */
	staffName?: string;
}

/**
 * 启用/停用排班设置参数
 */
export interface ToggleScheduleStatusParams {
	/** 排班ID */
	scheduleId: number;
}

/**
 * 排班设置名称列表项
 */
export interface ScheduleNameItem {
	/** 排班ID */
	scheduleId?: string;
	/** 排班名称 */
	name?: string;
}

/**
 * 关联人员数据传输对象
 */
export interface AssociatedPersonnelDTO {
	/** 关联人员ID */
	associatedId?: string;
	/** 员工ID */
	staffId?: string;
	/** 员工姓名 */
	staffName?: string;
	/** 状态 */
	statusCd?: number;
	/** 创建时间 */
	createTime?: string;
}

// ==================== 接口函数 ====================

/**
 * 删除排班关联人员接口
 * @description 删除排班关联的人员
 */
export function deleteAssociatedPersonnel<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteAssociatedPersonnelParams>({
		url: "/j4-orgmanager/scheduling/delete-associated-personnel",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: {
				associatedId: "",
			},
		},
		options,
	});
}

/**
 * 删除排班设置接口
 * @description 删除指定的排班设置
 */
export function deleteSchedule<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, DeleteScheduleParams>({
		url: "/j4-orgmanager/scheduling/delete/{scheduleId}",
		httpParamWay: "path",
		config: {
			method: "DELETE",
			url: "/j4-orgmanager/scheduling/delete/0",
		},
		options,
	});
}

/**
 * 获取排版设置列表接口
 * @description 获取排班设置列表，支持条件查询和分页
 */
export function queryScheduleList<T = PageDTO<ScheduleInfoDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryScheduleListParams>({
		url: "/j4-orgmanager/scheduling/listSchedule",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				name: "",
				pageIndex: 1,
				pageSize: 10,
				state: "",
			},
		},
		options,
	});
}

/**
 * 获取排班设置名称列表接口
 * @description 获取所有排班设置的名称列表
 */
export function getScheduleNameList<T = ScheduleNameItem[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j4-orgmanager/scheduling/schedule-name-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 添加排班关联人员接口
 * @description 为排班设置添加关联的员工
 */
export function addAssociatedPersonnel<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddAssociatedPersonnelParams>({
		url: "/j4-orgmanager/scheduling/save-Associated-Personnel",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				createTime: "",
				scheduleId: "",
				staffId: "",
				staffName: "",
				statusCd: 1,
				storeId: "",
			},
		},
		options,
	});
}

/**
 * 添加排班设置接口
 * @description 创建新的排班设置
 */
export function addSchedule<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddScheduleParams>({
		url: "/j4-orgmanager/scheduling/saveSchedule",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				details: [],
				name: "",
				scheduleCycle: "",
				scheduleType: "",
				storeId: "",
			},
		},
		options,
	});
}

/**
 * 获取排班设置详情接口
 * @description 获取指定排班设置的详细信息
 */
export function getScheduleDetail<T = ScheduleInfoDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetScheduleDetailParams>({
		url: "/j4-orgmanager/scheduling/schedule-detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				scheduleId: "",
			},
		},
		options,
	});
}

/**
 * 获取关联人员列表接口
 * @description 获取排班设置关联的人员列表
 */
export function getAssociatedPersonnelList<T = PageDTO<AssociatedPersonnelDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetAssociatedPersonnelListParams>({
		url: "/j4-orgmanager/scheduling/associated-personnel-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				scheduleId: "",
				pageIndex: 1,
				pageSize: 10,
				staffName: "",
			},
		},
		options,
	});
}

/**
 * 启用/停用排班设置接口
 * @description 启用或停用指定的排班设置
 */
export function toggleScheduleStatus<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, ToggleScheduleStatusParams>({
		url: "/j4-orgmanager/scheduling/status/{scheduleId}",
		httpParamWay: "path",
		config: {
			method: "PUT",
			url: "/j4-orgmanager/scheduling/status/0",
		},
		options,
	});
}

/**
 * 修改排班设置接口
 * @description 修改排班设置信息
 */
export function modifySchedule<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyScheduleParams>({
		url: "/j4-orgmanager/scheduling/modify-schedule",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				scheduleId: "",
				details: [],
				name: "",
				scheduleCycle: "",
				scheduleType: "",
				storeId: "",
			},
		},
		options,
	});
}
