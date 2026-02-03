## ADDED Requirements

### Requirement: Expense Items Table

系统 SHALL 提供 `ex_expense_items` 表存储收费项目配置。

#### Scenario: Store expense item config

- **WHEN** 配置收费项目
- **THEN** 系统存储费用类型、收费项目名称、费用标识、付费类型

#### Scenario: Store billing rules

- **WHEN** 设置计费规则
- **THEN** 系统存储计费单价、固定费用、计算公式、缴费周期

#### Scenario: Store billing options

- **WHEN** 配置缴费选项
- **THEN** 系统存储账户抵扣开关、手机缴费开关、进位方式、保留小数位

### Requirement: House Charges Table

系统 SHALL 提供 `ex_house_charges` 表存储房屋收费记录。

#### Scenario: Store charge record

- **WHEN** 生成房屋费用账单
- **THEN** 系统存储房屋编号、费用项目、应收金额、实收金额、账单周期

#### Scenario: Track payment status

- **WHEN** 管理缴费状态
- **THEN** 系统支持未缴费/已缴费/部分缴费/逾期状态

#### Scenario: Associate with house

- **WHEN** 费用关联特定房屋
- **THEN** 系统通过 `house_id` 外键关联到 `hp_houses` 表

### Requirement: Vehicle Charges Table

系统 SHALL 提供 `ex_vehicle_charges` 表存储车辆收费记录。

#### Scenario: Store vehicle charge

- **WHEN** 生成车辆费用账单
- **THEN** 系统存储车牌号、车位编号、费用类型、应收金额、账单周期

#### Scenario: Associate with vehicle

- **WHEN** 费用关联特定车辆
- **THEN** 系统通过 `vehicle_id` 外键关联到 `pk_owner_vehicles` 表

### Requirement: Contract Charges Table

系统 SHALL 提供 `ex_contract_charges` 表存储合同收费记录。

#### Scenario: Store contract charge

- **WHEN** 根据合同生成费用
- **THEN** 系统存储合同编号、费用项目、应收金额、收费周期

#### Scenario: Associate with contract

- **WHEN** 费用关联特定合同
- **THEN** 系统通过 `contract_id` 外键关联到 `ct_contracts` 表

### Requirement: Payments Table

系统 SHALL 提供 `ex_payments` 表存储缴费记录。

#### Scenario: Store payment record

- **WHEN** 业主完成缴费
- **THEN** 系统存储支付金额、支付方式、支付时间、交易流水号

#### Scenario: Associate with charge

- **WHEN** 支付关联费用账单
- **THEN** 系统通过 `charge_id` 外键关联到费用记录

#### Scenario: Support soft delete

- **WHEN** 删除支付记录
- **THEN** 系统使用软删除机制，保留交易历史

### Requirement: Payment Reviews Table

系统 SHALL 提供 `ex_payment_reviews` 表存储缴费审核记录。

#### Scenario: Store review record

- **WHEN** 人工缴费需要审核
- **THEN** 系统存储审核人、审核意见、审核结果、审核时间

### Requirement: Refund Reviews Table

系统 SHALL 提供 `ex_refund_reviews` 表存储退费审核记录。

#### Scenario: Store refund application

- **WHEN** 申请退费
- **THEN** 系统存储退费原因、退费金额、申请时间、关联收费记录

#### Scenario: Track refund status

- **WHEN** 管理退费状态
- **THEN** 系统支持待审核/已通过/已拒绝/已退款状态

### Requirement: Discount Types Table

系统 SHALL 提供 `ex_discount_types` 表存储折扣类型配置。

#### Scenario: Store discount type

- **WHEN** 配置折扣类型
- **THEN** 系统存储折扣名称、折扣类型（比例/固定金额/减免期）、折扣值

### Requirement: Discount Settings Table

系统 SHALL 提供 `ex_discount_settings` 表存储折扣设置。

#### Scenario: Store discount rule

- **WHEN** 设置折扣规则
- **THEN** 系统存储适用费用项、折扣类型、有效期、适用条件

### Requirement: Discount Applications Table

系统 SHALL 提供 `ex_discount_applications` 表存储折扣申请记录。

#### Scenario: Store discount application

- **WHEN** 业主申请折扣
- **THEN** 系统存储申请类型、申请原因、申请金额、审核状态

### Requirement: Meter Reading Types Table

系统 SHALL 提供 `ex_meter_reading_types` 表存储表计类型配置。

#### Scenario: Store meter type

- **WHEN** 配置表计类型
- **THEN** 系统存储类型名称（水表/电表/燃气表）、单价、计费方式

### Requirement: Meter Readings Table

系统 SHALL 提供 `ex_meter_readings` 表存储表计抄读记录。

#### Scenario: Store reading record

- **WHEN** 抄表员录入读数
- **THEN** 系统存储表计编号、本期读数、上期读数、用量、抄表日期

#### Scenario: Associate with house

- **WHEN** 表计关联特定房屋
- **THEN** 系统通过 `house_id` 外键关联到 `hp_houses` 表

### Requirement: Cancel Fees Table

系统 SHALL 提供 `ex_cancel_fees` 表存储费用核销记录。

#### Scenario: Store cancel record

- **WHEN** 核销费用
- **THEN** 系统存储核销金额、核销原因、核销日期、操作人

### Requirement: Overdue Reminders Table

系统 SHALL 提供 `ex_overdue_reminders` 表存储逾期催缴记录。

#### Scenario: Store reminder record

- **WHEN** 催缴逾期费用
- **THEN** 系统存储催缴方式、催缴时间、催缴结果、催缴人

### Requirement: Reprint Vouchers Table

系统 SHALL 提供 `ex_reprint_vouchers` 表存储凭证重打记录。

#### Scenario: Store reprint record

- **WHEN** 重打缴费凭证
- **THEN** 系统存储原凭证号、重打原因、重打时间、操作人

### Requirement: Expense Module Indexes

系统 SHALL 为费用管理模块表创建必要的索引。

#### Scenario: Charge query optimization

- **WHEN** 按房屋和账单周期查询
- **THEN** `ex_house_charges` 表的 `house_id` 和 `billing_period` 字段有复合索引

#### Scenario: Payment status optimization

- **WHEN** 按支付状态筛选
- **THEN** 费用表的 `status` 字段有索引
