import { useRequest } from "@/composables/use-request";

/**
 * 报修待办-暂停参数
 */
export interface RepairToDoUpdateToSuspendDTO {
	/** 报修单id */
	repair_id: string;
	/** 暂停原因 */
	context: string;
}

/**
 * 报修管理-报修待办-暂停
 * @description
 * 暂停指定报修单
 */
export function modifyStateToSuspend<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairToDoUpdateToSuspendDTO>({
		url: "/comm-c2-repairsetting/repair-to-do/modify-state-suspend",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				repair_id: "",
				context: "",
			},
		},
	});
}

/**
 * 报修待办查询项
 */
export interface RepairToDoQueryDTO {
	/** 报修单id */
	repair_id?: string;
	/** 报修人姓名 */
	repair_name?: string;
	/** 电话 */
	tel?: string;
	/** 状态 */
	state?: string;
	/** 位置（报修对象名称） */
	repair_obj_name?: string;
	/** 维修类型名称 */
	repair_type_name?: string;
	/** 预约时间 */
	appointment_time?: string;
	/** 状态详情 */
	state_detail?: string;
	/** 上一级维修师傅ID */
	pre_staff_id?: string;
	/** 上一级维修师傅姓名 */
	pre_staff_name?: string;
}

/**
 * 报修待办--分页查询获取待办列表
 * @description
 * 获取报修待办分页列表
 */
export function queryAllRepairToDo<T = PageDTO<RepairToDoQueryDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/repair-to-do/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
				staff_id: "",
				repair_id: "",
				repair_name: "",
				tel: "",
				repair_type_name: "",
				state: "",
			},
		},
	});
}

/**
 * 报修类型信息
 */
export interface RepairToDoQueryAllRepairTypeDTO {
	/** 维修类型名称 */
	repair_type_name?: string;
	/** 报修类型ID */
	repair_type?: string;
}

/**
 * 查询该小区中的所有报修类型
 * @description
 * 获取指定小区中的所有报修类型列表
 */
export function queryAllRepairType<T = PageDTO<RepairToDoQueryAllRepairTypeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/repair-to-do/query-all-repair-type",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				community_id: "",
			},
		},
	});
}

/**
 * 报修师傅信息（按报修类型查询）
 */
export interface RepairToDoQueryAllStaffDTO {
	/** 维修师傅姓名 */
	staff_name?: string;
	/** 维修师傅ID */
	staff_id?: string;
}

/**
 * 查询该报修类型对应的所有报修师傅
 * @description
 * 根据报修类型ID获取所有报修师傅列表
 */
export function queryAllStaff<T = PageDTO<RepairToDoQueryAllStaffDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/repair-to-do/query-all-staff",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				repair_type: "",
			},
		},
	});
}

/**
 * 报修待办-改单处理参数
 */
export interface RepairToDoUpdateDTO {
	/** 报修单id */
	repair_id: string;
	/** 报修内容 */
	context: string;
	/** 维修师傅ID */
	staff_id: string;
}

/**
 * 报修待办--改单处理
 * @description
 * 修改报修待办信息
 */
export function modifyRepairToDo<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairToDoUpdateDTO>({
		url: "/comm-c2-repairsetting/repair-to-do/modify",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				repair_id: "",
				context: "",
				staff_id: "",
			},
		},
	});
}

/**
 * 报修待办-退单处理参数
 */
export interface RepairToDoUpdateToRemoveDTO {
	/** 报修单id */
	repair_id: string;
	/** 退单原因 */
	context: string;
}

/**
 * 报修待办--退单处理
 * @description
 * 退单处理报修待办
 */
export function removeRepairToDo<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairToDoUpdateToRemoveDTO>({
		url: "/comm-c2-repairsetting/repair-to-do/delete",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				repair_id: "",
				context: "",
			},
		},
	});
}

/**
 * 维修材料项
 */
export interface RepairMaterialItemDTO {
	/** 商品ID */
	res_id: string;
	/** 商品材料名称 */
	material_name: string;
	/** 商品材料数量 */
	material_count: number;
	/** 商品材料单位 */
	material_unit?: string;
	/** 商品材料规格 */
	material_specification?: string;
	/** 商品材料价格 */
	material_price?: number;
}

/**
 * 报修待办办结处理参数
 */
export interface RepairToDoUpdateToFinishDTO {
	/** 报修单id */
	repair_id: string;
	/** 是否使用材料 */
	is_material: string;
	/** 商品材料列表 */
	materials?: RepairMaterialItemDTO[];
	/** 办结处理意见 */
	context: string;
	/** 维修前照片路径 */
	repair_before_photo_path: string[];
	/** 维修后照片路径 */
	repair_after_photo_path: string[];
	/** 房间ID (如果是房屋报修则需要房间ID，否则不需要) */
	room_id?: string;
	/** 支付方式 (现金/微信转账/微信公众号/支付宝) */
	pay_type?: string;
	/** 总价(如果是房屋报修则需要总价，否则不需要) */
	total_price?: string;
}

/**
 * 报修待办--办结处理
 */
export function modifyStateToFinish<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairToDoUpdateToFinishDTO>({
		url: "/comm-c2-repairsetting/repair-to-do/finish",
		options,
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				repair_id: "",
				is_material: "",
				materials: [],
				context: "",
				repair_before_photo_path: [],
				repair_after_photo_path: [],
				room_id: "",
				pay_type: "",
				total_price: "",
			},
		},
	});
}
