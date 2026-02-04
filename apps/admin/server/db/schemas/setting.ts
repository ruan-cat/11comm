/**
 * @file 设置管理模块 Schema
 * @description 定义设置管理相关的表结构，前缀 sm_
 */

import {
	index,
	integer,
	pgTable,
	text,
	time,
	date,
	boolean,
	uniqueIndex,
	jsonb,
	varchar,
	uuid,
} from "drizzle-orm/pg-core";
import { primaryId, timestamps, remarkField, statusEnum, genderEnum } from "./common";

/** 组织架构表 */
export const smOrganizations = pgTable(
	"sm_organizations",
	{
		id: primaryId(),
		/** 组织名称 */
		orgName: varchar("org_name", { length: 100 }).notNull(),
		/** 组织编码 */
		orgCode: varchar("org_code", { length: 50 }).notNull(),
		/** 组织类型 */
		orgType: varchar("org_type", { length: 50 }),
		/** 排序号 */
		sortOrder: integer("sort_order").default(0),
		/** 父级组织 ID（自引用） */
		parentId: uuid("parent_id"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("sm_organizations_org_name_idx").on(table.orgName),
		index("sm_organizations_org_code_idx").on(table.orgCode),
		index("sm_organizations_parent_id_idx").on(table.parentId),
	],
);

/** 员工信息表 */
export const smStaff = pgTable(
	"sm_staff",
	{
		id: primaryId(),
		/** 关联组织 ID */
		orgId: uuid("org_id").references(() => smOrganizations.id),
		/** 员工编号 */
		employeeNumber: varchar("employee_number", { length: 50 }).notNull(),
		/** 姓名 */
		name: varchar("name", { length: 50 }).notNull(),
		/** 性别 */
		gender: genderEnum("gender"),
		/** 职位 */
		position: varchar("position", { length: 50 }),
		/** 邮箱 */
		email: varchar("email", { length: 100 }),
		/** 手机号 */
		phone: varchar("phone", { length: 20 }),
		/** 家庭住址 */
		homeAddress: text("home_address"),
		/** 头像 URL */
		avatarUrl: text("avatar_url"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("sm_staff_employee_number_idx").on(table.employeeNumber),
		index("sm_staff_name_idx").on(table.name),
		index("sm_staff_org_id_idx").on(table.orgId),
	],
);

/** 角色信息表 */
export const smRoles = pgTable(
	"sm_roles",
	{
		id: primaryId(),
		/** 角色名称 */
		roleName: varchar("role_name", { length: 100 }).notNull(),
		/** 角色编码 */
		code: varchar("code", { length: 50 }).notNull(),
		/** 角色描述 */
		description: text("description"),
		/** 是否启用 */
		isEnabled: boolean("is_enabled").default(true),
		...timestamps,
	},
	(table) => [uniqueIndex("sm_roles_code_idx").on(table.code), index("sm_roles_role_name_idx").on(table.roleName)],
);

/** 权限信息表 */
export const smPermissions = pgTable(
	"sm_permissions",
	{
		id: primaryId(),
		/** 权限名称 */
		permissionName: varchar("permission_name", { length: 100 }).notNull(),
		/** 权限编码 */
		permissionCode: varchar("permission_code", { length: 100 }).notNull(),
		/** 权限类型 */
		permissionType: varchar("permission_type", { length: 50 }),
		/** 资源路径 */
		resourcePath: text("resource_path"),
		...timestamps,
	},
	(table) => [
		index("sm_permissions_permission_code_idx").on(table.permissionCode),
		index("sm_permissions_permission_type_idx").on(table.permissionType),
	],
);

/** 角色权限关联表 */
export const smRolePermissions = pgTable(
	"sm_role_permissions",
	{
		id: primaryId(),
		/** 关联角色 ID */
		roleId: uuid("role_id")
			.references(() => smRoles.id)
			.notNull(),
		/** 关联权限 ID */
		permissionId: uuid("permission_id")
			.references(() => smPermissions.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("sm_role_permissions_role_id_idx").on(table.roleId),
		index("sm_role_permissions_permission_id_idx").on(table.permissionId),
	],
);

/** 员工角色关联表 */
export const smStaffRoles = pgTable(
	"sm_staff_roles",
	{
		id: primaryId(),
		/** 关联员工 ID */
		staffId: uuid("staff_id")
			.references(() => smStaff.id)
			.notNull(),
		/** 关联角色 ID */
		roleId: uuid("role_id")
			.references(() => smRoles.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("sm_staff_roles_staff_id_idx").on(table.staffId),
		index("sm_staff_roles_role_id_idx").on(table.roleId),
	],
);

/** 数据权限表 */
export const smDataPermissions = pgTable(
	"sm_data_permissions",
	{
		id: primaryId(),
		/** 关联角色 ID */
		roleId: uuid("role_id")
			.references(() => smRoles.id)
			.notNull(),
		/** 权限规则 */
		permissionRule: text("permission_rule"),
		/** 权限范围 */
		scope: varchar("scope", { length: 50 }),
		/** 数据过滤条件 */
		dataFilter: jsonb("data_filter"),
		...timestamps,
	},
	(table) => [index("sm_data_permissions_role_id_idx").on(table.roleId)],
);

/** 班次设置表 */
export const smShifts = pgTable("sm_shifts", {
	id: primaryId(),
	/** 班次名称 */
	shiftName: varchar("shift_name", { length: 100 }).notNull(),
	/** 开始时间 */
	startTime: time("start_time"),
	/** 结束时间 */
	endTime: time("end_time"),
	/** 工作时长（分钟） */
	workDuration: integer("work_duration"),
	...timestamps,
});

/** 排班设置表 */
export const smSchedulingSettings = pgTable("sm_scheduling_settings", {
	id: primaryId(),
	/** 排班模式 */
	schedulingMode: varchar("scheduling_mode", { length: 50 }),
	/** 适用职位 */
	applicablePosition: varchar("applicable_position", { length: 100 }),
	/** 轮换周期 */
	rotationCycle: varchar("rotation_cycle", { length: 50 }),
	...timestamps,
});

/** 工作排班表 */
export const smWorkingSchedules = pgTable(
	"sm_working_schedules",
	{
		id: primaryId(),
		/** 关联员工 ID */
		staffId: uuid("staff_id")
			.references(() => smStaff.id)
			.notNull(),
		/** 关联班次 ID */
		shiftId: uuid("shift_id")
			.references(() => smShifts.id)
			.notNull(),
		/** 排班日期 */
		scheduleDate: date("schedule_date").notNull(),
		...timestamps,
	},
	(table) => [
		index("sm_working_schedules_staff_id_idx").on(table.staffId),
		index("sm_working_schedules_shift_id_idx").on(table.shiftId),
		index("sm_working_schedules_schedule_date_idx").on(table.scheduleDate),
	],
);

/** 系统配置表 */
export const smSystemConfigs = pgTable(
	"sm_system_configs",
	{
		id: primaryId(),
		/** 配置键 */
		configKey: varchar("config_key", { length: 100 }).notNull(),
		/** 配置值 */
		configValue: text("config_value"),
		/** 配置类型 */
		configType: varchar("config_type", { length: 50 }),
		/** 配置描述 */
		configDescription: text("config_description"),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		...timestamps,
	},
	(table) => [
		uniqueIndex("sm_system_configs_config_key_idx").on(table.configKey),
		index("sm_system_configs_config_type_idx").on(table.configType),
	],
);

/** 注册协议表 */
export const smRegisterProtocols = pgTable(
	"sm_register_protocols",
	{
		id: primaryId(),
		/** 协议类型 */
		protocolType: varchar("protocol_type", { length: 50 }),
		/** 协议标题 */
		protocolTitle: varchar("protocol_title", { length: 200 }).notNull(),
		/** 协议内容 */
		protocolContent: text("protocol_content"),
		/** 版本号 */
		version: varchar("version", { length: 20 }),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		...timestamps,
	},
	(table) => [
		index("sm_register_protocols_protocol_type_idx").on(table.protocolType),
		index("sm_register_protocols_status_idx").on(table.status),
	],
);

/** 小区初始化配置表 */
export const smInitializeCells = pgTable(
	"sm_initialize_cells",
	{
		id: primaryId(),
		/** 初始化项目 */
		initItem: varchar("init_item", { length: 100 }).notNull(),
		/** 初始化状态 */
		initStatus: varchar("init_status", { length: 50 }),
		/** 配置参数 */
		configParams: jsonb("config_params"),
		...timestamps,
	},
	(table) => [
		index("sm_initialize_cells_init_item_idx").on(table.initItem),
		index("sm_initialize_cells_init_status_idx").on(table.initStatus),
	],
);

export type InsertSmOrganization = typeof smOrganizations.$inferInsert;
export type InsertSmStaff = typeof smStaff.$inferInsert;
export type InsertSmRole = typeof smRoles.$inferInsert;
export type InsertSmPermission = typeof smPermissions.$inferInsert;
export type InsertSmRolePermission = typeof smRolePermissions.$inferInsert;
export type InsertSmStaffRole = typeof smStaffRoles.$inferInsert;
export type InsertSmDataPermission = typeof smDataPermissions.$inferInsert;
export type InsertSmShift = typeof smShifts.$inferInsert;
export type InsertSmSchedulingSetting = typeof smSchedulingSettings.$inferInsert;
export type InsertSmWorkingSchedule = typeof smWorkingSchedules.$inferInsert;
export type InsertSmSystemConfig = typeof smSystemConfigs.$inferInsert;
export type InsertSmRegisterProtocol = typeof smRegisterProtocols.$inferInsert;
export type InsertSmInitializeCell = typeof smInitializeCells.$inferInsert;
