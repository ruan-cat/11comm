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

/**
 * @description 商户信息表单数据类型 Merchant info form data type
 */
export interface MerchantInfoFormVO {
	/** 商户编号 Merchant ID */
	merchantId: string;
	/** 商户名称 Merchant name */
	merchantName: string;
	/** 商户详细地址 Merchant address */
	merchantAddress: string;
	/** 商户联系电话 Contact phone */
	contactPhone: string;
	/** 商户分类类型 Merchant category type */
	merchantType: MerchantType;
	/** 企业法人姓名 Legal representative */
	legalRepresentative: string;
	/** 公司成立日期 Establishment date */
	establishmentDate: string;
	/** 当前经营状态 Current business status */
	businessStatus: BusinessStatus;
	/** 所属小区/写字楼 Affiliated community/building */
	affiliatedCommunity: string;
	/** 每日营业时间段 Daily business hours */
	businessHours: string;
	/** 经营面积(平方米) Business area (square meters) */
	businessArea: string;
	/** 商户营业执照号 Business license number */
	businessLicenseNo: string;
	/** 银行开户行 Bank name */
	bankName: string;
	/** 银行账号 Bank account */
	bankAccount: string;
	/** 联系人手机号 Contact mobile */
	contactMobile: string;
	/** 商户备注信息 Merchant remarks */
	remarks: string;
}

/**
 * @description 默认表单 @description 对外导出用于其他场景使用 Default form for external use
 */
export const merchantInfoDefaultForm: MerchantInfoFormVO = {
	merchantId: "",
	merchantName: "",
	merchantAddress: "",
	contactPhone: "",
	merchantType: "餐饮服务",
	legalRepresentative: "",
	establishmentDate: "",
	businessStatus: "正常营业",
	affiliatedCommunity: "",
	businessHours: "",
	businessArea: "",
	businessLicenseNo: "",
	bankName: "",
	bankAccount: "",
	contactMobile: "",
	remarks: "",
};

/**
 * @description 商户信息表单 props Merchant info form props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 * To avoid global type conflicts, a longer type name is designed
 */
export interface MerchantInfoFormProps {
	/** 表单数据 Form data */
	form: MerchantInfoFormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: MerchantInfoFormVO;
	/** 表单模式 Form mode */
	mode?: "add" | "edit" | "info";
}


