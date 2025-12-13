import type { OptionsType } from "../../../common";

/**
 * @description owners-committee列表数据
 * OwnersCommittee list item
 */
export interface OwnersCommitteeListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
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
 * @description owners-committee列表查询参数
 * OwnersCommittee list query parameters
 */
export interface OwnersCommitteeQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
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
