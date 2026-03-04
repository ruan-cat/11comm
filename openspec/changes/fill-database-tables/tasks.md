## 1. 准备阶段

- [ ] 1.1 运行数据库迁移创建表结构 (pnpm db:migrate)
- [ ] 1.2 检查现有 seed-sql 模块的实现状态
- [ ] 1.3 分析每个模块的数据覆盖情况，识别缺失 mock 数据的表

## 2. Dev 模块 (9 个表)

- [ ] 2.1 创建/扩展 dt_dictionaries 的 mock 数据
- [ ] 2.2 创建/扩展 dt_dictionary_items 的 mock 数据
- [ ] 2.3 创建/扩展 dt_cache_configs 的 mock 数据
- [ ] 2.4 创建 dt_config_types 的 mock 数据
- [ ] 2.5 创建 dt_configs 的 mock 数据
- [ ] 2.6 创建 dt_config_items 的 mock 数据
- [ ] 2.7 创建 dt_menu_groups 的 mock 数据
- [ ] 2.8 创建 dt_menu_catalogs 的 mock 数据
- [ ] 2.9 创建 dt_menu_items 的 mock 数据
- [ ] 2.10 扩展 seed-sql/00-dev.ts 添加所有表的生成逻辑
- [ ] 2.11 测试 dev 模块 SQL 生成 (pnpm run generate-seed-sql --module dev)

## 3. Community 模块 (6 个表)

- [ ] 3.1 创建 cm_communities 的 mock 数据
- [ ] 3.2 创建 cm_building_structures 的 mock 数据
- [ ] 3.3 创建 cm_notices 的 mock 数据
- [ ] 3.4 创建 cm_handing_business 的 mock 数据
- [ ] 3.5 创建 cm_house_decorations 的 mock 数据
- [ ] 3.6 创建 cm_property_registers 的 mock 数据
- [ ] 3.7 扩展 seed-sql/01-community.ts 添加所有表的生成逻辑
- [ ] 3.8 测试 community 模块 SQL 生成

## 4. Setting 模块 (13 个表)

- [ ] 4.1 创建 sm_organizations 的 mock 数据
- [ ] 4.2 创建 sm_staff 的 mock 数据
- [ ] 4.3 创建 sm_roles 的 mock 数据
- [ ] 4.4 创建 sm_permissions 的 mock 数据
- [ ] 4.5 创建 sm_role_permissions 的 mock 数据
- [ ] 4.6 创建 sm_staff_roles 的 mock 数据
- [ ] 4.7 创建 sm_data_permissions 的 mock 数据
- [ ] 4.8 创建 sm_shifts 的 mock 数据
- [ ] 4.9 创建 sm_scheduling_settings 的 mock 数据
- [ ] 4.10 创建 sm_working_schedules 的 mock 数据
- [ ] 4.11 创建 sm_system_configs 的 mock 数据
- [ ] 4.12 创建 sm_register_protocols 的 mock 数据
- [ ] 4.13 创建 sm_initialize_cells 的 mock 数据
- [ ] 4.14 创建 sm_community_configurations 的 mock 数据
- [ ] 4.15 创建 sm_change_password_records 的 mock 数据
- [ ] 4.16 扩展 seed-sql/02-setting.ts 添加所有表的生成逻辑
- [ ] 4.17 测试 setting 模块 SQL 生成

## 5. House Property 模块 (11 个表)

- [ ] 5.1 创建 hp_houses 的 mock 数据
- [ ] 5.2 创建 hp_owners 的 mock 数据
- [ ] 5.3 创建 hp_owner_accounts 的 mock 数据
- [ ] 5.4 创建 hp_owner_members 的 mock 数据
- [ ] 5.5 创建 hp_owners_committees 的 mock 数据
- [ ] 5.6 创建 hp_invoice_titles 的 mock 数据
- [ ] 5.7 创建 hp_invoices 的 mock 数据
- [ ] 5.8 创建 hp_reserve_venues 的 mock 数据
- [ ] 5.9 创建 hp_reserve_venue_orders 的 mock 数据
- [ ] 5.10 创建 hp_site_managements 的 mock 数据
- [ ] 5.11 扩展 seed-sql/03-house-property.ts 添加所有表的生成逻辑
- [ ] 5.12 测试 house-property 模块 SQL 生成

## 6. Operation 模块 (9 个表)

- [ ] 6.1 创建 op_merchants 的 mock 数据
- [ ] 6.2 创建 op_merchant_admins 的 mock 数据
- [ ] 6.3 创建 op_property_companies 的 mock 数据
- [ ] 6.4 创建 op_community_info 的 mock 数据
- [ ] 6.5 创建 op_community_configs 的 mock 数据
- [ ] 6.6 创建 op_register_protocols 的 mock 数据
- [ ] 6.7 创建 op_report_groups 的 mock 数据
- [ ] 6.8 创建 op_report_components 的 mock 数据
- [ ] 6.9 创建 op_report_infos 的 mock 数据
- [ ] 6.10 扩展 seed-sql/04-operation.ts 添加所有表的生成逻辑
- [ ] 6.11 测试 operation 模块 SQL 生成

## 7. Contract 模块 (11 个表)

- [ ] 7.1 创建 ct_types 的 mock 数据
- [ ] 7.2 创建 ct_templates 的 mock 数据
- [ ] 7.3 创建 ct_clauses 的 mock 数据
- [ ] 7.4 创建 ct_first_parties 的 mock 数据
- [ ] 7.5 创建 ct_second_parties 的 mock 数据
- [ ] 7.6 创建 ct_contracts 的 mock 数据
- [ ] 7.7 创建 ct_attachments 的 mock 数据
- [ ] 7.8 创建 ct_changes 的 mock 数据
- [ ] 7.9 创建 ct_reviews 的 mock 数据
- [ ] 7.10 创建 ct_prints 的 mock 数据
- [ ] 7.11 创建 ct_archives 的 mock 数据
- [ ] 7.12 扩展 seed-sql/05-contract.ts 添加所有表的生成逻辑
- [ ] 7.13 测试 contract 模块 SQL 生成

## 8. Parking 模块 (5 个表)

- [ ] 8.1 创建 pk_parking_lots 的 mock 数据
- [ ] 8.2 创建 pk_parking_structures 的 mock 数据
- [ ] 8.3 创建 pk_carports 的 mock 数据
- [ ] 8.4 创建 pk_owner_vehicles 的 mock 数据
- [ ] 8.5 创建 pk_carport_applications 的 mock 数据
- [ ] 8.6 扩展 seed-sql/06-parking.ts 添加所有表的生成逻辑
- [ ] 8.7 测试 parking 模块 SQL 生成

## 9. Expense 模块 (16 个表)

- [ ] 9.1 创建 ex_expense_items 的 mock 数据
- [ ] 9.2 创建 ex_discount_types 的 mock 数据
- [ ] 9.3 创建 ex_discount_settings 的 mock 数据
- [ ] 9.4 创建 ex_meter_reading_types 的 mock 数据
- [ ] 9.5 创建 ex_contract_charges 的 mock 数据
- [ ] 9.6 创建 ex_house_charges 的 mock 数据
- [ ] 9.7 创建 ex_vehicle_charges 的 mock 数据
- [ ] 9.8 创建 ex_meter_readings 的 mock 数据
- [ ] 9.9 创建 ex_payments 的 mock 数据
- [ ] 9.10 创建 ex_payment_reviews 的 mock 数据
- [ ] 9.11 创建 ex_discount_applications 的 mock 数据
- [ ] 9.12 创建 ex_cancel_fees 的 mock 数据
- [ ] 9.13 创建 ex_refund_reviews 的 mock 数据
- [ ] 9.14 创建 ex_overdue_reminders 的 mock 数据
- [ ] 9.15 创建 ex_reprint_vouchers 的 mock 数据
- [ ] 9.16 创建 ex_expense_summary_tables 的 mock 数据
- [ ] 9.17 扩展 seed-sql/07-expense.ts 添加所有表的生成逻辑
- [ ] 9.18 测试 expense 模块 SQL 生成

## 10. Patrol 模块 (6 个表)

- [ ] 10.1 创建 pt_patrol_points 的 mock 数据
- [ ] 10.2 创建 pt_patrol_paths 的 mock 数据
- [ ] 10.3 创建 pt_patrol_items 的 mock 数据
- [ ] 10.4 创建 pt_patrol_plans 的 mock 数据
- [ ] 10.5 创建 pt_patrol_tasks 的 mock 数据
- [ ] 10.6 创建 pt_patrol_task_details 的 mock 数据
- [ ] 10.7 扩展 seed-sql/08-patrol.ts 添加所有表的生成逻辑
- [ ] 10.8 测试 patrol 模块 SQL 生成

## 11. Repairs 模块 (7 个表)

- [ ] 11.1 创建 rp_repair_types 的 mock 数据
- [ ] 11.2 创建 rp_repair_settings 的 mock 数据
- [ ] 11.3 创建 rp_repair_orders 的 mock 数据
- [ ] 11.4 创建 rp_repair_order_histories 的 mock 数据
- [ ] 11.5 创建 rp_phone_repair_reports 的 mock 数据
- [ ] 11.6 创建 rp_return_visits 的 mock 数据
- [ ] 11.7 创建 rp_mandatory_return_issues 的 mock 数据
- [ ] 11.8 扩展 seed-sql/09-repairs.ts 添加所有表的生成逻辑
- [ ] 11.9 测试 repairs 模块 SQL 生成

## 12. Report 模块 (12 个表)

- [ ] 12.1 创建 rpt_data_statistics 的 mock 数据
- [ ] 12.2 创建 rpt_expense_summaries 的 mock 数据
- [ ] 12.3 创建 rpt_statement_expenses 的 mock 数据
- [ ] 12.4 创建 rpt_payment_details 的 mock 数据
- [ ] 12.5 创建 rpt_owner_payment_details 的 mock 数据
- [ ] 12.6 创建 rpt_deposit_reports 的 mock 数据
- [ ] 12.7 创建 rpt_outstanding_fees 的 mock 数据
- [ ] 12.8 创建 rpt_no_charge_houses 的 mock 数据
- [ ] 12.9 创建 rpt_fee_reminders 的 mock 数据
- [ ] 12.10 创建 rpt_repair_reports 的 mock 数据
- [ ] 12.11 创建 rpt_repair_summaries 的 mock 数据
- [ ] 12.12 创建 rpt_patrol_reports 的 mock 数据
- [ ] 12.13 扩展 seed-sql/10-report.ts 添加所有表的生成逻辑
- [ ] 12.14 测试 report 模块 SQL 生成

## 13. 认证模块 (3 个表)

- [ ] 13.1 创建 auth_roles 的 mock 数据
- [ ] 13.2 创建 auth_user_mapping 的 mock 数据
- [ ] 13.3 创建 auth_user_roles 的 mock 数据
- [ ] 13.4 创建新的 seed-sql 模块或扩展现有模块处理认证表
- [ ] 13.5 测试认证模块 SQL 生成

## 14. 集成测试与验证

- [ ] 14.1 生成完整 SQL (pnpm run generate-seed-sql)
- [ ] 14.2 执行 SQL 到 Neon 数据库
- [ ] 14.3 验证所有 94 个表都有数据 (运行 COUNT 查询)
- [ ] 14.4 验证外键关联正确 (检查孤立记录)
- [ ] 14.5 在前端页面测试数据展示
- [ ] 14.6 测试分页、筛选、排序功能
- [ ] 14.7 更新 neon-db-list 技能文档
