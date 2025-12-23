import type { Mode } from "@/composables/use-mode";

const REPORT_COMPONENT_TYPES = ["组件名称", "组件类型", "查询方式", "sql", "java", "描述"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type ReportComponentType = (typeof REPORT_COMPONENT_TYPES)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface ReportComponentFormVO {
	componentName: string;
	componentType: string;
	queryMethod: string;
	sql?: string;
	java?: string;
	description?: string;
}

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
