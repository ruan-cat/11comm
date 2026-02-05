import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 数据权限信息
 */
export interface DataPermission {
	/** 编号 */
	id: string;
	/** 名称 */
	name: string;
	/** 描述 */
	description?: string;
	/** 级别 */
	level?: number;
	/** 是否启用 */
	enabled?: boolean;
	/** 角色ID Role ID */
	roleId?: string;
	/** 资源类型 Resource type */
	resourceType?: string;
	/** 数据范围 Data scope */
	dataScope?: string;
	/** 自定义范围 Custom range */
	customRange?: any;
	/** 创建时间 Create time */
	createTime?: string;
}

/**
 * 数据权限列表查询参数
 */
export interface DataPermissionListQuery extends BaseListQueryParams {
	/** 名称 */
	name?: string;
}

/**
 * 单元授权信息
 */
export interface UnitAuth {
	/** 授权ID */
	id: string;
	/** 数据权限ID */
	permissionId: string;
	/** 单元名称 */
	unitName: string;
	/** 授权类型 */
	authType?: string;
	/** 创建时间 */
	createTime?: string;
}

/**
 * 员工关联信息
 */
export interface StaffRelation {
	/** 关联ID */
	id: string;
	/** 数据权限ID */
	permissionId: string;
	/** 员工ID */
	staffId: string;
	/** 员工姓名 */
	staffName?: string;
	/** 关联类型 */
	relationType?: string;
}

/**
 * 数据权限选项
 */
export const dataPermissionOptions: OptionsType[] = [];

/**
 * 授权类型选项
 */
export const authTypeOptions: OptionsType = [
	{ label: "读", value: "read" },
	{ label: "写", value: "write" },
	{ label: "读写", value: "readWrite" },
];

/**
 * 关联类型选项
 */
export const relationTypeOptions: OptionsType = [
	{ label: "主关联", value: "primary" },
	{ label: "次关联", value: "secondary" },
];
