import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 公示详情数据
 */
export interface AnnouncementDetailData {
	/** 小区id */
	communityId?: string;
	/** 活动内容 */
	context?: string;
	/** 公示时间 */
	createTime?: string;
	/** 发布人 */
	createUserName?: string;
	/** 头部照片 */
	headerImg?: string;
	/** 公示ID */
	pubId?: string;
	/** 公示类型 公共收益=1000 规章制度=2000 政策相关=3000 */
	pubType?: number;
	/** 公示标题 */
	title?: string;
}

/**
 * 公示列表数据
 */
export interface AnnouncementListData {
	/** 公示时间 */
	createTime?: string;
	/** 发布人 */
	createUserName?: string;
	/** 头部照片 */
	headerImg?: string;
	/** 公示类型 公共收益=1000 规章制度=2000 政策相关=3000 */
	pubType?: number;
	/** 公示标题 */
	title?: string;
}

/**
 * 添加公示参数
 */
export interface AddAnnouncementParams {
	/** 小区ID */
	communityId: string;
	/** 公示内容 */
	context: string;
	/** 封面图片URL */
	headerImg: string;
	/** 公示类型编码 */
	pubType: string;
	/** 公示标题 */
	title: string;
}

/**
 * 修改公示参数
 */
export interface ModifyAnnouncementParams {
	/** 小区ID */
	communityId: string;
	/** 公示内容 */
	context: string;
	/** 封面图片URL */
	headerImg: string;
	/** 公示ID */
	pubId: string;
	/** 公示类型编码 */
	pubType: string;
	/** 公示标题 */
	title: string;
}

/**
 * 删除公示参数
 */
export interface DeleteAnnouncementParams {
	/** 小区ID */
	communityId: string;
	/** 公示ID */
	pubId: string;
}

/**
 * 查询公示详情参数
 */
export interface QueryAnnouncementDetailParams {
	/** 小区id */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 公示ID */
	pubId: string;
}

/**
 * 查询公示列表参数
 */
export interface QueryAnnouncementListParams {
	/** 小区ID */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 公示类型 公共收益=1000 规章制度=2000 政策相关=3000 */
	pubType: string;
	/** 公示标题 */
	title?: string;
}

// ==================== 接口函数 ====================

/**
 * 添加公示
 * @description 添加新的小区公示信息
 */
export function addAnnouncement<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddAnnouncementParams>({
		url: "/j5-community/property/add-publicity",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				context: "",
				headerImg: "",
				pubType: "",
				title: "",
			},
		},
		options,
	});
}

/**
 * 修改公示
 * @description 修改现有的小区公示信息
 */
export function modifyAnnouncement<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyAnnouncementParams>({
		url: "/j5-community/property/modify-publicity",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				context: "",
				headerImg: "",
				pubId: "",
				pubType: "",
				title: "",
			},
		},
		options,
	});
}

/**
 * 删除公示
 * @description 删除指定的小区公示
 */
export function deleteAnnouncement<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteAnnouncementParams>({
		url: "/j5-community/property/remove-publicity",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				pubId: "",
			},
		},
		options,
	});
}

/**
 * 获取公示详情
 * @description 获取指定公示的详细信息
 */
export function queryAnnouncementDetail<T = AnnouncementDetailData>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAnnouncementDetailParams>({
		url: "/j5-community/publicity/query-publicity-detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
				pubId: "",
			},
		},
		options,
	});
}

/**
 * 获取公示列表（条件+分页）
 * @description 获取小区公示列表，支持条件查询和分页
 */
export function queryAnnouncementList<T = PageDTO<AnnouncementListData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAnnouncementListParams>({
		url: "/j5-community/publicity/query-publicity-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
				pubType: "",
			},
		},
		options,
	});
}
