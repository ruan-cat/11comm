import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 巡检项目选项数据模型
 */
export interface InspectTitleValueData {
	/** 小区ID */
	communityId?: string;
	/** 选项说明 */
	itemValue?: string;
	/** 选项顺序 */
	seq?: number;
	/** 题目ID */
	titleId?: string;
	/** 选项ID */
	valueId?: string;
}

/**
 * 添加巡检项目选项参数
 */
export interface AddInspectTitleValueParams {
	/** 小区ID */
	communityId: string;
	/** 选项说明 */
	itemValue: string;
	/** 选项顺序 */
	seq: number;
	/** 题目ID */
	titleId?: string;
	/** 选项ID */
	valueId?: string;
}

/**
 * 修改巡检项目选项参数
 */
export interface ModifyInspectTitleValueParams {
	/** 小区ID */
	communityId: string;
	/** 选项说明 */
	itemValue: string;
	/** 选项顺序 */
	seq: number;
	/** 题目ID */
	titleId: string;
	/** 选项ID */
	valueId?: string;
}

/**
 * 删除巡检项目选项参数
 */
export interface DeleteInspectTitleValueParams {
	/** 选项ID */
	valueId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加巡检项目选项
 * @description 添加新的巡检项目选项
 */
export function addInspectProjectOption<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInspectTitleValueParams>({
		url: "/j8-patrolmgt/inspectionTitle/inspection-item-title-value/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				communityId: "",
				itemValue: "",
				seq: 0,
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
	return useRequest<ParamsBodyKey, T, ModifyInspectTitleValueParams>({
		url: "/j8-patrolmgt/inspectionTitle/inspection-item-title-value/update",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				communityId: "",
				itemValue: "",
				seq: 0,
				titleId: "",
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
	return useRequest<ParamsPathKey, T, DeleteInspectTitleValueParams>({
		url: "/j8-patrolmgt/inspectionTitle/inspection-item-title-value/delete/{valueId}",
		httpParamWay: "path",
		config: {
			method: "DELETE",
			url: "/j8-patrolmgt/inspectionTitle/inspection-item-title-value/delete/{valueId}",
		},
		options,
	});
}
