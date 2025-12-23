import type { OptionsType } from "../../../common";
import { repairStatusOptions } from "../../../common/business-options";


/**
 * @description repairs-setting列表数据
 * RepairsSetting list item
 */
export interface RepairsSettingListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description repairs-setting列表查询参数
 * RepairsSetting list query parameters
 */
export interface RepairsSettingQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const repairsSettingStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/**
 * @description 报修设置类型
 * Repairs setting type
 */
export type RepairsSettingType = "cleaning" | "repair";

/**
 * @description 派单方式类型
 * Dispatch method type
 */
export type DispatchMethodType = "grab" | "assign" | "rotate";

/**
 * @description 区域类型
 * Area type
 */
export type AreaType = "house" | "public" | "garage" | "non_house";

/**
 * @description 业主端展示类型
 * Owner display type
 */
export type OwnerDisplayType = "yes" | "no";

/**
 * @description 通知方式类型
 * Notification method type
 */
export type NotificationMethodType = "sms" | "wechat" | "wechat_card";

/**
 * @description 回访设置类型
 * Return visit setting type
 */
export type ReturnVisitSettingType = "no_visit" | "no_visit_after_rating" | "visit";

/**
 * @description 报修设置表单 VO
 * Repairs setting form VO
 */
export interface RepairsSettingFormVO {
	/** 类型名称 Type name */
	typeName: string;
	/** 设置类型 Setting type */
	settingType: RepairsSettingType;
	/** 派单方式 Dispatch method */
	dispatchMethod: DispatchMethodType;
	/** 公共区域 Public area */
	publicArea: AreaType;
	/** 业主端展示 Owner display */
	ownerDisplay: OwnerDisplayType;
	/** 通知方式 Notification method */
	notificationMethod: NotificationMethodType;
	/** 回访设置 Return visit setting */
	returnVisitSetting: ReturnVisitSettingType;
	/** 说明 Description */
	description: string;
}
