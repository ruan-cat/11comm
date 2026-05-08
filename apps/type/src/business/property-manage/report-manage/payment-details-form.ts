import type { OptionsType } from "../../../common";

/**
 * @description payment-details-form列表数据
 * PaymentDetailsForm list item
 */
export interface PaymentDetailsFormListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 订单号 Order number */
	orderNumber: string;
	/** 小区 Community */
	community: string;
	/** 房号业主 Room and owner */
	roomNumberOwner: string;
	/** 费用类型 Fee type */
	feeType: string;
	/** 费用项 Fee item */
	feeItem: string;
	/** 费用状态 Fee status */
	feeStatus: string;
	/** 支付方式 Payment method */
	paymentMethod: string;
	/** 缴费时间 Payment time */
	paymentTime: string;
	/** 收银员 Cashier */
	cashier: string;
	/** 应缴金额 Payable amount */
	payableAmount: string;
	/** 应收金额 Receivable amount */
	receivableAmount: string;
	/** 实收金额 Actual amount */
	actualAmount: string;
	/** 账户抵扣 Account deduction */
	accountDeduction: string;
	/** 优惠减免金额 Discount amount */
	discountAmount: string;
	/** 赠送金额 Gift amount */
	giftAmount: string;
	/** 滞纳金 Late fee */
	lateFee: string;
	/** 面积 Area */
	area: string;
	/** 车位 Parking space */
	parkingSpace: string;
	/** 说明 Description */
	description: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description payment-details-form列表查询参数
 * PaymentDetailsForm list query parameters
 */
export interface PaymentDetailsFormQueryParams {
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
export const paymentDetailsFormStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];
