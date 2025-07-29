import { useRequest } from "@/composables/use-request";

/**
 * 报表统计信息
 */
export interface ReportComponentCountInfo {
	/** 当前底层统计所属的组件编号 */
	componentId: string;
	/** 底层统计编号 */
	footerId: string;
	/** 名称 */
	name: string;
	/** 查询方式 */
	queryModel: string;
	/** 描述 */
	footerDescription?: string;
}

/**
 * 查询报表统计参数
 */
export interface QueryComponentCountParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 组件ID */
	componentId?: string;
}

/**
 * 添加报表统计参数
 */
export interface AddComponentCountParams {
	/** 当前底层统计所属的组件编号 */
	componentId: string;
	/** 名称 */
	name: string;
	/** 查询方式 */
	queryModel: string;
	/** 描述 */
	footerDescription?: string;
}

/**
 * 修改报表统计参数
 */
export interface ModifyComponentCountParams {
	/** 当前底层统计所属的组件编号 */
	componentId: string;
	/** 底层统计编号 */
	footerId: string;
	/** 名称 */
	name: string;
	/** 查询方式 */
	queryModel: string;
	/** 描述 */
	footerDescription?: string;
}

/**
 * 删除报表统计参数
 */
export interface RemoveComponentCountParams {
	/** 底层统计编号 */
	footerID: string;
}

/**
 * 查询报表组件底层统计列表
 * @description 支持按组件ID进行条件查询，并返回分页数据
 */
export function queryComponentCountList<T = PageDTO<ReportComponentCountInfo>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryComponentCountParams>({
		url: "/j3-report/report-component-count/query-count",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

/**
 * 添加报表组件底层统计
 * @description 新增报表组件底层统计信息
 */
export function addComponentCount<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddComponentCountParams>({
		url: "/j3-report/report-component-count/add-count",
		httpParamWay: "body",
		options,
		config: {
			method: "POST",
			data: {
				componentId: "",
				name: "",
				queryModel: "",
			},
		},
	});
}

/**
 * 修改报表组件底层统计
 * @description 更新已有报表组件底层统计信息
 */
export function modifyComponentCount<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyComponentCountParams>({
		url: "/j3-report/report-component-count/modify-count",
		httpParamWay: "body",
		options,
		config: {
			method: "PUT",
			data: {
				componentId: "",
				footerId: "",
				name: "",
				queryModel: "",
			},
		},
	});
}

/**
 * 删除报表组件底层统计
 * @description 删除指定的报表组件底层统计信息
 */
export function removeComponentCount<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveComponentCountParams>({
		url: "/j3-report/report-component-count/remove-count",
		httpParamWay: "query",
		options,
		config: {
			method: "DELETE",
			params: {
				footerID: "",
			},
		},
	});
}
