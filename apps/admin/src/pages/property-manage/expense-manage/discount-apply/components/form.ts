import type { DiscountApplyFormVO } from "@01s-11comm/type";

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: DiscountApplyFormVO = {
	house: "",
	applicationType: "空置房",
	expenseItem: "",
	applicant: "",
	applicantPhone: "",
	startTime: "",
	endTime: "",
	description: "",
	material: "",
};

/**
 * 优惠申请表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface DiscountApplyFormProps {
	/** 表单数据 */
	form: DiscountApplyFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: DiscountApplyFormVO;
}
