import type { OptionsType } from "../../../common";
import { parkingSpaceStatusOptions } from "../../../common/business-options";

/**
 * @description vehicle-charge列表数据
 * VehicleCharge list item
 */
export interface VehicleChargeListItem {
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
 * @description vehicle-charge列表查询参数
 * VehicleCharge list query parameters
 */
export interface VehicleChargeQueryParams {
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
 * @description 状态选项
 * Status options
 */
export const vehicleChargeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 车辆收费表单VO
 * Vehicle charge form VO
 */
export interface VehicleChargeFormVO {
	/** 车牌号 License plate number */
	licensePlateNumber: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 车位状态 Parking space status */
	parkingSpaceStatus: string;
	/** 收费金额 Charge amount */
	chargeAmount: string;
	/** 收费时间 Charge time */
	chargeTime: string;
	/** 收费方式 Charge method */
	chargeMethod: string;
	/** 备注 Remark */
	remark?: string;
}

// 注意：parkingSpaceStatusOptions 已从 "../../../common/business-options" 导入
