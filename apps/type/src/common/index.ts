/**
 * @file 通用类型定义
 * @description 导出项目中共享的通用类型，如分页、响应格式等
 */

// 导出测试数据
export * from "./test-data";

// 状态选项已移至 business-options.ts

// 导出选项类型
export * from "./OptionsType";

// 导出业务共同类型定义 - 统一从 business-options 导出
export * from "./business-options";

/**
 * 前后端数据对接数据对象
 * @description
 * 后端 JsonVO 泛型类的前端翻译
 *
 * `01s` 项目统一的数据返回格式
 *
 * 这个类型是经过拓展后的类型 增加了 nitro 的字段
 *
 * - timestamp
 */
export interface JsonVO<T> {
	/** 状态码 */
	code: number;

	/** 提示消息 */
	message: string;

	/** 数据对象 */
	data: T;

	/** 时间戳 */
	timestamp?: number;

	/** 请求是否成功 */
	success?: boolean;
}

/**
 * 分页数据传输对象
 * Page data transfer object
 */
export interface PageDTO<T> {
	/** 数据列表 Data list */
	list: T[];
	/** 总记录数 Total count */
	total: number;
	/** 当前页码 Current page */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
	/** 总页数 Total pages */
	totalPages: number;
}

/**
 * 基础分页查询参数
 * Base pagination query parameters
 */
export interface BaseListQueryParams {
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}
