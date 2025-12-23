import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 商户信息
 */
export interface MerchantInfo {
	/** 商户ID */
	id: string;
	/** 商户名称 */
	merchantName: string;
	/** 商户编码 */
	merchantCode: string;
	/** 商户类型 */
	merchantType: string;
	/** 联系人 */
	contactPerson: string;
	/** 联系电话 */
	contactPhone: string;
	/** 联系邮箱 */
	email: string;
	/** 营业执照号 */
	businessLicenseNumber: string;
	/** 法人代表 */
	legalRepresentative: string;
	/** 注册地址 */
	registeredAddress: string;
	/** 经营地址 */
	businessAddress: string;
	/** 注册资本 */
	registeredCapital: number;
	/** 成立时间 */
	establishedTime: string;
	/** 经营范围 */
	businessScope: string;
	/** 服务小区 */
	serviceCommunities: string;
	/** 合同开始时间 */
	contractStartTime: string;
	/** 合同结束时间 */
	contractEndTime: string;
	/** 状态 */
	status: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 商户信息列表查询参数
 */
export interface MerchantInfoListQuery extends BaseListQueryParams {
	/** 商户名称 */
	merchantName?: string;
	/** 商户编码 */
	merchantCode?: string;
	/** 商户类型 */
	merchantType?: string;
	/** 联系人 */
	contactPerson?: string;
	/** 联系电话 */
	contactPhone?: string;
	/** 状态 */
	status?: string;
	/** 成立时间范围 */
	establishedTimeRange?: [string, string];
	/** 合同时间范围 */
	contractTimeRange?: [string, string];
}

/**
 * 商户类型选项
 */
export const merchantInfoTypeOptions: OptionsType = [
	{ label: "便利店", value: "convenience" },
	{ label: "超市", value: "supermarket" },
	{ label: "餐饮", value: "restaurant" },
	{ label: "美容美发", value: "beauty" },
	{ label: "维修服务", value: "repair" },
	{ label: "快递收发", value: "express" },
	{ label: "干洗服务", value: "laundry" },
	{ label: "其他", value: "other" },
];

/**
 * 状态选项
 */
export const merchantInfoStatusOptions: OptionsType = [
	{ label: "正常营业", value: "operating" },
	{ label: "暂停营业", value: "suspended" },
	{ label: "合同到期", value: "expired" },
	{ label: "终止合作", value: "terminated" },
];
