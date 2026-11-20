# Setting Schema Reference

This reference documents the System Settings module (Staff, Roles, Permissions).

## Staff Info Table

系统 SHALL 提供 `sm_staff` 表存储员工信息。

### Scenario: Store staff basic info

- **WHEN** 录入员工信息
- **THEN** 系统存储员工编号、姓名、性别、岗位、邮箱、手机号

### Scenario: Store staff address

- **WHEN** 记录员工地址
- **THEN** 系统存储家庭地址

### Scenario: Store staff avatar

- **WHEN** 上传员工照片
- **THEN** 系统存储照片 URL

### Scenario: Associate with organization

- **WHEN** 员工属于特定组织
- **THEN** 系统通过 `org_id` 外键关联到 `sm_organizations` 表

## Organizations Table

系统 SHALL 提供 `sm_organizations` 表存储组织架构。

### Scenario: Store org basic info

- **WHEN** 创建组织
- **THEN** 系统存储组织名称、组织编码、组织类型、排序号

### Scenario: Store org hierarchy

- **WHEN** 定义组织层级
- **THEN** 系统通过 `parent_id` 自引用实现树形结构

### Scenario: Query org tree

- **WHEN** 查询组织树
- **THEN** 系统支持通过递归查询获取完整组织树

## Roles Table

系统 SHALL 提供 `sm_roles` 表存储角色信息。

### Scenario: Store role info

- **WHEN** 创建角色
- **THEN** 系统存储角色名称、角色编码、角色描述、是否启用

## Permissions Table

系统 SHALL 提供 `sm_permissions` 表存储权限信息。

### Scenario: Store permission info

- **WHEN** 定义权限
- **THEN** 系统存储权限名称、权限编码、权限类型、资源路径

## Role Permissions Table

系统 SHALL 提供 `sm_role_permissions` 表存储角色权限关联。

### Scenario: Associate role with permissions

- **WHEN** 为角色分配权限
- **THEN** 系统通过 `role_id` 和 `permission_id` 外键建立多对多关联

## Staff Roles Table

系统 SHALL 提供 `sm_staff_roles` 表存储员工角色关联。

### Scenario: Associate staff with roles

- **WHEN** 为员工分配角色
- **THEN** 系统通过 `staff_id` 和 `role_id` 外键建立多对多关联

## Data Permissions Table

系统 SHALL 提供 `sm_data_permissions` 表存储数据权限配置。

### Scenario: Store data permission

- **WHEN** 配置数据权限
- **THEN** 系统存储权限规则、适用范围、数据过滤条件

### Scenario: Associate with role

- **WHEN** 数据权限关联角色
- **THEN** 系统通过 `role_id` 外键关联到 `sm_roles` 表

## Shifts Table

系统 SHALL 提供 `sm_shifts` 表存储班次设置。

### Scenario: Store shift info

- **WHEN** 创建班次
- **THEN** 系统存储班次名称、上班时间、下班时间、工作时长

## Scheduling Settings Table

系统 SHALL 提供 `sm_scheduling_settings` 表存储排班设置。

### Scenario: Store scheduling rule

- **WHEN** 配置排班规则
- **THEN** 系统存储排班模式、适用岗位、轮班周期

## Working Schedules Table

系统 SHALL 提供 `sm_working_schedules` 表存储工作排班。

### Scenario: Store schedule record

- **WHEN** 安排员工排班
- **THEN** 系统存储员工、班次、排班日期

### Scenario: Associate with staff and shift

- **WHEN** 排班关联员工和班次
- **THEN** 系统通过外键分别关联到 `sm_staff` 和 `sm_shifts` 表

## System Configs Table

系统 SHALL 提供 `sm_system_configs` 表存储系统配置。

### Scenario: Store config info

- **WHEN** 设置系统配置
- **THEN** 系统存储配置键、配置值、配置类型、配置描述

### Scenario: Manage config status

- **WHEN** 管理配置状态
- **THEN** 系统支持启用/禁用状态

## Register Protocols Table

系统 SHALL 提供 `sm_register_protocols` 表存储注册协议。

### Scenario: Store protocol info

- **WHEN** 配置注册协议
- **THEN** 系统存储协议类型、协议标题、协议内容、版本号

### Scenario: Manage protocol status

- **WHEN** 管理协议状态
- **THEN** 系统支持草稿/已发布/已停用状态

## Initialize Cells Table

系统 SHALL 提供 `sm_initialize_cells` 表存储小区初始化配置。

### Scenario: Store init config

- **WHEN** 初始化小区配置
- **THEN** 系统存储初始化项目、初始化状态、配置参数

## Change Password Records Table

系统 SHALL 提供 `sm_change_password_records` 表存储密码修改记录。

### Scenario: Store password change record

- **WHEN** 用户修改密码
- **THEN** 系统存储用户名、真实姓名、所属部门、修改时间、修改 IP

### Scenario: Track change type

- **WHEN** 记录密码修改类型
- **THEN** 系统存储修改类型（自主修改/管理员重置/强制修改）、操作人

### Scenario: Query by username

- **WHEN** 按用户名查询修改记录
- **THEN** 系统通过 `username` 字段索引快速检索

### Scenario: Query by time

- **WHEN** 按时间范围查询修改记录
- **THEN** 系统通过 `change_time` 字段索引快速检索

## Setting Module Indexes

系统 SHALL 为设置管理模块表创建必要的索引。

### Scenario: Staff query optimization

- **WHEN** 按员工编号或姓名查询
- **THEN** `sm_staff` 表的 `employee_number` 和 `name` 字段有索引

### Scenario: Role code optimization

- **WHEN** 按角色编码查询
- **THEN** `sm_roles` 表的 `code` 字段有唯一索引

### Scenario: Config key optimization

- **WHEN** 按配置键查询
- **THEN** `sm_system_configs` 表的 `config_key` 字段有唯一索引
