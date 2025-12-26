import { type Mode } from "@/composables/use-mode";
import type { ReportInfoFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReportInfoFormVO = {
	reportGroup: "",
	optionTitle: "",
	sort: "",
	description: "",
};

/**
 * 报表信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReportInfoFormProps {
	/** 表单数据 */
	form: ReportInfoFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReportInfoFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
