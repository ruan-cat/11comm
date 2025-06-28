import { useRequest } from "@/composables/use-request";

/**
 * 分页查询报修已办数据参数
 */
export interface QueryAllRepairHavedoneParams {
	pageIndex: number; // 查询页码
	pageSize: number; // 查询条数
	maintenance_type?: string; // 维修类型
	repair_name?: string; // 报修人
	tel?: string; // 报修人电话
	repair_type?: string; // 报修类型
	state?: string; // 报修状态
}

/**
 * 报修已办数据 DTO
 */
export interface RepairDoneDTO {
	setting_id?: string; // 工单编号
	repair_obj_name?: string; // 位置
	repair_type?: string; // 报修类型
	maintenance_type?: string; // 维修类型
	repair_name?: string; // 报修人
	tel?: string; // 报修人电话
	appointment_time?: string; // 预约时间
	state?: string; // 报修状态
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
			data: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}
