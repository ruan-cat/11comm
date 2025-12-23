import type { IssuesFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: IssuesFormVO = {
	workOrderCode: "",
	location: "",
	repairType: "",
	maintenanceType: "",
	reporter: "",
	contactInfo: "",
	appointmentTimeRange: "",
	submitTime: "",
	orderDuration: "",
	completeTime: "",
	status: "",
	violationDescription: "",
	remark: "",
};

/**
 * 工单池表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface IssuesSettingFormProps {
	/** 表单数据 */
	form: IssuesFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: IssuesFormVO;
	/** 表单模式 */
	mode?: Mode;
}

