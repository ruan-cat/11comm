import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 密码修改记录
 */
export interface ChangePasswordRecord {
	/** 记录ID */
	id: string;
	/** 用户名 */
	username: string;
	/** 真实姓名 */
	realName: string;
	/** 所属部门 */
	department: string;
	/** 修改时间 */
	changeTime: string;
	/** 修改IP */
	changeIp: string;
	/** 修改类型 */
	changeType: string;
	/** 操作人 */
	operator: string;
	/** 状态 */
	status: string;
	/** 备注 */
	remark: string;
}

/**
 * 密码修改记录列表查询参数
 */
export interface ChangePasswordRecordListQuery extends BaseListQueryParams {
	/** 用户名 */
	username?: string;
	/** 真实姓名 */
	realName?: string;
	/** 所属部门 */
	department?: string;
	/** 修改时间 */
	changeTime?: string;
	/** 修改类型 */
	changeType?: string;
	/** 状态 */
	status?: string;
	/** 修改时间范围 */
	changeTimeRange?: [string, string];
}

/**
 * 修改类型选项
 */
export const changePasswordRecordTypeOptions: OptionsType = [
	{ label: "用户自行修改", value: "用户自行修改" },
	{ label: "管理员重置", value: "管理员重置" },
	{ label: "强制修改", value: "强制修改" },
	{ label: "首次登录修改", value: "首次登录修改" },
];

/**
 * 修改状态选项
 */
export const changePasswordRecordStatusOptions: OptionsType = [
	{ label: "成功", value: "成功" },
	{ label: "失败", value: "失败" },
	{ label: "待审核", value: "待审核" },
];

/**
 * 部门选项
 */
export const changePasswordRecordDepartmentOptions: OptionsType = [
	{ label: "物业团队", value: "物业团队" },
	{ label: "开发团队", value: "开发团队" },
	{ label: "运营团队", value: "运营团队" },
	{ label: "财务部门", value: "财务部门" },
	{ label: "客服部门", value: "客服部门" },
	{ label: "维修部门", value: "维修部门" },
	{ label: "安保部门", value: "安保部门" },
	{ label: "绿化部门", value: "绿化部门" },
];
