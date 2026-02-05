import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * @file 业委会类型定义
 * @description Owners committee types
 */

/**
 * 业委会列表数据
 * Owners committee list item
 */
export interface OwnersCommitteeListItem {
	/** ID */
	id: string;
	/** 姓名 Full name */
	fullName: string;
	/** 性别 Gender */
	gender: string;
	/** 电话 Phone */
	phone: string;
	/** 身份证 ID number */
	idNumber: string;
	/** 住址 Address */
	address: string;
	/** 职位 Position */
	position: string;
	/** 岗位 Post */
	post: string;
	/** 任期 Tenure */
	tenure: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
	/** 名称别名 Name alias (for seed script compatibility) */
	name?: string;
	/** 角色别名 Role alias (for seed script compatibility) */
	role?: string;
	/** 任期开始时间 Term start */
	termStart?: string;
	/** 任期结束时间 Term end */
	termEnd?: string;
}

/**
 * 业委会查询参数
 * Owners committee query parameters
 */
export interface OwnersCommitteeQueryParams extends BaseListQueryParams {
	/** 姓名 Full name */
	fullName?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * @description 状态选项
 * Status options
 */
export const ownersCommitteeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 业委会表单VO
 * Owners committee form VO
 */
export interface OwnersCommitteeFormVO {
	/** 姓名 Name */
	fullName: string;
	/** 性别 Gender */
	gender: string;
	/** 电话 Phone */
	phone: string;
	/** 身份证号码 ID number */
	idNumber: string;
	/** 住址 Address */
	address: string;
	/** 职位 Position */
	position: string;
	/** 岗位 Post */
	post: string;
	/** 岗位描述 Post description */
	postDescription: string;
	/** 届期 Term */
	term: string;
	/** 任期 Tenure */
	tenure: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}
