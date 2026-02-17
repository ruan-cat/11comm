import type { BaseListQueryParams } from "../../../common";
import type { SmInitializeCell, NewSmInitializeCell } from "./schema";

/**
 * @description 初始化小区 VO（前端展示用）
 * Initialize cell VO for frontend display
 * 从 Schema 类型推导，转换时间字段为字符串格式
 */
export type SmInitializeCellVO = Omit<SmInitializeCell, "createTime" | "updateTime"> & {
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
};

/**
 * @description 初始化配置项列表项（前端类型）
 * Initialize configuration item list item
 * 从 Schema 类型推导，转换时间字段为字符串格式
 *
 * 注意：此类型用于"系统初始化配置项"（如"是否初始化楼栋"、"是否初始化房屋"等配置开关）
 * 不要与 operation-team 的 InitializeCellListItem（小区单元格初始化）混淆
 */
export type InitializeConfigItemListItem = Omit<SmInitializeCell, "createTime" | "updateTime"> & {
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
};

/**
 * @description 初始化配置项查询参数
 * Initialize configuration item query parameters
 */
export interface InitializeConfigItemQueryParams extends BaseListQueryParams {
	/** 初始化项目 Init item */
	initItem?: string;
	/** 初始化状态 Init status */
	initStatus?: string;
}

/**
 * @description 初始化配置项表单VO
 * Initialize configuration item form VO
 * 基于 schema 的 insert 类型，用于新增/编辑表单
 */
export type InitializeConfigItemFormVO = NewSmInitializeCell;

// ==========================================
// 向后兼容的类型别名（逐步废弃）
// ==========================================

/**
 * @deprecated 请使用 InitializeConfigItemListItem，避免与 operation-team 的 InitializeCellListItem 混淆
 * @description 初始化小区列表数据（向后兼容）
 */
export type InitializeCommunityListItem = InitializeConfigItemListItem;

/**
 * @deprecated 请使用 InitializeConfigItemQueryParams
 * @description 初始化小区列表查询参数（向后兼容）
 */
export type InitializeCommunityQueryParams = InitializeConfigItemQueryParams;

/**
 * @deprecated 请使用 InitializeConfigItemFormVO
 * @description 初始化小区表单VO（向后兼容）
 */
export type InitializeCommunityFormVO = InitializeConfigItemFormVO;
