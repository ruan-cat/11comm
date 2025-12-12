import type { OptionsType } from "../../../common";

/**
 * @description 密码修改记录列表数据
 * Change password record list item
 */
export interface ChangePasswordRecordListItem {
	/** 记录ID Record ID */
	recordId: string;
	/** 用户名 Username */
	username: string;
	/** 真实姓名 Real name */
	realName: string;
	/** 用户角色 User role */
	userRole: string;
	/** 所属部门 Department */
	department: string;
	/** 联系电话 Phone */
	phone: string;
	/** 邮箱 Email */
	email: string;
	/** 修改时间 Change time */
	changeTime: string;
	/** 修改IP地址 IP address */
	ipAddress: string;
	/** 修改地点 Location */
	location: string;
	/** 修改方式 Change method */
	changeMethod: string;
	/** 操作状态 Status */
	status: string;
	/** 是否成功 Success */
	success: string;
	/** 失败原因 Failure reason */
	failureReason: string;
	/** 操作人 Operator */
	operator: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 密码修改记录列表查询参数
 * Change password record list query parameters
 */
export interface ChangePasswordRecordQueryParams {
	/** 用户名 Username */
	username?: string;
	/** 真实姓名 Real name */
	realName?: string;
	/** 用户角色 User role */
	userRole?: string;
	/** 所属部门 Department */
	department?: string;
	/** 修改方式 Change method */
	changeMethod?: string;
	/** 操作状态 Status */
	status?: string;
	/** 是否成功 Success */
	success?: string;
	/** 修改开始时间 Start time */
	startTime?: string;
	/** 修改结束时间 End time */
	endTime?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 用户角色选项
 * User role options
 */
export const userRoleOptions: OptionsType = [
	{ label: "超级管理员", value: "超级管理员" },
	{ label: "运营团队", value: "运营团队" },
	{ label: "物业团队", value: "物业团队" },
	{ label: "客服团队", value: "客服团队" },
	{ label: "财务团队", value: "财务团队" },
	{ label: "维修团队", value: "维修团队" },
	{ label: "保安团队", value: "保安团队" },
	{ label: "普通用户", value: "普通用户" },
];

/**
 * @description 部门选项
 * Department options
 */
export const departmentOptions: OptionsType = [
	{ label: "运营部", value: "运营部" },
	{ label: "物业部", value: "物业部" },
	{ label: "客服部", value: "客服部" },
	{ label: "财务部", value: "财务部" },
	{ label: "维修部", value: "维修部" },
	{ label: "保安部", value: "保安部" },
	{ label: "行政部", value: "行政部" },
	{ label: "技术部", value: "技术部" },
];

/**
 * @description 修改方式选项
 * Change method options
 */
export const changeMethodOptions: OptionsType = [
	{ label: "用户自行修改", value: "用户自行修改" },
	{ label: "管理员重置", value: "管理员重置" },
	{ label: "忘记密码找回", value: "忘记密码找回" },
	{ label: "首次登录修改", value: "首次登录修改" },
	{ label: "定期强制修改", value: "定期强制修改" },
];

/**
 * @description 操作状态选项
 * Status options
 */
export const changePasswordStatusOptions: OptionsType = [
	{ label: "成功", value: "成功" },
	{ label: "失败", value: "失败" },
	{ label: "处理中", value: "处理中" },
	{ label: "已取消", value: "已取消" },
];

/**
 * @description 是否成功选项
 * Success options
 */
export const changePasswordSuccessOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];
