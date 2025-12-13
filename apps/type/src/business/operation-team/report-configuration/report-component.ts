import type { OptionsType } from "../../../common";

/**
 * @description 查询方式
 * Query method
 */
export type QueryMethod = "sql" | "java";

/**
 * @description 查询方式中文别名
 * Chinese alias for QueryMethod
 */
export type 查询方式 = QueryMethod;

/**
 * @description 组件类型
 * Component type
 */
export type ComponentType = "表格" | "饼状图" | "柱状图" | "折线图" | "数据卡片";

/**
 * @description 组件类型中文别名
 * Chinese alias for ComponentType
 */
export type 组件类型 = ComponentType;

/**
 * @description 报表组件列表数据
 * Report component list item
 */
export interface ReportComponentListItem {
	/** 组件ID Component ID */
	componentId: string;
	/** 组件名称 Component name */
	componentName: string;
	/** 组件类型 Component type */
	componentType: ComponentType;
	/** 查询方式 Query method */
	queryMethod: QueryMethod;
	/** SQL语句 SQL statement */
	sql: string;
	/** Java类名 Java class name */
	java: string;
	/** 描述 Description */
	description: string;
}

/**
 * @description 报表组件列表查询参数
 * Report component list query parameters
 */
export interface ReportComponentQueryParams {
	/** 组件ID Component ID */
	componentId?: string;
	/** 组件名称 Component name */
	componentName?: string;
	/** 组件类型 Component type */
	componentType?: ComponentType;
	/** 查询方式 Query method */
	queryMethod?: QueryMethod;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 组件类型选项
 * Component type options
 */
export const componentTypeOptions: OptionsType = [
	{ label: "表格", value: "表格" },
	{ label: "饼状图", value: "饼状图" },
	{ label: "柱状图", value: "柱状图" },
	{ label: "折线图", value: "折线图" },
	{ label: "数据卡片", value: "数据卡片" },
];

/**
 * @description 查询方式选项
 * Query method options
 */
export const queryMethodOptions: OptionsType = [
	{ label: "SQL", value: "sql" },
	{ label: "JAVA", value: "java" },
];

