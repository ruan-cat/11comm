/**
 * @file expense-manage 模块类型导出
 * @description 统一导出 expense-manage 相关的所有业务类型
 */

export * from "./cancel-fee";
export * from "./contracte-charge";
export * from "./discount-apply";
export * from "./discount-setting";
export * from "./discount-type";
export * from "./expense-item-setting";
export * from "./expense-summary-table";
export * from "./house-charge";
export * from "./meter-reading-type";
export * from "./overdue-payment-information";
export * from "./payment-review";
export * from "./refund-review";
export * from "./reminder-for-overdue-payments";
export * from "./reprint-voucher";
export * from "./vehicle-charge";
export * from "./water-and-electricity-meter-reading";

// 导出业务选项
export { expenseTypeOptions, expenseItemOptions, auditStatusOptions } from "../../../common/business-options";
export { refundReasonOptions, reminderMethodOptions, reminderStatusOptions } from "../../../common/business-options";
export { parkingSpaceStatusOptions, meterTypeOptions } from "../../../common/business-options";

// 从 common-types 导出费用类型选项
export { feeTypeOptions } from "./common-types";

// 从 common-types 中选择性导出，避免导出与公共选项冲突的 合同类型Options 和重复的 折扣类型Options
export type {
	退费审核表单_VO,
	补打收据表单_VO,
	抄表类型_VO,
	CommonListItem,
	CommonQueryParams,
} from "./common-types";

// 导出表单VO类型
export type {
	RefundReviewFormVO,
} from "./refund-review";

export type {
	ReprintVoucherFormVO,
} from "./reprint-voucher";

export {
	customExpenseOptions,
	usageStatusOptions,
	expenseStatusOptions,
	expenseItemNameOptions,
} from "./common-types";