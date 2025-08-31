const _报表组件类型 = ["组件名称", "组件类型", "查询方式", "sql", "java", "描述"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type 报表组件类型 = (typeof _报表组件类型)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 报表组件表单_VO {
	组件名称: string;
	组件类型: "表格" | "饼状图";
	查询方式: "sql" | "java";
	sql?: string;
	java?: string;
	描述?: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 报表组件表单_VO = {
	组件名称: "",
	组件类型: "表格",
	查询方式: "sql",
	sql: "",
	java: "",
	描述: "",
};

/**
 * 报表组件表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReportComponentFormProps {
	/** 表单数据 */
	form: 报表组件表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 报表组件表单_VO;
}
