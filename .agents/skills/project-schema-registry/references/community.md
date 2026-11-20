# Community Schema Reference

This reference documents the database tables and requirements for the Community Management module.

## Communities Table

系统 SHALL 提供 `cm_communities` 表存储小区基础信息。

### Scenario: Store community basic info

- **WHEN** 运营团队添加新小区
- **THEN** 系统存储小区名称、编码、地址、联系电话、状态等基础信息

### Scenario: Store community area info

- **WHEN** 记录小区物理信息
- **THEN** 系统存储占地面积、建筑面积、楼栋数量、单元数量、户数、车位数量

### Scenario: Store community metrics

- **WHEN** 记录小区规划指标
- **THEN** 系统存储绿化率、容积率、开发商、物业公司、成立时间

### Scenario: Query community by region

- **WHEN** 用户按区域筛选小区
- **THEN** 系统支持按省份、城市、区县字段进行查询

## Notices Table

系统 SHALL 提供 `cm_notices` 表存储社区公告信息。

### Scenario: Store notice content

- **WHEN** 物业发布社区公告
- **THEN** 系统存储公告标题、内容、发布时间、发布人、状态

### Scenario: Associate notice with community

- **WHEN** 公告属于特定小区
- **THEN** 系统通过 `community_id` 外键关联到 `cm_communities` 表

## Handing Business Table

系统 SHALL 提供 `cm_handing_business` 表存储业务受理记录。

### Scenario: Store business handling record

- **WHEN** 物业办理业主业务
- **THEN** 系统存储业务类型、申请人、联系方式、办理状态、办理时间

### Scenario: Track business status

- **WHEN** 查询业务办理进度
- **THEN** 系统支持按状态（待缴费、已缴费、已取消）筛选记录

## House Decoration Table

系统 SHALL 提供 `cm_house_decorations` 表存储房屋装修登记信息。

### Scenario: Store decoration application

- **WHEN** 业主申请房屋装修
- **THEN** 系统存储房屋编号、业主信息、装修公司、预计开始结束时间

### Scenario: Track decoration status

- **WHEN** 物业审批装修申请
- **THEN** 系统支持存储审批状态、审批人、审批时间

## Property Register Table

系统 SHALL 提供 `cm_property_registers` 表存储物业登记信息。

### Scenario: Store property registration

- **WHEN** 物业登记房产信息
- **THEN** 系统存储社区名称、楼栋号、单元号、房间号、业主姓名、联系电话

### Scenario: Store property details

- **WHEN** 记录房产详细信息
- **THEN** 系统存储房产面积、房产类型、登记日期、状态

## Building Space Structure Table

系统 SHALL 提供 `cm_building_structures` 表存储楼栋空间结构信息。

### Scenario: Store building structure

- **WHEN** 定义楼栋空间结构
- **THEN** 系统存储楼栋编号、层数、单元数、房间布局信息

### Scenario: Associate with community

- **WHEN** 楼栋属于特定小区
- **THEN** 系统通过 `community_id` 外键关联到 `cm_communities` 表

## Community Module Indexes

系统 SHALL 为社区管理模块表创建必要的索引。

### Scenario: Community query optimization

- **WHEN** 按小区名称或编码查询
- **THEN** `cm_communities` 表的 `community_name` 和 `community_code` 字段有索引

### Scenario: Status filter optimization

- **WHEN** 按状态筛选记录
- **THEN** 所有包含 `status` 字段的表该字段有索引
