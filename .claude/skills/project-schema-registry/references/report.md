# Report Schema Reference

This reference documents the Reporting module.

## Expense Summary Reports Table

系统 SHALL 提供 `rpt_expense_summaries` 表存储费用汇总报表数据。

### Scenario: Store summary data

- **WHEN** 生成费用汇总报表
- **THEN** 系统存储统计周期、费用类型、应收总额、实收总额、欠费总额

### Scenario: Store dimension data

- **WHEN** 按维度统计
- **THEN** 系统存储小区、楼栋、费用项等维度信息

### Scenario: Associate with community

- **WHEN** 报表关联特定小区
- **THEN** 系统通过 `community_id` 外键关联到 `cm_communities` 表

## Deposit Reports Table

系统 SHALL 提供 `rpt_deposit_reports` 表存储押金报表数据。

### Scenario: Store deposit data

- **WHEN** 统计押金信息
- **THEN** 系统存储押金类型、收取总额、退还总额、在押总额

### Scenario: Store period data

- **WHEN** 按周期统计
- **THEN** 系统存储统计开始日期、统计结束日期

## Payment Details Reports Table

系统 SHALL 提供 `rpt_payment_details` 表存储缴费明细报表数据。

### Scenario: Store payment detail

- **WHEN** 记录缴费明细
- **THEN** 系统存储业主姓名、房屋编号、费用项目、缴费金额、缴费时间

### Scenario: Store payment method

- **WHEN** 记录支付方式
- **THEN** 系统存储支付方式、交易流水号、收款人

## Owner Payment Details Table

系统 SHALL 提供 `rpt_owner_payment_details` 表存储业主缴费明细。

### Scenario: Store owner payment

- **WHEN** 统计业主缴费情况
- **THEN** 系统存储业主姓名、累计应缴、累计已缴、累计欠费

### Scenario: Associate with owner

- **WHEN** 明细关联特定业主
- **THEN** 系统通过 `owner_id` 外键关联到 `hp_owners` 表

## Fee Reminders Table

系统 SHALL 提供 `rpt_fee_reminders` 表存储催费提醒记录。

### Scenario: Store reminder record

- **WHEN** 生成催费提醒
- **THEN** 系统存储业主信息、欠费金额、提醒方式、提醒时间

### Scenario: Track reminder result

- **WHEN** 记录提醒结果
- **THEN** 系统存储是否送达、业主反馈

## No Charge Houses Table

系统 SHALL 提供 `rpt_no_charge_houses` 表存储未收费房屋统计。

### Scenario: Store no charge house

- **WHEN** 统计未产生收费的房屋
- **THEN** 系统存储房屋编号、业主信息、未收费原因、最后收费日期

## Outstanding Fees Analysis Table

系统 SHALL 提供 `rpt_outstanding_fees` 表存储欠费分析数据。

### Scenario: Store outstanding fee

- **WHEN** 分析欠费情况
- **THEN** 系统存储欠费账龄、欠费金额、欠费户数

### Scenario: Store analysis dimension

- **WHEN** 按维度分析
- **THEN** 系统存储小区、楼栋、费用项等维度

## Patrol Reports Table

系统 SHALL 提供 `rpt_patrol_reports` 表存储巡检报表数据。

### Scenario: Store patrol statistics

- **WHEN** 统计巡检情况
- **THEN** 系统存储计划任务数、完成任务数、异常任务数、按时完成率

### Scenario: Store period data

- **WHEN** 按周期统计
- **THEN** 系统存储统计周期、统计维度

## Repair Reports Table

系统 SHALL 提供 `rpt_repair_reports` 表存储维修报表数据。

### Scenario: Store repair statistics

- **WHEN** 统计维修情况
- **THEN** 系统存储报修总数、已完成数、待处理数、平均处理时长

### Scenario: Store satisfaction data

- **WHEN** 统计满意度
- **THEN** 系统存储满意率、不满意原因分布

## Repair Summary Reports Table

系统 SHALL 提供 `rpt_repair_summaries` 表存储维修汇总报表。

### Scenario: Store repair summary

- **WHEN** 汇总维修数据
- **THEN** 系统存储维修类型分布、维修人员工作量、维修成本统计

## Statement Expenses Table

系统 SHALL 提供 `rpt_statement_expenses` 表存储费用报表数据。

### Scenario: Store statement data

- **WHEN** 生成费用报表
- **THEN** 系统存储报表类型、报表周期、数据快照

## Data Statistics Table

系统 SHALL 提供 `rpt_data_statistics` 表存储综合数据统计。

### Scenario: Store statistics data

- **WHEN** 统计综合数据
- **THEN** 系统存储统计指标、统计值、统计时间、对比基准值

## Report Module Indexes

系统 SHALL 为报表管理模块表创建必要的索引。

### Scenario: Period query optimization

- **WHEN** 按统计周期查询
- **THEN** 报表表的 `period_start` 和 `period_end` 字段有索引

### Scenario: Community filter optimization

- **WHEN** 按小区筛选报表
- **THEN** 报表表的 `community_id` 字段有索引
