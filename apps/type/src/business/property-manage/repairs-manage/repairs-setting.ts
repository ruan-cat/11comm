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
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 报修设置类型
 * Repairs setting type
 */
export type RepairsSettingType = "保洁单" | "维修单";

/**
 * @description 派单方式类型
 * Dispatch method type
 */
export type DispatchMethodType = "抢单" | "指派" | "轮训";

/**
 * @description 区域类型
 * Area type
 */
export type AreaType = "房屋" | "公共区域" | "车库" | "非房屋";

/**
 * @description 业主端展示类型
 * Owner display type
 */
export type OwnerDisplayType = "是" | "否";

/**
 * @description 通知方式类型
 * Notification method type
 */
export type NotificationMethodType = "短信" | "微信" | "微信+员工工牌";

/**
 * @description 回访设置类型
 * Return visit setting type
 */
export type ReturnVisitSettingType = "不回访" | "已评价不回访" | "回访";

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

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultRepairsSettingForm: RepairsSettingFormVO = {
	typeName: "",
	settingType: "维修单",
	dispatchMethod: "指派",
	publicArea: "房屋",
	ownerDisplay: "是",
	notificationMethod: "微信",
	returnVisitSetting: "回访",
	description: "",
};

/**
 * @description 报修设置列表数据 (向后兼容)
 * Repairs setting list data (backward compatibility)
 */
export interface 报修设置_列表数据 extends RepairsSettingListItem {
	/** 类型名称 */
	类型名称: string;
	/** 设置类型 */
	设置类型: string;
	/** 派单方式 */
	派单方式: string;
	/** 公共区域 */
	公共区域: string;
	/** 业主端展示 */
	业主端展示: string;
	/** 通知方式 */
	通知方式: string;
	/** 回访设置 */
	回访设置: string;
	/** 说明 */
	说明: string;
}

/**
 * @description 报修设置搜索 VO (向后兼容)
 * Repairs setting search VO (backward compatibility)
 */
export interface 报修设置_搜索_VO extends RepairsSettingQueryParams {}
