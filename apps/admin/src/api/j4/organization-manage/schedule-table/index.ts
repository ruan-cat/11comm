import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 获取人员排班列表参数
 */
export interface GetPersonnelScheduleListParams {
	/** 查询月份 */
	month?: number;
	/** 姓名 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 班次名称 */
	shiftName?: string;
	/** 查询年份 */
	year?: number;
}

/**
 * 人员排班数据传输对象
 */
export interface PersonnelScheduleDTO {
	/** 日期 */
	attendanceDate?: string;
	/** 排班详情（日期->排班信息映射） */
	scheduleDetails?: Record<string, string>;
	/** 排班信息 */
	scheduleTime?: string;
	/** 员工ID */
	staffId?: string;
	/** 员工姓名 */
	staffName?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取人员排班列表接口
 * @description 获取人员排班列表，支持条件查询和分页
 */
export function getPersonnelScheduleList<T = PageDTO<PersonnelScheduleDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetPersonnelScheduleListParams>({
		url: "/j4-orgmanager/schedulingTable/getpagePersonnelSchedulingList",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				month: 6,
				name: "",
				pageIndex: 1,
				pageSize: 10,
				shiftName: "",
				year: 2025,
			},
		},
		options,
	});
}
