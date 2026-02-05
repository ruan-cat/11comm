# 任务清单 (Tasks)

本任务清单旨在实现 `apps/admin` 项目的数据库 Schema 初始化，涵盖所有业务模块。
所有文件路径均相对于项目根目录。

## 1. 基础架构 (Infrastructure)

- [ ] **创建公共模块定义** <!-- id: common -->
  - **目标文件**: `apps/admin/server/db/schemas/common.ts`
  - **任务详情**:
    - 实现 `primaryId` (UUID 主键)
    - 实现 `timestamps` (createdAt, updatedAt)
    - 实现 `softDelete` (deletedAt)
    - 实现 `remarkField` (备注字段)
    - 定义通用枚举: `statusEnum` (enabled/disabled), `genderEnum`, `auditStatusEnum` 等
  - **验证**: 文件无类型错误，导出正确。

## 2. 业务模块 Schema 实现 (Business Modules)

请按顺序检查、创建或更新以下模块文件，确保包含设计文档中定义的所有表结构。

- [ ] **社区管理模块 (Community)** <!-- id: community -->
  - **目标文件**: `apps/admin/server/db/schemas/community.ts`
  - **包含表**:
    - `cm_communities` (小区基础信息)
    - `cm_notices` (社区公告)
    - `cm_handing_business` (业务受理)
    - `cm_house_decorations` (房屋装修)
    - `cm_property_registers` (物业登记)
    - `cm_building_structures` (楼栋结构)

- [ ] **房产管理模块 (House Property)** <!-- id: house-property -->
  - **目标文件**: `apps/admin/server/db/schemas/house-property.ts`
  - **包含表**:
    - `hp_houses` (房屋信息)
    - `hp_owners` (业主信息)
    - `hp_owner_members` (家庭成员)
    - `hp_owner_accounts` (业主账户)
    - `hp_invoices` (发票信息)
    - `hp_invoice_titles` (发票抬头)
    - `hp_reserve_venues` (场地预约)
    - `hp_reserve_venue_orders` (预约订单)
    - `hp_site_managements` (场地管理)
    - `hp_owners_committees` (业委会)

- [ ] **合同管理模块 (Contract)** <!-- id: contract -->
  - **目标文件**: `apps/admin/server/db/schemas/contract.ts`
  - **包含表**:
    - `ct_first_parties` (甲方)
    - `ct_second_parties` (乙方)
    - `ct_templates` (合同模板)
    - `ct_clauses` (合同条款)
    - `ct_contracts` (合同信息)
    - `ct_attachments` (合同附件)
    - `ct_changes` (合同变更)
    - `ct_reviews` (合同审核)
    - `ct_archives` (合同归档)
    - `ct_prints` (打印记录)

- [ ] **费用管理模块 (Expense)** <!-- id: expense -->
  - **目标文件**: `apps/admin/server/db/schemas/expense.ts`
  - **包含表**:
    - `ex_expense_items` (收费项配置)
    - `ex_house_charges` (房屋收费)
    - `ex_vehicle_charges` (车辆收费)
    - `ex_contract_charges` (合同收费)
    - `ex_payments` (缴费记录)
    - `ex_payment_reviews` (缴费审核)
    - `ex_refund_reviews` (退费审核)
    - `ex_discount_types`, `ex_discount_settings`, `ex_discount_applications` (折扣相关)
    - `ex_meter_reading_types`, `ex_meter_readings` (抄表相关)
    - `ex_cancel_fees` (核销)
    - `ex_overdue_reminders` (催缴)
    - `ex_reprint_vouchers` (凭证重打)

- [ ] **停车管理模块 (Parking)** <!-- id: parking -->
  - **目标文件**: `apps/admin/server/db/schemas/parking.ts`
  - **注意**: **必须补充 `pk_parking_structures` 表定义 (参见 Design 文档补丁章节)**
  - **包含表**:
    - `pk_parking_lots` (停车场)
    - `pk_carports` (车位)
    - `pk_owner_vehicles` (业主车辆)
    - `pk_carport_applications` (车位申请)
    - **`pk_parking_structures`** (车位结构图 - NEW!)

- [ ] **巡检管理模块 (Patrol)** <!-- id: patrol -->
  - **目标文件**: `apps/admin/server/db/schemas/patrol.ts`
  - **包含表**:
    - `pt_patrol_plans` (巡检计划)
    - `pt_patrol_paths` (巡检路线)
    - `pt_patrol_points` (巡检点)
    - `pt_patrol_items` (巡检项目)
    - `pt_patrol_tasks` (巡检任务)
    - `pt_patrol_task_details` (任务明细)

- [ ] **报修管理模块 (Repairs)** <!-- id: repairs -->
  - **目标文件**: `apps/admin/server/db/schemas/repairs.ts`
  - **包含表**:
    - `rp_repair_orders` (报修工单)
    - `rp_repair_order_histories` (操作历史)
    - `rp_return_visits` (回访记录)
    - `rp_repair_settings` (报修设置)
    - `rp_repair_types` (报修类型)
    - `rp_mandatory_return_issues` (强制回单)
    - `rp_phone_repair_reports` (电话报修)

- [ ] **报表管理模块 (Report)** <!-- id: report -->
  - **目标文件**: `apps/admin/server/db/schemas/report.ts`
  - **包含表**:
    - `rpt_expense_summaries` (费用汇总)
    - `rpt_deposit_reports` (押金报表)
    - `rpt_payment_details` (缴费明细)
    - `rpt_owner_payment_details` (业主缴费)
    - `rpt_fee_reminders` (催费提醒)
    - `rpt_no_charge_houses` (未收费房屋)
    - `rpt_outstanding_fees` (欠费分析)
    - `rpt_patrol_reports` (巡检报表)
    - `rpt_repair_reports` (维修报表)
    - `rpt_repair_summaries` (维修汇总)
    - `rpt_statement_expenses` (费用报表快照)
    - `rpt_data_statistics` (综合统计)

- [ ] **设置管理模块 (Setting)** <!-- id: setting -->
  - **目标文件**: `apps/admin/server/db/schemas/setting.ts`
  - **包含表**:
    - `sm_organizations` (组织架构)
    - `sm_staff` (员工信息)
    - `sm_roles`, `sm_permissions`, `sm_role_permissions`, `sm_staff_roles`, `sm_data_permissions` (权限相关)
    - `sm_shifts`, `sm_scheduling_settings`, `sm_working_schedules` (排班相关)
    - `sm_system_configs` (系统配置)
    - `sm_register_protocols` (注册协议)
    - `sm_initialize_cells` (初始化配置)

- [ ] **运营团队模块 (Operation)** <!-- id: operation -->
  - **目标文件**: `apps/admin/server/db/schemas/operation.ts`
  - **包含表**:
    - `op_merchants`, `op_merchant_admins` (商户)
    - `op_property_companies` (物业公司)
    - `op_community_info`, `op_community_configs` (小区配置)
    - `op_report_groups`, `op_report_infos`, `op_report_components` (报表配置)
    - `op_register_protocols` (运营协议)

- [ ] **开发团队模块 (Dev)** <!-- id: dev -->
  - **目标文件**: `apps/admin/server/db/schemas/dev.ts`
  - **包含表**:
    - `dt_config_types`, `dt_configs`, `dt_config_items` (配置中心)
    - `dt_dictionaries`, `dt_dictionary_items` (数据字典)
    - `dt_menu_groups`, `dt_menu_catalogs`, `dt_menu_items` (菜单管理)
    - `dt_cache_configs` (缓存配置)

## 3. 整合与验证 (Integration & Verification)

- [ ] **更新统一导出入口** <!-- id: main-schema -->
  - **目标文件**: `apps/admin/server/db/schema.ts`
  - **任务详情**: 导出上述所有模块 (`export * from "./schemas/<module>"`)

- [ ] **Schema 生成验证** <!-- id: verify -->
  - **执行命令**: `pnpm db:generate`
  - **验证标准**:
    - 命令执行成功，无报错
    - 生成的 SQL 迁移文件包含所有新表
    - 检查 `drizzle` 目录下的 SQL 文件，确认表结构符合预期
