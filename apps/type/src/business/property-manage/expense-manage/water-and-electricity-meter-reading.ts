import type { OptionsType } from "../../../common";
import { meterTypeOptions } from "../../../common/business-options";

/**
 * @description 水电抄表列表数据
 * Water and electricity meter reading list item
 */
export interface WaterAndElectricityMeterReadingListItem {
	/** 表ID Meter ID */
	meterId: string;
	/** 表类型 Meter type */
	meterType: string;
	/** 对象名称 Object name */
	objectName: string;
	/** 上期度数 Last reading */
	lastReading: string;
	/** 本期度数 Current reading */
	currentReading: string;
	/** 上期读表时间 Last reading time */
	lastReadingTime: string;
	/** 本期读表时间 Current reading time */
	currentReadingTime: string;
	/** 创建时间 Create time */
	createTime: string;
}

/**
 * @description 水电抄表列表查询参数
 * Water and electricity meter reading list query parameters
 */
export interface WaterAndElectricityMeterReadingQueryParams {
	/** 表类型 Meter type */
	meterType?: string;
	/** 表ID Meter ID */
	meterId?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const waterAndElectricityMeterReadingStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 水电抄表表单VO
 * Water and electricity meter reading form VO
 */
export interface WaterAndElectricityMeterReadingFormVO {
	/** 房屋编号 House number */
	houseNumber: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 表计类型 Meter type */
	meterType: string;
	/** 上期读数 Last reading */
	lastReading: string;
	/** 本期读数 Current reading */
	currentReading: string;
	/** 用量 Usage */
	usage: string;
	/** 抄表时间 Meter reading time */
	meterReadingTime: string;
	/** 抄表员 Meter reader */
	meterReader: string;
	/** 备注 Remark */
	remark?: string;
}

// 注意：meterTypeOptions 已从 "../../../common/business-options" 导入
