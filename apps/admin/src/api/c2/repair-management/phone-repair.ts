import { useRequest } from "@/composables/use-request";

/**
 * 电话报修信息
 */
export interface TellRepairDTO {
	/** 报修对象类型,001小区,002楼栋,003单元,004 房屋 */
	repair_obj_type?: string;
	/** 归属楼栋 */
	building?: string;
	/** 归属单元 */
	unit?: string;
	/** 归属房屋 */
	house?: string;
	/** 报修类型 */
	repair_type?: string;
	/** 报修人姓名 */
	repair_name?: string;
	/** 报修人电话 */
	tel?: string;
	/** 预约时间 */
	appointment_time?: string;
	/** 报修内容 */
	context?: string;
	/** 报修ID */
	repair_id?: string;
}

/**
 * 分页查询报修列表
 * @description
 * 获取电话报修分页列表
 */
export function queryAllPhoneRepair<T = PageDTO<TellRepairDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/tell-repair/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				repair_id: "",
				repair_name: "",
				repair_type: "",
				tel: "",
				status_cd: "",
			},
		},
	});
}

/**
 * 新增报修参数
 */
export interface TellRepairAddDTO {
	/** 报修对象类型,001小区,002楼栋,003单元,004 房屋 */
	repair_obj_type: string;
	/** 归属楼栋 */
	building: string;
	/** 归属单元 */
	unit: string;
	/** 归属房屋 */
	house: string;
	/** 报修类型 */
	repair_type: string;
	/** 报修人姓名 */
	repair_name: string;
	/** 报修人电话 */
	tel: string;
	/** 预约时间 */
	appointment_time: string;
	/** 报修内容 */
	context: string;
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
		config: {
			method: "post",
			data: {
				repair_obj_type: "",
				building: "",
				unit: "",
				house: "",
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
	return useRequest<ParamsBodyKey, T, TellRepairDTO>({
		url: "/comm-c2-repairsetting/tell-repair/modify",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				repair_obj_type: "",
				building: "",
				unit: "",
				house: "",
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
		config: {
			method: "delete",
			data: [],
		},
	});
}
