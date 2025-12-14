import type { OptionsType } from "../../../common";

/**
 * @description property-register列表数据
 * PropertyRegister list item
 */
export interface PropertyRegisterListItem {
	/** ID */
	id: string;
	/** 房屋产权ID Property Right ID */
	propertyRightId: string;
	/** 房屋ID House ID */
	houseId: string;
	/** 房屋编号 House Number */
	houseNumber: string;
	/** 姓名 Owner Name */
	ownerName: string;
	/** 联系方式 Contact Info */
	contactInfo: string;
	/** 身份证号 ID Card Number */
	idCardNumber: string;
	/** 地址 Address */
	address: string;
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
 * @description 产权登记表单VO
 * Property register form VO
 */
export interface PropertyRegisterFormVO {
	/** 房屋产权ID Property Right ID */
	propertyRightId: string;
	/** 房屋ID House ID */
	houseId: string;
	/** 房屋编号 House Number */
	houseNumber: string;
	/** 姓名 Owner Name */
	ownerName: string;
	/** 联系方式 Contact Info */
	contactInfo: string;
	/** 身份证号 ID Card Number */
	idCardNumber: string;
	/** 地址 Address */
	address: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 产权登记表单默认值
 * Property register form default values
 */
export const defaultForm: PropertyRegisterFormVO = {
	propertyRightId: "",
	houseId: "",
	houseNumber: "",
	ownerName: "",
	contactInfo: "",
	idCardNumber: "",
	address: "",
	status: "启用",
	remark: "",
};

/**
 * @description property-register列表查询参数
 * PropertyRegister list query parameters
 */
export interface PropertyRegisterQueryParams {
	/** 房屋ID House ID */
	houseId?: string;
	/** 房屋编号 House Number */
	houseNumber?: string;
	/** 姓名 Owner Name */
	ownerName?: string;
	/** 联系方式 Contact Info */
	contactInfo?: string;
	/** 身份证号 ID Card Number */
	idCardNumber?: string;
	/** 地址 Address */
	address?: string;
	/** 状态 Status */
	status?: string;
	/** 楼栋 Building */
	building?: string;
	/** 单元 Unit */
	unit?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const propertyRegisterStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 产权登记审核状态选项
 * Property registration audit status options
 */
export const propertyRegistrationAuditStatusOptions = propertyRegisterStatusOptions;

/**
 * @description 楼栋选项
 * Building options
 */
export const buildingOptions: OptionsType = [
	{ label: "A栋", value: "A栋" },
	{ label: "B栋", value: "B栋" },
	{ label: "C栋", value: "C栋" },
	{ label: "D栋", value: "D栋" },
];

/**
 * @description 单元选项
 * Unit options
 */
export const unitOptions: OptionsType = [
	{ label: "1单元", value: "1单元" },
	{ label: "2单元", value: "2单元" },
	{ label: "3单元", value: "3单元" },
];
