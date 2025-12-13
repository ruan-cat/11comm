import type { OptionsType } from "plus-pro-components";

/** 状态选项 */
export const 状态Options: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "审核完成", value: "审核完成" },
	{ label: "审核失败", value: "审核失败" },
];

// 重新导出类型，供组件使用
export type { 初始化小区表单_VO };

/**
 * 默认表单
 * @description 对外导出用于其他场景使用
 */
export const defaultForm: 初始化小区表单_VO = {
	小区ID: "",
	小区名称: "",
	附近地标: "",
	城市编码: "",
	状态: "",
};

/**
 * 初始化小区表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface InitializeCellFormProps {
	/** 表单数据 */
	form: 初始化小区表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 初始化小区表单_VO;
}
