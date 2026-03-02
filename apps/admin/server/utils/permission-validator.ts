/**
 * 权限验证工具
 * @description 基于角色的权限验证中间件
 */

import { createError } from "nitro/h3";
import type { H3Event } from "nitro/h3";
import type { UserContext } from "./rls-helpers";

/**
 * 权限码类型
 */
type PermissionCode = string;

/**
 * 路由权限配置
 */
interface RoutePermissionConfig {
	/** 路由路径模式 */
	pattern: string | RegExp;
	/** 需要的权限码 */
	requiredPermissions: PermissionCode[];
	/** HTTP 方法（可选，默认所有方法） */
	methods?: string[];
}

/**
 * 默认路由权限配置
 */
const defaultRoutePermissions: RoutePermissionConfig[] = [
	// 菜单管理
	{
		pattern: /^\/api\/dev-team\/menu-manage\/.+/,
		requiredPermissions: ["menu:read", "menu:create", "menu:update", "menu:delete"],
	},

	// 用户管理
	{
		pattern: /^\/api\/dev-team\/user-manage\/.+/,
		requiredPermissions: ["user:read", "user:create", "user:update", "user:delete"],
	},

	// 角色管理
	{
		pattern: /^\/api\/setting-manage\/role-permission\/.+/,
		requiredPermissions: ["role:read", "role:create", "role:update", "role:delete"],
	},

	// 组织管理
	{
		pattern: /^\/api\/setting-manage\/org-info\/.+/,
		requiredPermissions: ["organization:read", "organization:create", "organization:update"],
	},

	// 员工管理
	{
		pattern: /^\/api\/setting-manage\/staff-info\/.+/,
		requiredPermissions: ["staff:read", "staff:create", "staff:update", "staff:delete"],
	},

	// 费用管理 - 创建/更新/删除需要权限
	{
		pattern: /^\/api\/property-manage\/expense-manage\/.+/,
		requiredPermissions: ["expense:read", "expense:create", "expense:update", "expense:delete"],
		methods: ["POST", "PUT", "DELETE"],
	},

	// 报修管理 - 创建需要权限
	{
		pattern: /^\/api\/property-manage\/repairs-manage\/.+/,
		requiredPermissions: ["repair:read", "repair:create", "repair:update", "repair:delete"],
	},

	// 巡检管理
	{
		pattern: /^\/api\/property-manage\/patrol-manage\/.+/,
		requiredPermissions: ["patrol:read", "patrol:create", "patrol:update", "patrol:delete"],
	},

	// 合同管理 - 敏感操作
	{
		pattern: /^\/api\/property-manage\/contract-manage\/.+/,
		requiredPermissions: ["contract:read", "contract:create", "contract:update", "contract:delete"],
	},

	// 通知公告 - 发布需要权限
	{
		pattern: /^\/api\/property-manage\/notice\/.+/,
		requiredPermissions: ["notice:read", "notice:create", "notice:update", "notice:delete"],
		methods: ["POST", "PUT", "DELETE"],
	},
];

/**
 * 角色权限映射
 */
const rolePermissions: Record<string, PermissionCode[]> = {
	super_admin: ["*"], // 拥有所有权限
	org_admin: [
		"community:read",
		"community:create",
		"community:update",
		"staff:read",
		"staff:create",
		"staff:update",
		"house:read",
		"house:update",
		"expense:read",
		"expense:create",
		"expense:approve",
		"repair:read",
		"repair:update",
		"patrol:read",
		"patrol:create",
		"patrol:update",
		"parking:read",
		"parking:create",
		"parking:update",
		"contract:read",
		"contract:create",
		"contract:update",
		"notice:create",
		"notice:read",
		"notice:update",
		"notice:publish",
		"report:read",
		"report:export",
	],
	community_admin: [
		"community:read",
		"staff:read",
		"staff:create",
		"staff:update",
		"house:read",
		"house:update",
		"expense:read",
		"expense:create",
		"expense:approve",
		"repair:read",
		"repair:update",
		"patrol:read",
		"patrol:create",
		"patrol:update",
		"parking:read",
		"parking:create",
		"parking:update",
		"contract:read",
		"contract:create",
		"notice:create",
		"notice:read",
		"notice:update",
		"report:read",
		"report:export",
	],
	staff: [
		"community:read",
		"house:read",
		"expense:read",
		"expense:create",
		"repair:read",
		"repair:update",
		"patrol:read",
		"patrol:create",
		"patrol:update",
		"parking:read",
		"parking:create",
		"notice:read",
		"report:read",
	],
	owner: ["house:read", "expense:read", "repair:create", "repair:read", "parking:read", "notice:read"],
};

/**
 * 获取用户的权限列表
 */
export function getUserPermissions(role: string): PermissionCode[] {
	const permissions = rolePermissions[role];
	if (!permissions) {
		return [];
	}

	// 超级管理员拥有所有权限
	if (permissions.includes("*")) {
		// 返回所有可能的权限
		return [
			"system:read",
			"system:update",
			"system:manage",
			"user:create",
			"user:read",
			"user:update",
			"user:delete",
			"role:create",
			"role:read",
			"role:update",
			"role:delete",
			"role:manage",
			"menu:create",
			"menu:read",
			"menu:update",
			"menu:delete",
			"organization:create",
			"organization:read",
			"organization:update",
			"organization:delete",
			"staff:create",
			"staff:read",
			"staff:update",
			"staff:delete",
			"community:create",
			"community:read",
			"community:update",
			"community:delete",
			"house:create",
			"house:read",
			"house:update",
			"house:delete",
			"owner:create",
			"owner:read",
			"owner:update",
			"owner:delete",
			"vehicle:create",
			"vehicle:read",
			"vehicle:update",
			"vehicle:delete",
			"expense:create",
			"expense:read",
			"expense:update",
			"expense:delete",
			"expense:approve",
			"expense:export",
			"charge:create",
			"charge:read",
			"charge:update",
			"charge:delete",
			"charge:approve",
			"charge:export",
			"discount:create",
			"discount:read",
			"discount:update",
			"discount:delete",
			"discount:approve",
			"refund:create",
			"refund:read",
			"refund:update",
			"refund:delete",
			"refund:approve",
			"parking:create",
			"parking:read",
			"parking:update",
			"parking:delete",
			"repair:create",
			"repair:read",
			"repair:update",
			"repair:delete",
			"repair:approve",
			"patrol:create",
			"patrol:read",
			"patrol:update",
			"patrol:delete",
			"contract:create",
			"contract:read",
			"contract:update",
			"contract:delete",
			"contract:approve",
			"notice:create",
			"notice:read",
			"notice:update",
			"notice:delete",
			"notice:publish",
			"report:create",
			"report:read",
			"report:update",
			"report:delete",
			"report:export",
			"asset:create",
			"asset:read",
			"asset:update",
			"asset:delete",
		];
	}

	return permissions;
}

/**
 * 检查用户是否有权限
 */
export function hasPermission(userPermissions: PermissionCode[], requiredPermission: PermissionCode): boolean {
	// 超级管理员权限通配符
	if (userPermissions.includes("*")) {
		return true;
	}

	return userPermissions.includes(requiredPermission);
}

/**
 * 检查用户是否有任意一个权限
 */
export function hasAnyPermission(userPermissions: PermissionCode[], requiredPermissions: PermissionCode[]): boolean {
	return requiredPermissions.some((perm) => hasPermission(userPermissions, perm));
}

/**
 * 权限验证中间件
 * @param customRoutePermissions 自定义路由权限配置
 */
export function createPermissionMiddleware(customRoutePermissions?: RoutePermissionConfig[]) {
	const routePermissions = customRoutePermissions || defaultRoutePermissions;

	return (event: H3Event) => {
		// 获取用户上下文
		const user = event.context.user as UserContext | undefined;

		// 如果没有用户信息，跳过权限验证
		if (!user) {
			return;
		}

		// 获取用户角色
		const userRole = user.role || "user";

		// 超级管理员跳过权限验证
		if (userRole === "super_admin") {
			return;
		}

		// 获取用户权限列表
		const userPermissions = getUserPermissions(userRole);

		// 获取请求方法和路径
		const method = event.method;
		const path = event.path;

		// 查找匹配的路由权限配置
		for (const config of routePermissions) {
			const pattern = config.pattern;
			const matches = typeof pattern === "string" ? path.startsWith(pattern) : pattern.test(path);

			if (!matches) {
				continue;
			}

			// 检查HTTP方法是否匹配
			if (config.methods && !config.methods.includes(method)) {
				continue;
			}

			// 检查权限
			if (!hasAnyPermission(userPermissions, config.requiredPermissions)) {
				throw createError({
					statusCode: 403,
					message: "您没有权限执行此操作",
					data: {
						required: config.requiredPermissions,
						has: userPermissions,
					},
				});
			}
		}
	};
}

/**
 * 验证特定权限
 */
export function validatePermission(event: H3Event, requiredPermission: PermissionCode): void {
	const user = event.context.user as UserContext | undefined;

	if (!user) {
		throw createError({
			statusCode: 401,
			message: "未登录",
		});
	}

	const userRole = user.role || "user";
	const userPermissions = getUserPermissions(userRole);

	if (!hasPermission(userPermissions, requiredPermission)) {
		throw createError({
			statusCode: 403,
			message: `需要权限: ${requiredPermission}`,
		});
	}
}
