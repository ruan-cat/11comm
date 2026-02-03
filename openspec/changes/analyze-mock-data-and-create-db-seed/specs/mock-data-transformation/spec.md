## ADDED Requirements

### Requirement: 状态枚举值映射

系统 SHALL 提供状态值的中英文映射函数，将 mock 数据中的中文状态值转换为数据库枚举值。

#### Scenario: 转换启用状态

- **WHEN** mock 数据中状态值为 "启用"
- **THEN** 系统 SHALL 转换为 "enabled"

#### Scenario: 转换禁用状态

- **WHEN** mock 数据中状态值为 "禁用"
- **THEN** 系统 SHALL 转换为 "disabled"

#### Scenario: 处理未知状态值

- **WHEN** mock 数据中状态值不在预定义映射中
- **THEN** 系统 SHALL 返回默认值 "enabled"
- **AND** 在控制台输出警告信息

### Requirement: 性别枚举值映射

系统 SHALL 提供性别值的中英文映射函数。

#### Scenario: 转换男性

- **WHEN** mock 数据中性别值为 "男"
- **THEN** 系统 SHALL 转换为 "male"

#### Scenario: 转换女性

- **WHEN** mock 数据中性别值为 "女"
- **THEN** 系统 SHALL 转换为 "female"

### Requirement: 审核状态枚举值映射

系统 SHALL 提供审核状态的中英文映射函数。

#### Scenario: 转换待审核状态

- **WHEN** mock 数据中审核状态值为 "待审核"
- **THEN** 系统 SHALL 转换为 "pending"

#### Scenario: 转换已通过状态

- **WHEN** mock 数据中审核状态值为 "已通过"
- **THEN** 系统 SHALL 转换为 "approved"

#### Scenario: 转换已拒绝状态

- **WHEN** mock 数据中审核状态值为 "已拒绝"
- **THEN** 系统 SHALL 转换为 "rejected"

### Requirement: 日期时间字符串解析

系统 SHALL 提供日期时间解析函数，支持 mock 数据中常见的日期格式。

#### Scenario: 解析标准日期时间格式

- **WHEN** 输入日期字符串为 "2024-01-15 09:00:00"
- **THEN** 系统 SHALL 返回对应的 Date 对象

#### Scenario: 解析纯日期格式

- **WHEN** 输入日期字符串为 "2024-01-15"
- **THEN** 系统 SHALL 返回对应的 Date 对象（时间部分为 00:00:00）

#### Scenario: 处理无效日期字符串

- **WHEN** 输入日期字符串为空或无效格式
- **THEN** 系统 SHALL 返回 null

### Requirement: 字段名映射转换

系统 SHALL 提供字段名从 camelCase 到 snake_case 的映射能力，适配 mock 数据与数据库字段的命名差异。

#### Scenario: 转换 createTime 字段

- **WHEN** mock 数据包含 "createTime" 字段
- **THEN** 系统 SHALL 映射到数据库的 "created_at" 字段

#### Scenario: 转换 updateTime 字段

- **WHEN** mock 数据包含 "updateTime" 字段
- **THEN** 系统 SHALL 映射到数据库的 "updated_at" 字段

### Requirement: ID 映射表管理

系统 SHALL 维护 mock 数据 ID 到数据库真实 ID 的映射表，支持外键引用的正确建立。

#### Scenario: 记录插入后的 ID 映射

- **WHEN** 成功插入一条记录
- **THEN** 系统 SHALL 将 mock 数据的 ID 与数据库生成的 UUID 建立映射关系

#### Scenario: 查询外键引用的真实 ID

- **WHEN** 需要填充具有外键的表
- **AND** 外键引用的是之前插入的记录
- **THEN** 系统 SHALL 通过 mock ID 查找对应的数据库真实 UUID

### Requirement: 数值类型转换

系统 SHALL 提供数值类型的安全转换函数。

#### Scenario: 转换字符串为数字

- **WHEN** mock 数据中数值字段为字符串类型 "100.50"
- **THEN** 系统 SHALL 转换为数字类型 100.50

#### Scenario: 处理无效数值

- **WHEN** mock 数据中数值字段为空或非数字字符串
- **THEN** 系统 SHALL 返回 null 或默认值 0
