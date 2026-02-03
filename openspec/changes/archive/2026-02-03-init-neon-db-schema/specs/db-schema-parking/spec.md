## ADDED Requirements

### Requirement: Parking Lots Table

系统 SHALL 提供 `pk_parking_lots` 表存储停车场信息。

#### Scenario: Store parking lot info

- **WHEN** 录入停车场信息
- **THEN** 系统存储停车场名称、停车场类型、车位总数、可用车位数

#### Scenario: Store parking lot location

- **WHEN** 记录停车场位置
- **THEN** 系统存储楼层区域、具体位置描述

#### Scenario: Associate with community

- **WHEN** 停车场属于特定小区
- **THEN** 系统通过 `community_id` 外键关联到 `cm_communities` 表

### Requirement: Carports Table

系统 SHALL 提供 `pk_carports` 表存储车位信息。

#### Scenario: Store carport basic info

- **WHEN** 录入车位信息
- **THEN** 系统存储车位编号、车位类型、面积、状态

#### Scenario: Store carport ownership

- **WHEN** 车位有归属人
- **THEN** 系统存储业主姓名、联系电话、绑定车辆号码

#### Scenario: Store carport rental info

- **WHEN** 车位出租
- **THEN** 系统存储月租费用、购买日期、到期日期

#### Scenario: Associate with parking lot

- **WHEN** 车位属于特定停车场
- **THEN** 系统通过 `parking_lot_id` 外键关联到 `pk_parking_lots` 表

### Requirement: Owner Vehicles Table

系统 SHALL 提供 `pk_owner_vehicles` 表存储业主车辆信息。

#### Scenario: Store vehicle basic info

- **WHEN** 录入车辆信息
- **THEN** 系统存储车牌号、车牌类型、车辆类型、车辆颜色

#### Scenario: Store vehicle details

- **WHEN** 记录车辆详细信息
- **THEN** 系统存储车辆品牌、关联房屋号

#### Scenario: Store vehicle validity

- **WHEN** 设置车辆通行有效期
- **THEN** 系统存储有效期开始日期和结束日期

#### Scenario: Associate with owner

- **WHEN** 车辆属于特定业主
- **THEN** 系统通过 `owner_id` 外键关联到 `hp_owners` 表

#### Scenario: Associate with carport

- **WHEN** 车辆绑定特定车位
- **THEN** 系统通过 `carport_id` 外键可选关联到 `pk_carports` 表

### Requirement: Carport Applications Table

系统 SHALL 提供 `pk_carport_applications` 表存储车位申请记录。

#### Scenario: Store application info

- **WHEN** 业主申请车位
- **THEN** 系统存储申请人、申请车位类型、申请时间、期望价格区间

#### Scenario: Track application status

- **WHEN** 管理申请状态
- **THEN** 系统支持待审核/已通过/已拒绝/已取消状态

#### Scenario: Store approval info

- **WHEN** 审批车位申请
- **THEN** 系统存储审批人、审批时间、审批意见、分配的车位

### Requirement: Parking Module Indexes

系统 SHALL 为停车管理模块表创建必要的索引。

#### Scenario: Vehicle query optimization

- **WHEN** 按车牌号查询
- **THEN** `pk_owner_vehicles` 表的 `license_plate` 字段有唯一索引

#### Scenario: Carport query optimization

- **WHEN** 按车位编号查询
- **THEN** `pk_carports` 表的 `carport_number` 字段有索引

#### Scenario: Status filter optimization

- **WHEN** 按车位状态筛选
- **THEN** `pk_carports` 表的 `status` 字段有索引
