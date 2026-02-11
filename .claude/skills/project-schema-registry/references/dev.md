# Dev Schema Reference

This reference documents the Development Team module (Configuration Center, etc.).

## Config Center Table

系统 SHALL 提供 `dt_configs` 表存储配置中心数据。

### Scenario: Store config basic info

- **WHEN** 添加配置项
- **THEN** 系统存储配置项 ID、配置项名称、配置类型、配置键名

### Scenario: Store config value

- **WHEN** 设置配置值
- **THEN** 系统存储配置值、默认值、配置描述

### Scenario: Store config metadata

- **WHEN** 记录配置元信息
- **THEN** 系统存储排序号、创建人、更新人

### Scenario: Manage config status

- **WHEN** 管理配置状态
- **THEN** 系统支持启用/禁用状态

## Config Types Table

系统 SHALL 提供 `dt_config_types` 表存储配置类型。

### Scenario: Store config type

- **WHEN** 定义配置类型
- **THEN** 系统存储类型名称、类型编码、类型描述、排序号

## Config Items Table

系统 SHALL 提供 `dt_config_items` 表存储配置项定义。

### Scenario: Store item definition

- **WHEN** 定义配置项
- **THEN** 系统存储配置项名称、配置项键名、数据类型、校验规则

### Scenario: Associate with type

- **WHEN** 配置项属于特定类型
- **THEN** 系统通过 `type_id` 外键关联到 `dt_config_types` 表

## Dictionaries Table

系统 SHALL 提供 `dt_dictionaries` 表存储数据字典。

### Scenario: Store dictionary info

- **WHEN** 创建数据字典
- **THEN** 系统存储字典名称、字典编码、字典类型、字典描述

## Dictionary Items Table

系统 SHALL 提供 `dt_dictionary_items` 表存储字典项。

### Scenario: Store dictionary item

- **WHEN** 添加字典项
- **THEN** 系统存储项标签、项值、排序号、是否默认

### Scenario: Associate with dictionary

- **WHEN** 字典项属于特定字典
- **THEN** 系统通过 `dictionary_id` 外键关联到 `dt_dictionaries` 表

## Menu Groups Table

系统 SHALL 提供 `dt_menu_groups` 表存储菜单分组。

### Scenario: Store menu group

- **WHEN** 创建菜单分组
- **THEN** 系统存储分组名称、分组编码、分组图标、排序号

## Menu Catalogs Table

系统 SHALL 提供 `dt_menu_catalogs` 表存储菜单目录。

### Scenario: Store menu catalog

- **WHEN** 创建菜单目录
- **THEN** 系统存储目录名称、目录路径、目录图标、排序号

### Scenario: Store catalog hierarchy

- **WHEN** 定义目录层级
- **THEN** 系统通过 `parent_id` 自引用实现树形结构

### Scenario: Associate with group

- **WHEN** 目录属于特定分组
- **THEN** 系统通过 `group_id` 外键关联到 `dt_menu_groups` 表

## Menu Items Table

系统 SHALL 提供 `dt_menu_items` 表存储菜单项。

### Scenario: Store menu item

- **WHEN** 创建菜单项
- **THEN** 系统存储菜单名称、菜单路径、组件路径、菜单图标、排序号

### Scenario: Store menu config

- **WHEN** 配置菜单属性
- **THEN** 系统存储是否显示、是否缓存、是否外链、重定向路径

### Scenario: Associate with catalog

- **WHEN** 菜单项属于特定目录
- **THEN** 系统通过 `catalog_id` 外键关联到 `dt_menu_catalogs` 表

## Cache Configs Table

系统 SHALL 提供 `dt_cache_configs` 表存储缓存配置。

### Scenario: Store cache config

- **WHEN** 配置缓存
- **THEN** 系统存储缓存键、缓存类型、过期时间、刷新策略

## Dev Module Indexes

系统 SHALL 为开发团队模块表创建必要的索引。

### Scenario: Config key optimization

- **WHEN** 按配置键查询
- **THEN** `dt_configs` 表的 `config_key` 字段有唯一索引

### Scenario: Dictionary code optimization

- **WHEN** 按字典编码查询
- **THEN** `dt_dictionaries` 表的 `dictionary_code` 字段有唯一索引

### Scenario: Menu path optimization

- **WHEN** 按菜单路径查询
- **THEN** `dt_menu_items` 表的 `path` 字段有索引
