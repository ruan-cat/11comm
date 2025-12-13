import type { OptionsType } from "../../../common";

/**
 * @description parking-space-structure-diagram列表数据
 * ParkingSpaceStructureDiagram list item
 */
export interface ParkingSpaceStructureDiagramListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description parking-space-structure-diagram列表查询参数
 * ParkingSpaceStructureDiagram list query parameters
 */
export interface ParkingSpaceStructureDiagramQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 车位类型选项
 * Parking space type options
 */
export const 车位类型选项: OptionsType = [
	{ label: "标准车位", value: "标准车位" },
	{ label: "大型车位", value: "大型车位" },
	{ label: "小型车位", value: "小型车位" },
	{ label: "子母车位", value: "子母车位" },
];

/**
 * @description 车位状态选项
 * Parking space status options
 */
export const 车位状态选项: OptionsType = [
	{ label: "空闲", value: "空闲" },
	{ label: "已售", value: "已售" },
	{ label: "已租", value: "已租" },
	{ label: "待售", value: "待售" },
	{ label: "待租", value: "待租" },
];

/**
 * @description 楼层区域选项
 * Floor area options
 */
export const 楼层区域选项: OptionsType = [
	{ label: "地下1层", value: "地下1层" },
	{ label: "地下2层", value: "地下2层" },
	{ label: "地下3层", value: "地下3层" },
	{ label: "地面层", value: "地面层" },
	{ label: "架空层", value: "架空层" },
];

/**
 * @description 是否充电桩选项
 * EV charging pile options
 */
export const 是否充电桩选项: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];

// ==================== 中文名称导出 ====================

/** 状态选项（中文名称） */
export const 状态选项 = 车位状态选项;
