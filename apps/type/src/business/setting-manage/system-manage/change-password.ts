import type { BaseListQueryParams } from "../../../common";
import type { SmChangePasswordRecord, NewSmChangePasswordRecord } from "./schema";

/**
 * @description 密码修改记录列表项
 * Change password record list item
 * 直接使用 schema 生成的类型，确保与数据库字段一致
 */
export type ChangePasswordRecordListItem = SmChangePasswordRecord;

/**
 * @description 密码修改记录
 * Change password record
 */
export type ChangePasswordRecord = SmChangePasswordRecord;

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
 * 基于 schema 的 insert 类型，用于新增表单
 */
export type ChangePasswordRecordFormVO = NewSmChangePasswordRecord;

// 从公共选项文件导入
export {
	changePasswordRecordTypeOptions,
	changePasswordRecordStatusOptions,
	changePasswordRecordDepartmentOptions,
} from "../../../common/business-options";
