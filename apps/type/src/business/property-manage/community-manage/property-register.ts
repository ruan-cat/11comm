/**
 * @file 产权登记类型定义
 * @description Property registration types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 产权登记列表数据
 * Property registration list item
 */
export interface PropertyRegisterListItem {
	/** 主键ID Primary key ID */
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
 * 产权登记查询参数
 * Property registration query parameters
 */
export interface PropertyRegisterQueryParams extends BaseListQueryParams {
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
}

/**
 * 产权登记表单VO
 * Property registration form VO
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
 * 产权登记表单默认值
 * Property registration form default values
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
 * 产权登记状态选项
 * Property registration status options
 */
export const propertyRegisterStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];
