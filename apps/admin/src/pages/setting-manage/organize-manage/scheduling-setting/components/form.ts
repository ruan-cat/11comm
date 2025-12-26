import type { SchedulingSetting, SchedulingSettingFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: SchedulingSettingFormVO = {
	name: "",
	type: "",
	cycle: "1",
	effectiveTime: "",
	staff: "",
	status: "",
};

/**
 * 排班设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface SchedulingSettingFormProps {
	/** 表单数据 */
	form: SchedulingSettingFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: SchedulingSettingFormVO;
	/** 表单模式 */
	mode?: Mode;
}
