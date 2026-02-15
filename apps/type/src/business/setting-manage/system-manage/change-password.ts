import type { BaseListQueryParams } from "../../../common";
import type { SmChangePasswordRecord, NewSmChangePasswordRecord } from "./schema";

/**
 * @description 密码修改记录列表项（前端类型）
 * Change password record list item
 * 从 Schema 类型推导，转换时间字段为字符串格式
 */
export type ChangePasswordRecordListItem = Omit<SmChangePasswordRecord, "createdAt" | "updatedAt"> & {
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
};

/**
 * @description 密码修改记录（前端类型）
 * Change password record
 * 从 Schema 类型推导，转换时间字段为字符串格式
 */
export type ChangePasswordRecord = Omit<SmChangePasswordRecord, "createdAt" | "updatedAt"> & {
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
};

/**
 * @description 密码修改记录列表查询参数
 * Change password record list query parameters
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
 * @description 密码修改记录查询参数
 * Change password record query parameters
 */
export type ChangePasswordRecordQueryParams = ChangePasswordRecordListQuery;

/**
 * @description 密码修改记录表单VO
 * Change password record form VO
 * 用于新增/编辑表单，不包含自动生成的字段
 */
export interface ChangePasswordRecordFormVO {
	/** 用户名 */
	username: string;
	/** 真实姓名 */
	realName?: string | null;
	/** 所属部门 */
	department?: string | null;
	/** 修改时间 */
	changeTime?: string | null;
	/** 修改IP */
	changeIp?: string | null;
	/** 修改类型 */
	changeType?: string | null;
	/** 操作人 */
	operator?: string | null;
	/** 状态 */
	status?: string | null;
	/** 备注 */
	remark?: string | null;
}

// 从公共选项文件导入
export {
	changePasswordRecordTypeOptions,
	changePasswordRecordStatusOptions,
	changePasswordRecordDepartmentOptions,
} from "../../../common/business-options";
