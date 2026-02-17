import type { BaseListQueryParams } from "../../../common";
import type { SmSystemConfig, NewSmSystemConfig } from "./schema";

/**
 * @description 系统配置响应 VO（前端展示用）
 * 从 Schema 类型推导，转换时间字段为字符串格式
 */
export type SmSystemConfigVO = Omit<SmSystemConfig, "createTime" | "updateTime"> & {
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
};

/**
 * 系统配置列表数据
 * System config list item
 */
export interface SystemConfigListItem {
	/** 配置ID Config ID */
	configId: string;
	/** 记录ID Record ID (用于seed脚本) */
	id?: string;
	/** 标题名称 Title name */
	title: string;
	/** 副标题 Subtitle */
	subtitle: string;
	/** 简写名称 Short name */
	shortName: string;
	/** 公司名称 Company name */
	companyName: string;
	/** Logo地址 Logo URL */
	logoUrl: string;
	/** 静态URL Static URL */
	staticUrl: string;
	/** 默认小区编号 Default community code */
	defaultCommunityCode: string;
	/** 业主标题 Owner title */
	ownerTitle: string;
	/** 物业手机标题 Property mobile title */
	propertyMobileTitle: string;
	/** QQ地图Key QQ map key */
	qqMapKey: string;
	/** 商城地址 Mall URL */
	mallUrl: string;
	/** 配置键 Config key */
	configKey?: string;
	/** 配置值 Config value */
	configValue?: string;
	/** 描述 Description */
	description?: string;
	/** 分类 Category */
	category?: string;
	/** 是否系统配置 Is system config */
	isSystem?: boolean;
	/** 创建时间 Create time */
	createTime?: string;
	/** 更新时间 Update time */
	updateTime?: string;
}

/**
 * 系统配置查询参数
 * System config query parameters
 */
export interface SystemConfigQueryParams extends BaseListQueryParams {
	/** 标题名称 Title name */
	title?: string;
	/** 简写名称 Short name */
	shortName?: string;
	/** 公司名称 Company name */
	companyName?: string;
	/** 默认小区编号 Default community code */
	defaultCommunityCode?: string;
}

/**
 * 设置管理系统的系统配置数据
 */
export type { SettingManagementSystemBasicInfoListItem as SettingManagementSystemConfig } from "../../../common/business-types";

/**
 * 设置管理系统配置列表查询参数
 */
export type { SettingManagementSystemBasicInfoQueryParams as SettingManagementSystemConfigListQuery } from "../../../common/business-types";
