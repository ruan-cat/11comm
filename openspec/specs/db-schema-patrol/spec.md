## ADDED Requirements

### Requirement: Patrol Plans Table

系统 SHALL 提供 `pt_patrol_plans` 表存储巡检计划。

#### Scenario: Store plan basic info

- **WHEN** 创建巡检计划
- **THEN** 系统存储计划名称、巡检类型、巡检级别、计划描述

#### Scenario: Store plan schedule

- **WHEN** 设置巡检周期
- **THEN** 系统存储执行频率、开始日期、结束日期、执行时间段

#### Scenario: Associate with community

- **WHEN** 巡检计划属于特定小区
- **THEN** 系统通过 `community_id` 外键关联到 `cm_communities` 表

### Requirement: Patrol Paths Table

系统 SHALL 提供 `pt_patrol_paths` 表存储巡检路线。

#### Scenario: Store path info

- **WHEN** 定义巡检路线
- **THEN** 系统存储路线名称、路线描述、预计用时

#### Scenario: Associate with plan

- **WHEN** 路线属于特定计划
- **THEN** 系统通过 `plan_id` 外键关联到 `pt_patrol_plans` 表

### Requirement: Patrol Points Table

系统 SHALL 提供 `pt_patrol_points` 表存储巡检点。

#### Scenario: Store point info

- **WHEN** 定义巡检点
- **THEN** 系统存储巡检点名称、位置信息、二维码/NFC 标识

#### Scenario: Store point order

- **WHEN** 设置巡检顺序
- **THEN** 系统存储在路线中的排序号

#### Scenario: Associate with path

- **WHEN** 巡检点属于特定路线
- **THEN** 系统通过 `path_id` 外键关联到 `pt_patrol_paths` 表

### Requirement: Patrol Items Table

系统 SHALL 提供 `pt_patrol_items` 表存储巡检项目。

#### Scenario: Store item info

- **WHEN** 定义巡检检查项
- **THEN** 系统存储检查项名称、检查标准、检查方式

#### Scenario: Associate with point

- **WHEN** 检查项属于特定巡检点
- **THEN** 系统通过 `point_id` 外键关联到 `pt_patrol_points` 表

### Requirement: Patrol Tasks Table

系统 SHALL 提供 `pt_patrol_tasks` 表存储巡检任务。

#### Scenario: Store task basic info

- **WHEN** 生成巡检任务
- **THEN** 系统存储任务编码、任务名称、计划巡检人、巡检方式

#### Scenario: Store task schedule

- **WHEN** 设置任务时间
- **THEN** 系统存储计划开始时间、计划结束时间、实际巡检时间

#### Scenario: Track task status

- **WHEN** 管理任务状态
- **THEN** 系统支持待执行/执行中/已完成/已逾期状态

#### Scenario: Store task transfer

- **WHEN** 任务需要转移
- **THEN** 系统存储当前巡检人、转移描述

#### Scenario: Associate with plan

- **WHEN** 任务属于特定计划
- **THEN** 系统通过 `plan_id` 外键关联到 `pt_patrol_plans` 表

### Requirement: Patrol Task Details Table

系统 SHALL 提供 `pt_patrol_task_details` 表存储巡检任务明细。

#### Scenario: Store check result

- **WHEN** 巡检员完成检查
- **THEN** 系统存储签到状态、巡检情况、巡检照片 URL

#### Scenario: Store location info

- **WHEN** 记录巡检位置
- **THEN** 系统存储签到时间、GPS 坐标

#### Scenario: Associate with task and point

- **WHEN** 明细关联任务和巡检点
- **THEN** 系统通过外键分别关联到 `pt_patrol_tasks` 和 `pt_patrol_points` 表

### Requirement: Patrol Module Indexes

系统 SHALL 为巡检管理模块表创建必要的索引。

#### Scenario: Task query optimization

- **WHEN** 按任务编码查询
- **THEN** `pt_patrol_tasks` 表的 `task_code` 字段有唯一索引

#### Scenario: Task status optimization

- **WHEN** 按任务状态和时间筛选
- **THEN** `pt_patrol_tasks` 表的 `status` 和 `planned_start_time` 字段有复合索引

#### Scenario: Patrol person optimization

- **WHEN** 按巡检人查询任务
- **THEN** `pt_patrol_tasks` 表的 `current_patrol_person` 字段有索引
