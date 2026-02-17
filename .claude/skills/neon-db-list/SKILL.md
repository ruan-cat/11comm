---
name: neon-db-list
description: 项目中所有数据库表的完整列表。当你需要验证表名、理解数据库结构或检查数据库 Schema 定义时，请使用此技能。
---

# Neon 数据库表清单

> **[MIGRATION NOTICE]** Schema 定义位置正在迁移中:
>
> - **旧位置 (Legacy)**: `apps\admin\server\db\schemas` - 仅供只读参考
> - **新位置 (Active)**: `apps/type/src/business/**/schema.ts` - 所有新 Schema 应在此创建
>
> 在 Full Stack Type Transformation 完成后，本文档将更新为扫描新位置。

本文档列出了 `apps\admin\server\db\schemas` 中定义的所有数据库表。
此列表由人工维护，每当添加、重命名或删除表时，都应立即更新此列表。

**重要**: 新的 Schema 定义应在 `apps/type/src/business/**/schema.ts` 中创建，不再添加到 `apps\admin\server\db\schemas`。

## 目录

- [Neon 数据库表清单](#neon-数据库表清单)
  - [目录](#目录)
  - [Community (cm)](#community-cm)
  - [Contract (ct)](#contract-ct)
  - [Dev (dt)](#dev-dt)
  - [Expense (ex)](#expense-ex)
  - [House Property (hp)](#house-property-hp)
  - [Operation (op)](#operation-op)
  - [Parking (pk)](#parking-pk)
  - [Patrol (pt)](#patrol-pt)
  - [Repairs (rp)](#repairs-rp)
  - [Report (rpt)](#report-rpt)
  - [Setting (sm)](#setting-sm)

## Community (cm)

来源: `apps\admin\server\db\schemas\community.ts`

- `cmCommunities`
- `cmNotices`
- `cmHandingBusiness`
- `cmHouseDecorations`
- `cmPropertyRegisters`
- `cmBuildingStructures`

## Contract (ct)

来源: `apps\admin\server\db\schemas\contract.ts`

- `ctFirstParties`
- `ctSecondParties`
- `ctTemplates`
- `ctClauses`
- `ctTypes` ("ct_types")
- `ctContracts`
- `ctAttachments`
- `ctChanges`
- `ctReviews`
- `ctArchives`
- `ctPrints`

## Dev (dt)

来源: `apps/type/src/business/setting-manage/dictionary-manage/schema.ts` (配置/字典/缓存表)
来源: `apps/type/src/business/setting-manage/menu-manage/schema.ts` (菜单表)

- `dtConfigTypes` ("dt_config_types")
- `dtConfigs`
- `dtConfigItems` ("dt_config_items")
- `dtDictionaries`
- `dtDictionaryItems` ("dt_dictionary_items")
- `dtMenuGroups` ("dt_menu_groups")
- `dtMenuCatalogs` ("dt_menu_catalogs")
- `dtMenuItems`
- `dtCacheConfigs` ("dt_cache_configs") — 含字段: cache_code, cache_name, cache_key, cache_type, cache_group, expire_time, description, refresh_strategy, status

## Expense (ex)

来源: `apps/type/src/business/property-manage/expense-manage/schema.ts`

- `exExpenseItems`
- `exHouseCharges`
- `exVehicleCharges`
- `exContractCharges`
- `exPayments`
- `exPaymentReviews`
- `exRefundReviews`
- `exDiscountTypes` ("ex_discount_types")
- `exDiscountSettings`
- `exDiscountApplications`
- `exMeterReadingTypes` ("ex_meter_reading_types")
- `exMeterReadings`
- `exCancelFees`
- `exOverdueReminders`
- `exReprintVouchers`
- `exExpenseSummaryTables` ("ex_expense_summary_tables") — 费用汇总表，含字段: time, expense_item_id, expense_item_name, receivable_amount, actual_amount, status

## House Property (hp)

来源: `apps\admin\server\db\schemas\house-property.ts`

- `hpHouses`
- `hpOwners`
- `hpOwnerMembers` ("hp_owner_members")
- `hpOwnerAccounts` ("hp_owner_accounts")
- `hpInvoices` ("hp_invoices")
- `hpInvoiceTitles` ("hp_invoice_titles")
- `hpReserveVenues` ("hp_reserve_venues")
- `hpReserveVenueOrders` ("hp_reserve_venue_orders")
- `hpSiteManagements` ("hp_site_managements")
- `hpOwnersCommittees` ("hp_owners_committees")

## Operation (op)

来源: `apps\admin\server\db\schemas\operation.ts`

- `opMerchants`
- `opMerchantAdmins` ("op_merchant_admins")
- `opPropertyCompanies`
- `opCommunityInfo` ("op_community_info")
- `opCommunityConfigs` ("op_community_configs")
- `opReportGroups` ("op_report_groups")
- `opReportInfos` ("op_report_infos")
- `opReportComponents` ("op_report_components")
- `opRegisterProtocols` ("op_register_protocols")

## Parking (pk)

来源: `apps\admin\server\db\schemas\parking.ts`

- `pkParkingStructures` ("pk_parking_structures")
- `pkParkingLots`
- `pkCarports`
- `pkOwnerVehicles`
- `pkCarportApplications`

## Patrol (pt)

来源: `apps\admin\server\db\schemas\patrol.ts`

- `ptPatrolPlans`
- `ptPatrolPaths`
- `ptPatrolPoints`
- `ptPatrolItems`
- `ptPatrolTasks`
- `ptPatrolTaskDetails`

## Repairs (rp)

来源: `apps\admin\server\db\schemas\repairs.ts`

- `rpRepairOrders`
- `rpRepairOrderHistories`
- `rpReturnVisits`
- `rpRepairSettings` ("rp_repair_settings")
- `rpRepairTypes` ("rp_repair_types")
- `rpMandatoryReturnIssues` ("rp_mandatory_return_issues")
- `rpPhoneRepairReports`

## Report (rpt)

来源: `apps\admin\server\db\schemas\report.ts`

- `rptExpenseSummaries`
- `rptDepositReports`
- `rptPaymentDetails`
- `rptOwnerPaymentDetails`
- `rptFeeReminders`
- `rptNoChargeHouses` ("rpt_no_charge_houses")
- `rptOutstandingFees`
- `rptPatrolReports`
- `rptRepairReports` ("rpt_repair_reports")
- `rptRepairSummaries` ("rpt_repair_summaries")
- `rptStatementExpenses` ("rpt_statement_expenses")
- `rptDataStatistics`

## Setting (sm)

来源: `apps\admin\server\db\schemas\setting.ts`
来源: `apps/type/src/business/setting-manage/system-manage/schema.ts` (系统配置/注册协议/初始化表)

- `smOrganizations` ("sm_organizations")
- `smStaff` ("sm_staff")
- `smRoles` ("sm_roles")
- `smPermissions` ("sm_permissions")
- `smRolePermissions` ("sm_role_permissions")
- `smStaffRoles` ("sm_staff_roles")
- `smDataPermissions` ("sm_data_permissions")
- `smShifts` ("sm_shifts")
- `smSchedulingSettings` ("sm_scheduling_settings")
- `smWorkingSchedules` ("sm_working_schedules")
- `smSystemConfigs` ("sm_system_configs")
- `smRegisterProtocols` ("sm_register_protocols")
- `smInitializeCells` ("sm_initialize_cells") — 小区初始化配置表，含字段: init_item, init_status, config_params
- `smChangePasswordRecords` ("sm_change_password_records") — 密码修改记录表，含字段: username, real_name, department, change_time, change_ip, change_type, operator, status
- `smCommunityConfigurations` ("sm_community_configurations") — 小区配置表，含字段: cs_id, community_id, community_name, setting_name, setting_value, setting_type, status_cd, remark, create_time, update_time, operator
