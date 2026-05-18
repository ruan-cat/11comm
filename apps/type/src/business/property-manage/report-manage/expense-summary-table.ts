import type { BaseListQueryParams } from "../../../common";

/**
 * @description report-manage expense-summary-table 列表数据
 * Report expense summary table list item.
 */
export interface ReportExpenseSummaryTableListItem {
	/** ID */
	id: string;
	/** 小区 */
	community: string;
	/** 房屋编号/合同名称 */
	houseNumberContractName: string;
	/** 业主名称 */
	ownerName: string;
	/** 业主手机号 */
	ownerPhone: string;
	/** 费用项 */
	feeItem: string;
	/** 总户数 */
	totalHouseholds: string;
	/** 收费户 */
	chargedHouseholds: string;
	/** 欠费户 */
	arrearsHouseholds: string;
	/** 欠费 */
	arrears: string;
	/** 实缴 */
	actualPayment: string;
	/** 当期应收 */
	currentReceivable: string;
	/** 当前实收 */
	currentActualReceipt: string;
	/** 户收费率 */
	householdChargeRate: string;
	/** 收费率 */
	chargeRate: string;
	/** 清缴率 */
	clearanceRate: string;
	/** 统计时间 */
	statisticsTime: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 备注 */
	remark?: string;
}

/**
 * @description report-manage expense-summary-table 列表查询参数
 * Report expense summary table list query parameters.
 */
export interface ReportExpenseSummaryTableQueryParams extends BaseListQueryParams {
	/** 房屋编号/合同名称 */
	houseNumberContractName?: string;
	/** 业主名称 */
	ownerName?: string;
	/** 业主手机号 */
	ownerPhone?: string;
	/** 费用项名称 */
	expenseItemName?: string;
	/** 统计时间 */
	time?: string;
	/** 状态 */
	status?: string;
}
