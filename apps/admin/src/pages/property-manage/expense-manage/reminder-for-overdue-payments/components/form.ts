import type { ReminderForOverduePaymentsFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReminderForOverduePaymentsFormVO = {
	ownerName: "",
	paymentObject: "",
	feeName: "",
	reminderAmount: "",
	reminderMethod: "",
	reminderStatus: "",
	reminderTime: "",
	reminderRemark: "",
};

/**
 * 欠费催缴表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReminderForOverduePaymentsFormProps {
	/** 表单数据 */
	form: ReminderForOverduePaymentsFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReminderForOverduePaymentsFormVO;
	/** 表单模式 */
	mode?: Mode;
}
