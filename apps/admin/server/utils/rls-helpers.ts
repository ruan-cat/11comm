/**
 * RLS 策略辅助函数
 * @description 提供数据隔离策略的辅助函数
 */

import type { H3Event } from "nitro/h3";
import { and, eq, inArray, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

/**
 * 当前用户上下文
 */
export interface UserContext {
	id: string;
	email: string;
	name: string | null;
	role: string;
	organizationId: string | null;
	communityId: string | null;
	/** 用户所属的组织 ID 列表 */
	organizationIds?: string[];
	/** 用户所属的小区 ID 列表 */
	communityIds?: string[];
	/** 用户是否是组织管理员（管理多个组织） */
	isOrgAdmin?: boolean;
	/** 用户是否是小 区管理员 */
	isCommunityAdmin?: boolean;
}

/**
 * 组织上下文信息（增强版，支持层级关系）
 */
export interface OrganizationContext {
	/** 当前组织 ID */
	organizationId: string | null;
	/** 当前组织名称 */
	organizationName: string | null;
	/** 父组织 ID */
	parentId: string | null;
	/** 组织层级 */
	level: number;
	/** 组织路径 */
	orgPath: string | null;
	/** 所管理的小区 ID 列表 */
	communityIds: string[];
	/** 子组织 ID 列表 */
	childOrganizationIds?: string[];
	/** 组织树路径（包含所有父组织） */
	organizationTreePath?: Array<{
		id: string;
		name: string;
		level: number;
	}>;
}

/**
 * 小区上下文信息
 */
export interface CommunityContext {
	/** 当前小区 ID */
	communityId: string | null;
	/** 当前小区名称 */
	communityName: string | null;
	/** 所属组织 ID */
	organizationId: string | null;
}

/**
 * 获取当前用户上下文
 *
 * @description
 * 从事件上下文中获取当前登录用户的信息
 *
 * @param event - H3 事件对象
 * @returns 用户上下文，如果未登录返回 null
 */
export function getUserContext(event: H3Event): UserContext | null {
	return (event.context.user as UserContext) || null;
}

/**
 * 检查用户是否已认证
 */
export function isAuthenticated(event: H3Event): boolean {
	return !!event.context.authenticated;
}

/**
 * 检查用户是否为超级管理员
 */
export function isSuperAdmin(event: H3Event): boolean {
	const user = getUserContext(event);
	return user?.role === "super_admin";
}

/**
 * 检查用户是否为组织管理员
 */
export function isOrgAdmin(event: H3Event): boolean {
	const user = getUserContext(event);
	return user?.role === "org_admin";
}

/**
 * 检查用户是否为小区管理员
 */
export function isCommunityAdmin(event: H3Event): boolean {
	const user = getUserContext(event);
	return user?.role === "community_admin";
}

/**
 * 检查用户是否为物业员工
 */
export function isStaff(event: H3Event): boolean {
	const user = getUserContext(event);
	return user?.role === "staff";
}

/**
 * 检查用户是否为业主/住户
 */
export function isOwner(event: H3Event): boolean {
	const user = getUserContext(event);
	return user?.role === "owner";
}

/**
 * 获取用户可访问的组织 ID 列表
 *
 * @description
 * - 超级管理员：返回 null（可访问所有）
 * - 组织管理员：返回所管理的组织 ID
 * - 其他角色：返回所属组织 ID
 */
export function getUserOrganizationIds(event: H3Event): string[] | null {
	const user = getUserContext(event);
	if (!user) return [];

	if (user.role === "super_admin") {
		return null; // null 表示无限制
	}

	if (user.organizationIds) {
		return user.organizationIds;
	}

	if (user.organizationId) {
		return [user.organizationId];
	}

	return [];
}

/**
 * 获取用户可访问的小区 ID 列表
 *
 * @description
 * - 超级管理员/组织管理员：返回 null（可访问所有）
 * - 小区管理员/物业员工：返回所管理的小区 ID
 * - 业主：返回所拥有房产的小区 ID
 */
export function getUserCommunityIds(event: H3Event): string[] | null {
	const user = getUserContext(event);
	if (!user) return [];

	if (user.role === "super_admin" || user.role === "org_admin") {
		return null; // null 表示无限制
	}

	if (user.communityIds) {
		return user.communityIds;
	}

	if (user.communityId) {
		return [user.communityId];
	}

	return [];
}

/**
 * 构建组织隔离条件
 *
 * @param event - H3 事件对象
 * @param organizationIdField - 组织 ID 字段名
 * @returns Drizzle 条件或 undefined（无限制）
 */
export function buildOrgIsolationCondition(
	event: H3Event,
	organizationIdField: string = "org_id",
): ReturnType<typeof eq> | ReturnType<typeof inArray> | undefined {
	const user = getUserContext(event);
	if (!user) {
		// 未认证用户无法访问
		return eq(organizationIdField as any, null as any);
	}

	// 超级管理员无限制
	if (user.role === "super_admin") {
		return undefined;
	}

	const orgIds = getUserOrganizationIds(event);
	if (orgIds === null) {
		return undefined;
	}

	if (orgIds.length === 0) {
		return eq(organizationIdField as any, null as any);
	}

	if (orgIds.length === 1) {
		return eq(organizationIdField as any, orgIds[0]);
	}

	return inArray(organizationIdField as any, orgIds);
}

/**
 * 构建小区隔离条件
 *
 * @param event - H3 事件对象
 * @param communityIdField - 小区 ID 字段名
 * @returns Drizzle 条件或 undefined（无限制）
 */
export function buildCommunityIsolationCondition(
	event: H3Event,
	communityIdField: string = "community_id",
): ReturnType<typeof eq> | ReturnType<typeof inArray> | undefined {
	const user = getUserContext(event);
	if (!user) {
		// 未认证用户无法访问
		return eq(communityIdField as any, null as any);
	}

	// 超级管理员和组织管理员无限制
	if (user.role === "super_admin" || user.role === "org_admin") {
		return undefined;
	}

	const communityIds = getUserCommunityIds(event);
	if (communityIds === null) {
		return undefined;
	}

	if (communityIds.length === 0) {
		return eq(communityIdField as any, null as any);
	}

	if (communityIds.length === 1) {
		return eq(communityIdField as any, communityIds[0]);
	}

	return inArray(communityIdField as any, communityIds);
}

/**
 * 获取当前用户的组织上下文（增强版）
 *
 * @description
 * 获取用户当前所在的组织信息，包括：
 * - 组织ID
 * - 组织层级
 * - 所管理的小区列表
 * - 子组织列表
 * - 组织树路径
 *
 * @param event - H3 事件对象
 * @returns 组织上下文信息
 */
export function getOrganizationContext(event: H3Event): OrganizationContext {
	const user = getUserContext(event);

	const defaultContext: OrganizationContext = {
		organizationId: null,
		organizationName: null,
		parentId: null,
		level: 1,
		orgPath: null,
		communityIds: [],
		childOrganizationIds: [],
		organizationTreePath: [],
	};

	if (!user) {
		return defaultContext;
	}

	// 超级管理员拥有所有组织
	if (user.role === "super_admin") {
		return {
			...defaultContext,
			organizationId: null, // 表示所有组织
			level: 0, // 最高层级
			communityIds: [], // 表示所有小区
			childOrganizationIds: [], // 表示所有子组织
			organizationTreePath: [], // 空表示根级别
		};
	}

	// 组织管理员
	if (user.role === "org_admin") {
		return {
			organizationId: user.organizationId,
			organizationName: null, // TODO: 从数据库获取
			parentId: null, // TODO: 从数据库获取
			level: 1, // TODO: 从数据库获取
			orgPath: null, // TODO: 从数据库获取
			communityIds: user.communityIds || [],
			childOrganizationIds: [], // TODO: 从数据库获取
			organizationTreePath: [], // TODO: 从数据库获取
		};
	}

	// 小区管理员或物业员工
	if (user.role === "community_admin" || user.role === "staff") {
		return {
			organizationId: user.organizationId,
			organizationName: null,
			parentId: null,
			level: 2,
			orgPath: null,
			communityIds: user.communityIds || [],
			childOrganizationIds: [],
			organizationTreePath: [],
		};
	}

	// 业主/住户
	if (user.role === "owner") {
		return {
			organizationId: null,
			organizationName: null,
			parentId: null,
			level: 3,
			orgPath: null,
			communityIds: user.communityIds || [],
			childOrganizationIds: [],
			organizationTreePath: [],
		};
	}

	// 默认情况
	return {
		organizationId: user.organizationId,
		organizationName: null,
		parentId: null,
		level: 1,
		orgPath: null,
		communityIds: user.communityIds || [],
		childOrganizationIds: [],
		organizationTreePath: [],
	};
}

/**
 * 检查用户是否可以访问特定组织及其子组织
 *
 * @description
 * 用于检查用户是否有权限访问指定组织或该组织的子组织的数据
 *
 * @param event - H3 事件对象
 * @param organizationId - 组织 ID
 * @param includeChildren - 是否包含子组织（默认 true）
 * @returns 是否可以访问
 */
export function canAccessOrganizationWithChildren(
	event: H3Event,
	organizationId: string,
	includeChildren: boolean = true,
): boolean {
	const user = getUserContext(event);
	if (!user) return false;

	// 超级管理员可以访问所有
	if (user.role === "super_admin") {
		return true;
	}

	// 获取用户可访问的组织 ID 列表
	const orgIds = getUserOrganizationIds(event);
	if (orgIds === null) return true;

	// 直接匹配
	if (orgIds.includes(organizationId)) {
		return true;
	}

	// 如果需要检查子组织，需要从数据库查询（这里简化处理）
	// TODO: 实现子组织检查逻辑

	return false;
}

/**
 * 获取用户可访问的完整组织树
 *
 * @description
 * 获取用户可以访问的完整组织树结构，包括：
 * - 顶级组织
 * - 子组织
 * - 每个组织关联的小区
 *
 * @param event - H3 事件对象
 * @returns 组织树结构
 */
export interface OrganizationTreeNode {
	id: string;
	name: string;
	level: number;
	parentId: string | null;
	communityIds: string[];
	children: OrganizationTreeNode[];
}

export function getUserOrganizationTree(event: H3Event): OrganizationTreeNode[] {
	const user = getUserContext(event);

	if (!user) {
		return [];
	}

	// 超级管理员返回所有组织树（这里简化处理）
	if (user.role === "super_admin") {
		// TODO: 从数据库获取完整组织树
		return [];
	}

	// 组织管理员返回其管理的组织树
	if (user.role === "org_admin") {
		// TODO: 从数据库获取组织树
		return [];
	}

	// 其他角色没有组织树
	return [];
}

/**
 * 获取当前用户的小区上下文
 *
 * @description
 * 获取用户当前所在的小区信息，包括：
 * - 小区ID
 * - 小区名称
 * - 所属组织ID
 *
 * @param event - H3 事件对象
 * @returns 小区上下文信息
 */
export function getCommunityContext(event: H3Event): CommunityContext {
	const user = getUserContext(event);

	const defaultContext: CommunityContext = {
		communityId: null,
		communityName: null,
		organizationId: null,
	};

	if (!user) {
		return defaultContext;
	}

	// 超级管理员拥有所有小区
	if (user.role === "super_admin") {
		return {
			...defaultContext,
			communityId: null,
			organizationId: null,
		};
	}

	return {
		communityId: user.communityId,
		communityName: null, // TODO: 从数据库获取
		organizationId: user.organizationId,
	};
}

/**
 * 公开数据表列表
 * @description 这些表允许匿名用户读取
 */
export const PUBLIC_TABLES = [
	"cm_communities", // 小区信息
	"dt_configs", // 系统配置
	"dt_dictionaries", // 数据字典
	"dt_dictionary_items", // 字典项
] as const;

/**
 * 检查表是否为公开表
 */
export function isPublicTable(tableName: string): boolean {
	return PUBLIC_TABLES.includes(tableName as any);
}

/**
 * 获取用户可访问的房产 ID 列表
 *
 * @description
 * - 超级管理员/组织管理员：返回 null（可访问所有）
 * - 小区管理员/物业员工：返回所管理的小区 ID
 * - 业主：返回所拥有房产的小区 ID
 */
export function getUserPropertyIds(event: H3Event): string[] | null {
	const user = getUserContext(event);
	if (!user) return [];

	if (user.role === "super_admin" || user.role === "org_admin") {
		return null; // null 表示无限制
	}

	if (user.communityIds) {
		return user.communityIds;
	}

	if (user.communityId) {
		return [user.communityId];
	}

	return [];
}

/**
 * 构建房产隔离条件
 *
 * @param event - H3 事件对象
 * @param propertyIdField - 房产ID字段名
 * @returns Drizzle 条件或 undefined（无限制）
 */
export function buildPropertyIsolationCondition(
	event: H3Event,
	propertyIdField: string = "property_id",
): ReturnType<typeof eq> | ReturnType<typeof inArray> | undefined {
	const user = getUserContext(event);
	if (!user) {
		// 未认证用户无法访问
		return eq(propertyIdField as any, null as any);
	}

	// 超级管理员和组织管理员无限制
	if (user.role === "super_admin" || user.role === "org_admin") {
		return undefined;
	}

	const propertyIds = getUserPropertyIds(event);
	if (propertyIds === null) {
		return undefined;
	}

	if (propertyIds.length === 0) {
		return eq(propertyIdField as any, null as any);
	}

	if (propertyIds.length === 1) {
		return eq(propertyIdField as any, propertyIds[0]);
	}

	return inArray(propertyIdField as any, propertyIds);
}

/**
 * 权限优先级类型
 *
 * @description
 * 权限优先级遵循：Organization > Community > Property
 * - Organization: 组织级别隔离（最高优先级）
 * - Community: 小区级别隔离
 * - Property: 房产级别隔离（最低优先级）
 */
export type PermissionPriority = "organization" | "community" | "property";

/**
 * 获取用户权限优先级
 *
 * @description
 * 根据用户角色确定权限优先级：
 * - super_admin: 无限制（返回 null）
 * - org_admin: organization（组织级别）
 * - community_admin: community（小区级别）
 * - staff: community（小区级别）
 * - owner: property（房产级别）
 *
 * 权限优先级逻辑：Organization > Community > Property
 * 高优先级可以访问低优先级的数据，反之则不行
 *
 * @param event - H3 事件对象
 * @returns 权限优先级或 null（无限制）
 */
export function getPermissionPriority(event: H3Event): PermissionPriority | null {
	const user = getUserContext(event);
	if (!user) {
		return null;
	}

	// 超级管理员无限制
	if (user.role === "super_admin") {
		return null;
	}

	// 组织管理员：组织级别隔离
	if (user.role === "org_admin") {
		return "organization";
	}

	// 小区管理员/物业员工：小区级别隔离
	if (user.role === "community_admin" || user.role === "staff") {
		return "community";
	}

	// 业主：房产级别隔离
	if (user.role === "owner") {
		return "property";
	}

	// 默认无权限
	return null;
}

/**
 * 检查用户是否有权限访问特定数据范围
 *
 * @description
 * 基于权限优先级检查用户是否有权访问目标数据范围
 * 权限优先级：Organization > Community > Property
 *
 * @param event - H3 事件对象
 * @param targetLevel - 目标数据访问级别
 * @returns 是否有权限
 */
export function canAccessDataScope(event: H3Event, targetLevel: PermissionPriority): boolean {
	const user = getUserContext(event);
	if (!user) {
		return false;
	}

	// 超级管理员可以访问所有
	if (user.role === "super_admin") {
		return true;
	}

	// 获取当前用户的权限优先级
	const userPriority = getPermissionPriority(event);

	// 无权限用户
	if (userPriority === null) {
		return false;
	}

	// 权限优先级比较：优先级高的可以访问优先级低的数据
	const priorityOrder: PermissionPriority[] = ["organization", "community", "property"];
	const userIndex = priorityOrder.indexOf(userPriority);
	const targetIndex = priorityOrder.indexOf(targetLevel);

	// 用户权限优先级 <= 目标权限优先级（数字越小优先级越高）
	return userIndex <= targetIndex;
}

/**
 * 权限检查函数
 */

/**
 * 检查用户是否有特定权限
 *
 * @param event - H3 事件对象
 * @param permission - 权限标识符，例如 "expense:read", "repair:*"
 * @returns 是否有权限
 */
export function hasPermission(event: H3Event, permission: string): boolean {
	const user = getUserContext(event);
	if (!user) return false;

	// 超级管理员拥有所有权限
	if (user.role === "super_admin") {
		return true;
	}

	// TODO: 从用户权限中检查
	// 这里应该从 auth_roles 或 sm_permissions 表中获取用户的实际权限
	// 目前简化处理：直接检查角色是否匹配
	return false;
}

/**
 * 检查用户是否可以访问特定组织
 *
 * @param event - H3 事件对象
 * @param organizationId - 组织 ID
 * @returns 是否可以访问
 */
export function canAccessOrganization(event: H3Event, organizationId: string): boolean {
	const orgIds = getUserOrganizationIds(event);
	if (orgIds === null) return true; // 超级管理员可访问所有
	return orgIds.includes(organizationId);
}

/**
 * 获取用户当前所在的组织信息（从数据库动态获取）
 *
 * @description
 * 从数据库获取当前用户的组织详细信息，包括：
 * - 组织基本信息
 * - 父组织信息
 * - 子组织列表
 * - 关联的小区列表
 *
 * @param event - H3 事件对象
 * @returns 组织详细信息（如果未找到返回 null）
 */
export async function getOrganizationDetailsFromDB(event: H3Event): Promise<{
	id: string;
	orgName: string;
	orgCode: string;
	orgType: string | null;
	parentId: string | null;
	level: number;
	orgPath: string | null;
	communityIds: string[];
	childOrganizationIds: string[];
} | null> {
	const user = getUserContext(event);
	if (!user || !user.organizationId) {
		return null;
	}

	// TODO: 从数据库查询组织详细信息
	// 这需要在实际使用的地方注入 db 实例
	// const db = event.context.db;
	// const org = await db.query.smOrganizations.findFirst({
	//   where: eq(smOrganizations.id, user.organizationId)
	// });

	return null;
}

/**
 * 获取用户当前所在的小区信息（从数据库动态获取）
 *
 * @description
 * 从数据库获取当前用户的小区详细信息
 *
 * @param event - H3 事件对象
 * @returns 小区详细信息（如果未找到返回 null）
 */
export async function getCommunityDetailsFromDB(event: H3Event): Promise<{
	id: string;
	name: string;
	code: string;
	address: string | null;
	phone: string | null;
	organizationId: string | null;
} | null> {
	const user = getUserContext(event);
	if (!user || !user.communityId) {
		return null;
	}

	// TODO: 从数据库查询小区详细信息
	// const db = event.context.db;
	// const community = await db.query.cmCommunities.findFirst({
	//   where: eq(cmCommunities.id, user.communityId)
	// });

	return null;
}

/**
 * 动态获取当前用户的完整上下文
 *
 * @description
 * 动态获取当前用户的完整上下文信息，包括：
 * - 用户基本信息
 * - 组织信息
 * - 小区信息
 * - 权限信息
 *
 * @param event - H3 事件对象
 * @returns 完整用户上下文
 */
export interface FullUserContext extends UserContext {
	/** 组织详细信息 */
	organizationDetails?: {
		id: string;
		name: string;
		level: number;
		parentId: string | null;
		orgPath: string | null;
	} | null;
	/** 小区详细信息 */
	communityDetails?: {
		id: string;
		name: string;
		address: string | null;
	} | null;
	/** 数据访问级别 */
	dataAccessLevel: "all" | "organization" | "community" | "none";
}

export async function getFullUserContext(event: H3Event): Promise<FullUserContext | null> {
	const user = getUserContext(event);
	if (!user) {
		return null;
	}

	const dataAccessLevel = getDataAccessLevel(event);

	// 获取组织详细信息
	const orgDetails = await getOrganizationDetailsFromDB(event);

	// 获取小区详细信息
	const commDetails = await getCommunityDetailsFromDB(event);

	return {
		...user,
		organizationDetails: orgDetails
			? {
					id: orgDetails.id,
					name: orgDetails.orgName,
					level: orgDetails.level,
					parentId: orgDetails.parentId,
					orgPath: orgDetails.orgPath,
				}
			: null,
		communityDetails: commDetails
			? {
					id: commDetails.id,
					name: commDetails.name,
					address: commDetails.address,
				}
			: null,
		dataAccessLevel,
	};
}

/**
 * 检查用户是否可以访问特定小区
 *
 * @param event - H3 事件对象
 * @param communityId - 小区 ID
 * @returns 是否可以访问
 */
export function canAccessCommunity(event: H3Event, communityId: string): boolean {
	const communityIds = getUserCommunityIds(event);
	if (communityIds === null) return true; // 超级管理员可访问所有
	return communityIds.includes(communityId);
}

/**
 * 检查用户是否可以访问特定房产
 *
 * @param event - H3 事件对象
 * @param propertyId - 房产 ID
 * @returns 是否可以访问
 */
export function canAccessProperty(event: H3Event, propertyId: string): boolean {
	const propertyIds = getUserPropertyIds(event);
	if (propertyIds === null) return true; // 超级管理员可访问所有
	return propertyIds.includes(propertyId);
}

/**
 * 构建数据隔离的 SQL 条件
 *
 * @param event - H3 事件对象
 * @param tableAlias - 表别名
 * @param idFieldName - ID 字段名，如 "community_id", "org_id"
 * @returns SQL 条件对象或 undefined
 */
export function buildIsolationCondition(
	event: H3Event,
	idFieldName: "community_id" | "org_id",
): Record<string, unknown> | undefined {
	const user = getUserContext(event);
	if (!user) return { id: null }; // 未认证用户无权限

	// 超级管理员无限制
	if (user.role === "super_admin" || user.role === "org_admin") {
		return undefined;
	}

	if (idFieldName === "community_id") {
		const communityIds = getUserCommunityIds(event);
		if (communityIds === null) return undefined;
		return { in: communityIds };
	}

	if (idFieldName === "org_id") {
		const orgIds = getUserOrganizationIds(event);
		if (orgIds === null) return undefined;
		return { in: orgIds };
	}

	return undefined;
}

/**
 * 业务表分组
 * 用于按模块批量处理数据隔离
 */
export const BUSINESS_TABLE_GROUPS = {
	// 费用管理
	expense: [
		"ex_expense_items",
		"ex_house_charges",
		"ex_vehicle_charges",
		"ex_contract_charges",
		"ex_payments",
		"ex_payment_reviews",
		"ex_refund_reviews",
		"ex_discount_types",
		"ex_discount_settings",
		"ex_discount_applications",
		"ex_meter_reading_types",
		"ex_meter_readings",
		"ex_cancel_fees",
		"ex_overdue_reminders",
		"ex_reprint_vouchers",
		"ex_expense_summary_tables",
	],
	// 报修管理
	repairs: [
		"rp_repair_orders",
		"rp_repair_order_histories",
		"rp_return_visits",
		"rp_repair_settings",
		"rp_repair_types",
		"rp_mandatory_return_issues",
		"rp_phone_repair_reports",
	],
	// 巡检管理
	patrol: [
		"pt_patrol_plans",
		"pt_patrol_paths",
		"pt_patrol_points",
		"pt_patrol_items",
		"pt_patrol_tasks",
		"pt_patrol_task_details",
	],
	// 停车管理
	parking: ["pk_parking_structures", "pk_parking_lots", "pk_carports", "pk_owner_vehicles", "pk_carport_applications"],
	// 合同管理
	contract: [
		"ct_first_parties",
		"ct_second_parties",
		"ct_templates",
		"ct_clauses",
		"ct_types",
		"ct_contracts",
		"ct_attachments",
		"ct_changes",
		"ct_reviews",
		"ct_archives",
		"ct_prints",
	],
	// 房产管理
	property: [
		"hp_houses",
		"hp_owners",
		"hp_owner_members",
		"hp_owner_accounts",
		"hp_invoices",
		"hp_invoice_titles",
		"hp_reserve_venues",
		"hp_reserve_venue_orders",
		"hp_site_managements",
		"hp_owners_committees",
	],
	// 社区管理
	community: [
		"cm_communities",
		"cm_notices",
		"cm_handing_business",
		"cm_house_decorations",
		"cm_property_registers",
		"cm_building_structures",
	],
	// 报表
	report: [
		"rpt_expense_summaries",
		"rpt_deposit_reports",
		"rpt_payment_details",
		"rpt_owner_payment_details",
		"rpt_fee_reminders",
		"rpt_no_charge_houses",
		"rpt_outstanding_fees",
		"rpt_patrol_reports",
		"rpt_repair_reports",
		"rpt_repair_summaries",
		"rpt_statement_expenses",
		"rpt_data_statistics",
	],
	// 组织架构
	setting: [
		"sm_organizations",
		"sm_staff",
		"sm_roles",
		"sm_permissions",
		"sm_role_permissions",
		"sm_staff_roles",
		"sm_data_permissions",
		"sm_shifts",
		"sm_scheduling_settings",
		"sm_working_schedules",
		"sm_system_configs",
		"sm_register_protocols",
	],
} as const;

/**
 * 检查表是否属于特定业务分组
 *
 * @param tableName - 表名
 * @param group - 业务分组名
 * @returns 是否属于该分组
 */
export function isTableInGroup(tableName: string, group: keyof typeof BUSINESS_TABLE_GROUPS): boolean {
	return (BUSINESS_TABLE_GROUPS[group] as unknown as string[]).includes(tableName);
}

// ==========================================
// RLS 策略构建函数
// ==========================================

/**
 * RLS 策略类型
 */
export type RLSPolicyType =
	| "super_admin" // 超级管理员 - 无限制
	| "org_admin" // 组织管理员 - 基于组织ID隔离
	| "community_admin" // 小区管理员 - 基于小区ID隔离
	| "staff" // 物业员工 - 基于小区ID隔离
	| "owner"; // 业主/住户 - 基于房产/小区ID隔离

/**
 * RLS 策略配置
 */
export interface RLSPolicyConfig {
	/** 表名 */
	tableName: string;
	/** ID 字段名（如 org_id, community_id） */
	idField: string;
	/** 策略类型 */
	policyType: RLSPolicyType;
	/** 是否启用 */
	enabled?: boolean;
}

/**
 * 构建组织管理员 RLS 策略条件
 *
 * @description
 * 组织管理员可以访问其所属组织及所有子组织的数据
 *
 * @param event - H3 事件对象
 * @param organizationIdField - 组织ID字段名
 * @returns Drizzle 条件
 */
export function buildOrgAdminRLSCondition(
	event: H3Event,
	organizationIdField: string = "org_id",
): ReturnType<typeof eq> | ReturnType<typeof inArray> | undefined {
	const user = getUserContext(event);

	// 非组织管理员不能使用此策略
	if (!user || (user.role !== "org_admin" && user.role !== "super_admin")) {
		return undefined;
	}

	// 超级管理员无限制
	if (user.role === "super_admin") {
		return undefined;
	}

	const orgIds = getUserOrganizationIds(event);
	if (orgIds === null) {
		return undefined;
	}

	if (orgIds.length === 0) {
		return eq(organizationIdField as any, null as any);
	}

	if (orgIds.length === 1) {
		return eq(organizationIdField as any, orgIds[0]);
	}

	return inArray(organizationIdField as any, orgIds);
}

/**
 * 构建小区管理员 RLS 策略条件
 *
 * @description
 * 小区管理员可以访问其所管理的小区的数据
 *
 * @param event - H3 事件对象
 * @param communityIdField - 小区ID字段名
 * @returns Drizzle 条件
 */
export function buildCommunityAdminRLSCondition(
	event: H3Event,
	communityIdField: string = "community_id",
): ReturnType<typeof eq> | ReturnType<typeof inArray> | undefined {
	const user = getUserContext(event);

	// 非小区管理员不能使用此策略
	if (!user || (user.role !== "community_admin" && user.role !== "staff" && user.role !== "super_admin")) {
		return undefined;
	}

	// 超级管理员无限制
	if (user.role === "super_admin") {
		return undefined;
	}

	const communityIds = getUserCommunityIds(event);
	if (communityIds === null) {
		return undefined;
	}

	if (communityIds.length === 0) {
		return eq(communityIdField as any, null as any);
	}

	if (communityIds.length === 1) {
		return eq(communityIdField as any, communityIds[0]);
	}

	return inArray(communityIdField as any, communityIds);
}

/**
 * 构建物业员工 RLS 策略条件
 *
 * @description
 * 物业员工只能访问其所属小区的数据
 *
 * @param event - H3 事件对象
 * @param communityIdField - 小区ID字段名
 * @returns Drizzle 条件
 */
export function buildStaffRLSCondition(
	event: H3Event,
	communityIdField: string = "community_id",
): ReturnType<typeof eq> | ReturnType<typeof inArray> | undefined {
	const user = getUserContext(event);

	// 非物业员工不能使用此策略
	if (!user || (user.role !== "staff" && user.role !== "super_admin")) {
		return undefined;
	}

	// 超级管理员无限制
	if (user.role === "super_admin") {
		return undefined;
	}

	const communityIds = getUserCommunityIds(event);
	if (communityIds === null) {
		return undefined;
	}

	if (communityIds.length === 0) {
		return eq(communityIdField as any, null as any);
	}

	if (communityIds.length === 1) {
		return eq(communityIdField as any, communityIds[0]);
	}

	return inArray(communityIdField as any, communityIds);
}

/**
 * 构建业主/住户 RLS 策略条件
 *
 * @description
 * 业主/住户只能访问与自己房产相关的数据
 *
 * @param event - H3 事件对象
 * @param communityIdField - 小区ID字段名
 * @param ownerIdField - 业主ID字段名（可选）
 * @returns Drizzle 条件
 */
export function buildOwnerRLSCondition(
	event: H3Event,
	communityIdField: string = "community_id",
	ownerIdField?: string,
): ReturnType<typeof eq> | ReturnType<typeof inArray> | undefined {
	const user = getUserContext(event);

	// 非业主不能使用此策略
	if (!user || (user.role !== "owner" && user.role !== "super_admin")) {
		return undefined;
	}

	// 超级管理员无限制
	if (user.role === "super_admin") {
		return undefined;
	}

	// 业主基于房产/小区ID隔离
	const communityIds = getUserCommunityIds(event);
	if (communityIds === null) {
		return undefined;
	}

	if (communityIds.length === 0) {
		return eq(communityIdField as any, null as any);
	}

	if (communityIds.length === 1) {
		return eq(communityIdField as any, communityIds[0]);
	}

	return inArray(communityIdField as any, communityIds);
}

/**
 * 构建组合 RLS 条件（自动根据用户角色选择合适的策略）
 *
 * @description
 * 根据当前用户的角色自动构建合适的 RLS 条件
 *
 * @param event - H3 事件对象
 * @param idField - ID 字段名（org_id 或 community_id）
 * @returns Drizzle 条件
 */
export function buildAutoRLSCondition(
	event: H3Event,
	idField: "org_id" | "community_id",
): ReturnType<typeof eq> | ReturnType<typeof inArray> | undefined {
	const user = getUserContext(event);
	if (!user) {
		return eq(idField as any, null as any);
	}

	// 超级管理员无限制
	if (user.role === "super_admin") {
		return undefined;
	}

	// 组织管理员使用组织ID隔离
	if (user.role === "org_admin") {
		return buildOrgAdminRLSCondition(event, idField);
	}

	// 小区管理员、物业员工、业主使用小区ID隔离
	if (user.role === "community_admin" || user.role === "staff" || user.role === "owner") {
		return buildCommunityAdminRLSCondition(event, idField);
	}

	// 默认拒绝访问
	return eq(idField as any, null as any);
}

/**
 * 获取用户的数据访问级别
 *
 * @description
 * 返回用户可以访问数据的级别：
 * - all: 访问所有数据（超级管理员）
 * - organization: 基于组织隔离
 * - community: 基于小区隔离
 * - none: 无访问权限
 *
 * @param event - H3 事件对象
 * @returns 数据访问级别
 */
export function getDataAccessLevel(event: H3Event): "all" | "organization" | "community" | "none" {
	const user = getUserContext(event);

	if (!user) {
		return "none";
	}

	switch (user.role) {
		case "super_admin":
			return "all";
		case "org_admin":
			return "organization";
		case "community_admin":
		case "staff":
		case "owner":
			return "community";
		default:
			return "none";
	}
}
