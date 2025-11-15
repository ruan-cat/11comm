import { type OptionsType } from "plus-pro-components";

/** 排班设置表单 */
export interface 排班设置表单_VO {
	班次名称: string;
	排班类型: string;
	排班周期: number;
	生效时间: string;
	人员: string;
	状态: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 排班设置表单_VO = {
	班次名称: "",
	排班类型: "",
	排班周期: 1,
	生效时间: "",
	人员: "",
	状态: "",
};

/** 排班类型选项 */
export const 排班类型Options: OptionsType = [
	{ label: "按月排班", value: "按月排班" },
	{ label: "按周排班", value: "按周排班" },
	{ label: "按日排班", value: "按日排班" },
];

/** 状态选项 */
export const 状态Options: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "停用", value: "停用" },
];

/**
 * 排班设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface SchedulingSettingFormProps {
	/** 表单数据 */
	form: 排班设置表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 排班设置表单_VO;
}