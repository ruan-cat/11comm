import type { OptionsType } from "../../../common";

/**
 * @description reprint-voucher列表数据
 * ReprintVoucher list item
 */
export interface ReprintVoucherListItem {
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
 * @description reprint-voucher列表查询参数
 * ReprintVoucher list query parameters
 */
export interface ReprintVoucherQueryParams {
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
export const reprintVoucherStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 补打收据表单VO
 * Reprint voucher form VO
 */
export interface ReprintVoucherFormVO {
	/** 收据ID Receipt ID */
	receiptId: string;
	/** 收据编号 Receipt number */
	receiptNumber: string;
	/** 费用类型 Fee type */
	feeType: string;
	/** 费用项 Fee item */
	feeItem: string;
	/** 房屋 House */
	house: string;
	/** 业主 Owner */
	owner: string;
	/** 车位 Parking space */
	parkingSpace: string;
	/** 总金额 Total amount */
	totalAmount: string;
	/** 缴费时间 Payment time */
	paymentTime: string;
	/** 打印份数 Print copies */
	printCopies: number;
	/** 打印备注 Print remark */
	printRemark: string;
}
