/**
 * @file 组织管理模块 Schema
 * @description 定义组织架构及排班相关的表结构，前缀 sm_
 * @module organize-manage
 */

import { index, integer, pgTable, text, time, date, boolean, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, remarkField } from "../../../common";
import { smStaff } from "../user-manage/schema";
// 注意：与 community-manage 的关联通过外键约束在迁移时配置，避免循环依赖

// ==========================================
// Part A: Database Table Definitions
// ==========================================

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
		/** 关联小区 ID（一个组织可以管理多个小区，通过外键约束关联 cm_communities） */
		communityId: uuid("community_id"),
		/** 组织层级（用于多级组织） */
		level: integer("level").default(1),
		/** 组织路径（如：/org1/org2 用于快速查询子组织） */
		orgPath: varchar("org_path", { length: 500 }),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("sm_organizations_org_name_idx").on(table.orgName),
		index("sm_organizations_org_code_idx").on(table.orgCode),
		index("sm_organizations_parent_id_idx").on(table.parentId),
		index("sm_organizations_community_id_idx").on(table.communityId),
		index("sm_organizations_org_path_idx").on(table.orgPath),
	],
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
		/** 名称 */
		name: varchar("name", { length: 100 }),
		/** 类型 */
		type: varchar("type", { length: 50 }),
		/** 开始时间 */
		startTime: time("start_time"),
		/** 结束时间 */
		endTime: time("end_time"),
		/** 星期几 */
		weekday: integer("weekday"),
		/** 负责人 */
		managerName: varchar("manager_name", { length: 50 }),
		/** 电话 */
		phone: varchar("phone", { length: 20 }),
		/** 是否启用 */
		enabled: boolean("enabled").default(true),
		/** 描述 */
		description: text("description"),
		/** 工作日期 */
		workDate: date("work_date"),
		/** 状态 */
		status: varchar("status", { length: 50 }),
		...timestamps,
	},
	(table) => [
		index("sm_working_schedules_staff_id_idx").on(table.staffId),
		index("sm_working_schedules_shift_id_idx").on(table.shiftId),
		index("sm_working_schedules_schedule_date_idx").on(table.scheduleDate),
	],
);

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- smOrganizations ---
export const insertSmOrganizationSchema = createInsertSchema(smOrganizations, {
	orgName: (schema) => schema.min(1, "组织名称不能为空").max(100),
	orgCode: (schema) => schema.min(1, "组织编码不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmOrganizationSchema = createSelectSchema(smOrganizations);

export const updateSmOrganizationSchema = z.object({
	id: z.string().uuid(),
	orgName: z.string().min(1, "组织名称不能为空").max(100).optional(),
	orgCode: z.string().min(1, "组织编码不能为空").max(50).optional(),
	orgType: z.string().max(50).optional().nullable(),
	sortOrder: z.number().int().optional(),
	parentId: z.string().uuid().optional().nullable(),
	communityId: z.string().uuid().optional().nullable(),
	level: z.number().int().optional(),
	orgPath: z.string().max(500).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- smShifts ---
export const insertSmShiftSchema = createInsertSchema(smShifts, {
	shiftName: (schema) => schema.min(1, "班次名称不能为空").max(100),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmShiftSchema = createSelectSchema(smShifts);

export const updateSmShiftSchema = z.object({
	id: z.string().uuid(),
	shiftName: z.string().min(1, "班次名称不能为空").max(100).optional(),
	startTime: z.string().optional().nullable(),
	endTime: z.string().optional().nullable(),
	workDuration: z.number().int().optional().nullable(),
});

// --- smSchedulingSettings ---
export const insertSmSchedulingSettingSchema = createInsertSchema(smSchedulingSettings).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmSchedulingSettingSchema = createSelectSchema(smSchedulingSettings);

export const updateSmSchedulingSettingSchema = z.object({
	id: z.string().uuid(),
	schedulingMode: z.string().max(50).optional().nullable(),
	applicablePosition: z.string().max(100).optional().nullable(),
	rotationCycle: z.string().max(50).optional().nullable(),
});

// --- smWorkingSchedules ---
export const insertSmWorkingScheduleSchema = createInsertSchema(smWorkingSchedules).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmWorkingScheduleSchema = createSelectSchema(smWorkingSchedules);

export const updateSmWorkingScheduleSchema = z.object({
	id: z.string().uuid(),
	staffId: z.string().uuid().optional(),
	shiftId: z.string().uuid().optional(),
	scheduleDate: z.string().optional(),
	name: z.string().max(100).optional().nullable(),
	type: z.string().max(50).optional().nullable(),
	startTime: z.string().optional().nullable(),
	endTime: z.string().optional().nullable(),
	weekday: z.number().int().optional().nullable(),
	managerName: z.string().max(50).optional().nullable(),
	phone: z.string().max(20).optional().nullable(),
	enabled: z.boolean().optional(),
	description: z.string().optional().nullable(),
	workDate: z.string().optional().nullable(),
	status: z.string().max(50).optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type SmOrganization = typeof smOrganizations.$inferSelect;
export type NewSmOrganization = typeof smOrganizations.$inferInsert;
export type UpdateSmOrganization = z.infer<typeof updateSmOrganizationSchema>;

export type SmShift = typeof smShifts.$inferSelect;
export type NewSmShift = typeof smShifts.$inferInsert;
export type UpdateSmShift = z.infer<typeof updateSmShiftSchema>;

export type SmSchedulingSetting = typeof smSchedulingSettings.$inferSelect;
export type NewSmSchedulingSetting = typeof smSchedulingSettings.$inferInsert;
export type UpdateSmSchedulingSetting = z.infer<typeof updateSmSchedulingSettingSchema>;

export type SmWorkingSchedule = typeof smWorkingSchedules.$inferSelect;
export type NewSmWorkingSchedule = typeof smWorkingSchedules.$inferInsert;
export type UpdateSmWorkingSchedule = z.infer<typeof updateSmWorkingScheduleSchema>;
