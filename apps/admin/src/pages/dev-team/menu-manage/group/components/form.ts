/**
 * @file 菜单组表单类型定义
 * @description Menu group form types
 */

import type { Mode } from "@/composables/use-mode";
import { menuGroupStatusOptions } from "@01s-11comm/type";
import type { OptionsType } from "@01s-11comm/type";

/**
 * 菜单组表单数据类型
 * Menu group form data type
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

/** 默认表单 Default form */
export const defaultForm: MenuGroupFormVO = {
	groupId: "",
	groupName: "",
	groupCode: "",
	groupType: "系统菜单",
	storeName: "系统默认",
	sortNo: 1,
	icon: "mdi:menu",
	status: "启用",
	description: "",
};

/**
 * 菜单组表单 props
 * @description Menu group form props
 */
export interface MenuGroupFormProps {
	/** 表单数据 Form data */
	form: MenuGroupFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: MenuGroupFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

/** 组类型选项 Group type options */
export const groupTypeOptions: OptionsType = [
	{ label: "系统菜单", value: "系统菜单" },
	{ label: "用户菜单", value: "用户菜单" },
	{ label: "商户菜单", value: "商户菜单" },
	{ label: "应用菜单", value: "应用菜单" },
];

/** 商户选项 Store options */
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

/** 图标选项 Icon options */
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

/** 导出状态选项 Export status options */
export { menuGroupStatusOptions };
