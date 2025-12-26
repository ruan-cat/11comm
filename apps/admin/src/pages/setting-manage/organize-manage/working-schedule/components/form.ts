import type { ScheduleType, WorkingSchedule, WorkingScheduleFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: WorkingScheduleFormVO = {
	name: "",
	type: "morning",
	startTime: "",
	endTime: "",
	weekday: 1,
	managerName: "",
	phone: "",
	description: "",
	enabled: true,
};

/**
 * 排班表表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface WorkingScheduleFormProps {
	/** 表单数据 */
	form: WorkingScheduleFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: WorkingScheduleFormVO;
	/** 表单模式 */
	mode?: Mode;
}
