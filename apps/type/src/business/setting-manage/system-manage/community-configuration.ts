// 从公共文件导入
import type { BaseListQueryParams } from "../../../common";
import type { SmCommunityConfiguration } from "./schema";

// 从公共类型文件导入
export type {
	SettingManagementCommunityConfiguration,
	SettingManagementCommunityConfigurationListQuery,
} from "../../../common/business-types";

// 从公共选项文件导入
export { settingTypeOptions, communityConfigStatusOptions } from "../../../common/business-options";

// 从 Schema 导入
export type { SmCommunityConfiguration } from "./schema";

/**
 * 小区配置列表项
 * 小区配置表查询返回的列表项类型
 */
export type SmCommunityConfigurationListItem = Omit<SmCommunityConfiguration, "createTime" | "updateTime">;

/**
 * 小区配置列表查询参数
 */
export interface SmCommunityConfigurationQueryParams extends BaseListQueryParams {
	/** 小区ID */
	communityId?: string;
	/** 小区名称 */
	communityName?: string;
	/** 设置名称 */
	settingName?: string;
	/** 状态编码 */
	statusCd?: string;
}

/**
 * 设置管理小区配置表单对象
 * Setting management community configuration form value object
 */
export interface SettingCommunityConfigFormVO {
	/** 配置ID */
	csId: string;
	/** 小区ID */
	communityId: string;
	/** 小区名称 */
	communityName: string;
	/** 设置名称 */
	settingName: string;
	/** 设置值 */
	settingValue: string;
	/** 设置类型 */
	settingType: string;
	/** 状态编码 */
	statusCd: string;
	/** 备注 */
	remark: string;
}
