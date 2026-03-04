import {
	smOrganizations,
	smStaff,
	smRoles,
	smPermissions,
	smRolePermissions,
	smStaffRoles,
	smDataPermissions,
	smShifts,
	smSchedulingSettings,
	smWorkingSchedules,
	smSystemConfigs,
	smRegisterProtocols,
	smInitializeCells,
	type NewSmOrganization as InsertSmOrganization,
	type NewSmRole as InsertSmRole,
	type NewSmStaff as InsertSmStaff,
	type NewSmPermission as InsertSmPermission,
	type NewSmRolePermission as InsertSmRolePermission,
	type NewSmStaffRole as InsertSmStaffRole,
	type NewSmDataPermission as InsertSmDataPermission,
	type NewSmShift as InsertSmShift,
	type NewSmSchedulingSetting as InsertSmSchedulingSetting,
	type NewSmWorkingSchedule as InsertSmWorkingSchedule,
	type NewSmSystemConfig as InsertSmSystemConfig,
	type NewSmRegisterProtocol as InsertSmRegisterProtocol,
	type NewSmInitializeCell as InsertSmInitializeCell,
} from "@01s-11comm/type";
import {
	mockOrganizationTreeData,
	mockEmployeeData,
} from "../../api/setting-manage/organize-manage/org-info/mock-data";
import { mockRolePermissionData } from "../../api/setting-manage/organize-manage/role-permission/mock-data";
import { mockDataPermissionData } from "../../api/setting-manage/organize-manage/data-permission/mock-data";
import { mockShiftSettingData } from "../../api/setting-manage/organize-manage/shift-setting/mock-data";
import { mockSchedulingSettingData } from "../../api/setting-manage/organize-manage/scheduling-setting/mock-data";
import { mockWorkingScheduleData } from "../../api/setting-manage/organize-manage/working-schedule/mock-data";
import { mockSystemConfigData } from "../../api/setting-manage/system-manage/system-config/mock-data";
import { mockRegisterProtocolData } from "../../api/setting-manage/system-manage/register-protocol/mock-data";
import { mockInitializeCommunityData } from "../../api/setting-manage/system-manage/initialize-cell/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, generateUuid } from "./index";
import { getDb } from "../index";
import { OrganizationTreeNode } from "@01s-11comm/type";

/**
 * 递归处理组织树，生成扁平化的记录列表
 */
function processOrgTree(nodes: OrganizationTreeNode[], idMap: IdMapRegistry, flattenedList: any[] = []) {
	for (const node of nodes) {
		const uuid = idMap.register("sm_organizations", node.id);

		let parentUuid = null;
		if (node.parentId) {
			parentUuid = idMap.get("sm_organizations", node.parentId);
			if (!parentUuid) {
				parentUuid = generateUuid("sm_organizations", node.parentId);
			}
		}

		flattenedList.push({
			id: uuid,
			orgName: node.name,
			orgCode: node.id,
			orgType: "department",
			parentId: parentUuid,
			createTime: new Date(),
			updateTime: new Date(),
		});

		if (node.children && node.children.length > 0) {
			processOrgTree(node.children, idMap, flattenedList);
		}
	}
}

/**
 * 生成设置管理模块的 SQL
 */
export async function generateSettingSql(idMap: IdMapRegistry): Promise<SqlStatement[]> {
	const db = await getDb();
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 sm_organizations (组织架构)
	// ==========================================
	console.log("正在生成 sm_organizations SQL...");
	const orgRecords: InsertSmOrganization[] = [];
	processOrgTree(mockOrganizationTreeData, idMap, orgRecords);

	if (orgRecords.length > 0) {
		const query = db
			.insert(smOrganizations as any)
			.values(orgRecords)
			.toSQL();
		statements.push({
			table: "sm_organizations",
			sql: toFullSql(query.sql, query.params),
			recordCount: orgRecords.length,
		});
		console.log(`✅ 已生成 sm_organizations SQL，共 ${orgRecords.length} 条记录`);
	}

	// ==========================================
	// 2. 生成 sm_roles (角色)
	// ==========================================
	console.log("正在生成 sm_roles SQL...");
	const roleRecords: InsertSmRole[] = mockRolePermissionData.map((item) => {
		const id = idMap.register("sm_roles", item.id);
		return {
			id: id,
			roleName: item.name,
			code: item.code,
			description: item.description,
			isEnabled: item.enabled,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (roleRecords.length > 0) {
		const query = db
			.insert(smRoles as any)
			.values(roleRecords)
			.toSQL();
		statements.push({
			table: "sm_roles",
			sql: toFullSql(query.sql, query.params),
			recordCount: roleRecords.length,
		});
		console.log(`✅ 已生成 sm_roles SQL，共 ${roleRecords.length} 条记录`);
	}

	// ==========================================
	// 3. 生成 sm_staff (员工)
	// ==========================================
	console.log("正在生成 sm_staff SQL...");
	const staffRecords: InsertSmStaff[] = mockEmployeeData.map((item) => {
		const id = idMap.register("sm_staff", item.id);
		const orgUuid = idMap.get("sm_organizations", item.orgId);

		// Default gender mapping just in case
		let genderVal: "male" | "female" | null = null;
		if (item.gender === "男" || item.gender === "male") genderVal = "male";
		if (item.gender === "女" || item.gender === "female") genderVal = "female";

		return {
			id: id,
			orgId: orgUuid,
			employeeNumber: item.id,
			name: item.name,
			gender: genderVal,
			position: item.position,
			email: item.email,
			phone: item.phone,
			homeAddress: item.address,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (staffRecords.length > 0) {
		const query = db
			.insert(smStaff as any)
			.values(staffRecords)
			.toSQL();
		statements.push({
			table: "sm_staff",
			sql: toFullSql(query.sql, query.params),
			recordCount: staffRecords.length,
		});
		console.log(`✅ 已生成 sm_staff SQL，共 ${staffRecords.length} 条记录`);
	}

	// ==========================================
	// 4. 生成 sm_data_permissions (数据权限)
	// ==========================================
	console.log("正在生成 sm_data_permissions SQL...");
	const dataPermRecords: InsertSmDataPermission[] = mockDataPermissionData
		.map((item, index) => {
			const id = idMap.register("sm_data_permissions", item.id);

			// 尝试将数据权限关联到角色
			// Mock数据没有roleId字段，逻辑上假设 DataPermission "1" -> Role "1"
			// Fallback: 如果没有对应ID的角色，默认关联到第一个角色 (ID "1", 系统管理员)
			let roleId = idMap.get("sm_roles", item.id);
			if (!roleId) {
				roleId = idMap.get("sm_roles", "1");
			}

			if (!roleId) {
				// 如果连系统管理员都找不到（极少见），跳过
				return null;
			}

			return {
				id: id,
				roleId: roleId,
				permissionRule: null, // item.rule // Mock lacking fields
				scope: "all", // default
				dataFilter: null,
				createTime: new Date(),
				updateTime: new Date(),
			};
		})
		.filter((x) => x !== null) as InsertSmDataPermission[];

	if (dataPermRecords.length > 0) {
		const query = db
			.insert(smDataPermissions as any)
			.values(dataPermRecords)
			.toSQL();
		statements.push({
			table: "sm_data_permissions",
			sql: toFullSql(query.sql, query.params),
			recordCount: dataPermRecords.length,
		});
		console.log(`✅ 已生成 sm_data_permissions SQL，共 ${dataPermRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 sm_permissions (权限)
	// ==========================================
	console.log("正在生成 sm_permissions SQL...");
	const permissionList = [
		{ name: "系统管理", code: "system", type: "menu" },
		{ name: "用户管理", code: "system:user", type: "menu" },
		{ name: "角色管理", code: "system:role", type: "menu" },
		{ name: "权限管理", code: "system:permission", type: "menu" },
		{ name: "社区管理", code: "community", type: "menu" },
		{ name: "房产管理", code: "property", type: "menu" },
		{ name: "费用管理", code: "expense", type: "menu" },
		{ name: "停车管理", code: "parking", type: "menu" },
		{ name: "巡检管理", code: "patrol", type: "menu" },
		{ name: "报修管理", code: "repairs", type: "menu" },
		{ name: "合同管理", code: "contract", type: "menu" },
		{ name: "报表管理", code: "report", type: "menu" },
		{ name: "运营管理", code: "operation", type: "menu" },
		{ name: "数据配置", code: "data:config", type: "button" },
		{ name: "数据新增", code: "data:create", type: "button" },
		{ name: "数据编辑", code: "data:edit", type: "button" },
		{ name: "数据删除", code: "data:delete", type: "button" },
		{ name: "数据查看", code: "data:view", type: "button" },
		{ name: "导出数据", code: "data:export", type: "button" },
		{ name: "导入数据", code: "data:import", type: "button" },
	];
	const permissionRecords: InsertSmPermission[] = permissionList.map((item) => {
		const id = idMap.register("sm_permissions", item.code);
		return {
			id,
			permissionName: item.name,
			permissionCode: item.code,
			permissionType: item.type,
			resourcePath: `/${item.code.replace(/:/g, "/")}`,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (permissionRecords.length > 0) {
		const query = db
			.insert(smPermissions as any)
			.values(permissionRecords)
			.toSQL();
		statements.push({
			table: "sm_permissions",
			sql: toFullSql(query.sql, query.params),
			recordCount: permissionRecords.length,
		});
		console.log(`✅ 已生成 sm_permissions SQL，共 ${permissionRecords.length} 条记录`);
	}

	// ==========================================
	// 6. 生成 sm_role_permissions (角色权限关联)
	// ==========================================
	console.log("正在生成 sm_role_permissions SQL...");
	// 获取所有角色ID
	const roleIds = Array.from(
		new Set([
			...(mockRolePermissionData || []).map((r) => idMap.get("sm_roles", r.id)).filter(Boolean),
			idMap.get("sm_roles", "1"),
		]),
	).filter(Boolean) as string[];

	// 获取权限ID列表
	const permissionCodes = permissionList.map((p) => p.code);
	const permissionIds = permissionCodes.map((code) => idMap.get("sm_permissions", code)).filter(Boolean) as string[];

	const rolePermissionRecords: any[] = [];
	// 为每个角色分配权限
	roleIds.forEach((roleId) => {
		permissionIds.forEach((permissionId) => {
			rolePermissionRecords.push({
				id: idMap.register("sm_role_permissions", `${roleId}-${permissionId}`),
				roleId,
				permissionId,
				createTime: new Date(),
				updateTime: new Date(),
			});
		});
	});

	if (rolePermissionRecords.length > 0) {
		const query = db
			.insert(smRolePermissions as any)
			.values(rolePermissionRecords)
			.toSQL();
		statements.push({
			table: "sm_role_permissions",
			sql: toFullSql(query.sql, query.params),
			recordCount: rolePermissionRecords.length,
		});
		console.log(`✅ 已生成 sm_role_permissions SQL，共 ${rolePermissionRecords.length} 条记录`);
	}

	// ==========================================
	// 7. 生成 sm_staff_roles (员工角色关联)
	// ==========================================
	console.log("正在生成 sm_staff_roles SQL...");
	const staffRoleRecords: any[] = [];

	// 为每个员工分配角色（第一个员工分配所有角色，其他员工分配普通角色）
	const staffIds = mockEmployeeData.map((e) => idMap.get("sm_staff", e.id)).filter(Boolean) as string[];

	staffIds.forEach((staffId, index) => {
		if (index === 0) {
			// 第一个员工（管理员）分配所有角色
			roleIds.forEach((roleId) => {
				staffRoleRecords.push({
					id: idMap.register("sm_staff_roles", `${staffId}-${roleId}`),
					staffId,
					roleId,
					createTime: new Date(),
					updateTime: new Date(),
				});
			});
		} else {
			// 其他员工分配普通角色
			const normalRoleId = idMap.get("sm_roles", "2"); // 假设 "2" 是普通角色
			if (normalRoleId) {
				staffRoleRecords.push({
					id: idMap.register("sm_staff_roles", `${staffId}-${normalRoleId}`),
					staffId,
					roleId: normalRoleId,
					createTime: new Date(),
					updateTime: new Date(),
				});
			}
		}
	});

	if (staffRoleRecords.length > 0) {
		const query = db
			.insert(smStaffRoles as any)
			.values(staffRoleRecords)
			.toSQL();
		statements.push({
			table: "sm_staff_roles",
			sql: toFullSql(query.sql, query.params),
			recordCount: staffRoleRecords.length,
		});
		console.log(`✅ 已生成 sm_staff_roles SQL，共 ${staffRoleRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 sm_shifts (班次)
	// ==========================================
	console.log("正在生成 sm_shifts SQL...");
	const shiftRecords: InsertSmShift[] = mockShiftSettingData.map((item) => {
		const id = idMap.register("sm_shifts", item.id);
		return {
			id: id,
			shiftName: item.shiftName ?? item.name,
			startTime: item.startTime,
			endTime: item.endTime,
			workDuration: null, // Default
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (shiftRecords.length > 0) {
		const query = db
			.insert(smShifts as any)
			.values(shiftRecords)
			.toSQL();
		statements.push({
			table: "sm_shifts",
			sql: toFullSql(query.sql, query.params),
			recordCount: shiftRecords.length,
		});
		console.log(`✅ 已生成 sm_shifts SQL，共 ${shiftRecords.length} 条记录`);
	}

	// ==========================================
	// 6. 生成 sm_scheduling_settings (排班规则)
	// ==========================================
	console.log("正在生成 sm_scheduling_settings SQL...");
	const schedulingRecords: InsertSmSchedulingSetting[] = mockSchedulingSettingData.map((item) => {
		const id = idMap.register("sm_scheduling_settings", item.id);
		// Link to orgId if available, otherwise null
		const orgUuid = item.orgId ? idMap.get("sm_organizations", item.orgId) : null;

		return {
			id: id,
			schedulingMode: null, // Default
			applicablePosition: null, // Default
			rotationCycle: null, // Default
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (schedulingRecords.length > 0) {
		const query = db
			.insert(smSchedulingSettings as any)
			.values(schedulingRecords)
			.toSQL();
		statements.push({
			table: "sm_scheduling_settings",
			sql: toFullSql(query.sql, query.params),
			recordCount: schedulingRecords.length,
		});
		console.log(`✅ 已生成 sm_scheduling_settings SQL，共 ${schedulingRecords.length} 条记录`);
	}

	// ==========================================
	// 7. 生成 sm_working_schedules (排班记录)
	// ==========================================
	console.log("正在生成 sm_working_schedules SQL...");
	const workingRecords: InsertSmWorkingSchedule[] = mockWorkingScheduleData
		.map((item) => {
			const id = idMap.register("sm_working_schedules", item.id);
			const staffIdVal = item.staffId ? idMap.get("sm_staff", item.staffId) : null;
			const shiftIdVal = item.shiftId ? idMap.get("sm_shifts", item.shiftId) : null;

			// staffId 和 shiftId 是必填字段，如果缺失则跳过
			if (!staffIdVal || !shiftIdVal) return null;

			return {
				id: id,
				staffId: staffIdVal,
				shiftId: shiftIdVal,
				scheduleDate: item.workDate ? String(item.workDate) : new Date().toISOString().split("T")[0],
			};
		})
		.filter((x) => x !== null) as InsertSmWorkingSchedule[];

	if (workingRecords.length > 0) {
		const query = db
			.insert(smWorkingSchedules as any)
			.values(workingRecords)
			.toSQL();
		statements.push({
			table: "sm_working_schedules",
			sql: toFullSql(query.sql, query.params),
			recordCount: workingRecords.length,
		});
		console.log(`✅ 已生成 sm_working_schedules SQL，共 ${workingRecords.length} 条记录`);
	}

	// ==========================================
	// 8. 生成 sm_system_configs (系统配置)
	// ==========================================
	console.log("正在生成 sm_system_configs SQL...");
	const configRecords: InsertSmSystemConfig[] = mockSystemConfigData.map((item) => {
		const id = idMap.register("sm_system_configs", item.id ?? item.configId);
		return {
			id: id,
			configKey: item.configKey ?? item.configId,
			configValue:
				item.configValue ??
				JSON.stringify({
					title: item.title,
					subtitle: item.subtitle,
					shortName: item.shortName,
					companyName: item.companyName,
					logoUrl: item.logoUrl,
					staticUrl: item.staticUrl,
					defaultCommunityCode: item.defaultCommunityCode,
					ownerTitle: item.ownerTitle,
					propertyMobileTitle: item.propertyMobileTitle,
					qqMapKey: item.qqMapKey,
					mallUrl: item.mallUrl,
				}),
			configType: null, // Default
			configDescription: item.description ?? item.title,
			status: "enabled",
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (configRecords.length > 0) {
		const query = db
			.insert(smSystemConfigs as any)
			.values(configRecords)
			.toSQL();
		statements.push({
			table: "sm_system_configs",
			sql: toFullSql(query.sql, query.params),
			recordCount: configRecords.length,
		});
		console.log(`✅ 已生成 sm_system_configs SQL，共 ${configRecords.length} 条记录`);
	}

	// ==========================================
	// 9. 生成 sm_register_protocols (注册协议)
	// ==========================================
	console.log("正在生成 sm_register_protocols SQL...");
	const protocolRecords: InsertSmRegisterProtocol[] = mockRegisterProtocolData.map((item) => {
		const id = idMap.register("sm_register_protocols", item.id);
		return {
			id: id,
			protocolType: null,
			protocolTitle: item.title,
			protocolContent: item.content,
			version: item.version,
		};
	});

	if (protocolRecords.length > 0) {
		const query = db
			.insert(smRegisterProtocols as any)
			.values(protocolRecords)
			.toSQL();
		statements.push({
			table: "sm_register_protocols",
			sql: toFullSql(query.sql, query.params),
			recordCount: protocolRecords.length,
		});
		console.log(`✅ 已生成 sm_register_protocols SQL，共 ${protocolRecords.length} 条记录`);
	}

	// ==========================================
	// 10. 生成 sm_initialize_cells (初始化单元)
	// ==========================================
	console.log("正在生成 sm_initialize_cells SQL...");
	const cellRecords: InsertSmInitializeCell[] = mockInitializeCommunityData.map((item) => {
		const id = idMap.register("sm_initialize_cells", item.id);
		return {
			id: id,
			initItem: item.initItem,
			initStatus: item.initStatus,
			configParams: item.configParams,
			createTime: item.createTime,
			updateTime: item.updateTime,
		};
	});

	if (cellRecords.length > 0) {
		const query = db
			.insert(smInitializeCells as any)
			.values(cellRecords)
			.toSQL();
		statements.push({
			table: "sm_initialize_cells",
			sql: toFullSql(query.sql, query.params),
			recordCount: cellRecords.length,
		});
		console.log(`✅ 已生成 sm_initialize_cells SQL，共 ${cellRecords.length} 条记录`);
	}

	return statements;
}
