
/**
 * 缴费审核表单数据类型
 */
export interface PaymentReviewFormVO {
	/** 房屋 */
	house: string;
	/** 费用项目 */
	expenseItem: string;
	/** 付费周期 */
	paymentPeriod: string;
	/** 缴费起始时间 */
	paymentStartTime: string;
	/** 缴费结束时间 */
	paymentEndTime: string;
	/** 应付金额 */
	payableAmount: string;
	/** 实付金额 */
	paidAmount: string;
	/** 操作员工 */
	operator: string;
	/** 缴费时间 */
	paymentTime: string;
	/** 审核状态 */
	auditStatus: string;
	/** 审核说明 */
	auditDescription: string;
	/** 缴费备注 */
	paymentRemark: string;
	/** 详情 */
	details: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PaymentReviewFormVO = {
	house: "",
	expenseItem: "",
	paymentPeriod: "",
	paymentStartTime: "",
	paymentEndTime: "",
	payableAmount: "",
	paidAmount: "",
	operator: "",
	paymentTime: "",
	auditStatus: "",
	auditDescription: "",
	paymentRemark: "",
	details: "",
};

/**
 * 缴费审核表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PaymentReviewFormProps {
	/** 表单数据 */
	form: PaymentReviewFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PaymentReviewFormVO;
}
