import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加班次数据传输对象
 */
export interface AddShiftParams {
	/** 班次名称 */
	name: string;
	/** 备注说明 */
	remark: string;
	/** 工作时间段 */
	workTime: string[];
}

/**
 * 修改班次信息参数
 */
export interface ModifyShiftParams {
	/** 班次编号 */
	classesId: string;
	/** 班次名称 */
	name?: string;
	/** 备注说明 */
	remark?: string;
	/** 工作时间段 */
	workTime?: string[];
}

/**
 * 获取班次列表参数
 */
export interface GetShiftListParams {
	/** 班次名称(可模糊) */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 班次列表显示对象
 */
export interface ShiftListDTO {
	/** 班次编号 */
	classesId?: string;
	/** 创建时间 */
	createTime?: string;
	/** 班次名称 */
	name?: string;
	/** 备注说明 */
	remark?: string;
	/** 状态 */
	state?: string;
	/** 工作时间段 */
	workTime?: string[];
}

/**
 * 班次名称列表项
 */
export interface ShiftNameItem {
	/** 班次编号 */
	classesId?: string;
	/** 班次名称 */
	name?: string;
}

/**
 * 班次信息回显对象
 */
export interface ShiftInfoDTO {
	/** 班次编号 */
	classesId?: string;
	/** 班次名称 */
	name?: string;
	/** 备注说明 */
	remark?: string;
	/** 状态 */
	state?: string;
	/** 工作时间段 */
	workTime?: string[];
	/** 创建时间 */
	createTime?: string;
}

/**
 * 修改班次状态参数
 */
export interface ModifyShiftStatusParams {
	/** 班次编号 */
	classesId: string;
	/** 状态 */
	state: string;
}

/**
 * 删除班次参数
 */
export interface DeleteShiftParams {
	/** 班次编号 */
	classesId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加班次信息接口
 * @description 添加新的班次信息
 */
export function addShiftSetting<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddShiftParams>({
		url: "/j4-orgmanager/shiftSetting/addShiftSetting",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				name: "",
				remark: "",
				workTime: [],
			},
		},
		options,
	});
}

/**
 * 修改班次信息接口
 * @description 修改班次信息
 */
export function modifyShiftInfo<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyShiftParams>({
		url: "/j4-orgmanager/shiftSetting/modifyShiftInfo",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				classesId: "",
				name: "",
				remark: "",
				workTime: [],
			},
		},
		options,
	});
}

/**
 * 获取班次列表接口
 * @description 获取班次列表，支持条件查询和分页
 */
export function listShiftSetting<T = PageDTO<ShiftListDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetShiftListParams>({
		url: "/j4-orgmanager/shiftSetting/listShiftSetting",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				name: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 获取班次名称列表接口
 * @description 获取所有班次的名称列表
 */
export function getShiftNameList<T = ShiftNameItem[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j4-orgmanager/shiftSetting/listShiftSettingName",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 班次信息回显接口
 * @description 获取指定班次的详细信息
 */
export function getShiftInfo<T = ShiftInfoDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { classesId: string }>({
		url: "/j4-orgmanager/shiftSetting/get-shift-info",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				classesId: "",
			},
		},
		options,
	});
}

/**
 * 修改班次状态接口
 * @description 修改班次的状态（启用/停用）
 */
export function modifyShiftStatus<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, { classId: string }>({
		url: "/j4-orgmanager/shiftSetting/{classId}",
		httpParamWay: "path",
		config: {
			method: "PUT",
			url: "/j4-orgmanager/shiftSetting/",
		},
		options,
	});
}

/**
 * 删除班次接口
 * @description 删除指定的班次
 */
export function deleteShift<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteShiftParams>({
		url: "/j4-orgmanager/shiftSetting/delete-shift",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: {
				classesId: "",
			},
		},
		options,
	});
}
