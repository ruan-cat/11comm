import type { OptionsType } from "../../../common";

/**
 * @description 初始化单元格列表数据
 * Initialize cell list item
 */
export interface InitializeCellListItem {
	/** 单元格ID Cell ID */
	cellId: string;
	/** 单元格名称 Cell name */
	cellName: string;
	/** 单元格类型 Cell type */
	cellType: string;
	/** 建筑物ID Building ID */
	buildingId: string;
	/** 建筑物名称 Building name */
	buildingName: string;
	/** 楼层 Floor */
	floor: string;
	/** 单元号 Unit number */
	unitNumber: string;
	/** 户数 Number of households */
	houseCount: number;
	/** 状态 Status */
	status: string;
	/** 描述 Description */
	description: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 创建人 Creator */
	creator: string;
	/** 更新人 Updater */
	updater: string;
}

/**
 * @description 初始化单元格列表查询参数
 * Initialize cell list query parameters
 */
export interface InitializeCellQueryParams {
	/** 单元格名称 Cell name */
	cellName?: string;
	/** 单元格类型 Cell type */
	cellType?: string;
	/** 建筑物名称 Building name */
	buildingName?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 单元格类型选项
 * Cell type options
 */
export const cellTypeOptions: OptionsType = [
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

/**
 * @description 状态选项
 * Status options
 */
export const initializeCellStatusOptions: OptionsType = [
	{ label: "已初始化", value: "已初始化" },
	{ label: "未初始化", value: "未初始化" },
	{ label: "初始化中", value: "初始化中" },
	{ label: "初始化失败", value: "初始化失败" },
];

// ==================== 兼容旧中文名称 ====================

/**
 * @description 单元格类型选项（兼容性）
 * Cell type options (for compatibility)
 */
export const 单元格类型Options: OptionsType = [
	{ label: "文本", value: "文本" },
	{ label: "数字", value: "数字" },
	{ label: "日期", value: "日期" },
	{ label: "下拉", value: "下拉" },
];
