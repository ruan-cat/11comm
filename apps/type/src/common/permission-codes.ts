/**
 * @file API 权限码定义
 * @description 定义所有业务模块的权限码，采用 module:action 格式
 * @module permission
 */

/**
 * 权限码命名规范：module:action
 * - module: 业务模块名称（英文）
 * - action: 操作类型（create|read|update|delete|approve|export|import）
 */

/**
 * 权限模块枚举
 */
export enum PermissionModule {
	// 系统管理
	SYSTEM = "system",
	USER = "user",
	ROLE = "role",
	MENU = "menu",

	// 组织管理
	ORGANIZATION = "organization",
	STAFF = "staff",

	// 社区管理
	COMMUNITY = "community",

	// 房产管理
	HOUSE = "house",
	OWNER = "owner",
	VEHICLE = "vehicle",

	// 费用管理
	EXPENSE = "expense",
	CHARGE = "charge",
	DISCOUNT = "discount",
	REFUND = "refund",

	// 停车管理
	PARKING = "parking",

	// 报修管理
	REPAIR = "repair",

	// 巡检管理
	PATROL = "patrol",

	// 合同管理
	CONTRACT = "contract",

	// 通知公告
	NOTICE = "notice",

	// 报表
	REPORT = "report",

	// 资产
	ASSET = "asset",
}

/**
 * 权限操作枚举
 */
export enum PermissionAction {
	CREATE = "create",
	READ = "read",
	UPDATE = "update",
	DELETE = "delete",
	APPROVE = "approve",
	EXPORT = "export",
	IMPORT = "import",
	MANAGE = "manage",
}

/**
 * 完整权限码类型
 */
export type PermissionCode = `${PermissionModule}:${PermissionAction}`;

/**
 * 系统管理权限码
 */
export const systemPermissions: PermissionCode[] = ["system:read", "system:update", "system:manage"];

/**
 * 用户管理权限码
 */
export const userPermissions: PermissionCode[] = ["user:create", "user:read", "user:update", "user:delete"];

/**
 * 角色管理权限码
 */
export const rolePermissions: PermissionCode[] = [
	"role:create",
	"role:read",
	"role:update",
	"role:delete",
	"role:manage",
];

/**
 * 菜单管理权限码
 */
export const menuPermissions: PermissionCode[] = ["menu:create", "menu:read", "menu:update", "menu:delete"];

/**
 * 组织管理权限码
 */
export const organizationPermissions: PermissionCode[] = [
	"organization:create",
	"organization:read",
	"organization:update",
	"organization:delete",
];

/**
 * 员工管理权限码
 */
export const staffPermissions: PermissionCode[] = ["staff:create", "staff:read", "staff:update", "staff:delete"];

/**
 * 社区管理权限码
 */
export const communityPermissions: PermissionCode[] = [
	"community:create",
	"community:read",
	"community:update",
	"community:delete",
];

/**
 * 房产管理权限码
 */
export const housePermissions: PermissionCode[] = ["house:create", "house:read", "house:update", "house:delete"];

/**
 * 业主管理权限码
 */
export const ownerPermissions: PermissionCode[] = ["owner:create", "owner:read", "owner:update", "owner:delete"];

/**
 * 车辆管理权限码
 */
export const vehiclePermissions: PermissionCode[] = [
	"vehicle:create",
	"vehicle:read",
	"vehicle:update",
	"vehicle:delete",
];

/**
 * 费用管理权限码
 */
export const expensePermissions: PermissionCode[] = [
	"expense:create",
	"expense:read",
	"expense:update",
	"expense:delete",
	"expense:approve",
	"expense:export",
];

/**
 * 收费管理权限码
 */
export const chargePermissions: PermissionCode[] = [
	"charge:create",
	"charge:read",
	"charge:update",
	"charge:delete",
	"charge:approve",
	"charge:export",
];

/**
 * 优惠管理权限码
 */
export const discountPermissions: PermissionCode[] = [
	"discount:create",
	"discount:read",
	"discount:update",
	"discount:delete",
	"discount:approve",
];

/**
 * 退款管理权限码
 */
export const refundPermissions: PermissionCode[] = [
	"refund:create",
	"refund:read",
	"refund:update",
	"refund:delete",
	"refund:approve",
];

/**
 * 停车管理权限码
 */
export const parkingPermissions: PermissionCode[] = [
	"parking:create",
	"parking:read",
	"parking:update",
	"parking:delete",
];

/**
 * 报修管理权限码
 */
export const repairPermissions: PermissionCode[] = [
	"repair:create",
	"repair:read",
	"repair:update",
	"repair:delete",
	"repair:approve",
];

/**
 * 巡检管理权限码
 */
export const patrolPermissions: PermissionCode[] = ["patrol:create", "patrol:read", "patrol:update", "patrol:delete"];

/**
 * 合同管理权限码
 */
export const contractPermissions: PermissionCode[] = [
	"contract:create",
	"contract:read",
	"contract:update",
	"contract:delete",
	"contract:approve",
];

/**
 * 通知公告权限码
 */
export const noticePermissions: PermissionCode[] = [
	"notice:create",
	"notice:read",
	"notice:update",
	"notice:delete",
	"notice:publish",
];

/**
 * 报表权限码
 */
export const reportPermissions: PermissionCode[] = [
	"report:create",
	"report:read",
	"report:update",
	"report:delete",
	"report:export",
];

/**
 * 资产管理权限码
 */
export const assetPermissions: PermissionCode[] = ["asset:create", "asset:read", "asset:update", "asset:delete"];

/**
 * 所有权限码汇总
 */
export const allPermissions: PermissionCode[] = [
	...systemPermissions,
	...userPermissions,
	...rolePermissions,
	...menuPermissions,
	...organizationPermissions,
	...staffPermissions,
	...communityPermissions,
	...housePermissions,
	...ownerPermissions,
	...vehiclePermissions,
	...expensePermissions,
	...chargePermissions,
	...discountPermissions,
	...refundPermissions,
	...parkingPermissions,
	...repairPermissions,
	...patrolPermissions,
	...contractPermissions,
	...noticePermissions,
	...reportPermissions,
	...assetPermissions,
];

/**
 * 检查权限码是否有效
 */
export function isValidPermissionCode(code: string): code is PermissionCode {
	return allPermissions.includes(code as PermissionCode);
}

/**
 * 解析权限码为模块和操作
 */
export function parsePermissionCode(code: string): { module: string; action: string } | null {
	const parts = code.split(":");
	if (parts.length !== 2) return null;

	const [module, action] = parts;
	if (!Object.values(PermissionModule).includes(module as PermissionModule)) return null;
	if (!Object.values(PermissionAction).includes(action as PermissionAction)) return null;

	return { module, action };
}

/**
 * 角色权限配置
 */
export const rolePermissionMap: Record<string, PermissionCode[]> = {
	// 超级管理员 - 拥有所有权限
	super_admin: allPermissions,

	// 组织管理员
	org_admin: [
		...communityPermissions,
		...staffPermissions,
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

	// 小区管理员
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

	// 物业员工
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

	// 业主/住户
	owner: [
		"house:read",
		"expense:read",
		"expense:create",
		"repair:create",
		"repair:read",
		"parking:read",
		"notice:read",
	],
};
