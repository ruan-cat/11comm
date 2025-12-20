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

// 导出业务选项 - 使用本地定义的版本避免重复
export { refundReasonOptions, reminderMethodOptions, reminderStatusOptions } from "../../../common/business-options";
export { parkingSpaceStatusOptions, meterTypeOptions } from "../../../common/business-options";
export { contractTypeOptions } from "../../../common/business-options";
export {
	expenseIdentifierOptions,
	paymentTypeOptions,
	accountDeductionOptions,
} from "../../../common/business-options";
export { statusOptions, expenseItemOptions, discountTypeOptions } from "../../../common/business-options";
export { ruleOptions, applicationTypeOptions, chargeObjectOptions } from "../../../common/business-options";

// 从 common-types 导出费用类型选项

// 导出表单VO类型
export type { RefundReviewFormVO } from "./refund-review";

export type { ReprintVoucherFormVO } from "./reprint-voucher";

export { customExpenseOptions, usageStatusOptions, expenseStatusOptions } from "./common-types";
