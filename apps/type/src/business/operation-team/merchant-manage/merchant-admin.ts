import type { OptionsType } from "../../../common";

/**
 * @description 管理员状态
 * Admin status
 */
export type MerchantAdminStatus = "正常" | "禁用" | "待审核";

/**
 * @description 商户管理员列表数据
 * Merchant admin list item
 */
export interface MerchantAdminListItem {
	/** 物业名称 Property name */
	propertyName: string;
	/** 管理员姓名 Admin name */
	adminName: string;
	/** 管理员电话 Admin phone */
	adminPhone: string;
	/** 管理员ID Admin ID */
	adminId: string;
	/** 状态 Status */
	status: MerchantAdminStatus;
	/** 创建时间 Creation time */
	createTime: string;
	/** 最后登录时间 Last login time */
	lastLoginTime?: string;
	/** 隶属小区数量 Number of affiliated communities */
	affiliatedCommunityCount: number;
	/** 登录次数 Login count */
	loginCount: number;
}

/**
 * @description 商户管理员列表查询参数
 * Merchant admin list query parameters
 */
export interface MerchantAdminQueryParams {
	/** 物业名称 Property name */
	propertyName?: string;
	/** 管理员姓名 Admin name */
	adminName?: string;
	/** 联系电话 Contact phone */
	contactPhone?: string;
	/** 状态 Status */
	status?: MerchantAdminStatus;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const merchantAdminStatusOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "禁用", value: "禁用" },
	{ label: "待审核", value: "待审核" },
];

/**
 * @description 物业公司选项
 * Property company options
 */
export const propertyCompanyOptions: OptionsType = [
	{ label: "万科物业服务有限公司", value: "万科物业服务有限公司" },
	{ label: "保利物业发展股份有限公司", value: "保利物业发展股份有限公司" },
	{ label: "碧桂园生活服务集团股份有限公司", value: "碧桂园生活服务集团股份有限公司" },
	{ label: "绿城服务集团有限公司", value: "绿城服务集团有限公司" },
	{ label: "龙湖智慧服务", value: "龙湖智慧服务" },
	{ label: "金地物业管理有限公司", value: "金地物业管理有限公司" },
	{ label: "华润物业科技服务有限公司", value: "华润物业科技服务有限公司" },
	{ label: "中海物业管理有限公司", value: "中海物业管理有限公司" },
	{ label: "恒大金碧物业有限公司", value: "恒大金碧物业有限公司" },
	{ label: "富力物业服务集团有限公司", value: "富力物业服务集团有限公司" },
];

/**
 * @description 商户管理员表单数据类型 Merchant admin form data type
 */
export interface MerchantAdminFormVO {
	/** 物业公司名称 Property company name */
	propertyCompany: string;
	/** 管理员姓名 Admin name */
	adminName: string;
	/** 管理员电话 Admin phone */
	adminPhone: string;
	/** 管理员邮箱 Admin email */
	adminEmail: string;
	/** 身份证号码 ID card number */
	idCardNumber: string;
	/** 账户状态 Account status */
	accountStatus: string;
	/** 登录密码 Login password */
	loginPassword: string;
	/** 确认密码 Confirm password */
	confirmPassword: string;
	/** 联系地址 Contact address */
	contactAddress: string;
	/** 备注 Remarks */
	remarks: string;
}

/**
 * @description 默认表单 @description 对外导出用于其他场景使用 Default form for external use
 */
export const merchantAdminDefaultForm: MerchantAdminFormVO = {
	propertyCompany: "",
	adminName: "",
	adminPhone: "",
	adminEmail: "",
	idCardNumber: "",
	accountStatus: "正常",
	loginPassword: "",
	confirmPassword: "",
	contactAddress: "",
	remarks: "",
};

