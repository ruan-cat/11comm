---
name: neon-db-query
description: 项目数据库表清单与批量查询工具。提供项目中所有数据库表的完整列表，并支持使用 Neon MCP 批量查询表结构信息（字段、索引、外键），用于数据库结构查询和开发参考。当你需要验证表名、理解数据库结构、检查数据库 Schema 定义、批量查询全部表数据、或为开发和调试获取表结构参考时，必须使用此技能。
---

# Neon 数据库表查询技能

> 此技能整合并扩展了原有的 `neon-db-list` 功能，不仅提供数据库表清单，还支持批量查询表结构。

## 功能概述

1. **数据库表清单** - 列出项目中所有数据库表
2. **批量表结构查询** - 使用 Neon MCP 批量查询所有表的结构信息
3. **开发参考输出** - 提供字段信息、外键关系、索引等，用于 seed 数据生成

## 使用场景

- 开发时快速查询表结构和数据
- 批量查询项目中全部表的数据结构
- 在做数据迁移或表结构调整前，全面了解现有数据
- 为开发和调试获取表结构参考

## 数据库表清单

> 以下是项目中所有数据库表的完整列表。详细信息请参考各模块章节。
>
> **数据来源**：Neon 数据库（Project ID: snowy-base-74751932）
> **表命名**：蛇形命名（snake_case）

### 表清单目录

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
- [Auth (系统表)](#auth-系统表)

---

## 批量查询表结构

### 核心查询流程

当你需要批量查询数据库表结构时，按以下步骤执行：

#### 步骤 1：获取项目 Project ID

首先需要获取 Neon 项目的 Project ID：

```bash
# 使用 MCP 工具列出项目
mcp__Neon__list_projects
```

#### 步骤 2：获取数据库表列表

使用以下方式获取项目中所有数据库表：

**方式 A：通过 SQL 直接查询**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**方式 B：参考下方表清单**

直接参考本技能中的数据库表清单，手动选择需要查询的表。

#### 步骤 3：批量查询表结构

使用 `describe_table_schema` MCP 工具批量查询表结构：

```bash
# 查询单张表的结构
mcp__Neon__describe_table_schema {
  tableName: "表名",
  projectId: "snowy-base-74751932"
}
```

**重要**：必须使用正确的表名格式（数据库中的蛇形命名）：

- 如 `cm_communities`、`hp_houses`、`sm_staff`
- 或带引号的 SQL 表名（如 `"ct_types"`）

#### 步骤 4：查询表统计信息

查询表的行数和数据量：

```sql
SELECT COUNT(*) as row_count FROM {table_name};
```

### 批量查询策略

#### 策略 1：全量查询（推荐用于开发参考）

一次性查询所有表的结构信息：

```typescript
// 需要查询的表列表（按模块分组）
const tables = [
	// Community 模块
	"cm_communities",
	"cm_notices",
	"cm_handing_business",
	"cm_house_decorations",
	"cm_property_registers",
	"cm_building_structures",
	// ... 其他模块
];

// 遍历查询每张表
for (const table of tables) {
	await mcp__Neon__describe_table_schema({
		tableName: table,
		projectId: "snowy-base-74751932",
	});
}
```

#### 策略 2：按模块查询

按业务模块分组查询：

```typescript
const moduleTables = {
	community: ["cm_communities", "cm_notices", ...],
	expense: ["ex_expense_items", "ex_payments", ...],
	// ...
};

// 按模块批量查询
for (const [module, tables] of Object.entries(moduleTables)) {
	console.log(`\n=== ${module} 模块 ===`);
	for (const table of tables) {
		const schema = await mcp__Neon__describe_table_schema({
			tableName: table,
			projectId: "snowy-base-74751932"
		});
		// 处理返回的结构信息
	}
}
```

#### 策略 3：按需查询

只查询特定的表：

```bash
# 只查询需要的表
mcp__Neon__describe_table_schema {tableName: "hp_houses", projectId: "snowy-base-74751932"}
mcp__Neon__describe_table_schema {tableName: "sm_staff", projectId: "snowy-base-74751932"}
```

---

## 输出格式参考

### 表结构输出格式

查询返回的结构信息包含：

```typescript
{
  table: "表名",
  columns: [
    {
      name: "字段名",
      type: "数据类型",
      nullable: true | false,
      default: "默认值" | null,
      isPrimaryKey: boolean,
      isForeignKey: boolean,
      references?: "外键引用"
    }
  ],
  indexes: [
    {
      name: "索引名",
      columns: ["字段1", "字段2"],
      unique: boolean
    }
  ],
  foreignKeys: [
    {
      name: "外键名",
      columns: ["字段"],
      references: { table: "引用表", columns: ["引用字段"] }
    }
  ]
}
```

### 统计信息输出格式

```typescript
{
  table: "表名",
  rowCount: number,
  lastUpdated: "最后更新时间"
}
```

---

## 表清单详情

> 以下表清单来源于 Neon 数据库实际查询结果。

### Community (cm)

| 表名                   | 说明     |
| ---------------------- | -------- |
| cm_communities         | 社区信息 |
| cm_notices             | 公告通知 |
| cm_handing_business    | 办事业务 |
| cm_house_decorations   | 装修管理 |
| cm_property_registers  | 住户登记 |
| cm_building_structures | 楼栋结构 |

### Contract (ct)

| 表名              | 说明     |
| ----------------- | -------- |
| ct_first_parties  | 合同甲方 |
| ct_second_parties | 合同乙方 |
| ct_templates      | 合同模板 |
| ct_clauses        | 合同条款 |
| ct_types          | 合同类型 |
| ct_contracts      | 合同记录 |
| ct_attachments    | 合同附件 |
| ct_changes        | 合同变更 |
| ct_reviews        | 合同审批 |
| ct_archives       | 合同归档 |
| ct_prints         | 合同打印 |

### Dev (dt)

| 表名                | 说明     |
| ------------------- | -------- |
| dt_config_types     | 配置类型 |
| dt_configs          | 配置管理 |
| dt_config_items     | 配置项   |
| dt_dictionaries     | 字典表   |
| dt_dictionary_items | 字典项   |
| dt_menu_groups      | 菜单分组 |
| dt_menu_catalogs    | 菜单目录 |
| dt_menu_items       | 菜单项   |
| dt_cache_configs    | 缓存配置 |

### Expense (ex)

| 表名                      | 说明     |
| ------------------------- | -------- |
| ex_expense_items          | 收费项目 |
| ex_house_charges          | 房屋收费 |
| ex_vehicle_charges        | 车辆收费 |
| ex_contract_charges       | 合同收费 |
| ex_payments               | 缴费记录 |
| ex_payment_reviews        | 缴费审批 |
| ex_refund_reviews         | 退款审批 |
| ex_discount_types         | 优惠类型 |
| ex_discount_settings      | 优惠配置 |
| ex_discount_applications  | 优惠申请 |
| ex_meter_reading_types    | 抄表类型 |
| ex_meter_readings         | 抄表记录 |
| ex_cancel_fees            | 费用取消 |
| ex_overdue_reminders      | 逾期提醒 |
| ex_reprint_vouchers       | 凭证重印 |
| ex_expense_summary_tables | 费用汇总 |

### House Property (hp)

| 表名                    | 说明       |
| ----------------------- | ---------- |
| hp_houses               | 房屋信息   |
| hp_owners               | 业主信息   |
| hp_owner_members        | 业主成员   |
| hp_owner_accounts       | 业主账户   |
| hp_invoices             | 发票记录   |
| hp_invoice_titles       | 发票抬头   |
| hp_reserve_venues       | 预约场地   |
| hp_reserve_venue_orders | 场地订单   |
| hp_site_managements     | 场地管理   |
| hp_owners_committees    | 业主委员会 |

### Operation (op)

| 表名                  | 说明       |
| --------------------- | ---------- |
| op_merchants          | 商家信息   |
| op_merchant_admins    | 商户管理员 |
| op_property_companies | 物业公司   |
| op_community_info     | 小区信息   |
| op_community_configs  | 小区配置   |
| op_report_groups      | 报表分组   |
| op_report_infos       | 报表信息   |
| op_report_components  | 报表组件   |
| op_register_protocols | 注册协议   |

### Parking (pk)

| 表名                    | 说明       |
| ----------------------- | ---------- |
| pk_parking_structures   | 停车场结构 |
| pk_parking_lots         | 车位信息   |
| pk_carports             | 车库/车位  |
| pk_owner_vehicles       | 业主车辆   |
| pk_carport_applications | 车位申请   |

### Patrol (pt)

| 表名                   | 说明     |
| ---------------------- | -------- |
| pt_patrol_plans        | 巡检计划 |
| pt_patrol_paths        | 巡检路线 |
| pt_patrol_points       | 巡检点位 |
| pt_patrol_items        | 巡检项目 |
| pt_patrol_tasks        | 巡检任务 |
| pt_patrol_task_details | 巡检详情 |

### Repairs (rp)

| 表名                       | 说明       |
| -------------------------- | ---------- |
| rp_repair_orders           | 报修工单   |
| rp_repair_order_histories  | 报修历史   |
| rp_return_visits           | 回访记录   |
| rp_repair_settings         | 报修配置   |
| rp_repair_types            | 报修类型   |
| rp_mandatory_return_issues | 必回访问题 |
| rp_phone_repair_reports    | 电话报修   |

### Report (rpt)

| 表名                      | 说明         |
| ------------------------- | ------------ |
| rpt_expense_summaries     | 费用汇总表   |
| rpt_deposit_reports       | 押金报表     |
| rpt_payment_details       | 缴费明细     |
| rpt_owner_payment_details | 业主缴费明细 |
| rpt_fee_reminders         | 欠费提醒     |
| rpt_no_charge_houses      | 未收费房屋   |
| rpt_outstanding_fees      | 欠费报表     |
| rpt_patrol_reports        | 巡检报表     |
| rpt_repair_reports        | 报修报表     |
| rpt_repair_summaries      | 报修汇总     |
| rpt_statement_expenses    | 对账单费用   |
| rpt_data_statistics       | 数据统计     |

### Setting (sm)

| 表名                        | 说明       |
| --------------------------- | ---------- |
| sm_organizations            | 组织架构   |
| sm_staff                    | 员工信息   |
| sm_roles                    | 角色定义   |
| sm_permissions              | 权限定义   |
| sm_role_permissions         | 角色权限   |
| sm_staff_roles              | 员工角色   |
| sm_data_permissions         | 数据权限   |
| sm_shifts                   | 班次管理   |
| sm_scheduling_settings      | 排班设置   |
| sm_working_schedules        | 工作日程   |
| sm_system_configs           | 系统配置   |
| sm_register_protocols       | 注册协议   |
| sm_initialize_cells         | 小区初始化 |
| sm_change_password_records  | 改密记录   |
| sm_community_configurations | 小区配置   |

### Auth (系统表)

| 表名              | 说明     |
| ----------------- | -------- |
| auth_roles        | 角色表   |
| auth_user_mapping | 用户映射 |
| auth_user_roles   | 用户角色 |

---

## 常见查询示例

### 示例 1：查询单个表的完整结构

```bash
# 查询房屋表结构
mcp__Neon__describe_table_schema {
  tableName: "hp_houses",
  projectId: "snowy-base-74751932"
}
```

### 示例 2：批量查询某模块所有表

```bash
# 查询费用模块所有表结构
const expenseTables = [
  "ex_expense_items", "ex_house_charges", "ex_vehicle_charges",
  "ex_contract_charges", "ex_payments", "ex_payment_reviews"
];

for (const table of expenseTables) {
  await mcp__Neon__describe_table_schema({
    tableName: table,
    projectId: "snowy-base-74751932"
  });
}
```

### 示例 3：查询表统计信息

```sql
-- 查询表行数
SELECT COUNT(*) as row_count FROM hp_houses;
SELECT COUNT(*) as row_count FROM sm_staff;
SELECT COUNT(*) as row_count FROM ex_payments;
```

### 示例 4：查询外键关系

```sql
-- 查询某表的所有外键
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'hp_houses';
```

---

## 错误处理

**严格模式**：任何表查询失败立即停止并报告详细错误。

常见错误及解决方案：

| 错误     | 原因            | 解决方案                         |
| -------- | --------------- | -------------------------------- |
| 表不存在 | 表名拼写错误    | 检查表名是否正确，参考上方表清单 |
| 权限不足 | Project ID 错误 | 确认使用的是正确的项目 ID        |
| 连接超时 | 网络问题        | 重试查询，确保网络通畅           |

---

## 相关技能

- `neon-postgres-zh` - Neon Serverless Postgres 中文文档
- `schema-and-seed-guardian` - Schema 与 Seed 数据生成指南
- `project-schema-registry` - 数据库 Schema 架构标准
