## ADDED Requirements

### Requirement: 状态枚举值映射

系统 SHALL 提供状态值的中英文映射函数，将 mock 数据中的中文状态值转换为数据库枚举值。

#### Scenario: 转换启用状态

- **WHEN** mock 数据中状态值为 "启用" 或 "operating"
- **THEN** 系统 SHALL 转换为 "enabled"

#### Scenario: 转换禁用状态

- **WHEN** mock 数据中状态值为 "禁用" 或 "disabled"
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

### Requirement: SQL 字符串转义

系统 SHALL 提供 SQL 字符串转义函数，防止 SQL 注入和语法错误。

#### Scenario: 转义单引号

- **WHEN** 字符串包含单引号 `'`
- **THEN** 系统 SHALL 将其转义为两个单引号 `''`

#### Scenario: 处理 NULL 值

- **WHEN** 值为 null 或 undefined
- **THEN** 系统 SHALL 输出 SQL 的 `NULL` 关键字

### Requirement: 日期时间字符串解析

系统 SHALL 提供日期时间解析函数，支持 mock 数据中常见的日期格式。

#### Scenario: 解析标准日期时间格式

- **WHEN** 输入日期字符串为 "2024-01-15 09:00:00"
- **THEN** 系统 SHALL 转换为 SQL 格式 `'2024-01-15 09:00:00'::timestamp`

#### Scenario: 解析纯日期格式

- **WHEN** 输入日期字符串为 "2024-01-15"
- **THEN** 系统 SHALL 转换为 SQL 格式 `'2024-01-15'::date`

#### Scenario: 处理无效日期字符串

- **WHEN** 输入日期字符串为空或无效格式
- **THEN** 系统 SHALL 返回 `NULL`

### Requirement: 字段名映射转换

系统 SHALL 提供字段名从 mock 数据格式到数据库字段的映射能力。

#### Scenario: 转换 createTime 字段

- **WHEN** mock 数据包含 "createTime" 字段
- **THEN** 系统 SHALL 映射到数据库的 "created_at" 字段

#### Scenario: 转换 updateTime 字段

- **WHEN** mock 数据包含 "updateTime" 字段
- **THEN** 系统 SHALL 映射到数据库的 "updated_at" 字段

#### Scenario: 转换 address 字段到 homeAddress

- **WHEN** 员工表的 mock 数据包含 "address" 字段
- **THEN** 系统 SHALL 映射到数据库的 "homeAddress" 字段

#### Scenario: 忽略冗余字段

- **WHEN** mock 数据包含数据库不存在的冗余字段（如 "orgName"）
- **THEN** 系统 SHALL 忽略该字段，不包含在 INSERT 语句中

### Requirement: ID 映射表管理

系统 SHALL 维护 mock 数据 ID 到数据库 UUID 的映射表。

#### Scenario: 生成确定性 UUID

- **WHEN** 处理 mock 数据中的记录 ID（如 "M001"）
- **THEN** 系统 SHALL 使用 `uuid` 包的 `v5` 方法生成确定性 UUID
- **AND** 使用固定的命名空间 UUID 和 `${tableName}:${mockId}` 作为输入
- **AND** 确保同一 mock ID 始终映射到相同的 UUID

#### Scenario: 跨模块查询 UUID

- **WHEN** 需要填充具有外键的表
- **THEN** 系统 SHALL 通过 mock ID 查找对应的数据库 UUID
- **AND** 如果找不到对应的 ID，使用 NULL 值

### Requirement: 树形结构 ID 处理

系统 SHALL 支持处理 mock 数据中的树形结构 ID 格式。

#### Scenario: 解析树形结构 ID

- **WHEN** mock 数据中包含树形结构 ID（如 "2-1"、"2-1-3"）
- **THEN** 系统 SHALL 将整个字符串作为 mock ID 输入
- **AND** 使用 `generateUuid("table_name", "2-1")` 生成确定性 UUID

#### Scenario: 处理父子关系

- **WHEN** mock 数据的树形结构 ID 表示父子关系
- **THEN** 系统 SHALL 解析 ID 格式推断 parentId
- **AND** 例如 "2-1" 的 parentId 为 "2"，"2-1-3" 的 parentId 为 "2-1"

#### Scenario: 处理顶级节点

- **WHEN** 树形结构 ID 为单个数字（如 "2"）
- **THEN** 系统 SHALL 将 parentId 设为 NULL

### Requirement: 参数化 SQL 转换

系统 SHALL 将 Drizzle 生成的参数化 SQL 转换为完整的可执行 SQL。

#### Scenario: 替换字符串参数

- **WHEN** 参数类型为 string
- **THEN** 系统 SHALL 将 `$N` 替换为 `'escaped_string'`

#### Scenario: 替换数字参数

- **WHEN** 参数类型为 number
- **THEN** 系统 SHALL 将 `$N` 替换为数字本身

#### Scenario: 替换日期参数

- **WHEN** 参数类型为 Date
- **THEN** 系统 SHALL 将 `$N` 替换为 `'ISO_DATE'::timestamp`

#### Scenario: 替换布尔参数

- **WHEN** 参数类型为 boolean
- **THEN** 系统 SHALL 将 `$N` 替换为 `true` 或 `false`

#### Scenario: 替换 JSON 参数

- **WHEN** 参数类型为对象或数组
- **THEN** 系统 SHALL 将 `$N` 替换为 `'{"json":"content"}'::jsonb`
