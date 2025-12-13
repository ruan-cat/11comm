import type { OptionsType } from "../../../common";

/**
 * @description 小区配置列表数据
 * Community configuration list item
 */
export interface CommunityConfigListItem {
	/** 主键ID Config ID */
	csId: string;
	/** 小区ID Community ID */
	communityId: string;
	/** 小区名称 Community name */
	communityName: string;
	/** 设置名称 Setting name */
	settingName: string;
	/** 设置值 Setting value */
	settingValue: string;
	/** 设置类型 Setting type */
	settingType: string;
	/** 数据状态 Status code */
	statusCd: string;
	/** 状态文本 Status text */
	statusText: string;
	/** 备注信息 Remark */
	remark: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * @description 小区配置列表查询参数
 * Community configuration list query parameters
 */
export interface CommunityConfigQueryParams {
	/** 小区ID Community ID */
	communityId?: string;
	/** 小区名称 Community name */
	communityName?: string;
	/** 设置名称 Setting name */
	settingName?: string;
	/** 设置类型 Setting type */
	settingType?: string;
	/** 数据状态 Status code */
	statusCd?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 设置类型选项
 * Setting type options
 */
export const settingTypeOptions: OptionsType = [
	{ label: "基础配置", value: "1001" },
	{ label: "费用配置", value: "2002" },
	{ label: "公告配置", value: "3003" },
	{ label: "安防配置", value: "4004" },
	{ label: "服务配置", value: "5005" },
];

/**
 * @description 数据状态选项
 * Status options
 */
export const communityConfigStatusOptions: OptionsType = [
	{ label: "正常", value: "0" },
	{ label: "失效", value: "1" },
];

/**
 * @description 小区配置表单VO
 * Community configuration form VO
 */
export interface CommunityConfigFormVO {
	/** 主键ID Config ID */
	csId: string;
	/** 小区ID Community ID */
	communityId: string;
	/** 小区名称 Community name */
	communityName: string;
	/** 设置名称 Setting name */
	settingName: string;
	/** 设置值 Setting value */
	settingValue: string;
	/** 设置类型 Setting type */
	settingType: string;
	/** 数据状态 Status code */
	statusCd: string;
	/** 备注信息 Remark */
	remark: string;
}

// ==================== 中文名称导出 ====================

/** 设置类型选项（中文名称） */
export const 设置类型选项 = settingTypeOptions;

/** 数据状态选项（中文名称） */
export const 数据状态选项 = communityConfigStatusOptions;
