import type { InputProps, ISelectProps } from "element-plus";
/**
 * 本文件专门拓展继承element-plus各种表单组件的props属性
 */
// import  {  SelectProps } from "element-plus";

/**
 * 表单配置对象 可以配置的字段
 * @description
 * 这里的写法是为了排除掉冗余的类型
 *
 * 预期用于表单校验等场景
 */
export type BaseFormPropKey<T> = string & keyof T;
// export type BaseFormPropKey<T> = keyof T;

/**
 * 每一个表单配置项都具有的字段
 * @description
 * 该类型预期被继承 本类型旨在于框定每一个表单配置项都要填写的字段
 *
 * 目前该类型将会被其他中间类型继承
 * @private
 */
export interface _BaseFormItemProps<T> {
	/** 表单字段 */
	label: string;
	/**
	 * 表单的字段key值
	 * @version 2 即之前的 `dataKey` 配置
	 * @description
	 * 取名为 prop 是为了配合表单校验所需的字段
	 *
	 * @see https://element-plus.org/zh-CN/component/form#表单校验
	 */
	prop: BaseFormPropKey<T>;
	/**
	 * 响应式布局配置
	 * @description
	 * 每个表单项的响应式布局配置·
	 */
	responsive?: ResponsiveConfig;
}

/**
 * 输入框 props
 * @description
 * 继承了 element-plus 的`输入框`组件的 props
 * @private
 */
export type _InputProps<T> = _BaseFormItemProps<T> & Partial<InputProps>;

/**
 * 选择框 props
 * @description
 * 继承了 element-plus 的`选择框`组件的 props
 * @private
 */
export type _SelectProps<T> = _BaseFormItemProps<T> & Partial<ISelectProps>;
