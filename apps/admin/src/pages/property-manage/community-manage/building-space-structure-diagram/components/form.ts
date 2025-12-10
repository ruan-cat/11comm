import type { OptionsType } from "plus-pro-components";

// ==================== 表单相关类型定义 ====================

/**
 * 楼栋结构图表单数据类型
 */
export interface 楼栋结构图表单_VO {
	/** 楼栋编号 */
	楼栋编号: string;
	/** 楼栋名称 */
	楼栋名称: string;
	/** 总楼层 */
	总楼层: number;
	/** 总户数 */
	总户数: number;
	/** 建筑面积 */
	建筑面积: number;
	/** 建筑结构 */
	建筑结构: string;
	/** 建成年份 */
	建成年份: string;
	/** 图纸路径 */
	图纸路径: string;
	/** 状态 */
	状态: string;
	/** 负责人 */
	负责人: string;
	/** 联系电话 */
	联系电话: string;
	/** 备注 */
	备注: string;
}

/**
 * 楼栋结构图表单组件 props 类型
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface BuildingSpaceStructureDiagramFormProps {
	/** 表单数据 */
	form: 楼栋结构图表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 楼栋结构图表单_VO;
}

// ==================== 常量定义 ====================

/**
 * 建筑结构选项
 */
export const 建筑结构选项: OptionsType = [
	{
		label: "钢筋混凝土结构",
		value: "钢筋混凝土结构",
	},
	{
		label: "钢结构",
		value: "钢结构",
	},
	{
		label: "砖混结构",
		value: "砖混结构",
	},
	{
		label: "框架结构",
		value: "框架结构",
	},
	{
		label: "剪力墙结构",
		value: "剪力墙结构",
	},
];

/**
 * 楼栋状态选项
 */
export const 楼栋状态选项: OptionsType = [
	{
		label: "正常使用",
		value: "正常使用",
	},
	{
		label: "装修中",
		value: "装修中",
	},
	{
		label: "维修中",
		value: "维修中",
	},
	{
		label: "待验收",
		value: "待验收",
	},
	{
		label: "已停用",
		value: "已停用",
	},
];

// ==================== 默认表单对象 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 楼栋结构图表单_VO = {
	楼栋编号: "",
	楼栋名称: "",
	总楼层: 0,
	总户数: 0,
	建筑面积: 0,
	建筑结构: "",
	建成年份: "",
	图纸路径: "",
	状态: "正常使用",
	负责人: "",
	联系电话: "",
	备注: "",
};
