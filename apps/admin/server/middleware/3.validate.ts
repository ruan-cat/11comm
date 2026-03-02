import { defineMiddleware, createError } from "nitro/h3";
import type { H3Event } from "nitro/h3";

/**
 * 路由权限验证中间件
 *
 * @description
 * 在 JWT 认证之后执行，验证用户是否有权限访问特定路由
 * 可选的权限验证，用于细粒度的访问控制
 */

/** 权限码映射表 */
const PERMISSION_MAP: Record<string, string[]> = {
	// 开发团队模块
	"GET /api/dev-team/config-manage/center": ["config:center:read"],
	"POST /api/dev-team/config-manage/center": ["config:center:create"],
	"PUT /api/dev-team/config-manage/center": ["config:center:update"],
	"DELETE /api/dev-team/config-manage/center": ["config:center:delete"],

	// 菜单管理
	"GET /api/dev-team/menu-manage": ["menu:read"],
	"POST /api/dev-team/menu-manage": ["menu:create"],
	"PUT /api/dev-team/menu-manage": ["menu:update"],
	"DELETE /api/dev-team/menu-manage": ["menu:delete"],

	// 组织管理
	"GET /api/setting-manage/organize-manage/staff-info": ["org:staff:read"],
	"POST /api/setting-manage/organize-manage/staff-info": ["org:staff:create"],
	"PUT /api/setting-manage/organize-manage/staff-info": ["org:staff:update"],
	"DELETE /api/setting-manage/organize-manage/staff-info": ["org:staff:delete"],

	// 角色权限
	"GET /api/setting-manage/organize-manage/role-permission": ["role:read"],
	"POST /api/setting-manage/organize-manage/role-permission": ["role:create"],
	"PUT /api/setting-manage/organize-manage/role-permission": ["role:update"],
	"DELETE /api/setting-manage/organize-manage/role-permission": ["role:delete"],

	// 物业模块 - 社区管理
	"GET /api/property-manage/community-manage": ["community:read"],
	"POST /api/property-manage/community-manage": ["community:create"],
	"PUT /api/property-manage/community-manage": ["community:update"],
	"DELETE /api/property-manage/community-manage": ["community:delete"],

	// 物业模块 - 房产管理
	"GET /api/property-manage/house-property-manage/house": ["house:read"],
	"POST /api/property-manage/house-property-manage/house": ["house:create"],
	"PUT /api/property-manage/house-property-manage/house": ["house:update"],
	"DELETE /api/property-manage/house-property-manage/house": ["house:delete"],

	// 物业模块 - 费用管理
	"GET /api/property-manage/expense-manage": ["expense:read"],
	"POST /api/property-manage/expense-manage": ["expense:create"],
	"PUT /api/property-manage/expense-manage": ["expense:update"],
	"DELETE /api/property-manage/expense-manage": ["expense:delete"],

	// 物业模块 - 报修管理
	"GET /api/property-manage/repairs-manage": ["repair:read"],
	"POST /api/property-manage/repairs-manage": ["repair:create"],
	"PUT /api/property-manage/repairs-manage": ["repair:update"],
	"DELETE /api/property-manage/repairs-manage": ["repair:delete"],

	// 物业模块 - 巡检管理
	"GET /api/property-manage/patrol-manage": ["patrol:read"],
	"POST /api/property-manage/patrol-manage": ["patrol:create"],
	"PUT /api/property-manage/patrol-manage": ["patrol:update"],
	"DELETE /api/property-manage/patrol-manage": ["patrol:delete"],

	// 物业模块 - 停车管理
	"GET /api/property-manage/parking-manage": ["parking:read"],
	"POST /api/property-manage/parking-manage": ["parking:create"],
	"PUT /api/property-manage/parking-manage": ["parking:update"],
	"DELETE /api/property-manage/parking-manage": ["parking:delete"],

	// 物业模块 - 合同管理
	"GET /api/property-manage/contract-manage": ["contract:read"],
	"POST /api/property-manage/contract-manage": ["contract:create"],
	"PUT /api/property-manage/contract-manage": ["contract:update"],
	"DELETE /api/property-manage/contract-manage": ["contract:delete"],

	// 运营团队模块
	"GET /api/operation-team": ["operation:read"],
	"POST /api/operation-team": ["operation:create"],
	"PUT /api/operation-team": ["operation:update"],
	"DELETE /api/operation-team": ["operation:delete"],
};

/**
 * 检查用户是否有权限访问路由
 */
function hasPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
	if (!requiredPermissions || requiredPermissions.length === 0) {
		return true;
	}

	if (!userPermissions || userPermissions.length === 0) {
		return false;
	}

	/** 超级管理员拥有所有权限 */
	if (userPermissions.includes("*")) {
		return true;
	}

	/** 检查用户权限是否包含所需权限 */
	return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * 获取路由所需的权限
 */
function getRequiredPermissions(method: string, path: string): string[] | null {
	const key = `${method} ${path}`;
	return PERMISSION_MAP[key] || null;
}

export default defineMiddleware(async (event: H3Event) => {
	/** 如果用户未认证，跳过权限验证 */
	if (!event.context.authenticated) {
		return;
	}

	/** 获取用户权限 */
	const userPermissions = (event.context.user as any)?.permissions || [];

	/** 获取路由所需的权限 */
	const method = event.method;
	const path = event.path;
	const requiredPermissions = getRequiredPermissions(method, path);

	/** 如果路由不需要权限，跳过验证 */
	if (!requiredPermissions) {
		return;
	}

	/** 验证权限 */
	if (!hasPermission(userPermissions as string[], requiredPermissions)) {
		throw createError({
			statusCode: 403,
			message: "您没有权限执行此操作",
			data: null,
		});
	}
});
