import type { OptionsType, BaseListQueryParams } from "../../../common";
import { genderOptions, memberTypeOptions } from "../../../common/business-options";

/**
 * @file 业主成员类型定义
 * @description Owner member types
 */

/**
 * 业主成员列表数据
 * Owner member list item
 */
export interface OwnerMemberListItem {
	/** ID */
	id: string;
	/** 成员人脸 Member face */
	memberFace: string;
	/** 名称 Name */
	name: string;
	/** 性别 Gender */
	gender: string;
	/** 类型 Type */
	type: string;
	/** 身份证 ID card */
	idCard: string;
	/** 联系方式 Contact */
	contact: string;
	/** 家庭住址 Home address */
	homeAddress: string;
	/** 门禁钥匙 Access key */
	accessKey: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * 业主成员查询参数
 * Owner member query parameters
 */
export interface OwnerMemberQueryParams extends BaseListQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * @description 状态选项
 * Status options
 */
export const ownerMemberStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 业主成员表单VO
 * Owner member form VO
 */
export interface OwnerMemberFormVO {
	/** 成员人脸 Member face */
	memberFace: string;
	/** 名称 Name */
	name: string;
	/** 性别 Gender */
	gender: string;
	/** 类型 Type */
	type: string;
	/** 身份证 ID card */
	idCard: string;
	/** 联系方式 Contact */
	contact: string;
	/** 家庭住址 Home address */
	homeAddress: string;
	/** 创建人 Creator */
	creator: string;
	/** 备注 Remark */
	remark: string;
	/** 门禁钥匙 Access key */
	accessKey: string;
}

// ==================== 兼容旧中文名称 ====================

/**
 * @description 业主成员列表数据（兼容性中文名称）
 * OwnerMember list item (for compatibility with Chinese names)
 */
export type 业主成员_列表数据 = OwnerMemberListItem;

/**
 * @description 业主成员列表查询参数（兼容性中文名称）
 * OwnerMember query parameters (for compatibility with Chinese names)
 */
export type 业主成员_列表查询_VO = OwnerMemberQueryParams;

/**
 * @description 业主成员表单VO（兼容性中文名称）
 * Owner member form VO (for compatibility with Chinese names)
 */
export type 业主成员表单_VO = OwnerMemberFormVO;

/**
 * @description 性别选项（兼容性中文名称）
 * Gender options (for compatibility with Chinese names)
 */
export const 性别选项 = genderOptions;

/**
 * @description 成员类型选项（兼容性中文名称）
 * Member type options (for compatibility with Chinese names)
 */
export const 成员类型选项 = memberTypeOptions;
