import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取报修已办单列表查询参数
 */
export interface QueryAllRepairHavedoneParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区id */
	community_id: string;
	/** 维修类型 */
	maintenance_type?: string;
	/** 报修人 */
	repair_name?: string;
	/** 报修人电话 */
	tel?: string;
	/** 报修类型 */
	repair_type?: string;
	/** 报修状态 */
	state?: string;
	/** 工单编码 */
	repair_id?: string;
}

/**
 * 报修已办数据 DTO
 */
export interface RepairDoneDTO {
	/** 工单编码 */
	repair_id?: string;
	/** 位置 */
	repair_obj_name?: string;
	/** 报修类型 */
	repair_type?: string;
	/** 报修类型中文映射 */
	repair_type_detail?: string;
	/** 维修类型 */
	maintenance_type?: string;
	/** 维修类型中文映射 */
	maintenance_type_detail?: string;
	/** 报修人 */
	repair_name?: string;
	/** 报修人电话 */
	tel?: string;
	/** 预约时间 */
	appointment_time?: string;
	/** 报修状态 */
	state?: string;
	/** 报修状态中文映射 */
	state_detail?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取报修已办单列表
 * @description 查询报修已办工单列表，支持多种过滤条件
 */
export function getRepairDoneList<T = PageDTO<RepairDoneDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAllRepairHavedoneParams>({
		url: "/c2-repairsetting/repair-done/repair-done/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 获取报修已办单列表 (comm-前缀)
 * @description 使用comm-前缀的API路径查询报修已办工单列表，支持多种过滤条件
 */
export function getRepairDoneListComm<T = PageDTO<RepairDoneDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAllRepairHavedoneParams>({
		url: "/comm-c2-repairsetting/repair-done/repair-done/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
		options,
	});
}
