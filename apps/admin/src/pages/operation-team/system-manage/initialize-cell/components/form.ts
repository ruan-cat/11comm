import type { OptionsType } from "plus-pro-components";

// ==================== 联合类型定义 ====================

/** 单元格类型联合类型 */
export type 单元格类型 = "住宅单元" | "商业单元" | "车库单元" | "办公单元" | "会所单元" | "物业单元" | "运动单元" | "教育单元" | "医疗单元" | "仓储单元" | "文化单元";

/** 状态联合类型 */
export type 状态 = "已初始化" | "未初始化" | "初始化中" | "初始化失败";

// ==================== 业务类型定义 ====================

/**
 * 初始化单元格表单数据类型
 * @description
 * 用于表单组件的数据传输和验证
 */
export interface 初始化单元格表单_VO {
	/** 单元格名称 */
	单元格名称: string;
	/** 单元格类型 */
	单元格类型: 单元格类型;
	/** 建筑物ID */
	建筑物ID: string;
	/** 建筑物名称 */
	建筑物名称: string;
	/** 楼层 */
	楼层: string;
	/** 单元号 */
	单元号: string;
	/** 户数 */
	户数: number;
	/** 状态 */
	状态: 状态;
	/** 描述 */
	描述: string;
}

// ==================== 常量定义 ====================

/** 单元格类型下拉选项 */
export const 单元格类型Options: OptionsType = [
	{ label: "住宅单元", value: "住宅单元" },
	{ label: "商业单元", value: "商业单元" },
	{ label: "车库单元", value: "车库单元" },
	{ label: "办公单元", value: "办公单元" },
	{ label: "会所单元", value: "会所单元" },
	{ label: "物业单元", value: "物业单元" },
	{ label: "运动单元", value: "运动单元" },
	{ label: "教育单元", value: "教育单元" },
	{ label: "医疗单元", value: "医疗单元" },
	{ label: "仓储单元", value: "仓储单元" },
	{ label: "文化单元", value: "文化单元" },
];

/** 状态下拉选项 */
export const 状态Options: OptionsType = [
	{ label: "已初始化", value: "已初始化" },
	{ label: "未初始化", value: "未初始化" },
	{ label: "初始化中", value: "初始化中" },
	{ label: "初始化失败", value: "初始化失败" },
];

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 初始化单元格表单_VO = {
	单元格名称: "",
	单元格类型: "住宅单元",
	建筑物ID: "",
	建筑物名称: "",
	楼层: "",
	单元号: "",
	户数: 0,
	状态: "未初始化",
	描述: "",
};

/**
 * 初始化单元格表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface InitializeCellFormProps {
	/** 表单数据 */
	form: 初始化单元格表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 初始化单元格表单_VO;
}