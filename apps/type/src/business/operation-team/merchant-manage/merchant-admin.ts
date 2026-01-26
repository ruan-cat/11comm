import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 商户管理员列表项
 */
export interface MerchantAdminListItem {
	/** 管理员ID */
	id: string;
	/** 商户ID */
	merchantId: string;
	/** 商户名称 */
	merchantName: string;
	/** 商户名称 */
	propertyName: string;
	/** 管理员用户名 */
	username: string;
	/** 管理员姓名 */
	adminName: string;
	/** 真实姓名 */
	realName: string;
	/** 手机号 */
	phone: string;
	/** 管理员手机号 */
	adminPhone: string;
	/** 邮箱 */
	email: string;
	/** 性别 */
	gender: string;
	/** 职位 */
	position: string;
	/** 身份证号 */
	idCard: string;
	/** 紧急联系人 */
	emergencyContact: string;
	/** 紧急联系电话 */
	emergencyPhone: string;
	/** 权限等级 */
	permissionLevel: string;
	/** 最后登录时间 */
	lastLoginTime: string;
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
 * 商户管理员列表查询参数
 */
export interface MerchantAdminQueryParams extends BaseListQueryParams {
	/** 商户ID */
	merchantId?: string;
	/** 商户名称 */
	merchantName?: string;
	/** 管理员用户名 */
	username?: string;
	/** 真实姓名 */
	realName?: string;
	/** 手机号 */
	phone?: string;
	/** 职位 */
	position?: string;
	/** 权限等级 */
	permissionLevel?: string;
	/** 状态 */
	status?: string;
}

/**
 * 性别选项
 */
export const merchantAdminGenderOptions: OptionsType = [
	{ label: "男", value: "male" },
	{ label: "女", value: "female" },
];

/**
 * 权限等级选项
 */
export const merchantAdminPermissionLevelOptions: OptionsType = [
	{ label: "超级管理员", value: "super_admin" },
	{ label: "普通管理员", value: "normal_admin" },
	{ label: "业务操作员", value: "operator" },
];

/**
 * 状态选项
 */
export const merchantAdminStatusOptions: OptionsType = [
	{ label: "正常", value: "normal" },
	{ label: "禁用", value: "disabled" },
	{ label: "待审核", value: "pending" },
	{ label: "已离职", value: "resigned" },
];

/**
 * 商户管理员
 * @deprecated 请使用 MerchantAdminListItem
 */
export interface MerchantAdmin extends MerchantAdminListItem {}

/**
 * 商户管理员列表查询参数
 * @deprecated 请使用 MerchantAdminQueryParams
 */
export interface MerchantAdminListQuery extends MerchantAdminQueryParams {}

/**
 * 商户管理员表单 VO
 */
export interface MerchantAdminFormVO {
	/** 管理员ID */
	id?: string;
	/** 商户ID */
	merchantId: string;
	/** 管理员用户名 */
	username: string;
	/** 真实姓名 */
	realName: string;
	/** 手机号 */
	phone: string;
	/** 邮箱 */
	email: string;
	/** 性别 */
	gender: string;
	/** 职位 */
	position: string;
	/** 身份证号 */
	idCard: string;
	/** 紧急联系人 */
	emergencyContact: string;
	/** 紧急联系电话 */
	emergencyPhone: string;
	/** 权限等级 */
	permissionLevel: string;
	/** 状态 */
	status: string;
}
