import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 分页查询报修已办数据参数
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

/**
 * 报修已办分页数据 DTO
 */
export interface RepairDonePageDTO {
	pageIndex: number; // 当前页码
	pageSize: number; // 每页数据条数
	total: number; // 数据的总条数
	pages: number; // 数据的总页数
	rows?: RepairDoneDTO[]; // 当前页数据列表
}

// ==================== 接口函数 ====================

/**
 * 分页查询报修已办数据
 */
export function queryAllRepairHavedone<T = RepairDonePageDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAllRepairHavedoneParams>({
		url: "/c2-repairsetting/repair-done/repair-done/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
	});
}

/**
 * 分页查询报修已办数据 (comm-)
 */
export function queryAllRepairHavedoneComm<T = RepairDonePageDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAllRepairHavedoneParams>({
		url: "/comm-c2-repairsetting/repair-done/repair-done/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
	});
}
