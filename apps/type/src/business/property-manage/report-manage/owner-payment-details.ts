import type { OptionsType } from "../../../common";

/**
 * @description owner-payment-details列表数据
 * OwnerPaymentDetails list item
 */
export interface OwnerPaymentDetailsListItem {
	/** ID */
	id: string;
	/** 小区 Community */
	community: string;
	/** 房屋编号/合同名称 House number/Contract name */
	houseNumberContractName: string;
	/** 业主名称 Owner name */
	ownerName: string;
	/** 业主手机号 Owner phone */
	ownerPhone: string;
	/** 费用大类 Fee category */
	feeCategory: string;
	/** 费用项 Fee item */
	feeItem: string;
	/** 年度 Year */
	year: string;
	/** 1月 January */
	january: string;
	/** 2月 February */
	february: string;
	/** 3月 March */
	march: string;
	/** 4月 April */
	april: string;
	/** 5月 May */
	may: string;
	/** 6月 June */
	june: string;
	/** 7月 July */
	july: string;
	/** 8月 August */
	august: string;
	/** 9月 September */
	september: string;
	/** 10月 October */
	october: string;
	/** 11月 November */
	november: string;
	/** 12月 December */
	december: string;
	/** 合计 Total */
	total: string;
	/** 应收 Receivable */
	receivable: string;
	/** 预收 Prepaid */
	prepaid: string;
}

/**
 * @description owner-payment-details列表查询参数
 * OwnerPaymentDetails list query parameters
 */
export interface OwnerPaymentDetailsQueryParams {
	/** 房屋编号/合同名称 House number/Contract name */
	houseNumberContractName?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 业主手机号 Owner phone */
	ownerPhone?: string;
	/** 费用大类 Fee category */
	feeCategory?: string;
	/** 费用项 Fee item */
	feeItem?: string;
	/** 小区 Community */
	community?: string;
	/** 年度 Year */
	year?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
