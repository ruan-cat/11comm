---
name: neon-db-list
description: A comprehensive list of all database tables in the project. Use this skill when you need to verify table names, understand the database structure, or check for existing tables in the `apps\admin\server\db\schemas` directory.
---

# Neon Database Tables List

This document lists all database tables defined in `apps\admin\server\db\schemas`.
This list is maintained manually and should be updated whenever a table is added, renamed, or removed.

## Table of Contents

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

Source: `apps\admin\server\db\schemas\community.ts`

- `cmCommunities`
- `cmNotices`
- `cmHandingBusiness`
- `cmHouseDecorations`
- `cmPropertyRegisters`
- `cmBuildingStructures`

## Contract (ct)

Source: `apps\admin\server\db\schemas\contract.ts`

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

Source: `apps\admin\server\db\schemas\dev.ts`

- `dtConfigTypes` ("dt_config_types")
- `dtConfigs`
- `dtConfigItems` ("dt_config_items")
- `dtDictionaries`
- `dtDictionaryItems` ("dt_dictionary_items")
- `dtMenuGroups` ("dt_menu_groups")
- `dtMenuCatalogs` ("dt_menu_catalogs")
- `dtMenuItems`
- `dtCacheConfigs` ("dt_cache_configs")

## Expense (ex)

Source: `apps\admin\server\db\schemas\expense.ts`

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

## House Property (hp)

Source: `apps\admin\server\db\schemas\house-property.ts`

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

Source: `apps\admin\server\db\schemas\operation.ts`

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

Source: `apps\admin\server\db\schemas\parking.ts`

- `pkParkingStructures` ("pk_parking_structures")
- `pkParkingLots`
- `pkCarports`
- `pkOwnerVehicles`
- `pkCarportApplications`

## Patrol (pt)

Source: `apps\admin\server\db\schemas\patrol.ts`

- `ptPatrolPlans`
- `ptPatrolPaths`
- `ptPatrolPoints`
- `ptPatrolItems`
- `ptPatrolTasks`
- `ptPatrolTaskDetails`

## Repairs (rp)

Source: `apps\admin\server\db\schemas\repairs.ts`

- `rpRepairOrders`
- `rpRepairOrderHistories`
- `rpReturnVisits`
- `rpRepairSettings` ("rp_repair_settings")
- `rpRepairTypes` ("rp_repair_types")
- `rpMandatoryReturnIssues` ("rp_mandatory_return_issues")
- `rpPhoneRepairReports`

## Report (rpt)

Source: `apps\admin\server\db\schemas\report.ts`

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

Source: `apps\admin\server\db\schemas\setting.ts`

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
- `smInitializeCells` ("sm_initialize_cells")
