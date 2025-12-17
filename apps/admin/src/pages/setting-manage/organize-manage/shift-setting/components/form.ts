import type { ShiftSetting } from "@01s-11comm/type";

/** 班次设置表单 */
export interface ShiftSettingFormVO extends Partial<ShiftSetting> {
	/** 班次名称 */
	name: string;
	/** 开始时间 */
	startTime: string;
	/** 结束时间 */
	endTime: string;
	/** 班次类型 */
	type: string;
	/** 描述 */
	description: string;
	/** 是否启用 */
	enabled: boolean;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ShiftSettingFormVO = {
	name: "",
	startTime: "",
	endTime: "",
	type: "",
	description: "",
	enabled: true,
};

/**
 * 班次设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ShiftSettingFormProps {
	/** 表单数据 */
	form: ShiftSettingFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ShiftSettingFormVO;
}
