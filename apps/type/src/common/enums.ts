/**
 * @file Drizzle Schema 枚举定义
 * @description 集中定义所有业务枚举类型，确保全局唯一性
 */

import { pgEnum } from "drizzle-orm/pg-core";

// ==========================================
// 通用枚举 (Common Enums)
// ==========================================

/** 状态枚举 - 启用/禁用 */
export const statusEnum = pgEnum("status", ["enabled", "disabled"]);

/** 性别枚举 - 男/女 */
export const genderEnum = pgEnum("gender", ["male", "female"]);

/** 审核状态枚举 - 待审核/已通过/已拒绝 */
export const auditStatusEnum = pgEnum("audit_status", ["pending", "approved", "rejected"]);

// ==========================================
// 合同管理枚举 (Contract Management Enums)
// ==========================================

/** 合同状态枚举 - 草稿/待审核/已生效/已到期/已终止 */
export const contractStatusEnum = pgEnum("contract_status", [
	"draft",
	"pending_review",
	"effective",
	"expired",
	"terminated",
]);

/** 模板状态枚举 - 草稿/已发布/已停用 */
export const templateStatusEnum = pgEnum("template_status", ["draft", "published", "disabled"]);

// ==========================================
// 费用管理枚举 (Expense Management Enums)
// ==========================================

/** 缴费状态枚举 - 未缴/已缴/部分缴/逾期 */
export const chargeStatusEnum = pgEnum("charge_status", ["unpaid", "paid", "partial", "overdue"]);

/** 退费状态枚举 - 待审核/已通过/已拒绝/已退费 */
export const refundStatusEnum = pgEnum("refund_status", ["pending", "approved", "rejected", "refunded"]);

/** 折扣类型枚举 - 比例/固定金额/减免期 */
export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed", "period"]);

/** 进位方式枚举 - 四舍五入/进一/舍去 */
export const roundingModeEnum = pgEnum("rounding_mode", ["round", "ceil", "floor"]);

// ==========================================
// 报修管理枚举 (Repairs Management Enums)
// ==========================================

/** 报修工单状态枚举 - 待处理/处理中/已完成/已取消/已暂停 */
export const repairOrderStatusEnum = pgEnum("repair_order_status", [
	"pending",
	"processing",
	"completed",
	"cancelled",
	"paused",
]);

/** 回访状态枚举 - 未回访/已回访/满意/不满意 */
export const returnVisitStatusEnum = pgEnum("return_visit_status", [
	"not_visited",
	"visited",
	"satisfied",
	"unsatisfied",
]);

/** 报修设置类型枚举 - 保洁/维修 */
export const repairSettingTypeEnum = pgEnum("repair_setting_type", ["cleaning", "maintenance"]);

/** 派单方式枚举 - 抢单/指派/轮训 */
export const dispatchMethodEnum = pgEnum("dispatch_method", ["grab", "assign", "rotation"]);

/** 服务区域枚举 - 房屋/公共区域/车库/非房屋 */
export const serviceAreaEnum = pgEnum("service_area", ["house", "public_area", "garage", "non_house"]);

/** 强制回单状态枚举 - 待回单/已回单/强制回单 */
export const mandatoryReturnStatusEnum = pgEnum("mandatory_return_status", [
	"pending_return",
	"returned",
	"forced_returned",
]);

// ==========================================
// 巡检管理枚举 (Patrol Management Enums)
// ==========================================

/** 巡检任务状态枚举 - 待执行/执行中/已完成/已逾期 */
export const patrolTaskStatusEnum = pgEnum("patrol_task_status", ["pending", "in_progress", "completed", "overdue"]);

/** 签到状态枚举 - 未签到/已签到/异常 */
export const checkInStatusEnum = pgEnum("check_in_status", ["not_checked", "checked", "abnormal"]);
