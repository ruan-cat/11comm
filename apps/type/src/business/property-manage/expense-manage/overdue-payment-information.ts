import type { OptionsType } from "../../../common";
import { chargeObjectOptions } from "../../../common/business-options";

/**
 * @description overdue-payment-information列表数据
 * OverduePaymentInformation list item
 */
export interface OverduePaymentInformationListItem {
	/** ID */
	id: string;
	/** 收费对象 Charge Object */
	chargeObject: string;
	/** 业主名称 Owner Name */
	ownerName: string;
	/** 手机号 Phone Number */
	phoneNumber: string;
	/** 开始时间 Start Time */
	startTime: string;
	/** 结束时间 End Time */
	endTime: string;
	/** 合计金额 Total Amount */
	totalAmount: string;
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
 * @description overdue-payment-information列表查询参数
 * OverduePaymentInformation list query parameters
 */
export interface OverduePaymentInformationQueryParams {
	/** 收费对象 Charge Object */
	chargeObject?: string;
	/** 业主名称 Owner Name */
	ownerName?: string;
	/** 手机号 Phone Number */
	phoneNumber?: string;
	/** 开始时间 Start Time */
	startTime?: string;
	/** 结束时间 End Time */
	endTime?: string;
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
export const overduePaymentInformationStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// 注意：chargeObjectOptions 已从 "../../../common/business-options" 导入
