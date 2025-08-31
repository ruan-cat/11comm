import type { DialogOptions } from "@/components/ReDialog/type";

/**
 * 默认的 表格组件 配置
 * @description
 * 移除掉不需要手动配置的 columns 和 data
 */
export const defaultPureTableProps: Prettify<Omit<PureTableProps, "columns" | "data">> = {
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	// 是否开启表格内容过长时显示 tooltip
	showOverflowTooltip: true,
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
