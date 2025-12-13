import type { RefundReviewFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: RefundReviewFormVO = {
	refundOrderNumber: "",
	paymentOrderNumber: "",
	feeType: "",
	payer: "",
	paymentPeriod: "",
	payablePaidAmount: "",
	applyTime: "",
	refundReason: "",
	applicant: "",
	auditStatus: "",
	auditor: "",
	auditRemark: "",
};

/**
 * 退费审核表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RefundReviewFormProps {
	/** 表单数据 */
	form: RefundReviewFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: RefundReviewFormVO;
}
