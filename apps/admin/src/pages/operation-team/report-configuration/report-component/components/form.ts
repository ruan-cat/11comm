import type { Mode } from "@/composables/use-mode";
import type { ReportComponentFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReportComponentFormVO = {
	componentName: "",
	componentType: "表格",
	queryMethod: "sql",
	sql: "",
	java: "",
	description: "",
};

/**
 * 报表组件表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReportComponentFormProps {
	/** 表单数据 */
	form: ReportComponentFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReportComponentFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
