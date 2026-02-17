# Repairs Schema Reference

This reference documents the Repairs Management module.

## Repair Orders Table

系统 SHALL 提供 `rp_repair_orders` 表存储报修工单。

### Scenario: Store order basic info

- **WHEN** 创建报修工单
- **THEN** 系统存储工单编号、报修类型、维修类型、报修来源

### Scenario: Store reporter info

- **WHEN** 记录报修人信息
- **THEN** 系统存储报修人姓名、联系方式、报修位置

### Scenario: Store order content

- **WHEN** 记录报修内容
- **THEN** 系统存储问题描述、报修照片 URL、预约时间

### Scenario: Track order status

- **WHEN** 管理工单状态
- **THEN** 系统支持待处理/处理中/已完成/已取消/已暂停状态

### Scenario: Store assignment info

- **WHEN** 指派维修人员
- **THEN** 系统存储指派人、指派时间、维修人员、计划完成时间

### Scenario: Support soft delete

- **WHEN** 删除报修工单
- **THEN** 系统使用软删除机制，保留历史记录

## Repair Order Histories Table

系统 SHALL 提供 `rp_repair_order_histories` 表存储工单操作历史。

### Scenario: Store operation history

- **WHEN** 工单状态变更
- **THEN** 系统存储操作类型、操作人、操作时间、操作说明

### Scenario: Associate with order

- **WHEN** 历史关联特定工单
- **THEN** 系统通过 `order_id` 外键关联到 `rp_repair_orders` 表，级联删除

## Return Visits Table

系统 SHALL 提供 `rp_return_visits` 表存储回访记录。

### Scenario: Store visit record

- **WHEN** 完成报修回访
- **THEN** 系统存储回访人、回访时间、回访方式、满意度评价

### Scenario: Store visit result

- **WHEN** 记录回访结果
- **THEN** 系统存储回访状态（未回访/已回访/满意/不满意）、回访备注

### Scenario: Associate with order

- **WHEN** 回访关联特定工单
- **THEN** 系统通过 `order_id` 外键关联到 `rp_repair_orders` 表

## Repair Settings Table

系统 SHALL 提供 `rp_repair_settings` 表存储报修设置。

### Scenario: Store setting config

- **WHEN** 配置报修设置
- **THEN** 系统存储设置类型（保洁单/维修单）、派单方式（抢单/指派/轮训）

### Scenario: Store service area

- **WHEN** 配置服务区域
- **THEN** 系统存储适用区域（房屋/公共区域/车库/非房屋）

### Scenario: Store time config

- **WHEN** 配置时限要求
- **THEN** 系统存储处理时限、回访时限

## Repair Types Table

系统 SHALL 提供 `rp_repair_types` 表存储报修类型配置。

### Scenario: Store repair type

- **WHEN** 配置报修类型
- **THEN** 系统存储类型名称（水管/电路/门窗/电梯/消防等）、类型描述、排序号

## Mandatory Return Issues Table

系统 SHALL 提供 `rp_mandatory_return_issues` 表存储强制回单记录。

### Scenario: Store mandatory return

- **WHEN** 强制要求维修人员回单
- **THEN** 系统存储工单编号、强制回单原因、强制回单时间

### Scenario: Track return status

- **WHEN** 管理回单状态
- **THEN** 系统支持待回单/已回单/已强制回单状态

## Phone Repair Reports Table

系统 SHALL 提供 `rp_phone_repair_reports` 表存储电话报修记录。

### Scenario: Store phone report

- **WHEN** 接听电话报修
- **THEN** 系统存储来电号码、来电时间、接听人、报修内容摘要

### Scenario: Associate with order

- **WHEN** 电话报修转工单
- **THEN** 系统通过 `order_id` 外键可选关联到 `rp_repair_orders` 表

## Repairs Module Indexes

系统 SHALL 为报修管理模块表创建必要的索引。

### Scenario: Order query optimization

- **WHEN** 按工单编号查询
- **THEN** `rp_repair_orders` 表的 `work_order_number` 字段有唯一索引

### Scenario: Status filter optimization

- **WHEN** 按工单状态筛选
- **THEN** `rp_repair_orders` 表的 `status` 字段有索引

### Scenario: Time range optimization

- **WHEN** 按时间范围查询
- **THEN** `rp_repair_orders` 表的 `create_time` 字段有索引
