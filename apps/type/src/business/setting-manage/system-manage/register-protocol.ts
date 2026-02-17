import type { BaseListQueryParams, OptionsType } from "../../../common";
import type { SmRegisterProtocol, NewSmRegisterProtocol } from "./schema";

/**
 * 设置管理注册协议列表查询参数
 * @description 从 business-types.ts 导入
 */
export type { SettingManagementRegisterProtocolListQuery } from "../../../common/business-types";

// ==========================================
// QueryParams 类型
// ==========================================

/**
 * 设置管理注册协议查询参数
 */
export interface SmRegisterProtocolQueryParams extends BaseListQueryParams {
	/** 协议类型 */
	protocolType?: string;
	/** 协议标题 */
	protocolTitle?: string;
	/** 状态 */
	status?: string;
}

// ==========================================
// ListItem 类型
// ==========================================

/**
 * 设置管理注册协议列表项
 */
export type SmRegisterProtocolListItem = Omit<SmRegisterProtocol, "createdAt" | "updatedAt"> & {
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
};

// ==========================================
// FormVO 类型
// ==========================================

/**
 * 设置管理注册协议表单VO
 */
export type SmRegisterProtocolFormVO = NewSmRegisterProtocol;

// ==========================================
// 状态选项
// ==========================================

/**
 * 设置管理注册协议状态选项
 */
export const smRegisterProtocolStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];
