import type { DataPermission, UnitAuth, StaffRelation } from "@01s-11comm/type";

/**
 * 模拟数据权限数据
 */
export const mockDataPermissionData: DataPermission[] = [
	{
		id: "1",
		name: "A级数据权限",
		description: "最高级别数据访问权限",
		level: 1,
		enabled: true,
	},
	{
		id: "2",
		name: "B级数据权限",
		description: "中级数据访问权限",
		level: 2,
		enabled: true,
	},
	{
		id: "3",
		name: "C级数据权限",
		description: "普通数据访问权限",
		level: 3,
		enabled: true,
	},
	{
		id: "4",
		name: "D级数据权限",
		description: "限制级数据访问权限",
		level: 4,
		enabled: false,
	},
];

/**
 * 模拟单元授权数据
 */
export const mockUnitAuthData: UnitAuth[] = [
	{
		id: "1",
		permissionId: "1",
		unitName: "1号楼",
		authType: "readWrite",
		createTime: "2024-01-01 00:00:00",
	},
	{
		id: "2",
		permissionId: "1",
		unitName: "2号楼",
		authType: "read",
		createTime: "2024-01-02 00:00:00",
	},
	{
		id: "3",
		permissionId: "2",
		unitName: "3号楼",
		authType: "write",
		createTime: "2024-01-03 00:00:00",
	},
	{
		id: "4",
		permissionId: "2",
		unitName: "4号楼",
		authType: "readWrite",
		createTime: "2024-01-04 00:00:00",
	},
];

/**
 * 模拟员工关联数据
 */
export const mockStaffRelationData: StaffRelation[] = [
	{
		id: "1",
		permissionId: "1",
		staffId: "101",
		staffName: "张三",
		relationType: "primary",
	},
	{
		id: "2",
		permissionId: "1",
		staffId: "102",
		staffName: "李四",
		relationType: "secondary",
	},
	{
		id: "3",
		permissionId: "2",
		staffId: "103",
		staffName: "王五",
		relationType: "primary",
	},
	{
		id: "4",
		permissionId: "3",
		staffId: "104",
		staffName: "赵六",
		relationType: "primary",
	},
];
