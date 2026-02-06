import {
	smOrganizations,
	smStaff,
	smRoles,
	smDataPermissions,
	smShifts,
	smSchedulingSettings,
	smWorkingSchedules,
	smSystemConfigs,
	smRegisterProtocols,
	smInitializeCells,
	InsertSmOrganization,
	InsertSmRole,
	InsertSmStaff,
	InsertSmDataPermission,
	InsertSmShift,
	InsertSmSchedulingSetting,
	InsertSmWorkingSchedule,
	InsertSmSystemConfig,
	InsertSmRegisterProtocol,
	InsertSmInitializeCell,
} from "../schemas/setting";
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
import { db } from "../index";
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
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		if (node.children && node.children.length > 0) {
			processOrgTree(node.children, idMap, flattenedList);
		}
	}
}

/**
 * 生成设置管理模块的 SQL
 */
export function generateSettingSql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 sm_organizations (组织架构)
	// ==========================================
	console.log("正在生成 sm_organizations SQL...");
	const orgRecords: InsertSmOrganization[] = [];
	processOrgTree(mockOrganizationTreeData, idMap, orgRecords);

	if (orgRecords.length > 0) {
		const query = db.insert(smOrganizations).values(orgRecords).toSQL();
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
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	});

	if (roleRecords.length > 0) {
		const query = db.insert(smRoles).values(roleRecords).toSQL();
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
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	});

	if (staffRecords.length > 0) {
		const query = db.insert(smStaff).values(staffRecords).toSQL();
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
	const dataPermRecords: InsertSmDataPermission[] = mockDataPermissionData.map((item) => {
		const id = idMap.register("sm_data_permissions", item.id);
		return {
			id: id,
			roleId: item.roleId ? idMap.get("sm_roles", item.roleId) : null,
			permissionRule: null, // Default
			scope: item.dataScope ?? null, // Map dataScope to scope
			dataFilter: null, // Default
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (dataPermRecords.length > 0) {
		const query = db.insert(smDataPermissions).values(dataPermRecords).toSQL();
		statements.push({
			table: "sm_data_permissions",
			sql: toFullSql(query.sql, query.params),
			recordCount: dataPermRecords.length,
		});
		console.log(`✅ 已生成 sm_data_permissions SQL，共 ${dataPermRecords.length} 条记录`);
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
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (shiftRecords.length > 0) {
		const query = db.insert(smShifts).values(shiftRecords).toSQL();
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
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (schedulingRecords.length > 0) {
		const query = db.insert(smSchedulingSettings).values(schedulingRecords).toSQL();
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
		const query = db.insert(smWorkingSchedules).values(workingRecords).toSQL();
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
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (configRecords.length > 0) {
		const query = db.insert(smSystemConfigs).values(configRecords).toSQL();
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
		const query = db.insert(smRegisterProtocols).values(protocolRecords).toSQL();
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
		const id = idMap.register("sm_initialize_cells", item.id ?? item.communityId);
		return {
			id: id,
			initItem: item.communityName ?? item.nearbyLandmark ?? "默认初始化项",
			initStatus: "completed",
			configParams: {
				communityId: item.communityId,
				cellName: item.cellName ?? item.nearbyLandmark,
				code: item.code ?? item.communityId,
				remark: item.remark ?? item.cityCode,
			},
		};
	});

	if (cellRecords.length > 0) {
		const query = db.insert(smInitializeCells).values(cellRecords).toSQL();
		statements.push({
			table: "sm_initialize_cells",
			sql: toFullSql(query.sql, query.params),
			recordCount: cellRecords.length,
		});
		console.log(`✅ 已生成 sm_initialize_cells SQL，共 ${cellRecords.length} 条记录`);
	}

	return statements;
}
