import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 报表组件
 */
export interface ReportComponent {
	/** 组件ID */
	id: string;
	/** 组件名称 */
	componentName: string;
	/** 组件编码 */
	componentCode: string;
	/** 组件类型 */
	componentType: string;
	/** 所属报表ID */
	reportId: string;
	/** 所属报表名称 */
	reportName: string;
	/** 组件配置 */
	componentConfig: string;
	/** 数据绑定 */
	dataBinding: string;
	/** 样式配置 */
	styleConfig: string;
	/** 事件配置 */
	eventConfig: string;
	/** 排序号 */
	sortOrder: number;
	/** 是否启用 */
	isEnabled: boolean;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 报表组件列表查询参数
 */
export interface ReportComponentListQuery extends BaseListQueryParams {
	/** 组件名称 */
	componentName?: string;
	/** 组件编码 */
	componentCode?: string;
	/** 组件类型 */
	componentType?: string;
	/** 所属报表ID */
	reportId?: string;
	/** 是否启用 */
	isEnabled?: boolean;
}

/**
 * 组件类型选项
 */
export const reportComponentTypeOptions: OptionsType = [
	{ label: "表格", value: "表格" },
	{ label: "图表", value: "图表" },
	{ label: "文本", value: "文本" },
	{ label: "图片", value: "图片" },
	{ label: "按钮", value: "按钮" },
	{ label: "输入框", value: "输入框" },
	{ label: "下拉框", value: "下拉框" },
	{ label: "日期选择器", value: "日期选择器" },
];

/**
 * 启用状态选项
 */
export const reportComponentEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];
