// ==================== 联合类型定义 ====================

/** 组类型联合类型 */
export type 组类型 = "系统菜单" | "用户菜单" | "商户菜单" | "应用菜单";

/** 状态联合类型 */
export type 状态类型 = "启用" | "禁用";

/** 商户联合类型 */
export type 商户类型 =
	| "系统默认"
	| "万科物业"
	| "碧桂园服务"
	| "恒大物业"
	| "绿城服务"
	| "保利物业"
	| "龙湖物业"
	| "中海物业"
	| "华润置地"
	| "招商积余";

// ==================== 业务类型定义 ====================

/**
 * 菜单组表单数据类型
 */
export interface 菜单组表单_VO {
	/** 组编号 */
	组编号: string;
	/** 组名称 */
	组名称: string;
	/** 组编码 */
	组编码: string;
	/** 组类型 */
	组类型: 组类型;
	/** 归属商户 */
	归属商户: 商户类型;
	/** 显示顺序 */
	排序: number;
	/** 图标 */
	图标: string;
	/** 状态 */
	状态: 状态类型;
	/** 描述 */
	描述: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 菜单组表单_VO = {
	组编号: "",
	组名称: "",
	组编码: "",
	组类型: "系统菜单",
	归属商户: "系统默认",
	排序: 1,
	图标: "mdi:menu",
	状态: "启用",
	描述: "",
};

/**
 * 菜单组表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface 菜单组表单Props {
	/** 表单数据 */
	form: 菜单组表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 菜单组表单_VO;
}

// ==================== 常量定义 ====================

/**
 * 组类型选项
 */
export const 组类型选项 = [
	{ label: "系统菜单", value: "系统菜单" as const },
	{ label: "用户菜单", value: "用户菜单" as const },
	{ label: "商户菜单", value: "商户菜单" as const },
	{ label: "应用菜单", value: "应用菜单" as const },
];

/**
 * 状态选项
 */
export const 状态选项 = [
	{ label: "启用", value: "启用" as const },
	{ label: "禁用", value: "禁用" as const },
];

/**
 * 商户选项
 */
export const 商户选项 = [
	{ label: "系统默认", value: "系统默认" as const },
	{ label: "万科物业", value: "万科物业" as const },
	{ label: "碧桂园服务", value: "碧桂园服务" as const },
	{ label: "恒大物业", value: "恒大物业" as const },
	{ label: "绿城服务", value: "绿城服务" as const },
	{ label: "保利物业", value: "保利物业" as const },
	{ label: "龙湖物业", value: "龙湖物业" as const },
	{ label: "中海物业", value: "中海物业" as const },
	{ label: "华润置地", value: "华润置地" as const },
	{ label: "招商积余", value: "招商积余" as const },
];

/**
 * 常用图标选项
 */
export const 图标选项 = [
	{ label: "菜单", value: "mdi:menu" },
	{ label: "设置", value: "mdi:cog" },
	{ label: "用户", value: "mdi:account" },
	{ label: "首页", value: "mdi:home" },
	{ label: "仪表盘", value: "mdi:dashboard" },
	{ label: "文件", value: "mdi:file" },
	{ label: "图表", value: "mdi:chart-bar" },
	{ label: "报表", value: "mdi:file-chart" },
	{ label: "系统", value: "mdi:server" },
	{ label: "安全", value: "mdi:shield" },
	{ label: "监控", value: "mdi:monitor" },
	{ label: "日志", value: "mdi:clipboard-text" },
	{ label: "权限", value: "mdi:key" },
	{ label: "角色", value: "mdi:account-group" },
	{ label: "部门", value: "mdi:domain" },
	{ label: "数据", value: "mdi:database" },
	{ label: "配置", value: "mdi:settings" },
	{ label: "工具", value: "mdi:tools" },
	{ label: "帮助", value: "mdi:help-circle" },
	{ label: "通知", value: "mdi:bell" },
];
