import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 员工信息
 */
export interface StaffInfo {
	/** 员工ID */
	id: string;
	/** 员工编号 */
	employeeNumber: string;
	/** 姓名 */
	name: string;
	/** 性别 */
	gender: string;
	/** 岗位 */
	position: string;
	/** 邮箱 */
	email: string;
	/** 手机号 */
	phone: string;
	/** 地址 */
	address: string;
	/** 关联组织ID */
	orgId?: string;
	/** 关联组织名称 */
	orgName?: string;
	/** 照片 */
	avatar?: string;
}

/**
 * 员工列表查询参数
 */
export interface StaffInfoListQuery extends BaseListQueryParams {
	/** 员工ID */
	id?: string;
	/** 员工姓名 */
	name?: string;
	/** 手机号 */
	phone?: string;
}

/**
 * 员工性别选项
 */
export const staffGenderOptions: OptionsType = [
	{ label: "男", value: "男" },
	{ label: "女", value: "女" },
];

/** 员工信息表单数据类型 */
export interface StaffInfoFormVO extends Partial<StaffInfo> {
	name: string;
	gender: string;
	position: string;
	email: string;
	phone: string;
	address: string;
	orgName: string;
	avatar?: string;
}
