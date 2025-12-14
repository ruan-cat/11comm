import type { OptionsType } from "../../../common";

/**
 * @description 商户类型
 * Merchant type
 */
export type MerchantType = "餐饮服务" | "零售商店" | "生活服务" | "休闲娱乐" | "教育培训" | "医疗健康" | "其他";

/**
 * @description 经营状态
 * Business status
 */
export type BusinessStatus = "正常营业" | "暂停营业" | "准备开业" | "已停业";

/**
 * @description 商户信息列表数据
 * Merchant info list item
 */
export interface MerchantInfoListItem {
	/** 商户编号 Merchant ID */
	merchantId: string;
	/** 商户名称 Merchant name */
	merchantName: string;
	/** 商户地址 Merchant address */
	merchantAddress: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 商户类型 Merchant type */
	merchantType: MerchantType;
	/** 企业法人 Legal representative */
	legalRepresentative: string;
	/** 成立日期 Establishment date */
	establishmentDate: string;
	/** 经营状态 Business status */
	businessStatus: BusinessStatus;
	/** 所属小区 Affiliated community */
	affiliatedCommunity: string;
	/** 营业时间 Business hours */
	businessHours: string;
	/** 经营面积 Business area */
	businessArea: string;
	/** 创建时间 Creation time */
	createTime: string;
	/** 营业执照号 Business license number */
	businessLicenseNo: string;
	/** 开户银行 Bank name */
	bankName: string;
	/** 银行账号 Bank account */
	bankAccount: string;
	/** 联系人手机 Contact mobile */
	contactMobile: string;
	/** 备注 Remarks */
	remarks: string;
}

/**
 * @description 商户信息列表查询参数
 * Merchant info list query parameters
 */
export interface MerchantInfoQueryParams {
	/** 商户名称 Merchant name */
	merchantName?: string;
	/** 商户类型 Merchant type */
	merchantType?: MerchantType;
	/** 联系电话 Contact phone */
	contactPhone?: string;
	/** 经营状态 Business status */
	businessStatus?: BusinessStatus;
	/** 所属小区 Affiliated community */
	affiliatedCommunity?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 商户类型选项
 * Merchant type options
 */
export const merchantTypeOptions: OptionsType = [
	{ label: "餐饮服务", value: "餐饮服务" },
	{ label: "零售商店", value: "零售商店" },
	{ label: "生活服务", value: "生活服务" },
	{ label: "休闲娱乐", value: "休闲娱乐" },
	{ label: "教育培训", value: "教育培训" },
	{ label: "医疗健康", value: "医疗健康" },
	{ label: "其他", value: "其他" },
];


/**
 * @description 经营状态选项
 * Business status options
 */
export const businessStatusOptions: OptionsType = [
	{ label: "正常营业", value: "正常营业" },
	{ label: "暂停营业", value: "暂停营业" },
	{ label: "准备开业", value: "准备开业" },
	{ label: "已停业", value: "已停业" },
];


