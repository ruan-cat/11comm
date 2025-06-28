import { useRequest } from "@/composables/use-request";

/**
 * 工单池工单详情
 */
export interface TaskDetailGetDTO {
	/** 工单编号 */
	repairId?: string;
	/** 工单类型 */
	repairType?: string;
	/** 工单类型文本 */
	repairTypeTxt?: string;
	/** 报修人 */
	repairName?: string;
	/** 联系方式 */
	tel?: string;
	/** 报修位置名称 */
	repairObjName?: string;
	/** 预约开始时间 */
	appointmentTime?: string;
	/** 预约超时时间 */
	timeoutTime?: string;
	/** 提单时长 */
	time?: string;
	/** 完成时间 */
	completeTime?: string;
	/** 创建时间 */
	createTime?: string;
	/** 状态 */
	state?: string;
	/** 状态文本 */
	stateTxt?: string;
	/** 报修内容 */
	context?: string;
}

/**
 * 获取工单池工单详情
 * @description
 * 根据工单编号获取工单池工单详情
 */
export function queryTaskDetailById<T = TaskDetailGetDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/task-detail/query-by-id",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				repair_id: "",
			},
		},
	});
}

/**
 * 工单列表项
 */
export interface TaskListDTO {
	/** 工单编号 */
	repair_id: string;
	/** 报修位置 */
	repair_obj_name: string;
	/** 报修类型 */
	repair_type: string;
	/** 维修类型 */
	maintenance_type: string;
	/** 维修类型中文映射 */
	maintenance_type_txt: string;
	/** 报修人 */
	repair_name: string;
	/** 报修电话 */
	tel: string;
	/** 预约时间 */
	appointment_time: string;
	/** 提交时间 */
	create_time: string;
	/** 状态 */
	state: string;
	/** 状态中文映射 */
	state_txt: string;
}

/**
 * 获取工单列表
 * @description
 * 获取工单池工单分页列表
 */
export function queryTaskList<T = PageDTO<TaskListDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/taskpool/task-list/query-all",
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
				tel: "",
				repair_type: "",
				repair_setting_type: "",
				repair_obj_name: "",
				maintenance_type: "",
				start_time: "",
				end_time: "",
			},
		},
	});
}

/**
 * 修改工单参数
 */
export interface TaskListUpdateDTO {
	/** 小区编号（前端传入） */
	community_id: string;
	/** 工单编号（前端传入） */
	repair_id: string;
	/** 报修类型 */
	repair_type: string;
	/** 报修人 */
	repair_name: string;
	/** 报修电话 */
	tel: string;
	/** 预约时间 */
	appointment_time: string;
	/** 报修内容 */
	context: string;
}

/**
 * 修改工单
 * @description
 * 修改工单池工单信息
 */
export function modifyTask<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TaskListUpdateDTO>({
		url: "/comm-c2-repairsetting/taskpool/task-list/modify",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				community_id: "",
				repair_id: "",
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
 * 删除工单参数
 */
export interface TaskListGetIdDTO {
	/** 工单编号 */
	repair_id: string;
}

/**
 * 删除工单
 * @description
 * 删除指定工单池工单
 */
export function removeTask<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TaskListGetIdDTO>({
		url: "/comm-c2-repairsetting/taskpool/task-list/remove",
		options,
		httpParamWay: "body",
		config: {
			method: "delete",
			data: {
				repair_id: "",
			},
		},
	});
}

/**
 * 打印工单
 * @description
 * 根据工单编号打印工单
 */
export function exportTaskDetail<T = void>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/taskpool/task-detail/export",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				repair_id: "",
			},
		},
	});
}

/**
 * 派单返回信息
 */
export interface TaskDetailGetIdDTO {
	/** 工单编号 */
	repair_id: string;
}

/**
 * 派单参数
 */
export interface TaskDetailAddDTO {
	/** 工单编号（前端传入） */
	repair_id: string;
	/** 处理人 */
	staff_name: string;
	/** 意见 */
	context: string;
}

/**
 * 派单
 * @description
 * 新增工单池派单
 */
export function addTaskDetail<T = TaskDetailGetIdDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, TaskDetailAddDTO>({
		url: "/comm-c2-repairsetting/taskpool/task-detail/add",
		options,
		httpParamWay: "body",
		config: {
			method: "post",
			data: {
				repair_id: "",
				staff_name: "",
				context: "",
			},
		},
	});
}
