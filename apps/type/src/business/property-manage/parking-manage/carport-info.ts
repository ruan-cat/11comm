import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * @description carport-info列表数据
 * CarportInfo list item
 */
export interface CarportInfoListItem {
	/** 停车场 Parking lot */
	parkingLot: string;
	/** 车位 Parking space */
	parkingSpace: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus: string;
	/** 车位类型 Parking space type */
	parkingSpaceType: string;
	/** 面积 Area */
	area: string;
	/** 业主姓名 Owner name */
	ownerName: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 车辆号码 Vehicle number */
	vehicleNumber: string;
	/** 购买日期 Purchase date */
	purchaseDate: string;
	/** 到期日期 Expiry date */
	expiryDate: string;
	/** 月租费用 Monthly rent */
	monthlyRent: number;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description carport-info列表查询参数
 * CarportInfo list query parameters
 */
export interface CarportInfoQueryParams extends BaseListQueryParams {
	/** 停车场 Parking lot */
	parkingLot?: string;
	/** 车位 Parking space */
	parkingSpace?: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus?: string;
	/** 车位类型 Parking space type */
	parkingSpaceType?: string;
	/** 业主姓名 Owner name */
	ownerName?: string;
	/** 联系电话 Contact phone */
	contactPhone?: string;
	/** 车辆号码 Vehicle number */
	vehicleNumber?: string;
}

/**
 * @description 状态选项
 * Status options
 */
export const carportInfoStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 车位信息表单数据类型（英文命名）
 * Carport info form data type (English naming)
 */
export interface CarportInfoFormVO {
	/** 停车场 Parking lot */
	parkingLot: string;
	/** 车位 Parking space */
	parkingSpace: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus: string;
	/** 车位类型 Parking space type */
	parkingSpaceType: string;
	/** 面积 Area */
	area: string;
	/** 业主姓名 Owner name */
	ownerName: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 车辆号码 Vehicle number */
	vehicleNumber: string;
	/** 购买日期 Purchase date */
	purchaseDate: string;
	/** 到期日期 Expiry date */
	expiryDate: string;
	/** 月租费用 Monthly rent */
	monthlyRent: number;
	/** 备注 Remark */
	remark: string;
}
