/**
 * @file 巡检管理模块 Schema
 * @description 定义巡检管理相关的表结构，前缀 pt_
 */

import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
	date,
	uuid,
} from "drizzle-orm/pg-core";
import { primaryId, timestamps, remarkField } from "./common";
import { cmCommunities } from "./community";

/** 巡检任务状态枚举 - 待执行/执行中/已完成/已逾期 */
export const patrolTaskStatusEnum = pgEnum("patrol_task_status", ["pending", "in_progress", "completed", "overdue"]);

/** 签到状态枚举 - 未签到/已签到/异常 */
export const checkInStatusEnum = pgEnum("check_in_status", ["not_checked", "checked", "abnormal"]);

/** 巡检计划表 */
export const ptPatrolPlans = pgTable(
	"pt_patrol_plans",
	{
		id: primaryId(),
		/** 关联小区 ID */
		communityId: uuid("community_id").references(() => cmCommunities.id),
		/** 计划名称 */
		planName: varchar("plan_name", { length: 100 }).notNull(),
		/** 巡检类型 */
		patrolType: varchar("patrol_type", { length: 50 }),
		/** 巡检级别 */
		patrolLevel: varchar("patrol_level", { length: 50 }),
		/** 计划描述 */
		planDescription: text("plan_description"),
		/** 执行频率 */
		frequency: varchar("frequency", { length: 50 }),
		/** 开始日期 */
		startDate: date("start_date"),
		/** 结束日期 */
		endDate: date("end_date"),
		/** 执行时段 */
		executionTimeSlot: varchar("execution_time_slot", { length: 100 }),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("pt_patrol_plans_community_id_idx").on(table.communityId),
		index("pt_patrol_plans_patrol_type_idx").on(table.patrolType),
	],
);

/** 巡检路线表 */
export const ptPatrolPaths = pgTable(
	"pt_patrol_paths",
	{
		id: primaryId(),
		/** 关联巡检计划 ID */
		planId: uuid("plan_id")
			.references(() => ptPatrolPlans.id)
			.notNull(),
		/** 路线名称 */
		pathName: varchar("path_name", { length: 100 }).notNull(),
		/** 路线描述 */
		pathDescription: text("path_description"),
		/** 预计耗时（分钟） */
		estimatedDuration: integer("estimated_duration"),
		...timestamps,
	},
	(table) => [index("pt_patrol_paths_plan_id_idx").on(table.planId)],
);

/** 巡检点表 */
export const ptPatrolPoints = pgTable(
	"pt_patrol_points",
	{
		id: primaryId(),
		/** 关联巡检路线 ID */
		pathId: uuid("path_id")
			.references(() => ptPatrolPaths.id)
			.notNull(),
		/** 巡检点名称 */
		pointName: varchar("point_name", { length: 100 }).notNull(),
		/** 位置描述 */
		location: text("location"),
		/** 二维码或NFC标识 */
		qrCodeOrNfc: varchar("qr_code_or_nfc", { length: 200 }),
		/** 排序序号 */
		sortOrder: integer("sort_order").default(0),
		...timestamps,
	},
	(table) => [
		index("pt_patrol_points_path_id_idx").on(table.pathId),
		index("pt_patrol_points_sort_order_idx").on(table.sortOrder),
	],
);

/** 巡检项目表 */
export const ptPatrolItems = pgTable(
	"pt_patrol_items",
	{
		id: primaryId(),
		/** 关联巡检点 ID */
		pointId: uuid("point_id")
			.references(() => ptPatrolPoints.id)
			.notNull(),
		/** 巡检项目名称 */
		itemName: varchar("item_name", { length: 100 }).notNull(),
		/** 检查标准 */
		checkStandard: text("check_standard"),
		/** 检查方法 */
		checkMethod: varchar("check_method", { length: 100 }),
		...timestamps,
	},
	(table) => [index("pt_patrol_items_point_id_idx").on(table.pointId)],
);

/** 巡检任务表 */
export const ptPatrolTasks = pgTable(
	"pt_patrol_tasks",
	{
		id: primaryId(),
		/** 关联巡检计划 ID */
		planId: uuid("plan_id")
			.references(() => ptPatrolPlans.id)
			.notNull(),
		/** 任务编码（唯一） */
		taskCode: varchar("task_code", { length: 50 }).notNull(),
		/** 任务名称 */
		taskName: varchar("task_name", { length: 100 }).notNull(),
		/** 计划巡检人 */
		plannedPatroller: varchar("planned_patroller", { length: 50 }),
		/** 巡检方式 */
		patrolMethod: varchar("patrol_method", { length: 50 }),
		/** 计划开始时间 */
		plannedStartTime: timestamp("planned_start_time"),
		/** 计划结束时间 */
		plannedEndTime: timestamp("planned_end_time"),
		/** 实际巡检时间 */
		actualPatrolTime: timestamp("actual_patrol_time"),
		/** 任务状态 */
		status: patrolTaskStatusEnum("status").default("pending"),
		/** 当前巡检人 */
		currentPatrolPerson: varchar("current_patrol_person", { length: 50 }),
		/** 转移说明 */
		transferDescription: text("transfer_description"),
		...timestamps,
	},
	(table) => [
		uniqueIndex("pt_patrol_tasks_task_code_idx").on(table.taskCode),
		index("pt_patrol_tasks_status_start_time_idx").on(table.status, table.plannedStartTime),
		index("pt_patrol_tasks_current_patrol_person_idx").on(table.currentPatrolPerson),
		index("pt_patrol_tasks_plan_id_idx").on(table.planId),
	],
);

/** 巡检任务明细表 */
export const ptPatrolTaskDetails = pgTable(
	"pt_patrol_task_details",
	{
		id: primaryId(),
		/** 关联巡检任务 ID */
		taskId: uuid("task_id")
			.references(() => ptPatrolTasks.id)
			.notNull(),
		/** 关联巡检点 ID */
		pointId: uuid("point_id")
			.references(() => ptPatrolPoints.id)
			.notNull(),
		/** 签到状态 */
		checkInStatus: checkInStatusEnum("check_in_status").default("not_checked"),
		/** 巡检情况 */
		patrolSituation: text("patrol_situation"),
		/** 巡检照片URL */
		patrolPhotoUrl: text("patrol_photo_url"),
		/** 签到时间 */
		checkInTime: timestamp("check_in_time"),
		/** GPS坐标 */
		gpsCoordinates: varchar("gps_coordinates", { length: 100 }),
		...timestamps,
	},
	(table) => [
		index("pt_patrol_task_details_task_id_idx").on(table.taskId),
		index("pt_patrol_task_details_point_id_idx").on(table.pointId),
		index("pt_patrol_task_details_check_in_status_idx").on(table.checkInStatus),
	],
);
