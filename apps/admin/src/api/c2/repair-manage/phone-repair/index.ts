import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 电话报修信息
 */
export interface TellRepairDTO {
	/** 小区ID */
	community_id: string;
	/** 电话报修对象类型,001小区,002楼栋,003单元,004 房屋 */
	repair_obj_type: string;
	/** 电话报修对象名称 */
	repair_obj_name: string;
	/** 电话报修类型 */
	repair_type: string;
	/** 电话报修人姓名 */
	repair_name: string;
	/** 电话报修人电话 */
	tel: string;
	/** 预约时间 */
	appointment_time: string;
	/** 电话报修内容 */
	context: string;
	/** 电话报修ID */
	repair_id?: string;
	/** 电话报修类型文本 */
	repair_type_txt?: string;
	/** 超时时间 */
	timeout_time?: string;
	/** 创建时间 */
	create_time?: string;
	/** 电话报修状态，请查看state表 */
	state?: string;
	/** 电话报修状态文本 */
	state_txt?: string;
}

/**
 * 分页查询报修列表查询参数
 */
export interface QueryAllPhoneRepairParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区ID */
	community_id: string;
	/** 电话报修ID */
	repair_id?: string;
	/** 电话报修人姓名 */
	repair_name?: string;
	/** 电话报修类型 */
	repair_type?: string;
	/** 电话报修人电话 */
	tel?: string;
	/** 电话报修状态，请查看state表 */
	state?: string;
}

/**
 * 新增报修参数
 */
export interface TellRepairAddDTO {
	/** 小区ID */
	community_id: string;
	/** 电话报修对象类型,001小区,002楼栋,003单元,004 房屋 */
	repair_obj_type: string;
	/** 电话报修对象名称 */
	repair_obj_name: string;
	/** 电话报修类型 */
	repair_type: string;
	/** 电话报修人姓名 */
	repair_name: string;
	/** 电话报修人电话 */
	tel: string;
	/** 预约时间 */
	appointment_time: string;
	/** 电话报修内容 */
	context: string;
}

/**
 * 修改报修参数
 */
export interface TellRepairUpdateDTO {
	/** 电话报修类型 */
	repair_type: string;
	/** 电话报修人姓名 */
	repair_name: string;
	/** 电话报修人电话 */
	tel: string;
	/** 预约时间 */
	appointment_time: string;
	/** 电话报修内容 */
	context: string;
	/** 电话报修ID */
	repair_id: string;
}

// ==================== 接口函数 ====================

/**
 * 分页查询报修列表
 * @description
 * 获取电话报修分页列表
 */
export function queryAllPhoneRepair<T = PageDTO<TellRepairDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAllPhoneRepairParams>({
		url: "/comm-c2-repairsetting/tell-repair/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
				repair_id: "",
				repair_name: "",
				repair_type: "",
				tel: "",
				state: "",
			},
		},
	});
}

/**
 * 新增报修
 * @description
 * 新增电话报修
 */
export function addPhoneRepair<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TellRepairAddDTO>({
		url: "/comm-c2-repairsetting/tell-repair/add",
		options,
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "post",
			data: {
				community_id: "",
				repair_obj_type: "",
				repair_obj_name: "",
				repair_type: "",
				repair_name: "",
				tel: "",
				appointment_time: "",
				context: "",
			},
		},
	});
}

/**
 * 修改报修
 * @description
 * 修改电话报修信息
 */
export function modifyPhoneRepair<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TellRepairUpdateDTO>({
		url: "/comm-c2-repairsetting/tell-repair/modify",
		options,
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "put",
			data: {
				repair_type: "",
				repair_name: "",
				tel: "",
				appointment_time: "",
				context: "",
				repair_id: "",
			},
		},
	});
}

/**
 * 删除报修
 * @description
 * 删除指定的电话报修
 */
export function removePhoneRepair<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/comm-c2-repairsetting/tell-repair/delete",
		options,
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "delete",
			data: [],
		},
	});
}