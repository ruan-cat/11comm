import type { OptionsType } from "../../../common";
import { parkingSpaceTypeOptions, parkingSpaceStatusOptions } from "../../../common/business-options";

/**
 * @description 车位结构图列表数据项
 * Parking space structure diagram list item
 */
export interface ParkingSpaceStructureDiagramListItem {
	/** ID */
	id: string;
	/** 车位编号 Parking space number */
	parkingSpaceNumber: string;
	/** 车位类型 Parking space type */
	parkingSpaceType: string;
	/** 车位位置 Parking space location */
	parkingSpaceLocation: string;
	/** 车位面积 Parking space area */
	parkingSpaceArea: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus: string;
	/** 业主姓名 Owner name */
	ownerName: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 车牌号码 License plate number */
	licensePlateNumber: string;
	/** 车辆品牌 Vehicle brand */
	vehicleBrand: string;
	/** 购买时间 Purchase time */
	purchaseTime: string;
	/** 到期时间 Expiry time */
	expiryTime: string;
	/** 月租金 Monthly rent */
	monthlyRent: number;
	/** 管理费 Management fee */
	managementFee: number;
	/** 车位朝向 Parking space orientation */
	parkingSpaceOrientation: string;
	/** 楼层区域 Floor area */
	floorArea: string;
	/** 是否充电桩 Has EV charging pile */
	hasEvChargingPile: boolean;
	/** 充电桩功率 Charging pile power */
	chargingPilePower: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description 停车场结构图列表查询参数
 * Parking space structure diagram list query parameters
 */
export interface ParkingSpaceStructureDiagramQueryParams {
	/** 车位编号 Parking space number */
	parkingSpaceNumber?: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

// 注意：parkingSpaceTypeOptions 和 parkingSpaceStatusOptions 已从 "../../../common/business-options" 导入

/**
 * @description 楼层区域选项
 * Floor area options
 */
export const floorAreaOptions: OptionsType = [
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
export const isChargingPileOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 车位结构图_列表数据 类型（兼容性）
 * Parking space structure diagram list data type (for compatibility)
 */
export type 车位结构图_列表数据 = ParkingSpaceStructureDiagramListItem[];

/**
 * @description 车位结构图_列表查询_VO 类型（兼容性）
 * Parking space structure diagram list query VO type (for compatibility)
 */
export type 车位结构图_列表查询_VO = ParkingSpaceStructureDiagramQueryParams;

// ==================== 中文字段映射 ====================

/**
 * @description 车位结构图数据项（中文字段映射）
 * Parking space structure diagram item with Chinese field mapping
 */
export interface 车位结构图数据项中文 extends ParkingSpaceStructureDiagramListItem {
	/** 车位编号（中文字段名） */
	车位编号: string;
	/** 车位类型（中文字段名） */
	车位类型: string;
	/** 车位位置（中文字段名） */
	车位位置: string;
	/** 车位面积（中文字段名） */
	车位面积: string;
	/** 车位状态（中文字段名） */
	车位状态: string;
	/** 业主姓名（中文字段名） */
	业主姓名: string;
	/** 联系电话（中文字段名） */
	联系电话: string;
	/** 车牌号码（中文字段名） */
	车牌号码: string;
	/** 车辆品牌（中文字段名） */
	车辆品牌: string;
	/** 购买时间（中文字段名） */
	购买时间: string;
	/** 到期时间（中文字段名） */
	到期时间: string;
	/** 月租金（中文字段名） */
	月租金: number;
	/** 管理费（中文字段名） */
	管理费: number;
	/** 车位朝向（中文字段名） */
	车位朝向: string;
	/** 楼层区域（中文字段名） */
	楼层区域: string;
	/** 是否充电桩（中文字段名） */
	是否充电桩: boolean;
	/** 充电桩功率（中文字段名） */
	充电桩功率: string;
	/** 备注信息（中文字段名） */
	备注信息: string;
}
