// 从公共类型文件导入
export type {
	SettingManagementCommunityConfiguration,
	SettingManagementCommunityConfigurationListQuery,
} from "../../../common/business-types";

// 从公共选项文件导入
export {
	settingTypeOptions,
	communityConfigStatusOptions,
} from "../../../common/business-options";

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
