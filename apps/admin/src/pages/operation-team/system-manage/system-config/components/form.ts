import type { OptionsType } from "plus-pro-components";

// ==================== 联合类型定义 ====================

/** 配置类型联合类型 */
export type 配置类型 = "文本" | "数字" | "布尔值" | "JSON" | "日期时间" | "文件路径" | "URL";

/** 配置分组联合类型 */
export type 配置分组 = "系统基础" | "业务配置" | "第三方服务" | "安全设置" | "通知设置" | "日志配置" | "缓存配置";

/** 状态联合类型 */
export type 状态 = "启用" | "禁用";

// ==================== 业务类型定义 ====================

/**
 * 系统配置表单数据类型
 * @description
 * 用于表单组件的数据传输和验证
 */
export interface 系统配置表单_VO {
	/** 配置名称 */
	配置名称: string;
	/** 配置值 */
	配置值: string;
	/** 配置类型 */
	配置类型: 配置类型;
	/** 配置分组 */
	配置分组: 配置分组;
	/** 状态 */
	状态: 状态;
	/** 描述 */
	描述: string;
}

// ==================== 常量定义 ====================

export { 配置类型Options, 配置分组Options } from "@01s-11comm/type";
export { 状态Options } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 系统配置表单_VO = {
	配置名称: "",
	配置值: "",
	配置类型: "文本",
	配置分组: "系统基础",
	状态: "启用",
	描述: "",
};

/**
 * 系统配置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface SystemConfigFormProps {
	/** 表单数据 */
	form: 系统配置表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 系统配置表单_VO;
}
