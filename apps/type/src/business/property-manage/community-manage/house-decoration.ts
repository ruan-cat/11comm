import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * @file 房屋装修类型定义
 * @description House decoration types
 */

/**
 * 房屋装修列表数据
 * House decoration list item
 */
export interface HouseDecorationListItem {
	/** 房屋编号 House number */
	houseNumber: string;
	/** 联系人姓名 Contact name */
	contactName: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 装修时间 Decoration time */
	decorationTime: string;
	/** 申请时间 Application time */
	applicationTime: string;
	/** 装修单位 Decoration company */
	decorationCompany: string;
	/** 负责人电话 Manager phone */
	managerPhone: string;
	/** 当前状态 Status */
	status: string;
	/** 是否延期 Is delayed */
	isDelayed: string;
	/** 延期时间 Delay time */
	delayTime: string;
	/** 是否违规 Is violated */
	isViolated: string;
	/** 违规说明 Violation description */
	violationDescription: string;
	/** 备注信息 Remarks */
	remarks: string;
}

/**
 * 房屋装修查询参数
 * House decoration query parameters
 */
export interface HouseDecorationQueryParams extends BaseListQueryParams {
	/** 房屋编号 House number */
	houseNumber?: string;
	/** 联系人 Contact name */
	contactName?: string;
	/** 联系电话 Contact phone */
	contactPhone?: string;
	/** 房屋状态 Status */
	status?: string;
	/** 延期状态 Is delayed */
	isDelayed?: string;
	/** 装修时间 Decoration time */
	decorationTime?: string;
	/** 装修申请开始时间 Application start time */
	applicationStartTime?: string;
	/** 装修申请结束时间 Application end time */
	applicationEndTime?: string;
}

/**
 * @description 房屋状态下拉选项
 * Status options
 */
export const decorationStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "审核不通过", value: "审核不通过" },
	{ label: "装修中", value: "装修中" },
	{ label: "待验收", value: "待验收" },
	{ label: "验收成功", value: "验收成功" },
	{ label: "验收失败", value: "验收失败" },
];

/**
 * @description 延期状态下拉选项
 * Delay status options
 */
export const delayStatusOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];
