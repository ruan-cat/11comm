import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 回访单列表项数据
 */
export interface RepairReturnDTO {
	/** 工单编码 */
	repair_id: string;
	/** 报修位置 */
	repair_obj_name: string;
	/** 报修类型 */
	repair_type: string;
	/** 报修类型中文映射 */
	repair_type_detail: string;
	/** 报修人 */
	repair_name: string;
	/** 报修人电话 */
	tel: string;
	/** 预约时间 */
	appointment_time: string;
	/** 回访状态 */
	state: string;
	/** 报修状态中文映射 */
	state_detail: string;
}

/**
 * 回访单分页数据
 */
export interface RepairReturnPageDTO {
	/** 当前页码 */
	pageIndex: number;
	/** 每页数据条数 */
	pageSize: number;
	/** 数据的总条数 */
	total: number;
	/** 数据的总页数 */
	pages: number;
	/** 当前页数据列表 */
	rows: RepairReturnDTO[];
}

/**
 * 回访单列表查询参数
 */
export interface QueryRepairReturnParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区id */
	community_id: string;
	/** 工单编码 */
	repair_id?: string;
	/** 报修类型 */
	repair_type?: string;
	/** 报修人 */
	repair_name?: string;
	/** 报修人电话 */
	tel?: string;
	/** 回访状态 */
	state?: string;
}

/**
 * 添加报修回访反馈参数
 */
export interface RepairReturnAddDTO {
	/** 小区id */
	community_id: string;
	/** 工单编码 */
	repair_id: string;
	/** 满意度 */
	visit_type: string;
	/** 回访内容 */
	context: string;
}

// ==================== 接口函数 ====================

/**
 * 获取回访单列表
 */
export function queryRepairReturn<T = RepairReturnPageDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRepairReturnParams>({
		url: "/c2-repairsetting/repair-return/repair-return/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
	});
}

/**
 * 获取回访单列表 (comm-)
 */
export function queryRepairReturnComm<T = RepairReturnPageDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRepairReturnParams>({
		url: "/comm-c2-repairsetting/repair-return/repair-return/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
	});
}

/**
 * 添加一条报修回访反馈数据
 */
export function addRepairReturn<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairReturnAddDTO>({
		url: "/c2-repairsetting/repair-return/repair-return/add",
		options,
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "post",
			data: {
				community_id: "",
				repair_id: "",
				visit_type: "",
				context: "",
			},
		},
	});
}

/**
 * 添加一条报修回访反馈数据 (comm-)
 */
export function addRepairReturnComm<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RepairReturnAddDTO>({
		url: "/comm-c2-repairsetting/repair-return/repair-return/add",
		options,
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "post",
			data: {
				community_id: "",
				repair_id: "",
				visit_type: "",
				context: "",
			},
		},
	});
}
