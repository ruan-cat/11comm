# drizzle-rls-policies Specification

## Purpose

TBD - created by archiving change nitro-api-authentication. Update Purpose after archive.

## Requirements

### Requirement: 用户数据行级隔离

系统 SHALL 实现用户只能访问自己拥有数据行的安全策略。

#### Scenario: 用户查询自己的数据

- **WHEN** 已登录用户查询包含 `ownerId` 或 `userId` 字段的表
- **THEN** 数据库 SHALL 仅返回用户 own 的数据行

#### Scenario: 用户无法访问他人数据

- **WHEN** 已登录用户尝试查询其他用户的数据行
- **THEN** 数据库 SHALL 返回空结果集

### Requirement: 数据创建时自动关联用户

系统 SHALL 在创建新数据行时自动关联当前用户。

#### Scenario: 创建数据时自动填充用户 ID

- **WHEN** 已登录用户创建新数据记录
- **THEN** 数据库 SHALL 自动将 `ownerId`/`userId` 设置为当前用户 ID

#### Scenario: 创建数据时强制用户归属

- **WHEN** 已登录用户尝试创建数据行时指定他人的 ownerId
- **THEN** 数据库 SHALL 拒绝创建并返回错误

### Requirement: 数据修改权限验证

系统 SHALL 验证用户只能修改自己拥有的数据行。

#### Scenario: 用户修改自己的数据

- **WHEN** 已登录用户修改自己拥有的数据行
- **THEN** 数据库 SHALL 允许修改并更新数据

#### Scenario: 用户尝试修改他人数据

- **WHEN** 已登录用户尝试修改其他用户的数据行
- **THEN** 数据库 SHALL 拒绝修改并返回权限错误

### Requirement: 数据删除权限验证

系统 SHALL 验证用户只能删除自己拥有的数据行。

#### Scenario: 用户删除自己的数据

- **WHEN** 已登录用户删除自己拥有的数据行
- **THEN** 数据库 SHALL 允许删除操作

#### Scenario: 用户尝试删除他人数据

- **WHEN** 已登录用户尝试删除其他用户的数据行
- **THEN** 数据库 SHALL 拒绝删除并返回权限错误

### Requirement: 公开数据可读

系统 SHALL 支持配置可被所有用户读取的数据。

#### Scenario: 读取公开数据

- **WHEN** 任意用户（包括匿名用户）查询公开数据
- **THEN** 数据库 SHALL 返回所有公开数据行

#### Scenario: 公开数据修改限制

- **WHEN** 已登录用户尝试修改公开数据
- **THEN** 数据库 SHALL 仅允许修改自己创建的数据行

### Requirement: 角色权限控制

系统 SHALL 支持基于用户角色的数据访问控制。

#### Scenario: 管理员访问所有数据

- **WHEN** 具有管理员角色的用户查询数据
- **THEN** 数据库 SHALL 返回所有数据行（忽略用户隔离）

#### Scenario: 普通用户受权限限制

- **WHEN** 普通用户（非管理员）查询数据
- **THEN** 数据库 SHALL 应用行级隔离策略

### Requirement: RLS 策略可审计

系统 SHALL 提供查询 RLS 策略执行结果的能力。

#### Scenario: 调试模式查看隔离结果

- **WHEN** 开发人员启用调试模式查询数据
- **THEN** 系统 SHALL 在返回结果中标注每行数据是否因 RLS 被过滤

### Requirement: 组织级别数据隔离（单租户模式）

系统 SHALL 实现组织之间的数据隔离，确保不同组织无法访问彼此的数据。

#### Scenario: 组织管理员只能访问所管理组织的数据

- **WHEN** 组织管理员查询数据
- **THEN** 数据库 SHALL 仅返回其所属组织及下属组织的数据

#### Scenario: 跨组织数据访问被拒绝

- **WHEN** 组织 A 的用户尝试查询组织 B 的数据
- **THEN** 数据库 SHALL 返回空结果集

### Requirement: 小区级别数据隔离

系统 SHALL 实现小区之间的数据隔离。

#### Scenario: 物业员工只能访问所服务小区的数据

- **WHEN** 物业员工查询数据
- **THEN** 数据库 SHALL 仅返回其岗位所分配小区的数据

#### Scenario: 跨小区数据访问被拒绝

- **WHEN** 小区 A 的员工尝试查询小区 B 的数据
- **THEN** 数据库 SHALL 返回空结果集

### Requirement: 房产级别数据隔离

系统 SHALL 实现业主/住户的房产数据隔离。

#### Scenario: 业主只能访问自己的房产数据

- **WHEN** 业主查询房产相关数据
- **THEN** 数据库 SHALL 仅返回该业主拥有的房产数据

#### Scenario: 业主无法访问其他业主房产数据

- **WHEN** 业主 A 尝试查询业主 B 的房产数据
- **THEN** 数据库 SHALL 返回空结果集
