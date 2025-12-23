import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * @description owner-vehicle列表数据
 * OwnerVehicle list item
 */
export interface OwnerVehicleListItem {
	/** 车牌号 License plate number */
	licensePlate: string;
	/** 成员车辆 Member vehicle */
	memberVehicle: string;
	/** 房屋号 House number */
	houseNumber: string;
	/** 车牌类型 License plate type */
	licensePlateType: string;
	/** 车辆类型 Vehicle type */
	vehicleType: string;
	/** 颜色 Color */
	color: string;
	/** 业主 Owner */
	owner: string;
	/** 车位 Parking space */
	parkingSpace: string;
	/** 有效期 Validity period */
	validityPeriod: string;
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
 * @description owner-vehicle列表查询参数
 * OwnerVehicle list query parameters
 */
export interface OwnerVehicleQueryParams extends BaseListQueryParams {
	/** 车牌号 License plate number */
	licensePlate?: string;
	/** 车位编号 Parking space number */
	parkingSpaceNumber?: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 联系方式 Contact info */
	contactInfo?: string;
	/** 成员车牌号 Member plate number */
	memberPlateNumber?: string;
}

/**
 * @description 状态选项
 * Status options
 */
export const ownerVehicleStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 业主车辆表单数据类型（英文命名）
 * Owner vehicle form data type (English naming)
 */
export interface OwnerVehicleFormVO {
	/** 车牌号 License plate */
	licensePlate: string;
	/** 汽车品牌 Car brand */
	carBrand: string;
	/** 车类型 Car type */
	carType: string;
	/** 颜色 Color */
	color: string;
	/** 车牌类型 License plate type */
	licensePlateType: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 业主 Owner */
	owner: string;
	/** 车位 Parking space */
	parkingSpace: string;
	/** 业主车辆 Owner vehicle */
	ownerVehicle: string;
	/** 备注 Remark */
	remark: string;
}
