import type { RolePermission } from "@01s-11comm/type";

/**
 * 模拟角色权限数据
 */
export const mockRolePermissionData: RolePermission[] = [
	{
		id: "1",
		name: "系统管理员",
		code: "ADMIN",
		description: "拥有系统所有权限",
		enabled: true,
	},
	{
		id: "2",
		name: "物业经理",
		code: "PROPERTY_MANAGER",
		description: "物业管理相关权限",
		enabled: true,
	},
	{
		id: "3",
		name: "客服专员",
		code: "CUSTOMER_SERVICE",
		description: "客户服务相关权限",
		enabled: true,
	},
	{
		id: "4",
		name: "财务人员",
		code: "FINANCE",
		description: "财务相关权限",
		enabled: true,
	},
	{
		id: "5",
		name: "安保人员",
		code: "SECURITY",
		description: "安保相关权限",
		enabled: true,
	},
];
