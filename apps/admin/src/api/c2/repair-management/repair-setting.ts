import { useRequest } from "@/composables/use-request";

/**
 * 报修设置类型信息
 */
export interface RepairSettingGetDTO {
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
 * 获取报修设置类型列表
 * @description
 * 获取报修设置类型分页列表
 */
export function queryRepairSettingTypeList<T = PageDTO<RepairSettingGetDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/repair-setting/repair-setting-type/query",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				repair_type_name: "",
				repair_way: "",
				repair_setting_type: "",
				public_area: "",
				return_visit_flag: "",
			},
		},
	});
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
 * 获取报修师傅列表（条件+分页）
 * @description
 * 获取报修师傅分页列表
 */
export function queryAllRepairWorker<T = PageDTO<RepairWorkerQueryDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				repair_type_name: "",
				community_id: "",
			},
		},
	});
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
 * 添加报修设置类型
 * @description
 * 新增报修设置类型
 */
export function addRepairSettingType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairSettingAddDTO>({
		url: "/comm-c2-repairsetting/repair-setting/repair-setting-type/add",
		options,
		httpParamWay: "body",
		config: {
			method: "post",
			data: {
				repair_type_name: "",
				repair_setting_type: "",
				repair_way: "",
				public_area: "",
				is_show: "",
				notify_way: "",
				return_visit_flag: "",
				community_id: "",
				remark: "",
			},
		},
	});
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
 * 添加报修师傅
 * @description
 * 新增报修师傅
 */
export function addRepairWorker<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairWorkerAddDTO>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker/add",
		options,
		httpParamWay: "body",
		config: {
			method: "post",
			data: {
				org_name: "",
				staff_name: "",
				repair_type_name: "",
				community_id: "",
			},
		},
	});
}

/**
 * 修改报修设置类型参数
 */
export interface RepairSettingModifyDTO {
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
	community_id?: string;
	/** 填写说明 */
	remark?: string;
}

/**
 * 修改报修设置类型
 * @description
 * 修改报修设置类型信息
 */
export function modifyRepairSettingType<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairSettingModifyDTO>({
		url: "/comm-c2-repairsetting/repair-setting/repair-setting-type/modify",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				repair_type_name: "",
				repair_setting_type: "",
				repair_way: "",
				public_area: "",
				is_show: "",
				notify_way: "",
				return_visit_flag: "",
				community_id: "",
				remark: "",
			},
		},
	});
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
 * 变更报修师傅
 * @description
 * 修改报修师傅信息
 */
export function modifyRepairWorker<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairWorkerModifyDTO>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker/modify",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				state: "",
				staff_id: "",
				remark: "",
				community_id: "",
				repair_type_name: "",
			},
		},
	});
}

/**
 * 删除报修设置类型
 * @description
 * 删除指定的报修设置类型
 */
export function removeRepairSettingType<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/comm-c2-repairsetting/repair-setting/repair-setting-type/delete",
		options,
		httpParamWay: "body",
		config: {
			method: "delete",
			data: [],
		},
	});
}

/**
 * 删除报修师傅
 * @description
 * 删除指定的报修师傅
 */
export function removeRepairWorker<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker/delete",
		options,
		httpParamWay: "body",
		config: {
			method: "delete",
			data: [],
		},
	});
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
 * 查询符合条件的所有维修师傅的名字
 * @description
 * 获取所有符合条件的维修师傅姓名列表
 */
export function queryAllRepairWorkerName<T = RepairWorkerNameDTO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/repair-setting/repair-worker-name/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				repair_type_name: "",
				repair_id: "",
				community_id: "",
			},
		},
	});
}
