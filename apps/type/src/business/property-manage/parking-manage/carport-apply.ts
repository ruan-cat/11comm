import type { OptionsType } from "../../../common";

/**
 * @description carport-apply列表数据
 * CarportApply list item
 */
export interface CarportApplyListItem {
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
 * @description carport-apply列表查询参数
 * CarportApply list query parameters
 */
export interface CarportApplyQueryParams {
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
export const carportApplyStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 车位申请表单类型 Carport Apply Form Types ====================

/**
 * @description 车位申请表单数据类型
 * Carport application form data type
 */
export interface CarportApplyFormVO {
	/** 申请ID Application ID */
	applicationId: string;
	/** 车牌号 License plate number */
	licensePlate: string;
	/** 停车位 Parking space */
	parkingSpace: string;
	/** 汽车品牌 Car brand */
	carBrand: string;
	/** 车辆类型 Vehicle type */
	vehicleType: string;
	/** 颜色 Color */
	color: string;
	/** 起租时间 Start lease time */
	startLeaseTime: string;
	/** 结租时间 End lease time */
	endLeaseTime: string;
	/** 申请人 Applicant */
	applicant: string;
	/** 手机号 Phone number */
	phoneNumber: string;
	/** 审核结果 Review result */
	reviewResult: string;
}

