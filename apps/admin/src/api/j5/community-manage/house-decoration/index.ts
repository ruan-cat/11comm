import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 房屋装修记录详情传输数据
 */
export interface RenovationRecordDetailData {
	/** 创建时间 */
	createTime?: string;
	/** 房屋id */
	roomId?: string;
	/** 房屋名称 */
	roomName?: string;
	/** 图片/视频地址 */
	url?: string;
}

/**
 * 房屋装修记录传输数据
 */
export interface RenovationRecordData {
	/** 小区id */
	communityId?: string;
	/** 创建时间 */
	createTime?: string;
	/** 图片地址 */
	imgUrls?: string[];
	/** 是否违规(true-是,false-否) */
	isViolation?: string;
	/** 装修跟踪记录ID */
	recordId?: string;
	/** 备注 */
	remark?: string;
	/** 装修id */
	renovationId?: string;
	/** 房屋id */
	roomId?: string;
	/** 房屋名称 */
	roomName?: string;
	/** 操作人员id */
	staffId?: string;
	/** 操作人员 */
	staffName?: string;
	/** 状态(1000-待审核 2000-审核不通过 3000-装修中 4000-待验收 5000-验收成功 6000-验收失败) */
	state?: string;
	/** 状态名称 */
	stateName?: string;
	/** 视频地址 */
	videoUrls?: string[];
}

/**
 * 装修数据
 */
export interface RenovationData {
	/** 小区id */
	communityId?: string;
	/** 创建时间/申请时间 */
	createTime?: string;
	/** 装修结束时间 */
	endTime?: string;
	/** 是否延期 */
	isPostpone?: string;
	/** 是否违规 */
	isViolation?: string;
	/** 装修负责人 */
	personMain?: string;
	/** 装修负责人联系电话 */
	personMainTel?: string;
	/** 联系人 */
	personName?: string;
	/** 联系电话 */
	personTel?: string;
	/** 延期时间 */
	postponeTime?: string;
	/** 主键id */
	rId?: string;
	/** 备注 */
	remark?: string;
	/** 装修单位 */
	renovationCompany?: string;
	/** 房屋id */
	roomId?: string;
	/** 房屋名称 */
	roomName?: string;
	/** 装修开始时间 */
	startTime?: string;
	/** 状态 */
	state?: string;
	/** 违规说明 */
	violationDesc?: string;
}

/**
 * 添加房屋装修记录参数
 */
export interface AddRenovationRecordParams {
	/** 小区id */
	communityId: string;
	/** 图片地址 */
	imgUrls?: string[];
	/** 是否违规(true-是,false-否) */
	isViolation: string;
	/** 备注 */
	remark?: string;
	/** 装修id */
	renovationId: string;
	/** 房屋id */
	roomId: string;
	/** 房屋名称 */
	roomName: string;
	/** 状态(1000-待审核 2000-审核不通过 3000-装修中 4000-待验收 5000-验收成功 6000-验收失败) */
	state: string;
	/** 视频地址 */
	videoUrls?: string[];
}

/**
 * 删除跟进记录参数
 */
export interface DeleteRenovationRecordParams {
	/** 小区id */
	communityId: string;
	/** 装修跟踪记录id */
	recordId: string;
}

/**
 * 查询跟进记录详情参数
 */
export interface QueryRenovationRecordDetailParams {
	/** 小区id */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 装修跟踪记录ID */
	recordId: string;
	/** 房屋id */
	roomId: string;
	/** 房屋名称 */
	roomName: string;
}

/**
 * 查询跟进记录列表参数
 */
export interface QueryRenovationRecordListParams {
	/** 小区id */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 装修id */
	renovationId: string;
	/** 房屋id */
	roomId: string;
	/** 房屋名称 */
	roomName: string;
}

/**
 * 添加装修参数
 */
export interface AddRenovationParams {
	/** 小区id */
	communityId: string;
	/** 装修结束时间 */
	endTime: string;
	/** 装修负责人 */
	personMain: string;
	/** 装修负责人联系电话 */
	personMainTel: string;
	/** 联系人 */
	personName: string;
	/** 联系电话 */
	personTel: string;
	/** 主键id */
	rId: string;
	/** 备注 */
	remark?: string;
	/** 装修单位 */
	renovationCompany: string;
	/** 房屋id */
	roomId: string;
	/** 房屋名称 */
	roomName: string;
	/** 装修开始时间 */
	startTime: string;
}

/**
 * 修改装修参数
 */
export interface ModifyRenovationParams {
	/** 小区id */
	communityId: string;
	/** 创建时间/申请时间 */
	createTime?: string;
	/** 装修结束时间 */
	endTime: string;
	/** 是否延期 */
	isPostpone: string;
	/** 是否违规 */
	isViolation: string;
	/** 装修负责人 */
	personMain: string;
	/** 装修负责人联系电话 */
	personMainTel: string;
	/** 联系人 */
	personName: string;
	/** 联系电话 */
	personTel: string;
	/** 延期时间 */
	postponeTime?: string;
	/** 主键id */
	rId: string;
	/** 备注 */
	remark?: string;
	/** 装修单位 */
	renovationCompany: string;
	/** 房屋id */
	roomId: string;
	/** 房屋名称 */
	roomName: string;
	/** 装修开始时间 */
	startTime: string;
	/** 状态 */
	state: string;
	/** 违规说明 */
	violationDesc?: string;
}

/**
 * 删除装修参数
 */
export interface DeleteRenovationParams {
	/** 装修编号 */
	rId: string;
}

/**
 * 完成装修参数
 */
export interface CompleteRenovationParams {
	/** 装修编号 */
	rId: string;
}

/**
 * 审核装修参数
 */
export interface AuditRenovationParams {
	/** 审核备注 */
	examineRemark?: string;
	/** 主键id,装修编号 */
	rId: string;
	/** 审核通过 审核不通过 */
	state: string;
}

/**
 * 查询装修列表参数
 */
export interface QueryRenovationListParams {
	/** 小区id */
	communityId: string;
	/** 装修结束时间 */
	endTime?: string;
	/** 是否延期 */
	isPostpone?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 联系人 */
	personName?: string;
	/** 联系电话 */
	personTel?: string;
	/** 延期时间 */
	postponeTime?: string;
	/** 装修时间 */
	renovationTime?: string;
	/** 房屋名称 */
	roomName?: string;
	/** 装修开始时间 */
	startTime?: string;
	/** 状态 */
	state?: string;
	/** 违规说明 */
	violationDesc?: string;
}

// ==================== 接口函数 ====================

/**
 * 添加跟进记录
 * @description 添加房屋装修跟进记录
 */
export function addRenovationRecord<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddRenovationRecordParams>({
		url: "/j5-community/renovation-record/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
				isViolation: "",
				renovationId: "",
				roomId: "",
				roomName: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 删除跟进记录
 * @description 删除装修跟踪记录
 */
export function deleteRenovationRecord<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteRenovationRecordParams>({
		url: "/j5-community/renovation-record/delete",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				communityId: "",
				recordId: "",
			},
		},
		options,
	});
}

/**
 * 查看跟进记录详情
 * @description 获取装修跟进记录的详细信息
 */
export function queryRenovationRecordDetail<T = PageDTO<RenovationRecordDetailData>>(
	options: UseAxiosOptionsJsonVO<T>,
) {
	return useRequest<ParamsQueryKey, T, QueryRenovationRecordDetailParams>({
		url: "/j5-community/renovation-record/queryDetail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
				recordId: "",
				roomId: "",
				roomName: "",
			},
		},
		options,
	});
}

/**
 * 获取跟进记录列表（条件+分页）
 * @description 获取装修跟进记录列表，支持条件查询和分页
 */
export function queryRenovationRecordList<T = PageDTO<RenovationRecordData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRenovationRecordListParams>({
		url: "/j5-community/renovation-record/queryPage",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
				renovationId: "",
				roomId: "",
				roomName: "",
			},
		},
		options,
	});
}

/**
 * 添加装修
 * @description 添加新的装修申请
 */
export function addRenovation<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddRenovationParams>({
		url: "/j5-community/renovation/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				endTime: "",
				personMain: "",
				personMainTel: "",
				personName: "",
				personTel: "",
				rId: "",
				renovationCompany: "",
				roomId: "",
				roomName: "",
				startTime: "",
			},
		},
		options,
	});
}

/**
 * 删除装修
 * @description 删除指定的装修记录
 */
export function deleteRenovation<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteRenovationParams>({
		url: "/j5-community/renovation/delete-by-id",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				rId: "",
			},
		},
		options,
	});
}

/**
 * 修改装修
 * @description 修改现有的装修信息
 */
export function modifyRenovation<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyRenovationParams>({
		url: "/j5-community/renovation/modify",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
				endTime: "",
				isPostpone: "",
				isViolation: "",
				personMain: "",
				personMainTel: "",
				personName: "",
				personTel: "",
				rId: "",
				renovationCompany: "",
				roomId: "",
				roomName: "",
				startTime: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 完成装修
 * @description 标记装修为完成状态
 */
export function completeRenovation<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, CompleteRenovationParams>({
		url: "/j5-community/renovation/modify-by-id",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				rId: "",
			},
		},
		options,
	});
}

/**
 * 审核装修
 * @description 审核装修申请
 */
export function auditRenovation<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, AuditRenovationParams>({
		url: "/j5-community/renovation/modify-state",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				rId: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 获取装修列表(条件+分页)
 * @description 获取装修列表，支持多种条件查询和分页
 */
export function queryRenovationList<T = PageDTO<RenovationData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRenovationListParams>({
		url: "/j5-community/renovation/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}
