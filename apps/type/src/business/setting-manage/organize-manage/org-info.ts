import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 组织类型
 */
export type OrganizationType = "company" | "department" | "group";


/**
 * 组织类型选项
 */
export const organizationTypeOptions: OptionsType = [
	{ label: "公司", value: "company" },
	{ label: "部门", value: "department" },
	{ label: "小组", value: "group" },
];


/**
 * 组织树节点
 */
export interface OrganizationTreeNode {
	/** 节点ID */
	id: string;
	/** 节点名称 */
	name: string;
	/** 父节点ID */
	parentId?: string;
	/** 图标 */
	icon?: string;
	/** 子节点 */
	children?: OrganizationTreeNode[];
	/** 排序 */
	sort?: number;
	/** 描述 */
	description?: string;
	/** 组织类型 */
	type?: OrganizationType;
	/** 组织编码 */
	code?: string;
	/** 负责人姓名 */
	leaderName?: string;
	/** 联系电话 */
	phone?: string;
	/** 是否启用 */
	enabled?: boolean;
}

/**
 * 员工信息
 */
export interface Employee {
	/** 员工ID */
	id: string;
	/** 姓名 */
	name: string;
	/** 手机号 */
	phone: string;
	/** 岗位 */
	position: string;
	/** 邮箱 */
	email: string;
	/** 地址 */
	address: string;
	/** 性别 */
	gender: string;
	/** 关联组织ID */
	orgId?: string;
}

/**
 * 组织列表查询参数
 */
export interface OrganizationListQuery {
	/** 搜索关键字 */
	keyword?: string;
}

/**
 * 员工列表查询参数
 */
export interface EmployeeListQuery extends BaseListQueryParams {
	/** 员工名称 */
	employeeName?: string;
	/** 组织ID */
	orgId?: string;
}


/**
 * 导出选项
 */
export const organizationOptions: OptionsType[] = [];
