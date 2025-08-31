import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 跟进进度详细内容数据
 */
export interface ProgressDetailData {
	/** 跟进内容 */
	content?: string;
	/** 创建时间 */
	createTime?: string;
	/** 登记人(受理人)ID */
	createUserId?: string;
	/** 登记人(受理人)名称 */
	createUserName?: string;
	/** 跟进进度表Id */
	detailId?: string;
	/** 业务反馈主表Id */
	noteId?: string;
	/** 数据状态 */
	statusCd?: string;
}

/**
 * 报修类型数据
 */
export interface RepairTypeData {
	/** 社区ID */
	communityId?: string;
	/** 是否显示 Y 是 N 否 */
	isShow?: string;
	/** 维修类型编号 */
	repairType?: string;
	/** 维修类型名称 */
	repairTypeName?: string;
	/** 设置主ID */
	settingId?: string;
}

/**
 * 业主反馈数据
 */
export interface OwnerFeedbackData {
	/** 小区id */
	communityId?: string;
	/** 内容 */
	content?: string;
	/** 创建的时间 */
	createTime?: string;
	/** 创建人id */
	createUserId?: string;
	/** 登记人 */
	createUserName?: string;
	/** 联系方式 */
	link?: string;
	/** 反馈id */
	noteId?: string;
	/** 反馈类型(1,其他) */
	noteType?: string;
	/** 反馈类型的值 */
	noteTypeValue?: string;
	/** 业主id */
	objId?: string;
	/** 业主名称 */
	objName?: string;
	/** 房间id */
	roomId?: string;
	/** 房间名称 */
	roomName?: string;
	/** 反馈状态(W,跟进中),(F,完成) */
	state?: string;
	/** 其他关联ID（例如报修ID） */
	thirdId?: string;
}

/**
 * 添加跟进进度参数
 */
export interface AddProgressParams {
	/** 社区Id */
	communityId: string;
	/** 反馈业务受理进度内容 */
	content: string;
	/** 反馈业务受理进度主表Id */
	noteId: string;
	/** 反馈是否完成 (W-完成 F-跟进中) */
	state: string;
}

/**
 * 转报修单参数
 */
export interface CreateRepairOrderParams {
	/** 预约时间 */
	appointmentTime: string;
	/** 社区ID */
	communityId: string;
	/** 内容描述 */
	context: string;
	/** 业务反馈ID */
	noteId: string;
	/** 报修渠道 D员工代客报修 T电话报修 Z业主自主保修 */
	repairChannel: string;
	/** 报修人姓名 */
	repairName: string;
	/** 报修房间ID */
	repairObjId: string;
	/** 报修房间名称 */
	repairObjName: string;
	/** 维修类型编号 */
	repairType: string;
	/** 联系电话 */
	tel: string;
}

/**
 * 获取跟进进度列表参数
 */
export interface QueryProgressListParams {
	/** 社区id */
	communityId: string;
	/** 业务反馈主表Id */
	noteId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 查询可报修类型参数
 */
export interface QueryRepairTypesParams {
	/** 社区id */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 是否公共区 T为是 F为否 */
	publicArea: string;
}

/**
 * 删除跟进进度参数
 */
export interface DeleteProgressParams {
	/** 社区Id */
	communityId: string;
	/** 反馈业务受理进度表Id */
	detailId: string;
	/** 业务反馈主表Id */
	noteId: string;
}

/**
 * 添加业主反馈参数
 */
export interface AddOwnerFeedbackParams {
	/** 小区id */
	communityId: string;
	/** 内容 */
	content: string;
	/** 联系方式 */
	link: string;
	/** 反馈类型(1,其他) */
	noteType: string;
	/** 业主id */
	objId: string;
	/** 业主名称 */
	objName: string;
	/** 房间id */
	roomId: string;
	/** 房间名称 */
	roomName: string;
}

/**
 * 修改业主反馈参数
 */
export interface ModifyOwnerFeedbackParams {
	/** 小区id */
	communityId: string;
	/** 内容 */
	content: string;
	/** 联系方式 */
	link: string;
	/** 反馈id */
	noteId: string;
	/** 反馈类型(1,其他) */
	noteType: string;
	/** 业主id */
	objId: string;
	/** 业主名称 */
	objName: string;
	/** 房间id */
	roomId: string;
	/** 房间名称 */
	roomName: string;
}

/**
 * 查询业主反馈列表参数
 */
export interface QueryOwnerFeedbackListParams {
	/** 小区CommunityId */
	communityId: string;
	/** 业主id */
	objId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 创建人 */
	createUserName?: string;
	/** 类型 */
	noteType?: string;
	/** 业主名称 */
	objName?: string;
	/** 状态(W,跟进中),(F,完成) */
	state?: string;
}

/**
 * 删除业主反馈参数
 */
export interface DeleteOwnerFeedbackParams {
	/** 反馈id */
	noteId: string;
	/** 业主id */
	objId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加跟进进度
 * @description 为业务受理添加跟进进度记录
 */
export function addProgress<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddProgressParams>({
		url: "/j5-community/notepad/detail/add-notepad",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				content: "",
				noteId: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 转报修单
 * @description 将业务受理转换为报修单
 */
export function createRepairOrder<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CreateRepairOrderParams>({
		url: "/j5-community/notepad/detail/add-repair",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				appointmentTime: "",
				communityId: "",
				context: "",
				noteId: "",
				repairChannel: "",
				repairName: "",
				repairObjId: "",
				repairObjName: "",
				repairType: "",
				tel: "",
			},
		},
		options,
	});
}

/**
 * 获取跟进进度列表（条件+分页）
 * @description 获取业务受理的跟进进度记录列表
 */
export function queryProgressList<T = PageDTO<ProgressDetailData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryProgressListParams>({
		url: "/j5-community/notepad/detail/query-notepad",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				noteId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 查询可报修类型
 * @description 查询可用的报修类型列表
 */
export function queryRepairTypes<T = RepairTypeData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRepairTypesParams>({
		url: "/j5-community/notepad/detail/query-repair",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
				publicArea: "",
			},
		},
		options,
	});
}

/**
 * 删除跟进进度
 * @description 删除指定的跟进进度记录
 */
export function deleteProgress<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteProgressParams>({
		url: "/j5-community/notepad/detail/remove-notepad",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: {
				communityId: "",
				detailId: "",
				noteId: "",
			},
		},
		options,
	});
}

/**
 * 添加业主反馈
 * @description 添加新的业主反馈记录
 */
export function addOwnerFeedback<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddOwnerFeedbackParams>({
		url: "/j5-community/notepad/owner/add-notepad",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				content: "",
				link: "",
				noteType: "",
				objId: "",
				objName: "",
				roomId: "",
				roomName: "",
			},
		},
		options,
	});
}

/**
 * 修改业主反馈
 * @description 修改现有的业主反馈记录
 */
export function modifyOwnerFeedback<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyOwnerFeedbackParams>({
		url: "/j5-community/notepad/owner/modify-notepad",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
				content: "",
				link: "",
				noteId: "",
				noteType: "",
				objId: "",
				objName: "",
				roomId: "",
				roomName: "",
			},
		},
		options,
	});
}

/**
 * 获取业主反馈列表（条件+分页）
 * @description 获取业主反馈记录列表，支持条件查询和分页
 */
export function queryOwnerFeedbackList<T = PageDTO<OwnerFeedbackData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryOwnerFeedbackListParams>({
		url: "/j5-community/notepad/owner/query-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				objId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 删除业主反馈
 * @description 删除指定的业主反馈记录
 */
export function deleteOwnerFeedback<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteOwnerFeedbackParams>({
		url: "/j5-community/notepad/owner/remove-notepad-by-id",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: {
				noteId: "",
				objId: "",
			},
		},
		options,
	});
}
