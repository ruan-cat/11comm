import type { DialogOptions } from "@/components/ReDialog/type";
import type { Arrayable } from "element-plus/es/utils";
import type { FormItemRule } from "element-plus";

export type DefaultPureTableTreeProps = {
	hasChildren: string;
	children: string;
	checkStrictly: boolean;
};

export type DefaultPureTableProps = Prettify<
	Omit<PureTableProps, "columns" | "data" | "treeProps"> & {
		treeProps: DefaultPureTableTreeProps;
	}
>;

export type DefaultListPureTableProps = Prettify<
	DefaultPureTableProps & Pick<PureTableProps, "columns" | "data"> & Partial<Pick<PureTableProps, "pagination">>
>;

export const defaultPureTableTreeProps: DefaultPureTableTreeProps = {
	hasChildren: "hasChildren",
	children: "children",
	checkStrictly: false,
};

/**
 * 默认的 表格组件 配置
 * @description
 * 移除掉不需要手动配置的 columns 和 data
 */
export const defaultPureTableProps: DefaultPureTableProps = {
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	treeProps: defaultPureTableTreeProps,
	// 是否开启表格内容过长时显示 tooltip
	showOverflowTooltip: true,
};

/** 默认的 表格组件 序号列配置 */
export const defaultPureTableIndexColumn: TableColumns = {
	label: "序号",
	type: "index",
	align: "center",
	fixed: true,
	index: (index: number) => index + 1,
	width: 55,
};

/**
 * 默认的 分页栏配置
 * @description
 * 只需要配置 pageSizes、align 和 background
 */
export const defaultPagination: Prettify<Pick<PaginationProps, "pageSizes" | "align" | "background">> = {
	pageSizes: [10, 15, 20, 50, 100],
	align: "right",
	background: true,
	// size: "default",
};

/** 默认的 打开弹框函数配置 */
export const defaultAddDialogParams: DialogOptions = {
	draggable: true,
	fullscreenIcon: true,
	closeOnClickModal: false,
	destroyOnClose: true,
	top: "10vh",
	fullscreen: deviceDetection(),
};

/**
 * 表单验证规则类型
 * @description
 * 用于定义表单验证规则
 * 专用于给 `<PlusForm>` 表单组件使用
 * 专用于给 plusFormRules 变量使用
 */
export type PlusFormRules = Partial<Record<string, Arrayable<FormItemRule>>>;
