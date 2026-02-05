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
	/** 业主名称 Owner name (for seed script compatibility) */
	ownerName?: string;
	/** 关系 Relation (alias for type, for seed script compatibility) */
	relation?: string;
	/** 电话 Phone (alias for contact, for seed script compatibility) */
	phone?: string;
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
