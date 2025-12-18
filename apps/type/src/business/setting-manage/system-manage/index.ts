/**
 * @file 系统管理模块类型导出
 * @description 统一导出系统管理相关的所有业务类型
 */

export * from "./system-config";
export * from "./change-password";
export * from "./initialize-cell";
export * from "./register-protocol";

// 重新导出运营团队的小区配置类型，避免重复定义
export type {
	CommunityConfigListItem,
	CommunityConfigQueryParams,
} from "../../operation-team/system-manage/community-configuration";

export {
	settingTypeOptions,
	communityConfigStatusOptions,
} from "../../operation-team/system-manage/community-configuration";

// 本地小区配置接口
export type {
	CommunityConfiguration,
	CommunityConfigurationListQuery,
	SettingCommunityConfigFormVO,
} from "./community-configuration";
