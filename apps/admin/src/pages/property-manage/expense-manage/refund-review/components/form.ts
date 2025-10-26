import { type 退费审核表单_VO } from "../test-data";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 退费审核表单_VO = {
	退费单号: "",
	缴费单号: "",
	费用类型: "",
	付费对象: "",
	付费周期: "",
	应付金额实付金额: "",
	申请时间: "",
	退费原因: "",
	申请人: "",
	审核状态: "",
	审核人: "",
	审核备注: "",
};

/**
 * 退费审核表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RefundReviewFormProps {
	/** 表单数据 */
	form: 退费审核表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 退费审核表单_VO;
}