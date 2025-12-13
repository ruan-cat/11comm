import type { PatrolPlanFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PatrolPlanFormVO = {
	planName: "",
	planRoute: "",
	planCycle: "",
	checkInMethod: "二维码",
	dateRange: "",
	timeRange: {
		startTime: "",
		endTime: "",
	},
	taskAdvanceMinutes: "",
	planner: "",
	planTime: "",
	status: "启用",
	patrolStaff: "",
};

/**
 * 巡检计划表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolPlanFormProps {
	/** 表单数据 */
	form: PatrolPlanFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PatrolPlanFormVO;
}

export type { PatrolPlanFormVO };
