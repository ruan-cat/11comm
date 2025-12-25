import type { OptionsType } from "../../../common";

/**
 * @description 菜单组状态
 * Menu group status
 */
export type MenuGroupStatus = "enabled" | "disabled";

/**
 * @description 菜单组类型名称
 * Menu group type name
 */
export type MenuGroupTypeName = "system" | "user" | "merchant";

/**
 * @description 菜单组列表数据
 * Menu group list item
 */
export interface MenuGroupListItem {
	/** 组编号 Group ID */
	groupId: string;
	/** 组名称 Group name */
	groupName: string;
	/** 组编码 Group code */
	groupCode: string;
	/** 组类型 Group type */
	groupType: MenuGroupTypeName;
	/** 归属商户 Store name */
	storeName: string;
	/** 排序 Sort number */
	sortNo: number;
	/** 图标 Icon */
	icon: string;
	/** 状态 Status */
	status: MenuGroupStatus;
	/** 描述 Description */
	description: string;
	/** 创建时间 Creation time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/**
 * @description 菜单组列表查询参数
 * Menu group list query parameters
 */
export interface MenuGroupQueryParams {
	/** 组编号 Group ID */
	groupId?: string;
	/** 组名称 Group name */
	groupName?: string;
	/** 组编码 Group code */
	groupCode?: string;
	/** 状态 Status */
	status?: MenuGroupStatus;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 菜单组表单VO
 * Menu group form VO
 */
export interface MenuGroupFormVO {
	/** 组编号 Group ID */
	groupId: string;
	/** 组名称 Group name */
	groupName: string;
	/** 组编码 Group code */
	groupCode: string;
	/** 组类型 Group type */
	groupType: string;
	/** 归属商户 Store name */
	storeName: string;
	/** 排序 Sort number */
	sortNo: number;
	/** 图标 Icon */
	icon: string;
	/** 状态 Status */
	status: string;
	/** 描述 Description */
	description: string;
}

/**
 * @description 状态选项
 * Status options
 */
export const menuGroupStatusOptions: OptionsType = [
	{ label: "启用", value: "enabled" },
	{ label: "禁用", value: "disabled" },
];

/**
 * @description 商户选项
 * Store options
 */
export const storeOptions: OptionsType = [
	{ label: "系统默认", value: "系统默认" },
	{ label: "万科物业", value: "万科物业" },
	{ label: "碧桂园服务", value: "碧桂园服务" },
	{ label: "恒大物业", value: "恒大物业" },
	{ label: "绿城服务", value: "绿城服务" },
	{ label: "保利物业", value: "保利物业" },
	{ label: "龙湖物业", value: "龙湖物业" },
	{ label: "中海物业", value: "中海物业" },
	{ label: "华润置地", value: "华润置地" },
	{ label: "招商积余", value: "招商积余" },
];

/**
 * @description 图标选项
 * Icon options
 */
export const iconOptions: OptionsType = [
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
