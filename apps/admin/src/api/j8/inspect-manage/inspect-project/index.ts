import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检项目数据模型
 */
export interface InspectProjectData {
	/** 项目ID */
	id?: string;
	/** 项目名称 */
	projectName?: string;
	/** 项目编码 */
	projectCode?: string;
	/** 项目描述 */
	projectDesc?: string;
	/** 项目类型 */
	projectType?: string;
	/** 状态 */
	status?: string;
	/** 排序 */
	sort?: number;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
}

/**
 * 巡检题目数据模型
 */
export interface InspectQuestionData {
	/** 题目ID */
	id?: string;
	/** 项目ID */
	projectId?: string;
	/** 题目名称 */
	questionName?: string;
	/** 题目类型 */
	questionType?: string;
	/** 题目内容 */
	questionContent?: string;
	/** 是否必填 */
	required?: boolean;
	/** 排序 */
	sort?: number;
	/** 状态 */
	status?: string;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
}

/**
 * 添加巡检项目参数
 */
export interface AddInspectProjectParams {
	/** 项目名称 */
	projectName: string;
	/** 项目编码 */
	projectCode?: string;
	/** 项目描述 */
	projectDesc?: string;
	/** 项目类型 */
	projectType?: string;
	/** 状态 */
	status?: string;
	/** 排序 */
	sort?: number;
}

/**
 * 修改巡检项目参数
 */
export interface ModifyInspectProjectParams {
	/** 项目ID */
	id: string;
	/** 项目名称 */
	projectName?: string;
	/** 项目编码 */
	projectCode?: string;
	/** 项目描述 */
	projectDesc?: string;
	/** 项目类型 */
	projectType?: string;
	/** 状态 */
	status?: string;
	/** 排序 */
	sort?: number;
}

/**
 * 添加巡检题目参数
 */
export interface AddInspectQuestionParams {
	/** 项目ID */
	projectId: string;
	/** 题目名称 */
	questionName: string;
	/** 题目类型 */
	questionType?: string;
	/** 题目内容 */
	questionContent?: string;
	/** 是否必填 */
	required?: boolean;
	/** 排序 */
	sort?: number;
	/** 状态 */
	status?: string;
}

/**
 * 修改巡检题目参数
 */
export interface ModifyInspectQuestionParams {
	/** 题目ID */
	id: string;
	/** 项目ID */
	projectId?: string;
	/** 题目名称 */
	questionName?: string;
	/** 题目类型 */
	questionType?: string;
	/** 题目内容 */
	questionContent?: string;
	/** 是否必填 */
	required?: boolean;
	/** 排序 */
	sort?: number;
	/** 状态 */
	status?: string;
}

/**
 * 获取巡检项目列表参数
 */
export interface QueryInspectProjectListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 项目名称 */
	projectName?: string;
	/** 项目类型 */
	projectType?: string;
	/** 状态 */
	status?: string;
}

/**
 * 获取巡检题目列表参数
 */
export interface QueryInspectQuestionListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 项目ID */
	projectId?: string;
	/** 题目名称 */
	questionName?: string;
	/** 题目类型 */
	questionType?: string;
	/** 状态 */
	status?: string;
}

/**
 * 删除参数
 */
export interface DeleteParams {
	/** ID */
	id: string;
}

// ==================== 接口函数 ====================

/**
 * 添加巡检项目
 * @description 添加新的巡检项目
 */
export function addInspectProject<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectProjectParams>({
		url: "/j8-patrolmgt/project/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				projectName: "",
			},
		},
		options,
	});
}

/**
 * 修改巡检项目
 * @description 修改已有的巡检项目
 */
export function modifyInspectProject<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectProjectParams>({
		url: "/j8-patrolmgt/project/modify",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				id: "",
			},
		},
		options,
	});
}

/**
 * 删除巡检项目
 * @description 删除指定的巡检项目
 */
export function deleteInspectProject<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteParams>({
		url: "/j8-patrolmgt/project/delete",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				id: "",
			},
		},
		options,
	});
}

/**
 * 获取巡检项目列表（条件+分页）
 * @description 获取巡检项目列表，支持按条件查询和分页
 */
export function queryInspectProjectList<T = PageDTO<InspectProjectData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectProjectListParams>({
		url: "/j8-patrolmgt/project/query-list",
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
 * 获取巡检项目名称列表
 * @description 获取所有巡检项目的名称列表
 */
export function queryInspectProjectNameList<T = InspectProjectData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j8-patrolmgt/project/query-name-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 增加巡检题目
 * @description 为指定项目添加新的巡检题目
 */
export function addInspectQuestion<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectQuestionParams>({
		url: "/j8-patrolmgt/question/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				projectId: "",
				questionName: "",
			},
		},
		options,
	});
}

/**
 * 修改巡检题目
 * @description 修改已有的巡检题目
 */
export function modifyInspectQuestion<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectQuestionParams>({
		url: "/j8-patrolmgt/question/modify",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				id: "",
			},
		},
		options,
	});
}

/**
 * 删除巡检题目
 * @description 删除指定的巡检题目
 */
export function deleteInspectQuestion<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteParams>({
		url: "/j8-patrolmgt/question/delete",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				id: "",
			},
		},
		options,
	});
}

/**
 * 获取巡检题目列表（条件+分页）
 * @description 获取巡检题目列表，支持按条件查询和分页
 */
export function queryInspectQuestionList<T = PageDTO<InspectQuestionData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInspectQuestionListParams>({
		url: "/j8-patrolmgt/question/query-list",
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
