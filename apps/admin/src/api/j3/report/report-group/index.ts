import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 报表组查询参数
 */
export interface ReportGroupQueryParams {
	/** 组ID */
	groupId?: string;
	/** 组名称 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 组url */
	url?: string;
}

/**
 * 报表组信息模型
 */
export interface ReportGroupInfo {
	/** 组ID */
	groupId?: string;
	/** 组名称 */
	name?: string;
	/** 描述 */
	remark?: string;
	/** 组url */
	url?: string;
}

/**
 * 添加报表组参数
 */
export interface AddReportGroupParams {
	/** 组名称 */
	name: string;
	/** 描述 */
	remark: string;
	/** 组url */
	url: string;
}

/**
 * 修改报表组参数
 */
export interface ModifyReportGroupParams {
	/** 组ID */
	groupId: string;
	/** 组名称 */
	name: string;
	/** 描述 */
	remark: string;
	/** 组url */
	url: string;
}

/**
 * 删除报表组参数
 */
export interface DeleteReportGroupParams {
	/** 组ID */
	groupId: string;
}

// ==================== 接口函数 ====================

/**
 * 获取报表组列表（条件+分页）
 * @description 支持按组ID、组名称、组url进行条件查询，并返回分页数据
 */
export function queryReportGroupList<T = PageDTO<ReportGroupInfo>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ReportGroupQueryParams>({
		url: "/j3-report/report-group/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 获取报表组名称列表
 * @description 获取所有报表组的基本信息列表
 */
export function queryReportGroupNameList<T = ReportGroupInfo[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, Record<string, never>>({
		url: "/j3-report/report-group/query-report-component-name",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 添加报表组
 * @description 创建新的报表组
 */
export function addReportGroup<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddReportGroupParams>({
		url: "/j3-report/report-group/add-group",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				name: "",
				remark: "",
				url: "",
			},
		},
		options,
	});
}

/**
 * 修改报表组
 * @description 更新已有报表组的信息
 */
export function modifyReportGroup<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyReportGroupParams>({
		url: "/j3-report/report-group/modify-group",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				groupId: "",
				name: "",
				remark: "",
				url: "",
			},
		},
		options,
	});
}

/**
 * 删除报表组
 * @description 根据组ID删除指定的报表组
 */
export function deleteReportGroup<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteReportGroupParams>({
		url: "/j3-report/report-group/remove-group",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				groupId: "",
			},
		},
		options,
	});
}
