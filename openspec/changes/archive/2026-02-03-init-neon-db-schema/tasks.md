## Implementation Tasks

### Phase 1: 基础设施模块

#### Task 1.1: 创建公共 Schema 模块

- [x] 创建 `apps/admin/server/db/schemas/common.ts` 文件
- [x] 定义 `primaryId()` 辅助函数，返回 UUID 主键
- [x] 定义 `timestamps` 对象，包含 `createTime` 和 `updateTime` 字段
- [x] 定义 `softDelete` 对象，包含 `deletedAt` 字段
- [x] 定义 `remarkField()` 辅助函数
- [x] 定义 `statusEnum` 枚举类型（enabled/disabled）
- [x] 定义 `genderEnum` 枚举类型（male/female）
- [x] 定义 `auditStatusEnum` 枚举类型（pending/approved/rejected）

#### Task 1.2: 更新 Schema 入口文件

- [x] 更新 `apps/admin/server/db/schema.ts` 作为统一导出入口
- [x] 重新导出 `common.ts` 中的所有内容
- [x] 预留各业务模块的导出语句

#### Task 1.3: 更新数据库连接模块

- [x] 确认 `apps/admin/server/db/index.ts` 数据库连接配置
- [x] 确保 `db` 实例初始化时包含完整的 schema 定义

---

### Phase 2: 社区管理模块 (cm\_)

#### Task 2.1: 创建社区管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/community.ts` 文件
- [x] 定义 `cm_communities` 表（小区基础信息）
  - 基础字段：name, code, address, phone, status
  - 面积字段：land_area, building_area, building_count, unit_count, household_count, parking_count
  - 规划字段：green_rate, plot_ratio, developer, property_company, established_date
  - 区域字段：province, city, district
- [x] 定义 `cm_notices` 表（社区公告）
  - 外键：community_id → cm_communities
- [x] 定义 `cm_handing_business` 表（业务受理）
- [x] 定义 `cm_house_decorations` 表（装修登记）
- [x] 定义 `cm_property_registers` 表（物业登记）
- [x] 定义 `cm_building_structures` 表（楼栋结构）
  - 外键：community_id → cm_communities
- [x] 创建必要的索引（community_name, community_code, status）

---

### Phase 3: 房产管理模块 (hp\_)

#### Task 3.1: 创建房产管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/house-property.ts` 文件
- [x] 定义 `hp_houses` 表（房屋信息）
  - 外键：community_id → cm_communities
  - 位置字段：building_no, unit_no, floor, room_no, house_number
  - 详细字段：building_area, usable_area, house_type, status
- [x] 定义 `hp_owners` 表（业主信息）
  - 支持软删除
  - 基础字段：name, id_card, phone, gender
  - 联系字段：email, address, emergency_contact
- [x] 定义 `hp_owner_members` 表（家庭成员）
  - 外键：owner_id → hp_owners
- [x] 定义 `hp_owner_accounts` 表（业主账户）
  - 外键：owner_id → hp_owners
- [x] 定义 `hp_invoices` 表（发票信息）
- [x] 定义 `hp_invoice_titles` 表（发票抬头）
  - 外键：owner_id → hp_owners
- [x] 定义 `hp_reserve_venues` 表（可预约场地）
- [x] 定义 `hp_reserve_venue_orders` 表（场地预约订单）
  - 外键：venue_id → hp_reserve_venues
- [x] 定义 `hp_site_managements` 表（场地管理）
- [x] 定义 `hp_owners_committees` 表（业委会）
- [x] 创建必要的索引（name, phone, house_number）

---

### Phase 4: 合同管理模块 (ct\_)

#### Task 4.1: 创建合同管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/contract.ts` 文件
- [x] 定义 `ct_first_parties` 表（合同甲方）
- [x] 定义 `ct_second_parties` 表（合同乙方）
  - 外键：owner_id → hp_owners（可选）
- [x] 定义 `ct_templates` 表（合同模板）
- [x] 定义 `ct_clauses` 表（合同条款）
  - 外键：template_id → ct_templates
- [x] 定义 `ct_contracts` 表（合同信息）
  - 支持软删除
  - 外键：first_party_id, second_party_id
- [x] 定义 `ct_attachments` 表（合同附件）
  - 外键：contract_id → ct_contracts（级联删除）
- [x] 定义 `ct_changes` 表（合同变更）
- [x] 定义 `ct_reviews` 表（合同审核）
  - 外键：contract_id → ct_contracts
- [x] 定义 `ct_archives` 表（合同归档）
- [x] 定义 `ct_prints` 表（打印记录）
- [x] 定义 `ct_types` 表（合同类型）
- [x] 创建必要的索引（contract_number 唯一索引, status）

---

### Phase 5: 费用管理模块 (ex\_)

#### Task 5.1: 创建费用管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/expense.ts` 文件
- [x] 定义 `ex_expense_items` 表（收费项目配置）
- [x] 定义 `ex_house_charges` 表（房屋收费）
  - 外键：house_id → hp_houses
- [x] 定义 `ex_vehicle_charges` 表（车辆收费）
  - 外键：vehicle_id → pk_owner_vehicles
- [x] 定义 `ex_contract_charges` 表（合同收费）
  - 外键：contract_id → ct_contracts
- [x] 定义 `ex_payments` 表（缴费记录）
  - 支持软删除
- [x] 定义 `ex_payment_reviews` 表（缴费审核）
- [x] 定义 `ex_refund_reviews` 表（退费审核）
- [x] 定义 `ex_discount_types` 表（折扣类型）
- [x] 定义 `ex_discount_settings` 表（折扣设置）
- [x] 定义 `ex_discount_applications` 表（折扣申请）
- [x] 定义 `ex_meter_reading_types` 表（表计类型）
- [x] 定义 `ex_meter_readings` 表（表计抄读）
  - 外键：house_id → hp_houses
- [x] 定义 `ex_cancel_fees` 表（费用核销）
- [x] 定义 `ex_overdue_reminders` 表（逾期催缴）
- [x] 定义 `ex_reprint_vouchers` 表（凭证重打）
- [x] 创建必要的索引（house_id + billing_period 复合索引, status）

---

### Phase 6: 停车管理模块 (pk\_)

#### Task 6.1: 创建停车管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/parking.ts` 文件
- [x] 定义 `pk_parking_lots` 表（停车场）
  - 外键：community_id → cm_communities
- [x] 定义 `pk_carports` 表（车位）
  - 外键：parking_lot_id → pk_parking_lots
- [x] 定义 `pk_owner_vehicles` 表（业主车辆）
  - 外键：owner_id → hp_owners
  - 外键：carport_id → pk_carports（可选）
- [x] 定义 `pk_carport_applications` 表（车位申请）
- [x] 创建必要的索引（license_plate 唯一索引, carport_number, status）

---

### Phase 7: 巡检管理模块 (pt\_)

#### Task 7.1: 创建巡检管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/patrol.ts` 文件
- [x] 定义 `pt_patrol_plans` 表（巡检计划）
  - 外键：community_id → cm_communities
- [x] 定义 `pt_patrol_paths` 表（巡检路线）
  - 外键：plan_id → pt_patrol_plans
- [x] 定义 `pt_patrol_points` 表（巡检点）
  - 外键：path_id → pt_patrol_paths
- [x] 定义 `pt_patrol_items` 表（巡检项目）
  - 外键：point_id → pt_patrol_points
- [x] 定义 `pt_patrol_tasks` 表（巡检任务）
  - 外键：plan_id → pt_patrol_plans
- [x] 定义 `pt_patrol_task_details` 表（任务明细）
  - 外键：task_id → pt_patrol_tasks
  - 外键：point_id → pt_patrol_points
- [x] 创建必要的索引（task_code 唯一索引, status + planned_start_time 复合索引, current_patrol_person）

---

### Phase 8: 报修管理模块 (rp\_)

#### Task 8.1: 创建报修管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/repairs.ts` 文件
- [x] 定义 `rp_repair_orders` 表（报修工单）
  - 支持软删除
  - 状态：待处理/处理中/已完成/已取消/已暂停
- [x] 定义 `rp_repair_order_histories` 表（工单历史）
  - 外键：order_id → rp_repair_orders（级联删除）
- [x] 定义 `rp_return_visits` 表（回访记录）
  - 外键：order_id → rp_repair_orders
- [x] 定义 `rp_repair_settings` 表（报修设置）
- [x] 定义 `rp_repair_types` 表（报修类型）
- [x] 定义 `rp_mandatory_return_issues` 表（强制回单）
- [x] 定义 `rp_phone_repair_reports` 表（电话报修）
  - 外键：order_id → rp_repair_orders（可选）
- [x] 创建必要的索引（work_order_number 唯一索引, status, create_time）

---

### Phase 9: 报表管理模块 (rpt\_)

#### Task 9.1: 创建报表管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/report.ts` 文件
- [x] 定义 `rpt_expense_summaries` 表（费用汇总报表）
  - 外键：community_id → cm_communities
- [x] 定义 `rpt_deposit_reports` 表（押金报表）
- [x] 定义 `rpt_payment_details` 表（缴费明细报表）
- [x] 定义 `rpt_owner_payment_details` 表（业主缴费明细）
  - 外键：owner_id → hp_owners
- [x] 定义 `rpt_fee_reminders` 表（催费提醒）
- [x] 定义 `rpt_no_charge_houses` 表（未收费房屋）
- [x] 定义 `rpt_outstanding_fees` 表（欠费分析）
- [x] 定义 `rpt_patrol_reports` 表（巡检报表）
- [x] 定义 `rpt_repair_reports` 表（维修报表）
- [x] 定义 `rpt_repair_summaries` 表（维修汇总报表）
- [x] 定义 `rpt_statement_expenses` 表（费用报表）
- [x] 定义 `rpt_data_statistics` 表（综合数据统计）
- [x] 创建必要的索引（period_start, period_end, community_id）

---

### Phase 10: 设置管理模块 (sm\_)

#### Task 10.1: 创建设置管理 Schema

- [x] 创建 `apps/admin/server/db/schemas/setting.ts` 文件
- [x] 定义 `sm_staff` 表（员工信息）
  - 外键：org_id → sm_organizations
- [x] 定义 `sm_organizations` 表（组织架构）
  - 自引用：parent_id → sm_organizations
- [x] 定义 `sm_roles` 表（角色信息）
- [x] 定义 `sm_permissions` 表（权限信息）
- [x] 定义 `sm_role_permissions` 表（角色权限关联）
  - 外键：role_id → sm_roles
  - 外键：permission_id → sm_permissions
- [x] 定义 `sm_staff_roles` 表（员工角色关联）
  - 外键：staff_id → sm_staff
  - 外键：role_id → sm_roles
- [x] 定义 `sm_data_permissions` 表（数据权限）
  - 外键：role_id → sm_roles
- [x] 定义 `sm_shifts` 表（班次设置）
- [x] 定义 `sm_scheduling_settings` 表（排班设置）
- [x] 定义 `sm_working_schedules` 表（工作排班）
  - 外键：staff_id → sm_staff
  - 外键：shift_id → sm_shifts
- [x] 定义 `sm_system_configs` 表（系统配置）
- [x] 定义 `sm_register_protocols` 表（注册协议）
- [x] 定义 `sm_initialize_cells` 表（小区初始化配置）
- [x] 创建必要的索引（employee_number, name, code 唯一索引, config_key 唯一索引）

---

### Phase 11: 运营团队模块 (op\_)

#### Task 11.1: 创建运营团队 Schema

- [x] 创建 `apps/admin/server/db/schemas/operation.ts` 文件
- [x] 定义 `op_merchants` 表（商户信息）
  - 基础字段：name, code, type, contact_person, contact_phone
  - 法律字段：business_license, legal_representative, registered_address, registered_capital, established_date
  - 经营字段：business_address, business_scope, business_hours, business_area
  - 合作字段：service_communities, contract_start_date, contract_end_date
  - 结算字段：bank_name, bank_account
- [x] 定义 `op_merchant_admins` 表（商户管理员）
  - 外键：merchant_id → op_merchants
- [x] 定义 `op_property_companies` 表（物业公司）
- [x] 定义 `op_community_info` 表（运营侧小区信息）
  - 外键：community_id → cm_communities
- [x] 定义 `op_community_configs` 表（小区配置）
  - 外键：community_id → cm_communities
- [x] 定义 `op_report_groups` 表（报表分组）
- [x] 定义 `op_report_infos` 表（报表信息）
  - 外键：group_id → op_report_groups
- [x] 定义 `op_report_components` 表（报表组件）
  - 外键：report_id → op_report_infos
- [x] 定义 `op_register_protocols` 表（运营侧注册协议）
- [x] 创建必要的索引（merchant_name, merchant_code, company_name）

---

### Phase 12: 开发团队模块 (dt\_)

#### Task 12.1: 创建开发团队 Schema

- [x] 创建 `apps/admin/server/db/schemas/dev.ts` 文件
- [x] 定义 `dt_configs` 表（配置中心）
- [x] 定义 `dt_config_types` 表（配置类型）
- [x] 定义 `dt_config_items` 表（配置项定义）
  - 外键：type_id → dt_config_types
- [x] 定义 `dt_dictionaries` 表（数据字典）
- [x] 定义 `dt_dictionary_items` 表（字典项）
  - 外键：dictionary_id → dt_dictionaries
- [x] 定义 `dt_menu_groups` 表（菜单分组）
- [x] 定义 `dt_menu_catalogs` 表（菜单目录）
  - 自引用：parent_id → dt_menu_catalogs
  - 外键：group_id → dt_menu_groups
- [x] 定义 `dt_menu_items` 表（菜单项）
  - 外键：catalog_id → dt_menu_catalogs
- [x] 定义 `dt_cache_configs` 表（缓存配置）
- [x] 创建必要的索引（config_key 唯一索引, dictionary_code 唯一索引, path）

---

### Phase 13: 统一导出与验证

#### Task 13.1: 更新统一导出

- [x] 更新 `apps/admin/server/db/schema.ts`，导出所有模块
  ```typescript
  export * from "./schemas/common";
  export * from "./schemas/community";
  export * from "./schemas/house-property";
  export * from "./schemas/contract";
  export * from "./schemas/expense";
  export * from "./schemas/parking";
  export * from "./schemas/patrol";
  export * from "./schemas/repairs";
  export * from "./schemas/report";
  export * from "./schemas/setting";
  export * from "./schemas/operation";
  export * from "./schemas/dev";
  ```

#### Task 13.2: 类型检查验证

- [x] 运行 `pnpm -F @01s-11comm/admin typecheck` 验证类型正确性

#### Task 13.3: 生成迁移文件

- [x] 运行 `pnpm -F @01s-11comm/admin db:generate` 生成迁移文件
- [x] 检查生成的 SQL 迁移文件内容正确性

#### Task 13.4: Drizzle Studio 验证

- [x] 运行 `pnpm -F @01s-11comm/admin db:studio` 可视化检查表结构

---

## Task Dependencies

```plain
Phase 1 (基础设施)
    ↓
Phase 2 (社区管理 cm_) ─────────────────┐
    ↓                                   │
Phase 3 (房产管理 hp_) ←────────────────┤
    ↓                                   │
Phase 4 (合同管理 ct_) ←── hp_owners ───┤
    ↓                                   │
Phase 5 (费用管理 ex_) ←── hp_, ct_, pk_│
    ↓                                   │
Phase 6 (停车管理 pk_) ←── cm_, hp_ ────┤
    ↓                                   │
Phase 7 (巡检管理 pt_) ←── cm_ ─────────┤
    ↓                                   │
Phase 8 (报修管理 rp_) ─────────────────┤
    ↓                                   │
Phase 9 (报表管理 rpt_) ←── cm_, hp_ ───┤
    ↓                                   │
Phase 10 (设置管理 sm_) ────────────────┤
    ↓                                   │
Phase 11 (运营团队 op_) ←── cm_ ────────┤
    ↓                                   │
Phase 12 (开发团队 dt_) ────────────────┘
    ↓
Phase 13 (统一导出与验证)
```

## Estimated Table Count

|   模块   | 前缀  | 表数量  |
| :------: | :---: | :-----: |
| 公共模块 |   -   |    0    |
| 社区管理 | cm\_  |    6    |
| 房产管理 | hp\_  |   10    |
| 合同管理 | ct\_  |   11    |
| 费用管理 | ex\_  |   15    |
| 停车管理 | pk\_  |    4    |
| 巡检管理 | pt\_  |    6    |
| 报修管理 | rp\_  |    7    |
| 报表管理 | rpt\_ |   12    |
| 设置管理 | sm\_  |   13    |
| 运营团队 | op\_  |    9    |
| 开发团队 | dt\_  |    9    |
| **合计** | **-** | **102** |
