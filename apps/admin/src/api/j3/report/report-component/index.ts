import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 报表组件查询参数
 */
export interface ReportComponentQueryParams {
	/** 组件id */
	componentId?: string;
	/** 组件类型 */
	componentType?: string;
	/** 组件名称 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 报表组件信息
 */
export interface RCCVO {
	/** 组件类型 */
	componentType?: string;
	/** 组件类型文本 */
	componentTypeText?: string;
	/** 组件名称 */
	name?: string;
	/** 查询方式 */
	queryModel?: string;
	/** 描述 */
	remark?: string;
}

/**
 * 条件查询参数
 */
export interface ComponentConditionQueryParams {
	/** 组件ID */
	componentId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 报表自定义组件条件信息
 */
export interface ComponentConditionVO {
	/** 组件ID */
	componentId?: string;
	/** 条件唯一标识符 */
	conditionId?: string;
	/** 提示文本 */
	holdpace?: string;
	/** 名称 */
	name?: string;
	/** 参数 */
	param?: string;
	/** 描述信息 */
	remark?: string;
	/** 条件类型 */
	type?: string;
}

/**
 * 添加报表组件参数
 */
export interface AddReportComponentParams {
	/** 组件组 */
	componentGroup: string;
	/** 组件类型 */
	componentType: string;
	/** 组件名称 */
	name: string;
	/** 查询方式 */
	queryModel: string;
	/** 数据状态 */
	statusCd: string;
	/** 执行sql */
	componentSql?: string;
	/** 执行java */
	javaScript?: string;
	/** 描述 */
	remark?: string;
}

/**
 * 删除报表组件参数
 */
export interface DeleteReportComponentParams {
	/** 组件id */
	componentId: string;
}

/**
 * 修改报表组件参数
 */
export interface ModifyReportComponentParams {
	/** 组件组 */
	componentGroup: string;
	/** 组件id */
	componentId: string;
	/** 组件类型 */
	componentType: string;
	/** 组件名称 */
	name: string;
	/** 查询方式 */
	queryModel: string;
	/** 数据状态 */
	statusCd: string;
	/** 执行sql */
	componentSql?: string;
	/** 执行java */
	javaScript?: string;
	/** 描述 */
	remark?: string;
}

/**
 * 添加条件参数
 */
export interface AddComponentConditionParams {
	/** 组件ID */
	componentId: string;
	/** 提示文本 */
	holdpace: string;
	/** 条件名称 */
	name: string;
	/** 参数 */
	param: string;
	/** 排序字段 */
	seq: number;
	/** 类型 */
	type: string;
	/** 描述信息 */
	remark?: string;
}

/**
 * 修改条件参数
 */
export interface ModifyComponentConditionParams {
	/** 组件ID */
	componentId: string;
	/** 条件唯一标识符 */
	conditionId: string;
	/** 提示文本 */
	holdpace: string;
	/** 条件名称 */
	name: string;
	/** 参数 */
	param: string;
	/** 排序字段 */
	seq: number;
	/** 类型 */
	type: string;
	/** 描述信息 */
	remark?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取报表组件列表
 * @description 支持按组件id、组件类型、组件名称进行条件查询，并返回分页数据
 */
export function queryReportComponentList<T = PageDTO<RCCVO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ReportComponentQueryParams>({
		url: "/j3-report/report-component/query",
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
 * 添加报表组件
 * @description 新增报表组件，返回组件ID
 */
export function addReportComponent<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddReportComponentParams>({
		url: "/j3-report/report-component/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				componentGroup: "",
				componentType: "",
				name: "",
				queryModel: "",
				statusCd: "",
			},
		},
		options,
	});
}

/**
 * 获取条件列表
 * @description 根据组件ID获取条件列表，列表为空返回查询失败（null)
 */
export function queryComponentConditionList<T = PageDTO<ComponentConditionVO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ComponentConditionQueryParams>({
		url: "/j3-report/report-component/condition/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				componentId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 删除条件
 * @description 根据条件ID删除条件
 */
export function deleteComponentCondition<T = string>(id: string, options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, Record<string, never>>({
		url: `/j3-report/report-component/condition/remove/${id}`,
		httpParamWay: "path",
		config: {
			method: "DELETE",
			url: `/j3-report/report-component/condition/remove/${id}`,
		},
		options,
	});
}

/**
 * 删除报表组件
 * @description 根据组件ID删除报表组件
 */
export function deleteReportComponent<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteReportComponentParams>({
		url: "/j3-report/report-component/delete",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: {
				componentId: "",
			},
		},
		options,
	});
}

/**
 * 修改报表组件
 * @description 更新已有报表组件的信息
 */
export function modifyReportComponent<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyReportComponentParams>({
		url: "/j3-report/report-component/modify",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				componentGroup: "",
				componentId: "",
				componentType: "",
				name: "",
				queryModel: "",
				statusCd: "",
			},
		},
		options,
	});
}

/**
 * 添加条件
 * @description 新增报表组件条件，返回条件ID
 */
export function addComponentCondition<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddComponentConditionParams>({
		url: "/j3-report/report-component/condition/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				componentId: "",
				holdpace: "",
				name: "",
				param: "",
				seq: 1,
				type: "text",
			},
		},
		options,
	});
}

/**
 * 修改条件
 * @description 修改报表组件条件，返回条件ID
 */
export function modifyComponentCondition<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyComponentConditionParams>({
		url: "/j3-report/report-component/condition/modify",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				componentId: "",
				conditionId: "",
				holdpace: "",
				name: "",
				param: "",
				seq: 1,
				type: "text",
			},
		},
		options,
	});
}
