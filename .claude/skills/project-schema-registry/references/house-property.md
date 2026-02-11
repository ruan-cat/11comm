# House Property Schema Reference

This reference documents the House Property module.

## Houses Table

系统 SHALL 提供 `hp_houses` 表存储房屋基础信息。

### Scenario: Store house location

- **WHEN** 录入房屋信息
- **THEN** 系统存储楼栋号、单元号、楼层、房间号、房屋编号

### Scenario: Store house details

- **WHEN** 记录房屋详细信息
- **THEN** 系统存储建筑面积、使用面积、房屋类型、房屋状态

### Scenario: Associate with community

- **WHEN** 房屋属于特定小区
- **THEN** 系统通过 `community_id` 外键关联到 `cm_communities` 表

## Owners Table

系统 SHALL 提供 `hp_owners` 表存储业主信息。

### Scenario: Store owner basic info

- **WHEN** 录入业主信息
- **THEN** 系统存储业主姓名、身份证号、手机号、性别

### Scenario: Store owner contact info

- **WHEN** 记录业主联系方式
- **THEN** 系统存储邮箱、家庭地址、紧急联系人

### Scenario: Support soft delete

- **WHEN** 删除业主信息
- **THEN** 系统使用软删除机制，设置 `deleted_at` 字段而非物理删除

## Owner Members Table

系统 SHALL 提供 `hp_owner_members` 表存储业主家庭成员信息。

### Scenario: Store member basic info

- **WHEN** 录入家庭成员信息
- **THEN** 系统存储成员姓名、性别、成员类型（家人/租户/使用人）、身份证号

### Scenario: Store member contact

- **WHEN** 记录成员联系方式
- **THEN** 系统存储手机号、家庭住址

### Scenario: Store member face data

- **WHEN** 录入门禁人脸信息
- **THEN** 系统存储人脸照片 URL、门禁钥匙信息

### Scenario: Associate with owner

- **WHEN** 成员属于特定业主
- **THEN** 系统通过 `owner_id` 外键关联到 `hp_owners` 表

## Owner Accounts Table

系统 SHALL 提供 `hp_owner_accounts` 表存储业主账户信息。

### Scenario: Store account info

- **WHEN** 创建业主预存账户
- **THEN** 系统存储账户编号、账户名称、账户类型、账户余额

### Scenario: Associate with owner

- **WHEN** 账户属于特定业主
- **THEN** 系统通过 `owner_id` 外键关联到 `hp_owners` 表

### Scenario: Store deduction house

- **WHEN** 设置扣款关联房屋
- **THEN** 系统存储扣款房号信息

## Invoices Table

系统 SHALL 提供 `hp_invoices` 表存储发票信息。

### Scenario: Store invoice info

- **WHEN** 开具发票
- **THEN** 系统存储发票号码、发票类型、开票金额、开票日期

### Scenario: Associate with payment

- **WHEN** 发票关联缴费记录
- **THEN** 系统通过 `payment_id` 外键关联到支付记录

## Invoice Titles Table

系统 SHALL 提供 `hp_invoice_titles` 表存储发票抬头信息。

### Scenario: Store invoice title

- **WHEN** 业主设置发票抬头
- **THEN** 系统存储抬头名称、纳税人识别号、地址电话、开户银行及账号

### Scenario: Associate with owner

- **WHEN** 抬头属于特定业主
- **THEN** 系统通过 `owner_id` 外键关联到 `hp_owners` 表

## Reserve Venues Table

系统 SHALL 提供 `hp_reserve_venues` 表存储可预约场地信息。

### Scenario: Store venue info

- **WHEN** 设置可预约场地
- **THEN** 系统存储场地名称、场地类型、容纳人数、开放时间、收费标准

### Scenario: Store venue status

- **WHEN** 管理场地状态
- **THEN** 系统存储场地状态（可预约/维护中）

## Reserve Venue Orders Table

系统 SHALL 提供 `hp_reserve_venue_orders` 表存储场地预约订单。

### Scenario: Store booking order

- **WHEN** 业主预约场地
- **THEN** 系统存储预约人、联系电话、预约时间段、预约状态

### Scenario: Associate with venue

- **WHEN** 订单关联特定场地
- **THEN** 系统通过 `venue_id` 外键关联到 `hp_reserve_venues` 表

## Site Management Table

系统 SHALL 提供 `hp_site_managements` 表存储场地管理信息。

### Scenario: Store site management

- **WHEN** 管理公共场地
- **THEN** 系统存储场地名称、位置、管理员、维护记录

## Owners Committee Table

系统 SHALL 提供 `hp_owners_committees` 表存储业主委员会信息。

### Scenario: Store committee info

- **WHEN** 设立业主委员会
- **THEN** 系统存储委员会名称、成立日期、届次、主任、联系电话

### Scenario: Store committee members

- **WHEN** 记录委员会成员
- **THEN** 系统存储成员名单、职务、任期

## House Property Module Indexes

系统 SHALL 为房产管理模块表创建必要的索引。

### Scenario: Owner query optimization

- **WHEN** 按业主姓名或手机号查询
- **THEN** `hp_owners` 表的 `name` 和 `phone` 字段有索引

### Scenario: House query optimization

- **WHEN** 按房屋编号查询
- **THEN** `hp_houses` 表的 `house_number` 字段有索引
