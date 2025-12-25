import type { ReturnVisitFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReturnVisitFormVO = {
	workOrderNumber: "",
	location: "",
	repairType: "",
	reporter: "",
	contactInfo: "",
	appointmentTime: "",
	returnVisitStatus: "",
	remark: "",
};

/**
 * 报修回访表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReturnVisitFormProps {
	/** 表单数据 */
	form: ReturnVisitFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReturnVisitFormVO;
	/** 表单模式 */
	mode?: Mode;
}
