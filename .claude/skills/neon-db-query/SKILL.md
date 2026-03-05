---
name: neon-db-query
description: 项目数据库表清单与批量查询工具。提供项目中所有数据库表的完整列表，并支持使用 Neon MCP 批量查询表结构信息（字段、索引、外键），用于 seed 数据生成参考。当你需要验证表名、理解数据库结构、检查数据库 Schema 定义、批量查询全部表数据、或为 seed 数据生成获取表结构参考时，必须使用此技能。
---

# Neon 数据库表查询技能

> 此技能整合并扩展了原有的 `neon-db-list` 功能，不仅提供数据库表清单，还支持批量查询表结构。

## 功能概述

1. **数据库表清单** - 列出项目中所有数据库表
2. **批量表结构查询** - 使用 Neon MCP 批量查询所有表的结构信息
3. **开发参考输出** - 提供字段信息、外键关系、索引等，用于 seed 数据生成

## 使用场景

- 开发 seed 数据时，快速查询某模块/表的数据情况
- 批量查询项目中全部表的数据结构
- 在做数据迁移或表结构调整前，全面了解现有数据
- 为 seed 数据生成获取表结构参考

## 数据库表清单

> 以下是项目中所有数据库表的完整列表。详细信息请参考各模块章节。

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

或者使用 Neon MCP 工具 `mcp__Neon__search` 搜索项目：

```bash
mcp__Neon__search {query: "01s-11comm"}
```

#### 步骤 2：获取数据库表列表

使用以下方式获取项目中所有数据库表：

**方式 A：通过 MCP 工具直接获取**

```bash
mcp__Neon__get_database_tables {projectId: "your-project-id"}
```

**方式 B：参考上方表清单**

直接参考本技能中的数据库表清单，手动选择需要查询的表。

#### 步骤 3：批量查询表结构

使用 `describe_table_schema` MCP 工具批量查询表结构：

```bash
# 查询单张表的结构
mcp__Neon__describe_table_schema {
  tableName: "表名",
  projectId: "your-project-id"
}
```

**重要**：必须使用正确的表名格式：

- Drizzle 表名（如 `cmCommunities`）
- 或带引号的 SQL 表名（如 `"ct_types"`）

#### 步骤 4：查询表统计信息

查询表的行数和数据量：

```sql
SELECT COUNT(*) as row_count FROM {table_name};
```

### 批量查询策略

#### 策略 1：全量查询（推荐用于 seed 开发）

一次性查询所有表的结构信息：

```typescript
// 需要查询的表列表（按模块分组）
const tables = [
	// Community 模块
	"cmCommunities",
	"cmNotices",
	"cmHandingBusiness",
	"cmHouseDecorations",
	"cmPropertyRegisters",
	"cmBuildingStructures",
	// ... 其他模块
];

// 遍历查询每张表
for (const table of tables) {
	await mcp__Neon__describe_table_schema({
		tableName: table,
		projectId: "your-project-id",
	});
}
```

#### 策略 2：按模块查询

按业务模块分组查询：

```typescript
const moduleTables = {
  community: ["cmCommunities", "cmNotices", ...],
  expense: ["exExpenseItems", "exPayments", ...],
  // ...
};

// 按模块批量查询
for (const [module, tables] of Object.entries(moduleTables)) {
  console.log(`\n=== ${module} 模块 ===`);
  for (const table of tables) {
    const schema = await mcp__Neon__describe_table_schema({
      tableName: table,
      projectId: "your-project-id"
    });
    // 处理返回的结构信息
  }
}
```

#### 策略 3：按需查询

只查询特定的表：

```bash
# 只查询需要的表
mcp__Neon__describe_table_schema {tableName: "hpHouses", projectId: "..."}
mcp__Neon__describe_table_schema {tableName: "smStaff", projectId: "..."}
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

### Community (cm)

来源: `apps\admin\server\db\schemas\community.ts`

| 表名                 | 说明     | 典型用途       |
| -------------------- | -------- | -------------- |
| cmCommunities        | 社区信息 | 小区基础数据   |
| cmNotices            | 公告通知 | 社区公告       |
| cmHandingBusiness    | 办事业务 | 社区业务办理   |
| cmHouseDecorations   | 装修管理 | 装修申请/记录  |
| cmPropertyRegisters  | 住户登记 | 业主登记       |
| cmBuildingStructures | 楼栋结构 | 楼栋/单元/房号 |

### Contract (ct)

来源: `apps\admin\server\db\schemas\contract.ts`

| 表名            | 说明     | 典型用途      |
| --------------- | -------- | ------------- |
| ctFirstParties  | 合同甲方 | 甲方信息管理  |
| ctSecondParties | 合同乙方 | 乙方信息管理  |
| ctTemplates     | 合同模板 | 合同模板配置  |
| ctClauses       | 合同条款 | 模板条款管理  |
| ctTypes         | 合同类型 | 合同分类      |
| ctContracts     | 合同记录 | 合同签订/管理 |
| ctAttachments   | 合同附件 | 合同文件上传  |
| ctChanges       | 合同变更 | 合同变更记录  |
| ctReviews       | 合同审批 | 合同审核流程  |
| ctArchives      | 合同归档 | 合同归档管理  |
| ctPrints        | 合同打印 | 打印记录      |

### Dev (dt)

来源: `apps/type/src/business/setting-manage/dictionary-manage/schema.ts`
来源: `apps/type/src/business/setting-manage/menu-manage/schema.ts`

| 表名              | 说明     | 典型用途      |
| ----------------- | -------- | ------------- |
| dtConfigTypes     | 配置类型 | 系统配置分类  |
| dtConfigs         | 配置管理 | 系统参数配置  |
| dtConfigItems     | 配置项   | 配置明细      |
| dtDictionaries    | 字典表   | 数据字典      |
| dtDictionaryItems | 字典项   | 字典值管理    |
| dtMenuGroups      | 菜单分组 | 菜单分类      |
| dtMenuCatalogs    | 菜单目录 | 菜单架构      |
| dtMenuItems       | 菜单项   | 菜单按钮/权限 |
| dtCacheConfigs    | 缓存配置 | 缓存策略管理  |

### Expense (ex)

来源: `apps/type/src/business/property-manage/expense-manage/schema.ts`

| 表名                   | 说明     | 典型用途     |
| ---------------------- | -------- | ------------ |
| exExpenseItems         | 收费项目 | 费用项目定义 |
| exHouseCharges         | 房屋收费 | 房产费用计算 |
| exVehicleCharges       | 车辆收费 | 车位费用管理 |
| exContractCharges      | 合同收费 | 合同费用     |
| exPayments             | 缴费记录 | 住户缴费     |
| exPaymentReviews       | 缴费审批 | 缴费审核     |
| exRefundReviews        | 退款审批 | 退款审核     |
| exDiscountTypes        | 优惠类型 | 折扣分类     |
| exDiscountSettings     | 优惠配置 | 折扣设置     |
| exDiscountApplications | 优惠申请 | 优惠申请     |
| exMeterReadingTypes    | 抄表类型 | 水电表分类   |
| exMeterReadings        | 抄表记录 | 抄表数据     |
| exCancelFees           | 费用取消 | 取消费用     |
| exOverdueReminders     | 逾期提醒 | 欠费通知     |
| exReprintVouchers      | 凭证重印 | 收据重打     |
| exExpenseSummaryTables | 费用汇总 | 月度统计     |

### House Property (hp)

来源: `apps\admin\server\db\schemas\house-property.ts`

| 表名                 | 说明       | 典型用途 |
| -------------------- | ---------- | -------- |
| hpHouses             | 房屋信息   | 房产管理 |
| hpOwners             | 业主信息   | 业主档案 |
| hpOwnerMembers       | 业主成员   | 家庭成员 |
| hpOwnerAccounts      | 业主账户   | 账户管理 |
| hpInvoices           | 发票记录   | 发票开具 |
| hpInvoiceTitles      | 发票抬头   | 开票信息 |
| hpReserveVenues      | 预约场地   | 场地预约 |
| hpReserveVenueOrders | 场地订单   | 预约记录 |
| hpSiteManagements    | 场地管理   | 场地配置 |
| hpOwnersCommittees   | 业主委员会 | 委会管理 |

### Operation (op)

来源: `apps\admin\server\db\schemas\operation.ts`

| 表名                | 说明       | 典型用途 |
| ------------------- | ---------- | -------- |
| opMerchants         | 商家信息   | 商户管理 |
| opMerchantAdmins    | 商户管理员 | 商户账号 |
| opPropertyCompanies | 物业公司   | 公司信息 |
| opCommunityInfo     | 小区信息   | 社区数据 |
| opCommunityConfigs  | 小区配置   | 社区配置 |
| opReportGroups      | 报表分组   | 报表分类 |
| opReportInfos       | 报表信息   | 报表定义 |
| opReportComponents  | 报表组件   | 报表元素 |
| opRegisterProtocols | 注册协议   | 用户协议 |

### Parking (pk)

来源: `apps\admin\server\db\schemas\parking.ts`

| 表名                  | 说明       | 典型用途   |
| --------------------- | ---------- | ---------- |
| pkParkingStructures   | 停车场结构 | 车库/层/区 |
| pkParkingLots         | 车位信息   | 车位管理   |
| pkCarports            | 车库/车位  | 车位详情   |
| pkOwnerVehicles       | 业主车辆   | 车辆登记   |
| pkCarportApplications | 车位申请   | 购买/租赁  |

### Patrol (pt)

来源: `apps\admin\server\db\schemas\patrol.ts`

| 表名                | 说明     | 典型用途 |
| ------------------- | -------- | -------- |
| ptPatrolPlans       | 巡检计划 | 计划制定 |
| ptPatrolPaths       | 巡检路线 | 路线规划 |
| ptPatrolPoints      | 巡检点位 | 点位管理 |
| ptPatrolItems       | 巡检项目 | 检查项   |
| ptPatrolTasks       | 巡检任务 | 任务下发 |
| ptPatrolTaskDetails | 巡检详情 | 任务记录 |

### Repairs (rp)

来源: `apps\admin\server\db\schemas\repairs.ts`

| 表名                    | 说明       | 典型用途   |
| ----------------------- | ---------- | ---------- |
| rpRepairOrders          | 报修工单   | 报修申请   |
| rpRepairOrderHistories  | 报修历史   | 处理记录   |
| rpReturnVisits          | 回访记录   | 满意度调查 |
| rpRepairSettings        | 报修配置   | 设置项     |
| rpRepairTypes           | 报修类型   | 分类管理   |
| rpMandatoryReturnIssues | 必回访问题 | 强制回访   |
| rpPhoneRepairReports    | 电话报修   | 来电记录   |

### Report (rpt)

来源: `apps\admin\server\db\schemas\report.ts`

| 表名                   | 说明         | 典型用途 |
| ---------------------- | ------------ | -------- |
| rptExpenseSummaries    | 费用汇总表   | 财务统计 |
| rptDepositReports      | 押金报表     | 押金管理 |
| rptPaymentDetails      | 缴费明细     | 收费明细 |
| rptOwnerPaymentDetails | 业主缴费明细 | 个人账单 |
| rptFeeReminders        | 欠费提醒     | 催费通知 |
| rptNoChargeHouses      | 未收费房屋   | 欠费房产 |
| rptOutstandingFees     | 欠费报表     | 欠费统计 |
| rptPatrolReports       | 巡检报表     | 巡检统计 |
| rptRepairReports       | 报修报表     | 维修统计 |
| rptRepairSummaries     | 报修汇总     | 维修汇总 |
| rptStatementExpenses   | 对账单费用   | 财务对账 |
| rptDataStatistics      | 数据统计     | 综合统计 |

### Setting (sm)

来源: `apps\admin\server\db\schemas\setting.ts`
来源: `apps/type/src/business/setting-manage/system-manage/schema.ts`

| 表名                      | 说明       | 典型用途   |
| ------------------------- | ---------- | ---------- |
| smOrganizations           | 组织架构   | 部门/公司  |
| smStaff                   | 员工信息   | 人员管理   |
| smRoles                   | 角色定义   | 角色配置   |
| smPermissions             | 权限定义   | 功能权限   |
| smRolePermissions         | 角色权限   | 权限分配   |
| smStaffRoles              | 员工角色   | 角色绑定   |
| smDataPermissions         | 数据权限   | 字段级权限 |
| smShifts                  | 班次管理   | 排班配置   |
| smSchedulingSettings      | 排班设置   | 排班规则   |
| smWorkingSchedules        | 工作日程   | 日程管理   |
| smSystemConfigs           | 系统配置   | 系统参数   |
| smRegisterProtocols       | 注册协议   | 用户注册   |
| smInitializeCells         | 小区初始化 | 初始化配置 |
| smChangePasswordRecords   | 改密记录   | 密码变更   |
| smCommunityConfigurations | 小区配置   | 社区设置   |

---

## 常见查询示例

### 示例 1：查询单个表的完整结构

```bash
# 查询房屋表结构
mcp__Neon__describe_table_schema {
  tableName: "hpHouses",
  projectId: "your-project-id"
}
```

### 示例 2：批量查询某模块所有表

```bash
# 查询费用模块所有表结构
const expenseTables = [
  "exExpenseItems", "exHouseCharges", "exVehicleCharges",
  "exContractCharges", "exPayments", "exPaymentReviews"
];

for (const table of expenseTables) {
  await mcp__Neon__describe_table_schema({
    tableName: table,
    projectId: "your-project-id"
  });
}
```

### 示例 3：查询表统计信息

```sql
-- 查询表行数
SELECT COUNT(*) as row_count FROM hpHouses;
SELECT COUNT(*) as row_count FROM smStaff;
SELECT COUNT(*) as row_count FROM exPayments;
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
    AND tc.table_name = 'hpHouses';
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
