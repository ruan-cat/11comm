import type { BaseListQueryParams } from "../../../common";

/**
 * 注册协议显示信息
 * @description 简化版的注册协议类型，用于页面展示
 */
export interface RegisterProtocolDisplay {
	/** 协议ID */
	id: string;
	/** 协议标题 */
	title: string;
	/** 协议内容 */
	content: string;
	/** 版本号 */
	version: string;
	/** 状态 */
	status: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
}

/**
 * 注册协议列表查询参数
 * @description 从 business-types.ts 导入
 */
export type { SettingManagementRegisterProtocolListQuery as RegisterProtocolListQuery } from "../../../common/business-types";
