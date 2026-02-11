# Operation Schema Reference

This reference documents the Operation Team module (Merchants, Property Companies).

## Merchants Table

系统 SHALL 提供 `op_merchants` 表存储商户信息。

### Scenario: Store merchant basic info

- **WHEN** 录入商户信息
- **THEN** 系统存储商户名称、商户编码、商户类型、联系人、联系电话

### Scenario: Store merchant legal info

- **WHEN** 记录商户法律信息
- **THEN** 系统存储营业执照号、法人代表、注册地址、注册资本、成立时间

### Scenario: Store merchant business info

- **WHEN** 记录商户经营信息
- **THEN** 系统存储经营地址、经营范围、营业时间、营业面积

### Scenario: Store merchant contract info

- **WHEN** 记录商户合作信息
- **THEN** 系统存储服务小区、合同开始时间、合同结束时间

### Scenario: Store merchant bank info

- **WHEN** 记录商户结算信息
- **THEN** 系统存储银行名称、银行账户

## Merchant Admins Table

系统 SHALL 提供 `op_merchant_admins` 表存储商户管理员信息。

### Scenario: Store admin info

- **WHEN** 添加商户管理员
- **THEN** 系统存储管理员姓名、手机号、邮箱、账号、角色

### Scenario: Associate with merchant

- **WHEN** 管理员属于特定商户
- **THEN** 系统通过 `merchant_id` 外键关联到 `op_merchants` 表

## Property Companies Table

系统 SHALL 提供 `op_property_companies` 表存储物业公司信息。

### Scenario: Store company basic info

- **WHEN** 录入物业公司
- **THEN** 系统存储公司名称、公司编码、联系人、联系电话、地址

### Scenario: Store company qualification

- **WHEN** 记录公司资质
- **THEN** 系统存储资质等级、资质证书号、资质有效期

## Community Information Table

系统 SHALL 提供 `op_community_info` 表存储运营侧小区信息。

### Scenario: Store community operation info

- **WHEN** 管理小区运营信息
- **THEN** 系统存储运营状态、管理员、运营配置

### Scenario: Associate with community

- **WHEN** 信息关联特定小区
- **THEN** 系统通过 `community_id` 外键关联到 `cm_communities` 表

## Community Configurations Table

系统 SHALL 提供 `op_community_configs` 表存储小区配置。

### Scenario: Store community config

- **WHEN** 配置小区参数
- **THEN** 系统存储配置类型、配置键、配置值、配置分组

### Scenario: Associate with community

- **WHEN** 配置关联特定小区
- **THEN** 系统通过 `community_id` 外键关联到 `cm_communities` 表

## Report Groups Table

系统 SHALL 提供 `op_report_groups` 表存储报表分组配置。

### Scenario: Store group info

- **WHEN** 创建报表分组
- **THEN** 系统存储分组名称、分组编码、分组描述、排序号

## Report Infos Table

系统 SHALL 提供 `op_report_infos` 表存储报表信息配置。

### Scenario: Store report info

- **WHEN** 配置报表信息
- **THEN** 系统存储报表名称、报表编码、报表类型、数据源配置

### Scenario: Associate with group

- **WHEN** 报表属于特定分组
- **THEN** 系统通过 `group_id` 外键关联到 `op_report_groups` 表

## Report Components Table

系统 SHALL 提供 `op_report_components` 表存储报表组件配置。

### Scenario: Store component info

- **WHEN** 配置报表组件
- **THEN** 系统存储组件名称、组件类型、组件配置 JSON

### Scenario: Associate with report

- **WHEN** 组件属于特定报表
- **THEN** 系统通过 `report_id` 外键关联到 `op_report_infos` 表

## Operation Register Protocols Table

系统 SHALL 提供 `op_register_protocols` 表存储运营侧注册协议。

### Scenario: Store protocol info

- **WHEN** 配置平台级注册协议
- **THEN** 系统存储协议类型、协议标题、协议内容、是否必读

## Operation Module Indexes

系统 SHALL 为运营团队模块表创建必要的索引。

### Scenario: Merchant query optimization

- **WHEN** 按商户名称或编码查询
- **THEN** `op_merchants` 表的 `merchant_name` 和 `merchant_code` 字段有索引

### Scenario: Company query optimization

- **WHEN** 按物业公司名称查询
- **THEN** `op_property_companies` 表的 `company_name` 字段有索引
