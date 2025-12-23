/**
 * @file 楼栋结构图类型定义
 * @description Building space structure diagram types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

// ==================== 表单类型定义 ====================

/**
 * 楼栋结构图表单数据类型 / Building space structure diagram form data type
 */
export interface BuildingSpaceStructureDiagramFormVO {
	/** 楼栋编号 / Building ID */
	buildingId: string;
	/** 楼栋名称 / Building name */
	buildingName: string;
	/** 总楼层 / Total floors */
	totalFloors: number;
	/** 总户数 / Total households */
	totalHouseholds: number;
	/** 建筑面积 / Building area */
	buildingArea: number;
	/** 建筑结构 / Building structure */
	buildingStructure: string;
	/** 建成年份 / Construction year */
	constructionYear: string;
	/** 图纸路径 / Drawing path */
	drawingPath: string;
	/** 状态 / Status */
	status: string;
	/** 负责人 / Person in charge */
	personInCharge: string;
	/** 联系电话 / Contact phone */
	contactPhone: string;
	/** 备注 / Remarks */
	remarks: string;
}


// ==================== 原有类型定义 ====================

/**
 * @description 楼栋结构图列表数据
 * Building space structure diagram list item
 */
export interface BuildingSpaceStructureDiagramListItem {
	/** 楼栋编号 Building ID */
	buildingId: string;
	/** 楼栋名称 Building name */
	buildingName: string;
	/** 总楼层 Total floors */
	totalFloors: number;
	/** 总户数 Total households */
	totalHouseholds: number;
	/** 建筑面积 Building area */
	buildingArea: number;
	/** 建筑结构 Building structure */
	buildingStructure: string;
	/** 建成年份 Construction year */
	constructionYear: string;
	/** 图纸路径 Drawing path */
	drawingPath: string;
	/** 状态 Status */
	status: string;
	/** 最后更新时间 Last update time */
	lastUpdateTime: string;
	/** 负责人 Person in charge */
	personInCharge: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 备注 Remarks */
	remarks: string;
}

/**
 * @description 楼栋结构图列表查询参数
 * Building space structure diagram list query parameters
 */
export interface BuildingSpaceStructureDiagramQueryParams extends BaseListQueryParams {
	/** 楼栋编号 Building ID */
	buildingId?: string;
	/** 楼栋名称 Building name */
	buildingName?: string;
	/** 建筑结构 Building structure */
	buildingStructure?: string;
	/** 状态 Status */
	status?: string;
	/** 建成年份 Construction year */
	constructionYear?: string;
}

// ==================== 常量定义 ====================

/**
 * @description 建筑结构选项
 * Building structure options
 */
export const buildingStructureOptions: OptionsType = [
	{ label: "钢筋混凝土结构", value: "钢筋混凝土结构" },
	{ label: "钢结构", value: "钢结构" },
	{ label: "砖混结构", value: "砖混结构" },
	{ label: "框架结构", value: "框架结构" },
	{ label: "剪力墙结构", value: "剪力墙结构" },
];

/**
 * @description 楼栋状态选项
 * Building status options
 */
export const buildingStatusOptions: OptionsType = [
	{ label: "正常使用", value: "正常使用" },
	{ label: "装修中", value: "装修中" },
	{ label: "维修中", value: "维修中" },
	{ label: "待验收", value: "待验收" },
	{ label: "已停用", value: "已停用" },
];

// ==================== 常量定义 ====================