import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检项目选项数据模型
 */
export interface InspectProjectOptionData {
	/** 选项ID */
	id?: string;
	/** 项目ID */
	projectId?: string;
	/** 选项名称 */
	optionName?: string;
	/** 选项值 */
	optionValue?: string;
	/** 选项类型 */
	optionType?: string;
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
 * 添加巡检项目选项参数
 */
export interface AddInspectProjectOptionParams {
	/** 项目ID */
	projectId: string;
	/** 选项名称 */
	optionName: string;
	/** 选项值 */
	optionValue: string;
	/** 选项类型 */
	optionType?: string;
	/** 排序 */
	sort?: number;
	/** 状态 */
	status?: string;
}

/**
 * 修改巡检项目选项参数
 */
export interface ModifyInspectProjectOptionParams {
	/** 选项ID */
	id: string;
	/** 项目ID */
	projectId?: string;
	/** 选项名称 */
	optionName?: string;
	/** 选项值 */
	optionValue?: string;
	/** 选项类型 */
	optionType?: string;
	/** 排序 */
	sort?: number;
	/** 状态 */
	status?: string;
}

/**
 * 删除巡检项目选项参数
 */
export interface DeleteInspectProjectOptionParams {
	/** 选项ID */
	id: string;
}

// ==================== 接口函数 ====================

/**
 * 添加巡检项目选项
 * @description 添加新的巡检项目选项
 */
export function addInspectProjectOption<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectProjectOptionParams>({
		url: "/j8-patrolmgt/project-option/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				projectId: "",
				optionName: "",
				optionValue: "",
			},
		},
		options,
	});
}

/**
 * 修改巡检项目选项
 * @description 修改已有的巡检项目选项
 */
export function modifyInspectProjectOption<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInspectProjectOptionParams>({
		url: "/j8-patrolmgt/project-option/modify",
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
 * 删除巡检项目选项
 * @description 删除指定的巡检项目选项
 */
export function deleteInspectProjectOption<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteInspectProjectOptionParams>({
		url: "/j8-patrolmgt/project-option/delete",
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
