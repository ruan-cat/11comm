import { useRequest } from "composables/use-request";

/**
 * 报表信息查询参数
 */
export interface ReportMessageQueryParams {
	/** 报表编号 */
	customId?: string;
	/** 组编号 */
	groupId?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 选项标题 */
	title?: string;
}

/**
 * 报表信息模型
 */
export interface ReportMessageInfo {
	/** 报表编号 */
	customId: string;
	/** 组编号对应的组名称 */
	groupName?: string;
	/** 描述信息 */
	remark?: string;
	/** 排序序号 */
	seq?: number;
	/** 选项标题 */
	title: string;
}

/**
 * 新增报表信息参数
 */
export interface AddReportMessageParams {
	/** 报表组ID */
	groupId: string;
	/** 描述 */
	remark?: string;
	/** 排序 */
	seq: number;
	/** 选项标题 */
	title: string;
}

/**
 * 修改报表信息参数
 */
export interface ModifyReportMessageParams {
	/** 报表编号 */
	customId: string;
	/** 报表组ID */
	groupId: string;
	/** 描述 */
	remark?: string;
	/** 排序 */
	seq: number;
	/** 选项标题 */
	title: string;
}

/**
 * 报表组件关系查询参数
 */
export interface ComponentRelQueryParams {
	/** 报表编号 */
	customId?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 组件关系编号 */
	relId?: string;
}

/**
 * 报表组件关系信息
 */
export interface ComponentRelInfo {
	/** 组件组 */
	componentGroup?: string;
	/** 组件ID */
	componentId?: string;
	/** 组件名称 */
	componentName?: string;
	/** 组件类型 */
	componentType?: string;
	/** 创建时间 */
	createTime?: string;
	/** 报表编号 */
	customId?: string;
	/** 查询模型 */
	queryModel?: string;
	/** 组件关系编号 */
	relId?: string;
	/** 序号 */
	seq?: number;
	/** 状态 */
	statusCd?: string;
}

/**
 * 删除报表组件关系参数
 */
export interface DeleteComponentRelParams {
	/** 组件ID */
	componentId: string;
	/** 报表编号 */
	customId: string;
	/** 组件关系编号 */
	relId: string;
}

/**
 * 删除报表信息参数
 */
export interface DeleteReportMessageParams {
	/** 报表编号 */
	customId: string;
}

/**
 * 添加报表组件关系参数
 */
export interface AddComponentRelParams {
	/** 组件ID */
	componentId: string;
	/** 报表编号 */
	customId: string;
	/** 序号 */
	seq?: number;
}

/**
 * 分页查询报表信息
 * @description 支持按报表编号、组编号、选项标题进行条件查询，并返回分页数据
 */
export function queryReportMessageList<T = PageDTO<ReportMessageInfo>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ReportMessageQueryParams>({
		url: "/j3-report/report-message/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 新增报表信息
 * @description 创建新的报表信息记录
 */
export function addReportMessage<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddReportMessageParams>({
		url: "/j3-report/report-message/add-report-message",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				groupId: "",
				remark: "",
				seq: 1,
				title: "",
			},
		},
		options,
	});
}

/**
 * 修改报表信息
 * @description 更新已有报表信息记录
 */
export function modifyReportMessage<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyReportMessageParams>({
		url: "/j3-report/report-message/modify-report-message",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				customId: "",
				groupId: "",
				remark: "",
				seq: 1,
				title: "",
			},
		},
		options,
	});
}

/**
 * 分页获取关联组件列表
 * @description 支持按报表编号、组件关系编号进行条件查询，并返回分页数据
 */
export function queryComponentRelList<T = PageDTO<ComponentRelInfo>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ComponentRelQueryParams>({
		url: "/j3-report/report-message/component-rel/pageList",
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 删除关联组件
 * @description 根据组件ID、报表编号和组件关系编号删除关联组件
 */
export function deleteComponentRel<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteComponentRelParams>({
		url: "/j3-report/report-message/delete-component-rel",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: {
				componentId: "",
				customId: "",
				relId: "",
			},
		},
		options,
	});
}

/**
 * 删除报表信息
 * @description 根据报表编号删除报表信息
 */
export function deleteReportMessage<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteReportMessageParams>({
		url: "/j3-report/report-message/delete-report-message",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			data: {
				customId: "",
			},
		},
		options,
	});
}

/**
 * 关联组件
 * @description 添加报表组件关系
 */
export function addComponentRel<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddComponentRelParams>({
		url: "/j3-report/report-message/save-component-rel",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				componentId: "",
				customId: "",
				seq: 1,
			},
		},
		options,
	});
}
