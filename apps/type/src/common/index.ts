/**
 * @file 通用类型定义
 * @description 导出项目中共享的通用类型，如分页、响应格式等
 */

// JsonVO 需要从 vueuse 子路径导入
export type { JsonVO } from "@ruan-cat/utils/vueuse";

/**
 * 分页数据传输对象
 * Page data transfer object
 */
export interface PageDTO<T> {
	/** 数据列表 Data list */
	list: T[];
	/** 总记录数 Total count */
	total: number;
	/** 当前页码 Current page */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
	/** 总页数 Total pages */
	totalPages: number;
}

/**
 * 选项类型，用于下拉框、单选框等组件
 * Option type for dropdowns, radio buttons, etc.
 */
export interface OptionItem {
	/** 选项显示文本 Label text */
	label: string;
	/** 选项值 Value */
	value: string | number | boolean;
	/** 是否禁用 Disabled */
	disabled?: boolean;
}

/**
 * 选项数组类型
 * Options array type
 */
export type OptionsType = OptionItem[];

/**
 * 基础分页查询参数
 * Base pagination query parameters
 */
export interface BaseListQueryParams {
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
