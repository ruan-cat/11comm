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

/**
 * 车位结构图表单数据类型
 * Parking space structure diagram form VO
 */
export interface ParkingSpaceStructureDiagramFormVO {
	/** 车位编号 */
	parkingSpaceNumber: string;
	/** 车位类型 */
	parkingSpaceType: string;
	/** 车位位置 */
	parkingSpaceLocation: string;
	/** 车位面积 */
	parkingSpaceArea: string;
	/** 车位状态 */
	parkingSpaceStatus: string;
	/** 业主姓名 */
	ownerName: string;
	/** 联系电话 */
	contactPhone: string;
	/** 车牌号码 */
	licensePlateNumber: string;
	/** 车辆品牌 */
	vehicleBrand: string;
	/** 购买时间 */
	purchaseTime: string;
	/** 到期时间 */
	expiryTime: string;
	/** 月租金 */
	monthlyRent: number;
	/** 管理费 */
	managementFee: number;
	/** 车位朝向 */
	parkingSpaceOrientation: string;
	/** 楼层区域 */
	floorArea: string;
	/** 是否充电桩 */
	hasEvChargingPile: string;
	/** 充电桩功率 */
	chargingPilePower: string;
	/** 备注信息 */
	remark: string;
}

// 注意：parkingSpaceTypeOptions 和 parkingSpaceStatusOptions 已从 "../../../common/business-options" 导入
