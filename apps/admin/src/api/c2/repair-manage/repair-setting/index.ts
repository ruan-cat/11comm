import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 报修设置类型信息
 */
export interface RepairSettingGetDTO {
	/** 设置ID */
	setting_id?: string;
	/** 类型名称 */
	repair_type_name?: string;
	/** 报修类型设置 */
	repair_setting_type?: string;
	/** 派单方式 */
	repair_way?: string;
	/** 社区id */
	public_area?: string;
	/** 业主端是否展示  Y 是  N 否 */
	is_show?: string;
	/** 通知方式  SMS 短信 WECHAT 微信 */
	notify_way?: string;
	/** 是否回访 */
	return_visit_flag?: string;
	/** 数据创建时间 */
	create_time?: string;
}

/**
 * 获取报修设置类型列表查询参数
 */
export interface QueryRepairSettingTypeListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区id */
	community_id: string;
	/** 类型名称 */
	repair_type_name?: string;
	/** 派单方式 */
	repair_way?: string;
	/** 报修类型设置 */
	repair_setting_type?: string;
	/** 区域 */
	public_area?: string;
	/** 是否回访 */
	return_visit_flag?: string;
}

/**
 * 报修师傅信息
 */
export interface RepairWorkerQueryDTO {
	/** 维修师傅id */
	staff_id: string;
	/** 维修师傅姓名 */
	staff_name: string;
	/** 维修类型名称 */
	repair_type_name: string;
	/** 维修师傅状态 */
	state: string;
	/** 维修师傅状态中文文本 */
	state_txt: string;
	/** 备注 */
	remark: string;
	/** 数据创建时间 */
	create_time: string;
}

/**
 * 获取报修师傅列表（条件+分页）查询参数
 */
export interface QueryAllRepairWorkerParams {
	/** 查询页码 */
	pageIndex: number;
	/** 每页查询条数 */
	pageSize: number;
	/** 报修类型名称 */
	repair_type_name: string;
	/** 小区ID */
	community_id: string;
}

/**
 * 添加报修设置类型参数
 */
export interface RepairSettingAddDTO {
	/** 类型名称 */
	repair_type_name: string;
	/** 报修类型设置 */
	repair_setting_type: string;
	/** 派单方式 */
	repair_way: string;
	/** 是否为公共区域 */
	public_area: string;
	/** 业主端是否展示  Y 是  N 否 */
	is_show: string;
	/** 通知方式  SMS 短信 WECHAT 微信 */
	notify_way: string;
	/** 是否回访 */
	return_visit_flag: string;
	/** 社区id */
	community_id: string;
	/** 填写说明 */
	remark?: string;
}

/**
 * 添加报修师傅参数
 */
export interface RepairWorkerAddDTO {
	/** 组织名称 */
	org_name: string;
	/** 维修师傅姓名 */
	staff_name: string;
	/** 维修类型名称 */
	repair_type_name: string;
	/** 小区id */
	community_id: string;
}

/**
 * 修改报修设置类型参数
 */
export interface RepairSettingModifyDTO {
	/** setting_id */
	setting_id: string;
	/** 类型名称 */
	repair_type_name: string;
	/** 报修类型设置 */
	repair_setting_type: string;
	/** 派单方式 */
	repair_way: string;
	/** 是否为公共区域 */
	public_area: string;
	/** 业主端是否展示  Y 是  N 否 */
	is_show: string;
	/** 通知方式  SMS 短信 WECHAT 微信 */
	notify_way: string;
	/** 是否回访 */
	return_visit_flag: string;
	/** 填写说明 */
	remark?: string;
}

/**
 * 变更报修师傅参数
 */
export interface RepairWorkerModifyDTO {
	/** 维修师傅状态 */
	state: string;
	/** 维修师傅id */
	staff_id: string;
	/** 备注 */
	remark: string;
	/** 小区id */
	community_id: string;
	/** 维修类型名称 */
	repair_type_name: string;
}

/**
 * 维修师傅名字信息
 */
export interface RepairWorkerNameDTO {
	/** 维修类型名称 */
	repair_type_name?: string;
	/** 维修师傅姓名 */
	staff_name?: string;
	/** 报修工单id */
	repair_id?: string;
}

/**
 * 查询符合条件的所有维修师傅的名字参数
 */
export interface QueryAllRepairWorkerNameParams {
	/** 报修工单id */
	repair_id: string;
	/** 小区id */
	community_id: string;
	/** 维修类型名称 */
	repair_type_name?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取报修设置类型列表
 * @description 根据条件查询报修设置类型列表，支持分页
 */
export function queryRepairSettingTypeList<T = PageDTO<RepairSettingGetDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRepairSettingTypeListParams>({
		url: "/comm-c2-repairsetting/repair-setting/repair-setting-type/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 获取报修师傅列表（条件+分页）
 * @description 根据条件查询报修师傅列表，支持分页
 */
export function queryAllRepairWorker<T = PageDTO<RepairWorkerQueryDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAllRepairWorkerParams>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				repair_type_name: "",
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 添加报修设置类型
 * @description 新增一个报修设置类型配置
 */
export function addRepairSettingType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairSettingAddDTO>({
		url: "/comm-c2-repairsetting/repair-setting/repair-setting-type/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				repair_type_name: "",
				repair_setting_type: "",
				repair_way: "",
				public_area: "",
				is_show: "",
				notify_way: "",
				return_visit_flag: "",
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 添加报修师傅
 * @description 新增一个报修师傅信息
 */
export function addRepairWorker<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairWorkerAddDTO>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				org_name: "",
				staff_name: "",
				repair_type_name: "",
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 修改报修设置类型
 * @description 根据setting_id修改报修设置类型配置
 */
export function modifyRepairSettingType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairSettingModifyDTO>({
		url: "/comm-c2-repairsetting/repair-setting/repair-setting-type/modify",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				setting_id: "",
				repair_type_name: "",
				repair_setting_type: "",
				repair_way: "",
				public_area: "",
				is_show: "",
				notify_way: "",
				return_visit_flag: "",
			},
		},
		options,
	});
}

/**
 * 变更报修师傅
 * @description 修改报修师傅的状态和备注信息
 */
export function modifyRepairWorker<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairWorkerModifyDTO>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker/modify",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				state: "",
				staff_id: "",
				remark: "",
				community_id: "",
				repair_type_name: "",
			},
		},
		options,
	});
}

/**
 * 删除报修设置类型
 * @description 批量删除报修设置类型，传入setting_id数组
 */
export function removeRepairSettingType<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/comm-c2-repairsetting/repair-setting/repair-setting-type/delete",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}

/**
 * 删除报修师傅
 * @description 批量删除报修师傅，传入staff_id数组
 */
export function removeRepairWorker<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker/delete",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}

/**
 * 查询符合条件的所有维修师傅的名字
 * @description 根据报修工单ID和社区ID查询可用的维修师傅信息
 */
export function queryAllRepairWorkerName<T = RepairWorkerNameDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAllRepairWorkerNameParams>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker-name/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				repair_id: "",
				community_id: "",
			},
		},
		options,
	});
}
