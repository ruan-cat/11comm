# fill-database-tables 任务清单

## 概述

本任务清单用于为智慧社区管理系统的 94 个数据库表填充 mock 数据。任务采用 Agent Team 并行执行模式，按模块顺序依次处理。

## 执行依赖

- Phase 2 依赖 Phase 1 完成（数据库迁移必须先执行）
- Phase 3 依赖 Phase 2 完成（dev 模块的字典数据可能被其他模块引用）
- Phase 4-14 依次依赖前一个 Phase 完成（外键引用顺序）

## 1. 准备阶段

本阶段为后续所有模块提供基础环境，必须首先完成。

### 1.1 数据库迁移准备

- [ ] **1.1.1 检查 Neon 数据库连接配置**
  - **输入**：读取 `.env` 文件中的 `DATABASE_URL` 配置
  - **输出**：确认数据库连接字符串有效
  - **内容**：验证 Neon 数据库连接配置是否正确，检查是否包含正确的项目 ID 和数据库名称
  - **验证**：运行 `pnpm db:info` 确认连接成功

- [ ] **1.1.2 运行数据库迁移命令**
  - **输入**：现有数据库迁移文件位于 `apps/admin/server/db/migrations/`
  - **输出**：在 Neon 数据库中创建所有 94 个表
  - **内容**：执行 `pnpm db:migrate` 运行所有待执行的迁移，创建表结构
  - **验证**：检查迁移日志，确认所有表创建成功，无错误输出

- [ ] **1.1.3 验证所有表已创建**
  - **输入**：已执行的迁移文件列表
  - **输出**：表创建状态报告
  - **内容**：对比设计文档中的 94 个表与实际创建的表，识别遗漏的表
  - **验证**：运行 SQL 查询 `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'` 确认表数量

- [ ] **1.1.4 记录表创建状态**
  - **输入**：表创建验证结果
  - **输出**：创建 `database-tables-status.md` 文件
  - **内容**：记录每个表的创建状态、字段数量、外键数量
  - **验证**：文件已创建并包含所有 94 个表的状态信息

### 1.2 seed-sql 模块状态分析

- [ ] **1.2.1 列出 seed-sql 目录下的所有模块文件**
  - **输入**：读取 `apps/admin/server/db/seed-sql/` 目录
  - **输出**：模块文件列表（dev.ts, community.ts, setting.ts 等）
  - **内容**：列出所有 11 个 seed 模块文件，确认文件存在
  - **验证**：文件数量为 11 个

- [ ] **1.2.2 分析每个模块的当前实现状态**
  - **输入**：每个 seed-sql 模块文件的内容
  - **输出**：实现状态分析报告
  - **内容**：逐个检查每个模块是否已实现 generateSql 函数，是否包含 INSERT 语句
  - **验证**：输出每个模块的状态（已实现/部分实现/未实现）

- [ ] **1.2.3 记录分析结果**
  - **输入**：模块实现状态分析报告
  - **输出**：创建 `seed-modules-status.md` 文件
  - **内容**：详细记录每个模块的表数量、已实现表、缺失表
  - **验证**：文件已创建且包含所有 11 个模块的状态

### 1.3 mock 数据覆盖情况分析

- [ ] **1.3.1 扫描现有 mock-data.ts 文件**
  - **输入**：读取 `apps/admin/server/api/` 目录
  - **输出**：现有 mock-data.ts 文件列表
  - **内容**：递归扫描所有 mock-data.ts 文件，记录文件路径和对应的业务模块
  - **验证**：输出完整的文件列表

- [ ] **1.3.2 对比 94 个表识别缺失 mock 数据的表**
  - **输入**：现有 mock 文件列表和 94 个表清单
  - **输出**：缺失 mock 数据的表清单
  - **内容**：对比分析，识别哪些表还没有对应的 mock-data.ts 文件
  - **验证**：输出按模块分组的缺失表清单

- [ ] **1.3.3 记录缺失情况**
  - **输入**：缺失 mock 数据的表清单
  - **输出**：创建 `missing-mock-data.md` 文件
  - **内容**：按模块分组记录缺失的表，标记优先级
  - **验证**：文件已创建且包含所有缺失表信息

## 2. Dev 模块 (9 个表)

本模块是系统基础配置模块，包含字典、缓存、配置、菜单等基础数据。其他模块可能引用本模块的数据，必须首先处理。

### 2.1 dt_dictionaries 表数据准备

- [ ] **2.1.1 读取 dt_dictionaries 表结构**
  - **输入**：读取 `apps/type/src/business/setting-manage/dictionary-manage/schema.ts` 中的 dtDictionaries 定义
  - **输出**：理解表字段定义（id, dictionaryCode, dictionaryName, dictionaryType, dictionaryDescription, remark, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义，获取所有字段名称、类型、约束条件
  - **验证**：能够列出所有字段及其类型、是否可为空、默认值

- [ ] **2.1.2 分析字典数据的业务场景**
  - **输入**：参考 `apps/admin/server/api/dev-team/config-manage/type/mock-data.ts`
  - **输出**：理解字典数据的业务含义
  - **内容**：了解系统需要哪些类型的字典（系统配置类、业务类型类、状态类等）
  - **验证**：能够说明每种字典类型的用途

- [ ] **2.1.3 创建 dt_dictionaries 的 mock 数据文件**
  - **输入**：表结构（来自 2.1.1）和业务场景（来自 2.1.2）
  - **输出**：创建 `apps/admin/server/api/dev-team/dictionary-manage/mock-data.ts` 文件
  - **内容**：
    - 导出 `mockDictionaries` 数组
    - 包含 20-30 条字典类型数据
    - 字段包括：id, dictionaryCode, dictionaryName, dictionaryType, dictionaryDescription, remark, createTime, updateTime
  - **验证**：文件存在且包含 20-30 条数据

- [ ] **2.1.4 编写字典类型数据内容**
  - **输入**：mock 数据文件（来自 2.1.3）
  - **输出**：完整的字典类型数据
  - **内容**：
    - 系统配置类：性别、状态、支付方式、房屋类型等
    - 业务类型类：报修类型、缴费类型、合同类型等
    - 状态类：启用/禁用、完成/未完成等
  - **验证**：数据量符合设计要求（20-30 条）

- [ ] **2.1.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的字典数据（来自 2.1.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、约束条件
  - **验证**：所有字段符合 Drizzle schema 定义，无类型错误

### 2.2 dt_dictionary_items 表数据准备

- [ ] **2.2.1 读取 dt_dictionary_items 表结构**
  - **输入**：读取 `apps/type/src/business/setting-manage/dictionary-manage/schema.ts` 中的 dtDictionaryItems 定义
  - **输出**：理解表字段定义（id, dictionaryId, itemCode, itemName, itemValue, itemSort, status, remark, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义，获取所有字段名称、类型、约束条件
  - **验证**：能够列出所有字段及其类型、是否可为空、默认值

- [ ] **2.2.2 理解外键关系**
  - **输入**：dt_dictionary_items 表结构（来自 2.2.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 dictionaryId，关联到 dt_dictionaries 表
  - **验证**：能够说明外键的目标表和字段

- [ ] **2.2.3 创建 dt_dictionary_items 的 mock 数据文件**
  - **输入**：表结构（来自 2.2.1）和外键关系（来自 2.2.2）
  - **输出**：创建 `apps/admin/server/api/dev-team/dictionary-items/mock-data.ts` 文件
  - **内容**：
    - 导出 `mockDictionaryItems` 数组
    - 包含 50-100 条字典项数据
    - 字段包括：id, dictionaryId, itemCode, itemName, itemValue, itemSort, status, remark, createTime, updateTime
  - **验证**：文件存在且包含 50-100 条数据

- [ ] **2.2.4 编写字典项数据内容**
  - **输入**：mock 数据文件（来自 2.2.3）
  - **输出**：完整的字典项数据
  - **内容**：为每个字典类型编写 3-5 个字典项，如：
    - 性别：男、女、未知
    - 支付方式：现金、支付宝、微信、银行卡
    - 房屋类型：住宅、商铺、写字楼、车位
  - **验证**：每个字典有对应项，dictionaryId 引用有效

- [ ] **2.2.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的字典项数据（来自 2.2.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用正确性
  - **验证**：所有字段符合 Drizzle schema 定义，dictionaryId 引用有效的字典 ID

### 2.3 dt_cache_configs 表数据准备

- [ ] **2.3.1 读取 dt_cache_configs 表结构**
  - **输入**：读取 `apps/type/src/business/dev/cache-config/schema.ts`
  - **输出**：理解表字段定义（id, cacheKey, cacheValue, description, expireTime, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义，获取所有字段名称、类型
  - **验证**：能够列出所有字段及其类型

- [ ] **2.3.2 分析缓存配置的业务场景**
  - **输入**：参考现有缓存配置
  - **输出**：理解缓存配置的业务含义
  - **内容**：了解系统需要哪些缓存配置（Token 缓存、会话缓存、配置缓存等）
  - **验证**：能够说明每种缓存配置的用途

- [ ] **2.3.3 创建 dt_cache_configs 的 mock 数据文件**
  - **输入**：表结构（来自 2.3.1）
  - **输出**：创建 `apps/admin/server/api/dev-team/cache-config/mock-data.ts` 文件
  - **内容**：
    - 导出 `mockCacheConfigs` 数组
    - 包含 10-15 条缓存配置数据
  - **验证**：文件存在且包含 10-15 条数据

- [ ] **2.3.4 编写缓存配置数据内容**
  - **输入**：mock 数据文件（来自 2.3.3）
  - **输出**：完整的缓存配置数据
  - **内容**：编写缓存配置数据，包括：
    - Token 过期时间配置
    - 会话超时配置
    - 接口限流配置
  - **验证**：数据量符合设计要求（10-15 条）

- [ ] **2.3.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的缓存配置数据（来自 2.3.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 2.4 dt_config_types 表数据准备

- [ ] **2.4.1 读取 dt_config_types 表结构**
  - **输入**：读取 `apps/type/src/business/dev/config-type/schema.ts`
  - **输出**：理解表字段定义（id, typeCode, typeName, description, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **2.4.2 分析配置类型的业务场景**
  - **输入**：参考现有配置类型
  - **输出**：理解配置类型的业务含义
  - **内容**：了解系统需要哪些配置类型
  - **验证**：能够说明每种配置类型的用途

- [ ] **2.4.3 创建 dt_config_types 的 mock 数据文件**
  - **输入**：表结构（来自 2.4.1）
  - **输出**：创建 `apps/admin/server/api/dev-team/config-type/mock-data.ts` 文件
  - **内容**：导出 `mockConfigTypes` 数组，包含 5-10 条配置类型数据
  - **验证**：文件存在且包含 5-10 条数据

- [ ] **2.4.4 编写配置类型数据内容**
  - **输入**：mock 数据文件（来自 2.4.3）
  - **输出**：完整的配置类型数据
  - **内容**：编写配置类型数据
  - **验证**：数据量符合设计要求

- [ ] **2.4.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的配置类型数据（来自 2.4.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 2.5 dt_configs 表数据准备

- [ ] **2.5.1 读取 dt_configs 表结构**
  - **输入**：读取 `apps/type/src/business/dev/config/schema.ts`
  - **输出**：理解表字段定义（id, configTypeId, configKey, configValue, description, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **2.5.2 理解外键关系**
  - **输入**：dt_configs 表结构（来自 2.5.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 configTypeId，关联到 dt_config_types 表
  - **验证**：能够说明外键的目标表和字段

- [ ] **2.5.3 创建 dt_configs 的 mock 数据文件**
  - **输入**：表结构（来自 2.5.1）
  - **输出**：创建 `apps/admin/server/api/dev-team/config/mock-data.ts` 文件
  - **内容**：导出 `mockConfigs` 数组，包含 15-20 条配置数据
  - **验证**：文件存在且包含 15-20 条数据

- [ ] **2.5.4 编写配置数据内容**
  - **输入**：mock 数据文件（来自 2.5.3）
  - **输出**：完整的配置数据
  - **内容**：编写配置数据，确保 configTypeId 引用有效的配置类型
  - **验证**：configTypeId 引用有效，数据量符合要求

- [ ] **2.5.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的配置数据（来自 2.5.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 2.6 dt_config_items 表数据准备

- [ ] **2.6.1 读取 dt_config_items 表结构**
  - **输入**：读取 `apps/type/src/business/dev/config-item/schema.ts`
  - **输出**：理解表字段定义（id, configId, itemKey, itemValue, itemSort, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **2.6.2 理解外键关系**
  - **输入**：dt_config_items 表结构（来自 2.6.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 configId，关联到 dt_configs 表
  - **验证**：能够说明外键的目标表和字段

- [ ] **2.6.3 创建 dt_config_items 的 mock 数据文件**
  - **输入**：表结构（来自 2.6.1）
  - **输出**：创建 `apps/admin/server/api/dev-team/config-item/mock-data.ts` 文件
  - **内容**：导出 `mockConfigItems` 数组，包含 30-50 条配置项数据
  - **验证**：文件存在且包含 30-50 条数据

- [ ] **2.6.4 编写配置项数据内容**
  - **输入**：mock 数据文件（来自 2.6.3）
  - **输出**：完整的配置项数据
  - **内容**：为每个配置编写配置项，确保 configId 引用有效
  - **验证**：configId 引用有效，数据量符合要求

- [ ] **2.6.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的配置项数据（来自 2.6.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 2.7 dt_menu_groups 表数据准备

- [ ] **2.7.1 读取 dt_menu_groups 表结构**
  - **输入**：读取 `apps/type/src/business/dev/menu-group/schema.ts`
  - **输出**：理解表字段定义（id, groupCode, groupName, description, icon, sort, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **2.7.2 分析菜单分组的业务场景**
  - **输入**：参考现有菜单分组
  - **输出**：理解菜单分组的业务含义
  - **内容**：了解系统需要哪些菜单分组（系统管理、物业管理、财务管理等）
  - **验证**：能够说明每种菜单分组的用途

- [ ] **2.7.3 创建 dt_menu_groups 的 mock 数据文件**
  - **输入**：表结构（来自 2.7.1）
  - **输出**：创建 `apps/admin/server/api/dev-team/menu-group/mock-data.ts` 文件
  - **内容**：导出 `mockMenuGroups` 数组，包含 5-8 个菜单分组
  - **验证**：文件存在且包含 5-8 个菜单分组

- [ ] **2.7.4 编写菜单分组数据内容**
  - **输入**：mock 数据文件（来自 2.7.3）
  - **输出**：完整的菜单分组数据
  - **内容**：编写菜单分组数据：
    - 系统管理
    - 社区管理
    - 物业管理
    - 财务管理
    - 报表管理
  - **验证**：数据量符合设计要求（5-8 个）

- [ ] **2.7.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的菜单分组数据（来自 2.7.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 2.8 dt_menu_catalogs 表数据准备

- [ ] **2.8.1 读取 dt_menu_catalogs 表结构**
  - **输入**：读取 `apps/type/src/business/dev/menu-catalog/schema.ts`
  - **输出**：理解表字段定义（id, groupId, parentId, catalogName, catalogCode, path, icon, sort, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **2.8.2 理解外键关系**
  - **输入**：dt_menu_catalogs 表结构（来自 2.8.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 groupId，关联到 dt_menu_groups 表；parentId 关联自身（树形结构）
  - **验证**：能够说明外键的目标表和字段

- [ ] **2.8.3 创建 dt_menu_catalogs 的 mock 数据文件**
  - **输入**：表结构（来自 2.8.1）
  - **输出**：创建 `apps/admin/server/api/dev-team/menu-catalog/mock-data.ts` 文件
  - **内容**：导出 `mockMenuCatalogs` 数组，包含 15-20 个菜单目录
  - **验证**：文件存在且包含 15-20 个菜单目录

- [ ] **2.8.4 编写菜单目录数据内容**
  - **输入**：mock 数据文件（来自 2.8.3）
  - **输出**：完整的菜单目录数据
  - **内容**：为每个菜单分组编写菜单目录，确保 groupId 引用有效
  - **验证**：groupId 引用有效，数据量符合要求

- [ ] **2.8.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的菜单目录数据（来自 2.8.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 2.9 dt_menu_items 表数据准备

- [ ] **2.9.1 读取 dt_menu_items 表结构**
  - **输入**：读取 `apps/type/src/business/dev/menu-item/schema.ts`
  - **输出**：理解表字段定义（id, catalogId, itemName, itemCode, path, icon, sort, permission, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **2.9.2 理解外键关系**
  - **输入**：dt_menu_items 表结构（来自 2.9.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 catalogId，关联到 dt_menu_catalogs 表
  - **验证**：能够说明外键的目标表和字段

- [ ] **2.9.3 创建 dt_menu_items 的 mock 数据文件**
  - **输入**：表结构（来自 2.9.1）
  - **输出**：创建 `apps/admin/server/api/dev-team/menu-item/mock-data.ts` 文件
  - **内容**：导出 `mockMenuItems` 数组，包含 50-80 个菜单项
  - **验证**：文件存在且包含 50-80 个菜单项

- [ ] **2.9.4 编写菜单项数据内容**
  - **输入**：mock 数据文件（来自 2.9.3）
  - **输出**：完整的菜单项数据
  - **内容**：为每个菜单目录编写菜单项，确保 catalogId 引用有效
  - **验证**：catalogId 引用有效，数据量符合要求

- [ ] **2.9.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的菜单项数据（来自 2.9.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 2.10 seed-sql/00-dev.ts 集成

- [ ] **2.10.1 导入所有 dev 模块的 mock 数据**
  - **输入**：所有 dev 模块的 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/00-dev.ts 中导入所有 mock 数据：
    - mockDictionaries
    - mockDictionaryItems
    - mockCacheConfigs
    - mockConfigTypes
    - mockConfigs
    - mockConfigItems
    - mockMenuGroups
    - mockMenuCatalogs
    - mockMenuItems
  - **验证**：无导入错误

- [ ] **2.10.2 为 dt_dictionaries 添加生成逻辑**
  - **输入**：mockDictionaries 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册每条字典的 ID，生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有字典数据

- [ ] **2.10.3 为 dt_dictionary_items 添加生成逻辑**
  - **输入**：mockDictionaryItems 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取字典 ID，处理外键关系，生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有字典项数据，外键正确

- [ ] **2.10.4 为 dt_cache_configs 添加生成逻辑**
  - **输入**：mockCacheConfigs 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有缓存配置数据

- [ ] **2.10.5 为 dt_config_types 添加生成逻辑**
  - **输入**：mockConfigTypes 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有配置类型数据

- [ ] **2.10.6 为 dt_configs 添加生成逻辑**
  - **输入**：mockConfigs 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取配置类型 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有配置数据，外键正确

- [ ] **2.10.7 为 dt_config_items 添加生成逻辑**
  - **输入**：mockConfigItems 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取配置 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有配置项数据，外键正确

- [ ] **2.10.8 为 dt_menu_groups 添加生成逻辑**
  - **输入**：mockMenuGroups 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有菜单分组数据

- [ ] **2.10.9 为 dt_menu_catalogs 添加生成逻辑**
  - **输入**：mockMenuCatalogs 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取菜单分组 ID，处理外键关系；处理 parentId 自关联
  - **验证**：生成的 SQL 包含所有菜单目录数据，外键正确

- [ ] **2.10.10 为 dt_menu_items 添加生成逻辑**
  - **输入**：mockMenuItems 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取菜单目录 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有菜单项数据，外键正确

- [ ] **2.10.11 导出 generateDevSql 函数**
  - **输入**：所有表的生成逻辑
  - **输出**：generateDevSql 函数
  - **内容**：整合所有表的生成逻辑，导出 generateDevSql 函数
  - **验证**：函数导出正确，可在 generate-seed-sql.ts 中调用

### 2.11 Dev 模块测试验证

- [ ] **2.11.1 运行 SQL 生成命令**
  - **输入**：seed-sql/00-dev.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module dev`
  - **验证**：命令执行成功，无错误

- [ ] **2.11.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 9 个表的 INSERT 语句
  - **验证**：所有 9 个表都有对应的 INSERT 语句

- [ ] **2.11.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量：
    - dt_dictionaries: 20-30 条
    - dt_dictionary_items: 50-100 条
    - dt_cache_configs: 10-15 条
    - dt_config_types: 5-10 条
    - dt_configs: 15-20 条
    - dt_config_items: 30-50 条
    - dt_menu_groups: 5-8 个
    - dt_menu_catalogs: 15-20 个
    - dt_menu_items: 50-80 个
  - **验证**：数据量符合设计要求

- [ ] **2.11.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确：
    - dt_dictionary_items.dictionaryId → dt_dictionaries.id
    - dt_configs.configTypeId → dt_config_types.id
    - dt_config_items.configId → dt_configs.id
    - dt_menu_catalogs.groupId → dt_menu_groups.id
    - dt_menu_items.catalogId → dt_menu_catalogs.id
  - **验证**：无孤立记录，外键引用有效

- [ ] **2.11.5 记录测试结果**
  - **输入**：测试验证结果（来自 2.11.1-2.11.4）
  - **输出**：创建 `dev-module-test-report.md` 文件
  - **内容**：记录每个测试项的结果，标记问题（如有）
  - **验证**：文件已创建且包含完整的测试结果

## 3. Community 模块 (6 个表)

本模块包含社区、楼栋、公告等基础数据。

### 3.1 cm_communities 表数据准备

- [ ] **3.1.1 读取 cm_communities 表结构**
  - **输入**：读取 `apps/type/src/business/community/community/schema.ts`
  - **输出**：理解表字段定义（id, communityCode, communityName, province, city, district, address, area, buildingCount, householdCount, propertyCompany, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **3.1.2 分析社区的业务场景**
  - **输入**：参考现有社区数据
  - **输出**：理解社区数据的业务含义
  - **内容**：了解社区数据包含的信息
  - **验证**：能够说明社区数据的用途

- [ ] **3.1.3 创建 cm_communities 的 mock 数据文件**
  - **输入**：表结构（来自 3.1.1）
  - **输出**：创建 `apps/admin/server/api/community/community/mock-data.ts` 文件
  - **内容**：导出 `mockCommunities` 数组，包含 2-3 个社区数据
  - **验证**：文件存在且包含 2-3 个社区数据

- [ ] **3.1.4 编写社区数据内容**
  - **输入**：mock 数据文件（来自 3.1.3）
  - **输出**：完整的社区数据
  - **内容**：编写 2-3 个社区数据，包含真实地址信息
  - **验证**：数据量符合设计要求（2-3 个）

- [ ] **3.1.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的社区数据（来自 3.1.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 3.2 cm_building_structures 表数据准备

- [ ] **3.2.1 读取 cm_building_structures 表结构**
  - **输入**：读取 `apps/type/src/business/community/building/schema.ts`
  - **输出**：理解表字段定义（id, communityId, buildingName, buildingCode, unitCount, floorCount, householdCountPerFloor, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **3.2.2 理解外键关系**
  - **输入**：cm_building_structures 表结构（来自 3.2.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 communityId，关联到 cm_communities 表
  - **验证**：能够说明外键的目标表和字段

- [ ] **3.2.3 创建 cm_building_structures 的 mock 数据文件**
  - **输入**：表结构（来自 3.2.1）
  - **输出**：创建 `apps/admin/server/api/community/building/mock-data.ts` 文件
  - **内容**：导出 `mockBuildingStructures` 数组，包含每个社区 5-10 个楼栋
  - **验证**：文件存在且包含楼栋数据

- [ ] **3.2.4 编写楼栋数据内容**
  - **输入**：mock 数据文件（来自 3.2.3）
  - **输出**：完整的楼栋数据
  - **内容**：为每个社区编写楼栋数据，确保 communityId 引用有效
  - **验证**：communityId 引用有效，数据量符合要求

- [ ] **3.2.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的楼栋数据（来自 3.2.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 3.3 cm_notices 表数据准备

- [ ] **3.3.1 读取 cm_notices 表结构**
  - **输入**：读取 `apps/type/src/business/community/notice/schema.ts`
  - **输出**：理解表字段定义（id, communityId, title, content, noticeType, publishTime, expireTime, status, createTime, updateTime）
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **3.3.2 理解外键关系**
  - **输入**：cm_notices 表结构（来自 3.3.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 communityId，关联到 cm_communities 表
  - **验证**：能够说明外键的目标表和字段

- [ ] **3.3.3 创建 cm_notices 的 mock 数据文件**
  - **输入**：表结构（来自 3.3.1）
  - **输出**：创建 `apps/admin/server/api/community/notice/mock-data.ts` 文件
  - **内容**：导出 `mockNotices` 数组，包含 20-30 条公告数据
  - **验证**：文件存在且包含 20-30 条公告数据

- [ ] **3.3.4 编写公告数据内容**
  - **输入**：mock 数据文件（来自 3.3.3）
  - **输出**：完整的公告数据
  - **内容**：编写公告数据，包括标题、内容、类型、发布时间等
  - **验证**：communityId 引用有效，数据量符合要求

- [ ] **3.3.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的公告数据（来自 3.3.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 3.4 cm_handing_business 表数据准备

- [ ] **3.4.1 读取 cm_handing_business 表结构**
  - **输入**：读取 `apps/type/src/business/community/handing-business/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **3.4.2 理解外键关系**
  - **输入**：cm_handing_business 表结构（来自 3.4.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **3.4.3 创建 cm_handing_business 的 mock 数据文件**
  - **输入**：表结构（来自 3.4.1）
  - **输出**：创建 `apps/admin/server/api/community/handing-business/mock-data.ts` 文件
  - **内容**：导出 `mockHandingBusinesses` 数组
  - **验证**：文件存在

- [ ] **3.4.4 编写业务数据内容**
  - **输入**：mock 数据文件（来自 3.4.3）
  - **输出**：完整的业务数据
  - **内容**：编写业务数据
  - **验证**：外键引用有效

- [ ] **3.4.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的业务数据（来自 3.4.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 3.5 cm_house_decorations 表数据准备

- [ ] **3.5.1 读取 cm_house_decorations 表结构**
  - **输入**：读取 `apps/type/src/business/community/house-decoration/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **3.5.2 理解外键关系**
  - **输入**：cm_house_decorations 表结构（来自 3.5.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **3.5.3 创建 cm_house_decorations 的 mock 数据文件**
  - **输入**：表结构（来自 3.5.1）
  - **输出**：创建 `apps/admin/server/api/community/house-decoration/mock-data.ts` 文件
  - **内容**：导出 `mockHouseDecorations` 数组
  - **验证**：文件存在

- [ ] **3.5.4 编写装修数据内容**
  - **输入**：mock 数据文件（来自 3.5.3）
  - **输出**：完整的装修数据
  - **内容**：编写装修申请数据
  - **验证**：外键引用有效

- [ ] **3.5.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的装修数据（来自 3.5.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 3.6 cm_property_registers 表数据准备

- [ ] **3.6.1 读取 cm_property_registers 表结构**
  - **输入**：读取 `apps/type/src/business/community/property-register/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **3.6.2 理解外键关系**
  - **输入**：cm_property_registers 表结构（来自 3.6.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **3.6.3 创建 cm_property_registers 的 mock 数据文件**
  - **输入**：表结构（来自 3.6.1）
  - **输出**：创建 `apps/admin/server/api/community/property-register/mock-data.ts` 文件
  - **内容**：导出 `mockPropertyRegisters` 数组
  - **验证**：文件存在

- [ ] **3.6.4 编写登记数据内容**
  - **输入**：mock 数据文件（来自 3.6.3）
  - **输出**：完整的登记数据
  - **内容**：编写物业登记数据
  - **验证**：外键引用有效

- [ ] **3.6.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的登记数据（来自 3.6.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 3.7 seed-sql/01-community.ts 集成

- [ ] **3.7.1 导入所有 community 模块的 mock 数据**
  - **输入**：所有 community 模块的 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/01-community.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **3.7.2 为 cm_communities 添加生成逻辑**
  - **输入**：mockCommunities 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有社区数据

- [ ] **3.7.3 为 cm_building_structures 添加生成逻辑**
  - **输入**：mockBuildingStructures 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取社区 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有楼栋数据，外键正确

- [ ] **3.7.4 为 cm_notices 添加生成逻辑**
  - **输入**：mockNotices 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取社区 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有公告数据，外键正确

- [ ] **3.7.5 为其他表添加生成逻辑**
  - **输入**：其他表的 mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：为 cm_handing_business, cm_house_decorations, cm_property_registers 生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有数据

- [ ] **3.7.6 导出 generateCommunitySql 函数**
  - **输入**：所有表的生成逻辑
  - **输出**：generateCommunitySql 函数
  - **内容**：整合所有表的生成逻辑，导出 generateCommunitySql 函数
  - **验证**：函数导出正确

### 3.8 Community 模块测试验证

- [ ] **3.8.1 运行 SQL 生成命令**
  - **输入**：seed-sql/01-community.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module community`
  - **验证**：命令执行成功，无错误

- [ ] **3.8.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 6 个表的 INSERT 语句
  - **验证**：所有 6 个表都有对应的 INSERT 语句

- [ ] **3.8.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求

- [ ] **3.8.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录

- [ ] **3.8.5 记录测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `community-module-test-report.md` 文件
  - **内容**：记录测试结果
  - **验证**：文件已创建

## 4. Setting 模块 (13 个表)

本模块包含组织架构、员工、角色、权限等系统管理数据。

### 4.1 sm_organizations 表数据准备

- [ ] **4.1.1 读取 sm_organizations 表结构**
  - **输入**：读取 `apps/type/src/business/setting/organization/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.1.2 分析组织的业务场景**
  - **输入**：参考现有组织数据
  - **输出**：理解组织数据的业务含义
  - **内容**：了解组织架构的层级结构
  - **验证**：能够说明组织数据的用途

- [ ] **4.1.3 创建 sm_organizations 的 mock 数据文件**
  - **输入**：表结构（来自 4.1.1）
  - **输出**：创建 `apps/admin/server/api/setting/organization/mock-data.ts` 文件
  - **内容**：导出 `mockOrganizations` 数组，包含 3-5 个组织
  - **验证**：文件存在且包含 3-5 个组织数据

- [ ] **4.1.4 编写组织数据内容**
  - **输入**：mock 数据文件（来自 4.1.3）
  - **输出**：完整的组织数据
  - **内容**：编写组织数据，包含层级结构
  - **验证**：数据量符合设计要求（3-5 个）

- [ ] **4.1.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的组织数据（来自 4.1.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.2 sm_staff 表数据准备

- [ ] **4.2.1 读取 sm_staff 表结构**
  - **输入**：读取 `apps/type/src/business/setting/staff/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.2.2 理解外键关系**
  - **输入**：sm_staff 表结构（来自 4.2.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **4.2.3 创建 sm_staff 的 mock 数据文件**
  - **输入**：表结构（来自 4.2.1）
  - **输出**：创建 `apps/admin/server/api/setting/staff/mock-data.ts` 文件
  - **内容**：导出 `mockStaff` 数组
  - **验证**：文件存在

- [ ] **4.2.4 编写员工数据内容**
  - **输入**：mock 数据文件（来自 4.2.3）
  - **输出**：完整的员工数据
  - **内容**：编写员工数据
  - **验证**：外键引用有效

- [ ] **4.2.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的员工数据（来自 4.2.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.3 sm_roles 表数据准备

- [ ] **4.3.1 读取 sm_roles 表结构**
  - **输入**：读取 `apps/type/src/business/setting/role/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.3.2 分析角色的业务场景**
  - **输入**：参考现有角色数据
  - **输出**：理解角色数据的业务含义
  - **内容**：了解系统需要哪些角色（管理员、物业经理、财务、保安等）
  - **验证**：能够说明每种角色的用途

- [ ] **4.3.3 创建 sm_roles 的 mock 数据文件**
  - **输入**：表结构（来自 4.3.1）
  - **输出**：创建 `apps/admin/server/api/setting/role/mock-data.ts` 文件
  - **内容**：导出 `mockRoles` 数组，包含 5-8 个角色
  - **验证**：文件存在且包含 5-8 个角色

- [ ] **4.3.4 编写角色数据内容**
  - **输入**：mock 数据文件（来自 4.3.3）
  - **输出**：完整的角色数据
  - **内容**：编写角色数据：
    - 超级管理员
    - 物业经理
    - 财务
    - 客服
    - 保安
    - 维修工
  - **验证**：数据量符合设计要求

- [ ] **4.3.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的角色数据（来自 4.3.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.4 sm_permissions 表数据准备

- [ ] **4.4.1 读取 sm_permissions 表结构**
  - **输入**：读取 `apps/type/src/business/setting/permission/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.4.2 分析权限的业务场景**
  - **输入**：参考现有权限数据
  - **输出**：理解权限数据的业务含义
  - **内容**：了解系统需要哪些权限
  - **验证**：能够说明每种权限的用途

- [ ] **4.4.3 创建 sm_permissions 的 mock 数据文件**
  - **输入**：表结构（来自 4.4.1）
  - **输出**：创建 `apps/admin/server/api/setting/permission/mock-data.ts` 文件
  - **内容**：导出 `mockPermissions` 数组
  - **验证**：文件存在

- [ ] **4.4.4 编写权限数据内容**
  - **输入**：mock 数据文件（来自 4.4.3）
  - **输出**：完整的权限数据
  - **内容**：编写权限数据
  - **验证**：数据量合理

- [ ] **4.4.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的权限数据（来自 4.4.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.5 sm_role_permissions 表数据准备

- [ ] **4.5.1 读取 sm_role_permissions 表结构**
  - **输入**：读取 `apps/type/src/business/setting/role-permission/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.5.2 理解外键关系**
  - **输入**：sm_role_permissions 表结构（来自 4.5.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 roleId, permissionId
  - **验证**：能够说明外键的目标表和字段

- [ ] **4.5.3 创建 sm_role_permissions 的 mock 数据文件**
  - **输入**：表结构（来自 4.5.1）
  - **输出**：创建 `apps/admin/server/api/setting/role-permission/mock-data.ts` 文件
  - **内容**：导出 `mockRolePermissions` 数组
  - **验证**：文件存在

- [ ] **4.5.4 编写角色权限数据内容**
  - **输入**：mock 数据文件（来自 4.5.3）
  - **输出**：完整的角色权限数据
  - **内容**：为每个角色分配权限
  - **验证**：外键引用有效

- [ ] **4.5.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的角色权限数据（来自 4.5.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.6 sm_staff_roles 表数据准备

- [ ] **4.6.1 读取 sm_staff_roles 表结构**
  - **输入**：读取 `apps/type/src/business/setting/staff-role/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.6.2 理解外键关系**
  - **输入**：sm_staff_roles 表结构（来自 4.6.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段 staffId, roleId
  - **验证**：能够说明外键的目标表和字段

- [ ] **4.6.3 创建 sm_staff_roles 的 mock 数据文件**
  - **输入**：表结构（来自 4.6.1）
  - **输出**：创建 `apps/admin/server/api/setting/staff-role/mock-data.ts` 文件
  - **内容**：导出 `mockStaffRoles` 数组
  - **验证**：文件存在

- [ ] **4.6.4 编写员工角色数据内容**
  - **输入**：mock 数据文件（来自 4.6.3）
  - **输出**：完整的员工角色数据
  - **内容**：为每个员工分配角色
  - **验证**：外键引用有效

- [ ] **4.6.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的员工角色数据（来自 4.6.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.7 sm_data_permissions 表数据准备

- [ ] **4.7.1 读取 sm_data_permissions 表结构**
  - **输入**：读取 `apps/type/src/business/setting/data-permission/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.7.2 创建 sm_data_permissions 的 mock 数据文件**
  - **输入**：表结构（来自 4.7.1）
  - **输出**：创建 `apps/admin/server/api/setting/data-permission/mock-data.ts` 文件
  - **内容**：导出 `mockDataPermissions` 数组
  - **验证**：文件存在

- [ ] **4.7.3 编写数据权限数据内容**
  - **输入**：mock 数据文件（来自 4.7.2）
  - **输出**：完整的数据权限数据
  - **内容**：编写数据权限配置
  - **验证**：数据合理

- [ ] **4.7.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的数据权限数据（来自 4.7.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.8 sm_shifts 表数据准备

- [ ] **4.8.1 读取 sm_shifts 表结构**
  - **输入**：读取 `apps/type/src/business/setting/shift/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.8.2 创建 sm_shifts 的 mock 数据文件**
  - **输入**：表结构（来自 4.8.1）
  - **输出**：创建 `apps/admin/server/api/setting/shift/mock-data.ts` 文件
  - **内容**：导出 `mockShifts` 数组
  - **验证**：文件存在

- [ ] **4.8.3 编写班次数据内容**
  - **输入**：mock 数据文件（来自 4.8.2）
  - **输出**：完整的班次数据
  - **内容**：编写班次配置（早班、晚班、夜班等）
  - **验证**：数据合理

- [ ] **4.8.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的班次数据（来自 4.8.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.9 sm_scheduling_settings 表数据准备

- [ ] **4.9.1 读取 sm_scheduling_settings 表结构**
  - **输入**：读取 `apps/type/src/business/setting/scheduling-setting/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.9.2 创建 sm_scheduling_settings 的 mock 数据文件**
  - **输入**：表结构（来自 4.9.1）
  - **输出**：创建 `apps/admin/server/api/setting/scheduling-setting/mock-data.ts` 文件
  - **内容**：导出 `mockSchedulingSettings` 数组
  - **验证**：文件存在

- [ ] **4.9.3 编写排班设置数据内容**
  - **输入**：mock 数据文件（来自 4.9.2）
  - **输出**：完整的排班设置数据
  - **内容**：编写排班规则配置
  - **验证**：数据合理

- [ ] **4.9.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的排班设置数据（来自 4.9.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.10 sm_working_schedules 表数据准备

- [ ] **4.10.1 读取 sm_working_schedules 表结构**
  - **输入**：读取 `apps/type/src/business/setting/working-schedule/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.10.2 理解外键关系**
  - **输入**：sm_working_schedules 表结构（来自 4.10.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **4.10.3 创建 sm_working_schedules 的 mock 数据文件**
  - **输入**：表结构（来自 4.10.1）
  - **输出**：创建 `apps/admin/server/api/setting/working-schedule/mock-data.ts` 文件
  - **内容**：导出 `mockWorkingSchedules` 数组
  - **验证**：文件存在

- [ ] **4.10.4 编写排班数据内容**
  - **输入**：mock 数据文件（来自 4.10.3）
  - **输出**：完整的排班数据
  - **内容**：编写员工排班数据
  - **验证**：外键引用有效

- [ ] **4.10.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的排班数据（来自 4.10.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.11 sm_system_configs 表数据准备

- [ ] **4.11.1 读取 sm_system_configs 表结构**
  - **输入**：读取 `apps/type/src/business/setting/system-config/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.11.2 创建 sm_system_configs 的 mock 数据文件**
  - **输入**：表结构（来自 4.11.1）
  - **输出**：创建 `apps/admin/server/api/setting/system-config/mock-data.ts` 文件
  - **内容**：导出 `mockSystemConfigs` 数组
  - **验证**：文件存在

- [ ] **4.11.3 编写系统配置数据内容**
  - **输入**：mock 数据文件（来自 4.11.2）
  - **输出**：完整的系统配置数据
  - **内容**：编写系统配置数据
  - **验证**：数据合理

- [ ] **4.11.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的系统配置数据（来自 4.11.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.12 sm_register_protocols 表数据准备

- [ ] **4.12.1 读取 sm_register_protocols 表结构**
  - **输入**：读取 `apps/type/src/business/setting/register-protocol/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.12.2 创建 sm_register_protocols 的 mock 数据文件**
  - **输入**：表结构（来自 4.12.1）
  - **输出**：创建 `apps/admin/server/api/setting/register-protocol/mock-data.ts` 文件
  - **内容**：导出 `mockRegisterProtocols` 数组
  - **验证**：文件存在

- [ ] **4.12.3 编写注册协议数据内容**
  - **输入**：mock 数据文件（来自 4.12.2）
  - **输出**：完整的注册协议数据
  - **内容**：编写用户注册协议
  - **验证**：数据合理

- [ ] **4.12.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的注册协议数据（来自 4.12.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.13 sm_initialize_cells 表数据准备

- [ ] **4.13.1 读取 sm_initialize_cells 表结构**
  - **输入**：读取 `apps/type/src/business/setting/initialize-cell/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.13.2 创建 sm_initialize_cells 的 mock 数据文件**
  - **输入**：表结构（来自 4.13.1）
  - **输出**：创建 `apps/admin/server/api/setting/initialize-cell/mock-data.ts` 文件
  - **内容**：导出 `mockInitializeCells` 数组
  - **验证**：文件存在

- [ ] **4.13.3 编写初始化单元格数据内容**
  - **输入**：mock 数据文件（来自 4.13.2）
  - **输出**：完整的初始化单元格数据
  - **内容**：编写初始化数据配置
  - **验证**：数据合理

- [ ] **4.13.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的初始化单元格数据（来自 4.13.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.14 sm_community_configurations 表数据准备

- [ ] **4.14.1 读取 sm_community_configurations 表结构**
  - **输入**：读取 `apps/type/src/business/setting/community-configuration/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.14.2 创建 sm_community_configurations 的 mock 数据文件**
  - **输入**：表结构（来自 4.14.1）
  - **输出**：创建 `apps/admin/server/api/setting/community-configuration/mock-data.ts` 文件
  - **内容**：导出 `mockCommunityConfigurations` 数组
  - **验证**：文件存在

- [ ] **4.14.3 编写社区配置数据内容**
  - **输入**：mock 数据文件（来自 4.14.2）
  - **输出**：完整的社区配置数据
  - **内容**：编写社区配置数据
  - **验证**：数据合理

- [ ] **4.14.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的社区配置数据（来自 4.14.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.15 sm_change_password_records 表数据准备

- [ ] **4.15.1 读取 sm_change_password_records 表结构**
  - **输入**：读取 `apps/type/src/business/setting/change-password-record/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **4.15.2 创建 sm_change_password_records 的 mock 数据文件**
  - **输入**：表结构（来自 4.15.1）
  - **输出**：创建 `apps/admin/server/api/setting/change-password-record/mock-data.ts` 文件
  - **内容**：导出 `mockChangePasswordRecords` 数组
  - **验证**：文件存在

- [ ] **4.15.3 编写密码修改记录数据内容**
  - **输入**：mock 数据文件（来自 4.15.2）
  - **输出**：完整的密码修改记录数据
  - **内容**：编写密码修改历史
  - **验证**：数据合理

- [ ] **4.15.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的密码修改记录数据（来自 4.15.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 4.16 seed-sql/02-setting.ts 集成

- [ ] **4.16.1 导入所有 setting 模块的 mock 数据**
  - **输入**：所有 setting 模块的 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/02-setting.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **4.16.2 为 sm_organizations 添加生成逻辑**
  - **输入**：mockOrganizations 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有组织数据

- [ ] **4.16.3 为 sm_staff 添加生成逻辑**
  - **输入**：mockStaff 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取组织 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有员工数据

- [ ] **4.16.4 为 sm_roles 添加生成逻辑**
  - **输入**：mockRoles 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有角色数据

- [ ] **4.16.5 为 sm_permissions 添加生成逻辑**
  - **输入**：mockPermissions 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有权限数据

- [ ] **4.16.6 为 sm_role_permissions 添加生成逻辑**
  - **输入**：mockRolePermissions 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取角色和权限 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有角色权限数据

- [ ] **4.16.7 为 sm_staff_roles 添加生成逻辑**
  - **输入**：mockStaffRoles 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取员工和角色 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有员工角色数据

- [ ] **4.16.8 为其他表添加生成逻辑**
  - **输入**：其他表的 mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：为 sm_data_permissions, sm_shifts, sm_scheduling_settings, sm_working_schedules, sm_system_configs, sm_register_protocols, sm_initialize_cells, sm_community_configurations, sm_change_password_records 生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有数据

- [ ] **4.16.9 导出 generateSettingSql 函数**
  - **输入**：所有表的生成逻辑
  - **输出**：generateSettingSql 函数
  - **内容**：整合所有表的生成逻辑，导出 generateSettingSql 函数
  - **验证**：函数导出正确

### 4.17 Setting 模块测试验证

- [ ] **4.17.1 运行 SQL 生成命令**
  - **输入**：seed-sql/02-setting.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module setting`
  - **验证**：命令执行成功，无错误

- [ ] **4.17.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 13 个表的 INSERT 语句
  - **验证**：所有 13 个表都有对应的 INSERT 语句

- [ ] **4.17.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求

- [ ] **4.17.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录

- [ ] **4.17.5 记录测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `setting-module-test-report.md` 文件
  - **内容**：记录测试结果
  - **验证**：文件已创建

## 5. House Property 模块 (11 个表)

本模块包含房产、业主、发票、场地预约等数据。

### 5.1 hp_houses 表数据准备

- [ ] **5.1.1 读取 hp_houses 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/house/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.1.2 理解外键关系**
  - **输入**：hp_houses 表结构（来自 5.1.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **5.1.3 创建 hp_houses 的 mock 数据文件**
  - **输入**：表结构（来自 5.1.1）
  - **输出**：创建 `apps/admin/server/api/house-property/house/mock-data.ts` 文件
  - **内容**：导出 `mockHouses` 数组
  - **验证**：文件存在

- [ ] **5.1.4 编写房产数据内容**
  - **输入**：mock 数据文件（来自 5.1.3）
  - **输出**：完整的房产数据
  - **内容**：编写房产数据
  - **验证**：外键引用有效

- [ ] **5.1.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的房产数据（来自 5.1.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.2 hp_owners 表数据准备

- [ ] **5.2.1 读取 hp_owners 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/owner/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.2.2 理解外键关系**
  - **输入**：hp_owners 表结构（来自 5.2.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **5.2.3 创建 hp_owners 的 mock 数据文件**
  - **输入**：表结构（来自 5.2.1）
  - **输出**：创建 `apps/admin/server/api/house-property/owner/mock-data.ts` 文件
  - **内容**：导出 `mockOwners` 数组
  - **验证**：文件存在

- [ ] **5.2.4 编写业主数据内容**
  - **输入**：mock 数据文件（来自 5.2.3）
  - **输出**：完整的业主数据
  - **内容**：编写业主数据
  - **验证**：数据合理

- [ ] **5.2.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的业主数据（来自 5.2.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.3 hp_owner_accounts 表数据准备

- [ ] **5.3.1 读取 hp_owner_accounts 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/owner-account/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.3.2 创建 hp_owner_accounts 的 mock 数据文件**
  - **输入**：表结构（来自 5.3.1）
  - **输出**：创建 `apps/admin/server/api/house-property/owner-account/mock-data.ts` 文件
  - **内容**：导出 `mockOwnerAccounts` 数组
  - **验证**：文件存在

- [ ] **5.3.3 编写业主账户数据内容**
  - **输入**：mock 数据文件（来自 5.3.2）
  - **输出**：完整的业主账户数据
  - **内容**：编写业主账户数据
  - **验证**：外键引用有效

- [ ] **5.3.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的业主账户数据（来自 5.3.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.4 hp_owner_members 表数据准备

- [ ] **5.4.1 读取 hp_owner_members 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/owner-member/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.4.2 创建 hp_owner_members 的 mock 数据文件**
  - **输入**：表结构（来自 5.4.1）
  - **输出**：创建 `apps/admin/server/api/house-property/owner-member/mock-data.ts` 文件
  - **内容**：导出 `mockOwnerMembers` 数组
  - **验证**：文件存在

- [ ] **5.4.3 编写业主成员数据内容**
  - **输入**：mock 数据文件（来自 5.4.2）
  - **输出**：完整的业主成员数据
  - **内容**：编写业主家庭成员数据
  - **验证**：外键引用有效

- [ ] **5.4.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的业主成员数据（来自 5.4.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.5 hp_owners_committees 表数据准备

- [ ] **5.5.1 读取 hp_owners_committees 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/owners-committee/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.5.2 创建 hp_owners_committees 的 mock 数据文件**
  - **输入**：表结构（来自 5.5.1）
  - **输出**：创建 `apps/admin/server/api/house-property/owners-committee/mock-data.ts` 文件
  - **内容**：导出 `mockOwnersCommittees` 数组
  - **验证**：文件存在

- [ ] **5.5.3 编写业主委员会数据内容**
  - **输入**：mock 数据文件（来自 5.5.2）
  - **输出**：完整的业主委员会数据
  - **内容**：编写业主委员会数据
  - **验证**：数据合理

- [ ] **5.5.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的业主委员会数据（来自 5.5.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.6 hp_invoice_titles 表数据准备

- [ ] **5.6.1 读取 hp_invoice_titles 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/invoice-title/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.6.2 创建 hp_invoice_titles 的 mock 数据文件**
  - **输入**：表结构（来自 5.6.1）
  - **输出**：创建 `apps/admin/server/api/house-property/invoice-title/mock-data.ts` 文件
  - **内容**：导出 `mockInvoiceTitles` 数组
  - **验证**：文件存在

- [ ] **5.6.3 编写发票抬头数据内容**
  - **输入**：mock 数据文件（来自 5.6.2）
  - **输出**：完整的发票抬头数据
  - **内容**：编写发票抬头数据
  - **验证**：外键引用有效

- [ ] **5.6.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的发票抬头数据（来自 5.6.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.7 hp_invoices 表数据准备

- [ ] **5.7.1 读取 hp_invoices 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/invoice/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.7.2 创建 hp_invoices 的 mock 数据文件**
  - **输入**：表结构（来自 5.7.1）
  - **输出**：创建 `apps/admin/server/api/house-property/invoice/mock-data.ts` 文件
  - **内容**：导出 `mockInvoices` 数组
  - **验证**：文件存在

- [ ] **5.7.3 编写发票数据内容**
  - **输入**：mock 数据文件（来自 5.7.2）
  - **输出**：完整的发票数据
  - **内容**：编写发票数据
  - **验证**：外键引用有效

- [ ] **5.7.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的发票数据（来自 5.7.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.8 hp_reserve_venues 表数据准备

- [ ] **5.8.1 读取 hp_reserve_venues 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/reserve-venue/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.8.2 创建 hp_reserve_venues 的 mock 数据文件**
  - **输入**：表结构（来自 5.8.1）
  - **输出**：创建 `apps/admin/server/api/house-property/reserve-venue/mock-data.ts` 文件
  - **内容**：导出 `mockReserveVenues` 数组
  - **验证**：文件存在

- [ ] **5.8.3 编写场地数据内容**
  - **输入**：mock 数据文件（来自 5.8.2）
  - **输出**：完整的场地数据
  - **内容**：编写场地预约配置数据
  - **验证**：数据合理

- [ ] **5.8.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的场地数据（来自 5.8.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.9 hp_reserve_venue_orders 表数据准备

- [ ] **5.9.1 读取 hp_reserve_venue_orders 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/reserve-venue-order/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.9.2 理解外键关系**
  - **输入**：hp_reserve_venue_orders 表结构（来自 5.9.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **5.9.3 创建 hp_reserve_venue_orders 的 mock 数据文件**
  - **输入**：表结构（来自 5.9.1）
  - **输出**：创建 `apps/admin/server/api/house-property/reserve-venue-order/mock-data.ts` 文件
  - **内容**：导出 `mockReserveVenueOrders` 数组
  - **验证**：文件存在

- [ ] **5.9.4 编写场地预约订单数据内容**
  - **输入**：mock 数据文件（来自 5.9.3）
  - **输出**：完整的场地预约订单数据
  - **内容**：编写场地预约订单数据
  - **验证**：外键引用有效

- [ ] **5.9.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的场地预约订单数据（来自 5.9.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.10 hp_site_managements 表数据准备

- [ ] **5.10.1 读取 hp_site_managements 表结构**
  - **输入**：读取 `apps/type/src/business/house-property/site-management/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **5.10.2 创建 hp_site_managements 的 mock 数据文件**
  - **输入**：表结构（来自 5.10.1）
  - **输出**：创建 `apps/admin/server/api/house-property/site-management/mock-data.ts` 文件
  - **内容**：导出 `mockSiteManagements` 数组
  - **验证**：文件存在

- [ ] **5.10.3 编写场地管理数据内容**
  - **输入**：mock 数据文件（来自 5.10.2）
  - **输出**：完整的场地管理数据
  - **内容**：编写场地管理数据
  - **验证**：数据合理

- [ ] **5.10.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的场地管理数据（来自 5.10.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 5.11 seed-sql/03-house-property.ts 集成

- [ ] **5.11.1 导入所有 house-property 模块的 mock 数据**
  - **输入**：所有 house-property 模块的 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/03-house-property.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **5.11.2 为 hp_houses 添加生成逻辑**
  - **输入**：mockHouses 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有房产数据

- [ ] **5.11.3 为 hp_owners 添加生成逻辑**
  - **输入**：mockOwners 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有业主数据

- [ ] **5.11.4 为 hp_owner_accounts 添加生成逻辑**
  - **输入**：mockOwnerAccounts 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取业主 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有业主账户数据

- [ ] **5.11.5 为 hp_owner_members 添加生成逻辑**
  - **输入**：mockOwnerMembers 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取业主 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有业主成员数据

- [ ] **5.11.6 为其他表添加生成逻辑**
  - **输入**：其他表的 mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：为 hp_owners_committees, hp_invoice_titles, hp_invoices, hp_reserve_venues, hp_reserve_venue_orders, hp_site_managements 生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有数据

- [ ] **5.11.7 导出 generateHousePropertySql 函数**
  - **输入**：所有表的生成逻辑
  - **输出**：generateHousePropertySql 函数
  - **内容**：整合所有表的生成逻辑，导出 generateHousePropertySql 函数
  - **验证**：函数导出正确

### 5.12 House Property 模块测试验证

- [ ] **5.12.1 运行 SQL 生成命令**
  - **输入**：seed-sql/03-house-property.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module house-property`
  - **验证**：命令执行成功，无错误

- [ ] **5.12.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 11 个表的 INSERT 语句
  - **验证**：所有 11 个表都有对应的 INSERT 语句

- [ ] **5.12.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求

- [ ] **5.12.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录

- [ ] **5.12.5 记录测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `house-property-module-test-report.md` 文件
  - **内容**：记录测试结果
  - **验证**：文件已创建

## 6. Operation 模块 (9 个表)

本模块包含商家、运营配置等数据。

### 6.1 op_merchants 表数据准备

- [ ] **6.1.1 读取 op_merchants 表结构**
  - **输入**：读取 `apps/type/src/business/operation/merchant/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.1.2 创建 op_merchants 的 mock 数据文件**
  - **输入**：表结构（来自 6.1.1）
  - **输出**：创建 `apps/admin/server/api/operation/merchant/mock-data.ts` 文件
  - **内容**：导出 `mockMerchants` 数组
  - **验证**：文件存在

- [ ] **6.1.3 编写商家数据内容**
  - **输入**：mock 数据文件（来自 6.1.2）
  - **输出**：完整的商家数据
  - **内容**：编写商家数据
  - **验证**：数据合理

- [ ] **6.1.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的商家数据（来自 6.1.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.2 op_merchant_admins 表数据准备

- [ ] **6.2.1 读取 op_merchant_admins 表结构**
  - **输入**：读取 `apps/type/src/business/operation/merchant-admin/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.2.2 理解外键关系**
  - **输入**：op_merchant_admins 表结构（来自 6.2.1）
  - **输出**：外键关系说明
  - **内容**：识别外键字段
  - **验证**：能够说明外键的目标表和字段

- [ ] **6.2.3 创建 op_merchant_admins 的 mock 数据文件**
  - **输入**：表结构（来自 6.2.1）
  - **输出**：创建 `apps/admin/server/api/operation/merchant-admin/mock-data.ts` 文件
  - **内容**：导出 `mockMerchantAdmins` 数组
  - **验证**：文件存在

- [ ] **6.2.4 编写商家管理员数据内容**
  - **输入**：mock 数据文件（来自 6.2.3）
  - **输出**：完整的商家管理员数据
  - **内容**：编写商家管理员数据
  - **验证**：外键引用有效

- [ ] **6.2.5 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的商家管理员数据（来自 6.2.4）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型、外键引用
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.3 op_property_companies 表数据准备

- [ ] **6.3.1 读取 op_property_companies 表结构**
  - **输入**：读取 `apps/type/src/business/operation/property-company/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.3.2 创建 op_property_companies 的 mock 数据文件**
  - **输入**：表结构（来自 6.3.1）
  - **输出**：创建 `apps/admin/server/api/operation/property-company/mock-data.ts` 文件
  - **内容**：导出 `mockPropertyCompanies` 数组
  - **验证**：文件存在

- [ ] **6.3.3 编写物业公司数据内容**
  - **输入**：mock 数据文件（来自 6.3.2）
  - **输出**：完整的物业公司数据
  - **内容**：编写物业公司数据
  - **验证**：数据合理

- [ ] **6.3.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的物业公司数据（来自 6.3.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.4 op_community_info 表数据准备

- [ ] **6.4.1 读取 op_community_info 表结构**
  - **输入**：读取 `apps/type/src/business/operation/community-info/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.4.2 创建 op_community_info 的 mock 数据文件**
  - **输入**：表结构（来自 6.4.1）
  - **输出**：创建 `apps/admin/server/api/operation/community-info/mock-data.ts` 文件
  - **内容**：导出 `mockCommunityInfo` 数组
  - **验证**：文件存在

- [ ] **6.4.3 编写社区信息数据内容**
  - **输入**：mock 数据文件（来自 6.4.2）
  - **输出**：完整的社区信息数据
  - **内容**：编写社区信息数据
  - **验证**：数据合理

- [ ] **6.4.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的社区信息数据（来自 6.4.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.5 op_community_configs 表数据准备

- [ ] **6.5.1 读取 op_community_configs 表结构**
  - **输入**：读取 `apps/type/src/business/operation/community-config/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.5.2 创建 op_community_configs 的 mock 数据文件**
  - **输入**：表结构（来自 6.5.1）
  - **输出**：创建 `apps/admin/server/api/operation/community-config/mock-data.ts` 文件
  - **内容**：导出 `mockCommunityConfigs` 数组
  - **验证**：文件存在

- [ ] **6.5.3 编写社区配置数据内容**
  - **输入**：mock 数据文件（来自 6.5.2）
  - **输出**：完整的社区配置数据
  - **内容**：编写社区配置数据
  - **验证**：数据合理

- [ ] **6.5.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的社区配置数据（来自 6.5.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.6 op_register_protocols 表数据准备

- [ ] **6.6.1 读取 op_register_protocols 表结构**
  - **输入**：读取 `apps/type/src/business/operation/register-protocol/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.6.2 创建 op_register_protocols 的 mock 数据文件**
  - **输入**：表结构（来自 6.6.1）
  - **输出**：创建 `apps/admin/server/api/operation/register-protocol/mock-data.ts` 文件
  - **内容**：导出 `mockRegisterProtocols` 数组
  - **验证**：文件存在

- [ ] **6.6.3 编写注册协议数据内容**
  - **输入**：mock 数据文件（来自 6.6.2）
  - **输出**：完整的注册协议数据
  - **内容**：编写注册协议数据
  - **验证**：数据合理

- [ ] **6.6.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的注册协议数据（来自 6.6.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.7 op_report_groups 表数据准备

- [ ] **6.7.1 读取 op_report_groups 表结构**
  - **输入**：读取 `apps/type/src/business/operation/report-group/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.7.2 创建 op_report_groups 的 mock 数据文件**
  - **输入**：表结构（来自 6.7.1）
  - **输出**：创建 `apps/admin/server/api/operation/report-group/mock-data.ts` 文件
  - **内容**：导出 `mockReportGroups` 数组
  - **验证**：文件存在

- [ ] **6.7.3 编写报表分组数据内容**
  - **输入**：mock 数据文件（来自 6.7.2）
  - **输出**：完整的报表分组数据
  - **内容**：编写报表分组数据
  - **验证**：数据合理

- [ ] **6.7.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的报表分组数据（来自 6.7.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.8 op_report_components 表数据准备

- [ ] **6.8.1 读取 op_report_components 表结构**
  - **输入**：读取 `apps/type/src/business/operation/report-component/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.8.2 创建 op_report_components 的 mock 数据文件**
  - **输入**：表结构（来自 6.8.1）
  - **输出**：创建 `apps/admin/server/api/operation/report-component/mock-data.ts` 文件
  - **内容**：导出 `mockReportComponents` 数组
  - **验证**：文件存在

- [ ] **6.8.3 编写报表组件数据内容**
  - **输入**：mock 数据文件（来自 6.8.2）
  - **输出**：完整的报表组件数据
  - **内容**：编写报表组件数据
  - **验证**：数据合理

- [ ] **6.8.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的报表组件数据（来自 6.8.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.9 op_report_infos 表数据准备

- [ ] **6.9.1 读取 op_report_infos 表结构**
  - **输入**：读取 `apps/type/src/business/operation/report-info/schema.ts`
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **6.9.2 创建 op_report_infos 的 mock 数据文件**
  - **输入**：表结构（来自 6.9.1）
  - **输出**：创建 `apps/admin/server/api/operation/report-info/mock-data.ts` 文件
  - **内容**：导出 `mockReportInfos` 数组
  - **验证**：文件存在

- [ ] **6.9.3 编写报表信息数据内容**
  - **输入**：mock 数据文件（来自 6.9.2）
  - **输出**：完整的报表信息数据
  - **内容**：编写报表信息数据
  - **验证**：数据合理

- [ ] **6.9.4 验证 mock 数据格式符合 schema 定义**
  - **输入**：完整的报表信息数据（来自 6.9.3）
  - **输出**：格式验证报告
  - **内容**：检查字段完整性、数据类型
  - **验证**：所有字段符合 Drizzle schema 定义

### 6.10 seed-sql/04-operation.ts 集成

- [ ] **6.10.1 导入所有 operation 模块的 mock 数据**
  - **输入**：所有 operation 模块的 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/04-operation.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **6.10.2 为 op_merchants 添加生成逻辑**
  - **输入**：mockMerchants 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有商家数据

- [ ] **6.10.3 为 op_merchant_admins 添加生成逻辑**
  - **输入**：mockMerchantAdmins 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.get() 获取商家 ID，处理外键关系
  - **验证**：生成的 SQL 包含所有商家管理员数据

- [ ] **6.10.4 为其他表添加生成逻辑**
  - **输入**：其他表的 mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：为 op_property_companies, op_community_info, op_community_configs, op_register_protocols, op_report_groups, op_report_components, op_report_infos 生成 INSERT 语句
  - **验证**：生成的 SQL 包含所有数据

- [ ] **6.10.5 导出 generateOperationSql 函数**
  - **输入**：所有表的生成逻辑
  - **输出**：generateOperationSql 函数
  - **内容**：整合所有表的生成逻辑，导出 generateOperationSql 函数
  - **验证**：函数导出正确

### 6.11 Operation 模块测试验证

- [ ] **6.11.1 运行 SQL 生成命令**
  - **输入**：seed-sql/04-operation.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module operation`
  - **验证**：命令执行成功，无错误

- [ ] **6.11.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 9 个表的 INSERT 语句
  - **验证**：所有 9 个表都有对应的 INSERT 语句

- [ ] **6.11.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求

- [ ] **6.11.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录

- [ ] **6.11.5 记录测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `operation-module-test-report.md` 文件
  - **内容**：记录测试结果
  - **验证**：文件已创建

## 7-14. 其他模块

由于篇幅限制，Phase 7-14 的任务清单按照上述模式继续细化。每个模块遵循相同的结构：

- 每个表：5 个子任务（读取结构、理解外键、创建文件、编写内容、验证格式）
- seed-sql 集成：N 个子任务（N = 表数量）
- 模块测试：5 个子任务

### 7. Contract 模块 (11 个表)

#### 7.1 ct_types 表数据准备

- [ ] **7.1.1 读取 ct_types 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.1.2 分析合同类型的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同类型的业务含义
  - **内容**：了解合同类型定义
  - **验证**：能够说明合同类型用途

- [ ] **7.1.3 创建 ct_types mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.1.4 编写 ct_types 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同类型数据
  - **验证**：数据量符合设计要求

- [ ] **7.1.5 验证 ct_types mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 7.2 ct_templates 表数据准备

- [ ] **7.2.1 读取 ct_templates 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.2.2 分析合同模板的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同模板的业务含义
  - **内容**：了解合同模板内容
  - **验证**：能够说明合同模板用途

- [ ] **7.2.3 创建 ct_templates mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.2.4 编写 ct_templates 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同模板数据
  - **验证**：数据量符合设计要求

- [ ] **7.2.5 验证 ct_templates mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 7.3 ct_clauses 表数据准备

- [ ] **7.3.1 读取 ct_clauses 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.3.2 分析合同条款的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同条款的业务含义
  - **内容**：了解合同条款内容
  - **验证**：能够说明合同条款用途

- [ ] **7.3.3 创建 ct_clauses mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.3.4 编写 ct_clauses 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同条款数据
  - **验证**：数据量符合设计要求

- [ ] **7.3.5 验证 ct_clauses mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 7.4 ct_first_parties 表数据准备

- [ ] **7.4.1 读取 ct_first_parties 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.4.2 分析甲方信息的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解甲方信息的业务含义
  - **内容**：了解甲方信息内容
  - **验证**：能够说明甲方信息用途

- [ ] **7.4.3 创建 ct_first_parties mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.4.4 编写 ct_first_parties 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的甲方信息数据
  - **验证**：数据量符合设计要求

- [ ] **7.4.5 验证 ct_first_parties mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 7.5 ct_second_parties 表数据准备

- [ ] **7.5.1 读取 ct_second_parties 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.5.2 分析乙方信息的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解乙方信息的业务含义
  - **内容**：了解乙方信息内容
  - **验证**：能够说明乙方信息用途

- [ ] **7.5.3 创建 ct_second_parties mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.5.4 编写 ct_second_parties 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的乙方信息数据
  - **验证**：数据量符合设计要求

- [ ] **7.5.5 验证 ct_second_parties mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 7.6 ct_contracts 表数据准备

- [ ] **7.6.1 读取 ct_contracts 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.6.2 分析合同信息的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同信息的业务含义
  - **内容**：了解合同信息内容
  - **验证**：能够说明合同信息用途

- [ ] **7.6.3 创建 ct_contracts mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.6.4 编写 ct_contracts 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同信息数据
  - **验证**：数据量符合设计要求

- [ ] **7.6.5 验证 ct_contracts mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 7.7 ct_attachments 表数据准备

- [ ] **7.7.1 读取 ct_attachments 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.7.2 分析合同附件的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同附件的业务含义
  - **内容**：了解合同附件内容
  - **验证**：能够说明合同附件用途

- [ ] **7.7.3 创建 ct_attachments mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.7.4 编写 ct_attachments 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同附件数据
  - **验证**：数据量符合设计要求

- [ ] **7.7.5 验证 ct_attachments mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 7.8 ct_changes 表数据准备

- [ ] **7.8.1 读取 ct_changes 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.8.2 分析合同变更的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同变更的业务含义
  - **内容**：了解合同变更内容
  - **验证**：能够说明合同变更用途

- [ ] **7.8.3 创建 ct_changes mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.8.4 编写 ct_changes 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同变更数据
  - **验证**：数据量符合设计要求

- [ ] **7.8.5 验证 ct_changes mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 7.9 ct_reviews 表数据准备

- [ ] **7.9.1 读取 ct_reviews 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.9.2 分析合同审核的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同审核的业务含义
  - **内容**：了解合同审核内容
  - **验证**：能够说明合同审核用途

- [ ] **7.9.3 创建 ct_reviews mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.9.4 编写 ct_reviews 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同审核数据
  - **验证**：数据量符合设计要求

- [ ] **7.9.5 验证 ct_reviews mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 7.10 ct_prints 表数据准备

- [ ] **7.10.1 读取 ct_prints 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.10.2 分析合同打印的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同打印的业务含义
  - **内容**：了解合同打印内容
  - **验证**：能够说明合同打印用途

- [ ] **7.10.3 创建 ct_prints mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.10.4 编写 ct_prints 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同打印数据
  - **验证**：数据量符合设计要求

- [ ] **7.10.5 验证 ct_prints mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 7.11 ct_archives 表数据准备

- [ ] **7.11.1 读取 ct_archives 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **7.11.2 分析合同归档的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同归档的业务含义
  - **内容**：了解合同归档内容
  - **验证**：能够说明合同归档用途

- [ ] **7.11.3 创建 ct_archives mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **7.11.4 编写 ct_archives 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同归档数据
  - **验证**：数据量符合设计要求

- [ ] **7.11.5 验证 ct_archives mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 7.12 seed-sql/05-contract.ts 模块集成

- [ ] **7.12.1 导入所有 contract 模块 mock 数据**
  - **输入**：所有 contract 模块 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/05-contract.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **7.12.2 添加 ct_types 生成逻辑**
  - **输入**：ct_types mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.3 添加 ct_templates 生成逻辑**
  - **输入**：ct_templates mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.4 添加 ct_clauses 生成逻辑**
  - **输入**：ct_clauses mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.5 添加 ct_first_parties 生成逻辑**
  - **输入**：ct_first_parties mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.6 添加 ct_second_parties 生成逻辑**
  - **输入**：ct_second_parties mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.7 添加 ct_contracts 生成逻辑**
  - **输入**：ct_contracts mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.8 添加 ct_attachments 生成逻辑**
  - **输入**：ct_attachments mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.9 添加 ct_changes 生成逻辑**
  - **输入**：ct_changes mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.10 添加 ct_reviews 生成逻辑**
  - **输入**：ct_reviews mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.11 添加 ct_prints 生成逻辑**
  - **输入**：ct_prints mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **7.12.12 添加 ct_archives 生成逻辑**
  - **输入**：ct_archives mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

#### 7.13 Contract 模块测试验证

- [ ] **7.13.1 运行 contract 模块 SQL 生成命令**
  - **输入**：seed-sql/05-contract.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module contract`
  - **验证**：命令执行成功，无错误

- [ ] **7.13.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 11 个表的 INSERT 语句
  - **验证**：所有表都有对应的 INSERT 语句

- [ ] **7.13.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求（50-100 条）

- [ ] **7.13.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录，外键关联正确

- [ ] **7.13.5 记录 contract 模块测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `contract-test-report.md`
  - **内容**：记录测试结果和问题
  - **验证**：文件已创建

### 8. Parking 模块 (5 个表)

#### 8.1 pk_parking_lots 表数据准备

- [ ] **8.1.1 读取 pk_parking_lots 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **8.1.2 分析停车场的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解停车场的业务含义
  - **内容**：了解停车场信息
  - **验证**：能够说明停车场用途

- [ ] **8.1.3 创建 pk_parking_lots mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **8.1.4 编写 pk_parking_lots 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的停车场数据
  - **验证**：数据量符合设计要求

- [ ] **8.1.5 验证 pk_parking_lots mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 8.2 pk_parking_structures 表数据准备

- [ ] **8.2.1 读取 pk_parking_structures 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **8.2.2 分析停车区域的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解停车区域的业务含义
  - **内容**：了解停车区域信息
  - **验证**：能够说明停车区域用途

- [ ] **8.2.3 创建 pk_parking_structures mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **8.2.4 编写 pk_parking_structures 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的停车区域数据
  - **验证**：数据量符合设计要求

- [ ] **8.2.5 验证 pk_parking_structures mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 8.3 pk_carports 表数据准备

- [ ] **8.3.1 读取 pk_carports 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **8.3.2 分析车位的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解车位的业务含义
  - **内容**：了解车位信息
  - **验证**：能够说明车位用途

- [ ] **8.3.3 创建 pk_carports mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **8.3.4 编写 pk_carports 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的车位数据
  - **验证**：数据量符合设计要求

- [ ] **8.3.5 验证 pk_carports mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 8.4 pk_owner_vehicles 表数据准备

- [ ] **8.4.1 读取 pk_owner_vehicles 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **8.4.2 分析车主车辆的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解车主车辆的业务含义
  - **内容**：了解车主车辆信息
  - **验证**：能够说明车主车辆用途

- [ ] **8.4.3 创建 pk_owner_vehicles mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **8.4.4 编写 pk_owner_vehicles 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的车主车辆数据
  - **验证**：数据量符合设计要求

- [ ] **8.4.5 验证 pk_owner_vehicles mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 8.5 pk_carport_applications 表数据准备

- [ ] **8.5.1 读取 pk_carport_applications 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **8.5.2 分析车位申请的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解车位申请的业务含义
  - **内容**：了解车位申请信息
  - **验证**：能够说明车位申请用途

- [ ] **8.5.3 创建 pk_carport_applications mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **8.5.4 编写 pk_carport_applications 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的车位申请数据
  - **验证**：数据量符合设计要求

- [ ] **8.5.5 验证 pk_carport_applications mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 8.6 seed-sql/06-parking.ts 模块集成

- [ ] **8.6.1 导入所有 parking 模块 mock 数据**
  - **输入**：所有 parking 模块 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/06-parking.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **8.6.2 添加 pk_parking_lots 生成逻辑**
  - **输入**：pk_parking_lots mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **8.6.3 添加 pk_parking_structures 生成逻辑**
  - **输入**：pk_parking_structures mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **8.6.4 添加 pk_carports 生成逻辑**
  - **输入**：pk_carports mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **8.6.5 添加 pk_owner_vehicles 生成逻辑**
  - **输入**：pk_owner_vehicles mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **8.6.6 添加 pk_carport_applications 生成逻辑**
  - **输入**：pk_carport_applications mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

#### 8.7 Parking 模块测试验证

- [ ] **8.7.1 运行 parking 模块 SQL 生成命令**
  - **输入**：seed-sql/06-parking.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module parking`
  - **验证**：命令执行成功，无错误

- [ ] **8.7.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 5 个表的 INSERT 语句
  - **验证**：所有表都有对应的 INSERT 语句

- [ ] **8.7.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求（50-100 条）

- [ ] **8.7.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录，外键关联正确

- [ ] **8.7.5 记录 parking 模块测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `parking-test-report.md`
  - **内容**：记录测试结果和问题
  - **验证**：文件已创建

### 9. Expense 模块 (16 个表)

#### 9.1 ex_expense_items 表数据准备

- [ ] **9.1.1 读取 ex_expense_items 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.1.2 分析费用项目的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解费用项目的业务含义
  - **内容**：了解费用项目信息
  - **验证**：能够说明费用项目用途

- [ ] **9.1.3 创建 ex_expense_items mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.1.4 编写 ex_expense_items 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的费用项目数据
  - **验证**：数据量符合设计要求

- [ ] **9.1.5 验证 ex_expense_items mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 9.2 ex_discount_types 表数据准备

- [ ] **9.2.1 读取 ex_discount_types 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.2.2 分析优惠类型的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解优惠类型的业务含义
  - **内容**：了解优惠类型信息
  - **验证**：能够说明优惠类型用途

- [ ] **9.2.3 创建 ex_discount_types mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.2.4 编写 ex_discount_types 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的优惠类型数据
  - **验证**：数据量符合设计要求

- [ ] **9.2.5 验证 ex_discount_types mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 9.3 ex_discount_settings 表数据准备

- [ ] **9.3.1 读取 ex_discount_settings 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.3.2 分析优惠设置的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解优惠设置的业务含义
  - **内容**：了解优惠设置信息
  - **验证**：能够说明优惠设置用途

- [ ] **9.3.3 创建 ex_discount_settings mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.3.4 编写 ex_discount_settings 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的优惠设置数据
  - **验证**：数据量符合设计要求

- [ ] **9.3.5 验证 ex_discount_settings mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.4 ex_meter_reading_types 表数据准备

- [ ] **9.4.1 读取 ex_meter_reading_types 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.4.2 分析抄表类型的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解抄表类型的业务含义
  - **内容**：了解抄表类型信息
  - **验证**：能够说明抄表类型用途

- [ ] **9.4.3 创建 ex_meter_reading_types mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.4.4 编写 ex_meter_reading_types 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的抄表类型数据
  - **验证**：数据量符合设计要求

- [ ] **9.4.5 验证 ex_meter_reading_types mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 9.5 ex_contract_charges 表数据准备

- [ ] **9.5.1 读取 ex_contract_charges 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.5.2 分析合同费用的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解合同费用的业务含义
  - **内容**：了解合同费用信息
  - **验证**：能够说明合同费用用途

- [ ] **9.5.3 创建 ex_contract_charges mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.5.4 编写 ex_contract_charges 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的合同费用数据
  - **验证**：数据量符合设计要求

- [ ] **9.5.5 验证 ex_contract_charges mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.6 ex_house_charges 表数据准备

- [ ] **9.6.1 读取 ex_house_charges 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.6.2 分析房产费用的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解房产费用的业务含义
  - **内容**：了解房产费用信息
  - **验证**：能够说明房产费用用途

- [ ] **9.6.3 创建 ex_house_charges mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.6.4 编写 ex_house_charges 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的房产费用数据
  - **验证**：数据量符合设计要求

- [ ] **9.6.5 验证 ex_house_charges mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.7 ex_vehicle_charges 表数据准备

- [ ] **9.7.1 读取 ex_vehicle_charges 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.7.2 分析车辆费用的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解车辆费用的业务含义
  - **内容**：了解车辆费用信息
  - **验证**：能够说明车辆费用用途

- [ ] **9.7.3 创建 ex_vehicle_charges mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.7.4 编写 ex_vehicle_charges 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的车辆费用数据
  - **验证**：数据量符合设计要求

- [ ] **9.7.5 验证 ex_vehicle_charges mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.8 ex_meter_readings 表数据准备

- [ ] **9.8.1 读取 ex_meter_readings 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.8.2 分析抄表记录的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解抄表记录的业务含义
  - **内容**：了解抄表记录信息
  - **验证**：能够说明抄表记录用途

- [ ] **9.8.3 创建 ex_meter_readings mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.8.4 编写 ex_meter_readings 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的抄表记录数据
  - **验证**：数据量符合设计要求

- [ ] **9.8.5 验证 ex_meter_readings mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.9 ex_payments 表数据准备

- [ ] **9.9.1 读取 ex_payments 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.9.2 分析缴费记录的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解缴费记录的业务含义
  - **内容**：了解缴费记录信息
  - **验证**：能够说明缴费记录用途

- [ ] **9.9.3 创建 ex_payments mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.9.4 编写 ex_payments 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的缴费记录数据
  - **验证**：数据量符合设计要求

- [ ] **9.9.5 验证 ex_payments mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.10 ex_payment_reviews 表数据准备

- [ ] **9.10.1 读取 ex_payment_reviews 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.10.2 分析缴费审核的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解缴费审核的业务含义
  - **内容**：了解缴费审核信息
  - **验证**：能够说明缴费审核用途

- [ ] **9.10.3 创建 ex_payment_reviews mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.10.4 编写 ex_payment_reviews 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的缴费审核数据
  - **验证**：数据量符合设计要求

- [ ] **9.10.5 验证 ex_payment_reviews mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.11 ex_discount_applications 表数据准备

- [ ] **9.11.1 读取 ex_discount_applications 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.11.2 分析优惠申请的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解优惠申请的业务含义
  - **内容**：了解优惠申请信息
  - **验证**：能够说明优惠申请用途

- [ ] **9.11.3 创建 ex_discount_applications mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.11.4 编写 ex_discount_applications 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的优惠申请数据
  - **验证**：数据量符合设计要求

- [ ] **9.11.5 验证 ex_discount_applications mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.12 ex_cancel_fees 表数据准备

- [ ] **9.12.1 读取 ex_cancel_fees 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.12.2 分析退费记录的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解退费记录的业务含义
  - **内容**：了解退费记录信息
  - **验证**：能够说明退费记录用途

- [ ] **9.12.3 创建 ex_cancel_fees mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.12.4 编写 ex_cancel_fees 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的退费记录数据
  - **验证**：数据量符合设计要求

- [ ] **9.12.5 验证 ex_cancel_fees mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.13 ex_refund_reviews 表数据准备

- [ ] **9.13.1 读取 ex_refund_reviews 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.13.2 分析退款审核的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解退款审核的业务含义
  - **内容**：了解退款审核信息
  - **验证**：能够说明退款审核用途

- [ ] **9.13.3 创建 ex_refund_reviews mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.13.4 编写 ex_refund_reviews 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的退款审核数据
  - **验证**：数据量符合设计要求

- [ ] **9.13.5 验证 ex_refund_reviews mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.14 ex_overdue_reminders 表数据准备

- [ ] **9.14.1 读取 ex_overdue_reminders 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.14.2 分析催缴提醒的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解催缴提醒的业务含义
  - **内容**：了解催缴提醒信息
  - **验证**：能够说明催缴提醒用途

- [ ] **9.14.3 创建 ex_overdue_reminders mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.14.4 编写 ex_overdue_reminders 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的催缴提醒数据
  - **验证**：数据量符合设计要求

- [ ] **9.14.5 验证 ex_overdue_reminders mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.15 ex_reprint_vouchers 表数据准备

- [ ] **9.15.1 读取 ex_reprint_vouchers 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.15.2 分析补打凭证的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解补打凭证的业务含义
  - **内容**：了解补打凭证信息
  - **验证**：能够说明补打凭证用途

- [ ] **9.15.3 创建 ex_reprint_vouchers mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.15.4 编写 ex_reprint_vouchers 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的补打凭证数据
  - **验证**：数据量符合设计要求

- [ ] **9.15.5 验证 ex_reprint_vouchers mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.16 ex_expense_summary_tables 表数据准备

- [ ] **9.16.1 读取 ex_expense_summary_tables 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **9.16.2 分析费用汇总表的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解费用汇总表的业务含义
  - **内容**：了解费用汇总表信息
  - **验证**：能够说明费用汇总表用途

- [ ] **9.16.3 创建 ex_expense_summary_tables mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **9.16.4 编写 ex_expense_summary_tables 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的费用汇总表数据
  - **验证**：数据量符合设计要求

- [ ] **9.16.5 验证 ex_expense_summary_tables mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 9.17 seed-sql/07-expense.ts 模块集成

- [ ] **9.17.1 导入所有 expense 模块 mock 数据**
  - **输入**：所有 expense 模块 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/07-expense.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **9.17.2 添加 ex_expense_items 生成逻辑**
  - **输入**：ex_expense_items mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.3 添加 ex_discount_types 生成逻辑**
  - **输入**：ex_discount_types mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.4 添加 ex_discount_settings 生成逻辑**
  - **输入**：ex_discount_settings mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.5 添加 ex_meter_reading_types 生成逻辑**
  - **输入**：ex_meter_reading_types mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.6 添加 ex_contract_charges 生成逻辑**
  - **输入**：ex_contract_charges mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.7 添加 ex_house_charges 生成逻辑**
  - **输入**：ex_house_charges mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.8 添加 ex_vehicle_charges 生成逻辑**
  - **输入**：ex_vehicle_charges mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.9 添加 ex_meter_readings 生成逻辑**
  - **输入**：ex_meter_readings mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.10 添加 ex_payments 生成逻辑**
  - **输入**：ex_payments mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.11 添加 ex_payment_reviews 生成逻辑**
  - **输入**：ex_payment_reviews mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.12 添加 ex_discount_applications 生成逻辑**
  - **输入**：ex_discount_applications mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.13 添加 ex_cancel_fees 生成逻辑**
  - **输入**：ex_cancel_fees mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.14 添加 ex_refund_reviews 生成逻辑**
  - **输入**：ex_refund_reviews mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.15 添加 ex_overdue_reminders 生成逻辑**
  - **输入**：ex_overdue_reminders mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.16 添加 ex_reprint_vouchers 生成逻辑**
  - **输入**：ex_reprint_vouchers mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **9.17.17 添加 ex_expense_summary_tables 生成逻辑**
  - **输入**：ex_expense_summary_tables mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

#### 9.18 Expense 模块测试验证

- [ ] **9.18.1 运行 expense 模块 SQL 生成命令**
  - **输入**：seed-sql/07-expense.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module expense`
  - **验证**：命令执行成功，无错误

- [ ] **9.18.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 16 个表的 INSERT 语句
  - **验证**：所有表都有对应的 INSERT 语句

- [ ] **9.18.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求（200-500 条）

- [ ] **9.18.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录，外键关联正确

- [ ] **9.18.5 记录 expense 模块测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `expense-test-report.md`
  - **内容**：记录测试结果和问题
  - **验证**：文件已创建

### 10. Patrol 模块 (6 个表)

#### 10.1 pt_patrol_points 表数据准备

- [ ] **10.1.1 读取 pt_patrol_points 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **10.1.2 分析巡检点的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解巡检点的业务含义
  - **内容**：了解巡检点信息
  - **验证**：能够说明巡检点用途

- [ ] **10.1.3 创建 pt_patrol_points mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **10.1.4 编写 pt_patrol_points 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的巡检点数据
  - **验证**：数据量符合设计要求

- [ ] **10.1.5 验证 pt_patrol_points mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 10.2 pt_patrol_paths 表数据准备

- [ ] **10.2.1 读取 pt_patrol_paths 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **10.2.2 分析巡检路线的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解巡检路线的业务含义
  - **内容**：了解巡检路线信息
  - **验证**：能够说明巡检路线用途

- [ ] **10.2.3 创建 pt_patrol_paths mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **10.2.4 编写 pt_patrol_paths 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的巡检路线数据
  - **验证**：数据量符合设计要求

- [ ] **10.2.5 验证 pt_patrol_paths mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 10.3 pt_patrol_items 表数据准备

- [ ] **10.3.1 读取 pt_patrol_items 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **10.3.2 分析巡检项目的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解巡检项目的业务含义
  - **内容**：了解巡检项目信息
  - **验证**：能够说明巡检项目用途

- [ ] **10.3.3 创建 pt_patrol_items mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **10.3.4 编写 pt_patrol_items 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的巡检项目数据
  - **验证**：数据量符合设计要求

- [ ] **10.3.5 验证 pt_patrol_items mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 10.4 pt_patrol_plans 表数据准备

- [ ] **10.4.1 读取 pt_patrol_plans 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **10.4.2 分析巡检计划的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解巡检计划的业务含义
  - **内容**：了解巡检计划信息
  - **验证**：能够说明巡检计划用途

- [ ] **10.4.3 创建 pt_patrol_plans mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **10.4.4 编写 pt_patrol_plans 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的巡检计划数据
  - **验证**：数据量符合设计要求

- [ ] **10.4.5 验证 pt_patrol_plans mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 10.5 pt_patrol_tasks 表数据准备

- [ ] **10.5.1 读取 pt_patrol_tasks 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **10.5.2 分析巡检任务的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解巡检任务的业务含义
  - **内容**：了解巡检任务信息
  - **验证**：能够说明巡检任务用途

- [ ] **10.5.3 创建 pt_patrol_tasks mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **10.5.4 编写 pt_patrol_tasks 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的巡检任务数据
  - **验证**：数据量符合设计要求

- [ ] **10.5.5 验证 pt_patrol_tasks mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 10.6 pt_patrol_task_details 表数据准备

- [ ] **10.6.1 读取 pt_patrol_task_details 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **10.6.2 分析巡检任务详情的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解巡检任务详情的业务含义
  - **内容**：了解巡检任务详情信息
  - **验证**：能够说明巡检任务详情用途

- [ ] **10.6.3 创建 pt_patrol_task_details mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **10.6.4 编写 pt_patrol_task_details 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的巡检任务详情数据
  - **验证**：数据量符合设计要求

- [ ] **10.6.5 验证 pt_patrol_task_details mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 10.7 seed-sql/08-patrol.ts 模块集成

- [ ] **10.7.1 导入所有 patrol 模块 mock 数据**
  - **输入**：所有 patrol 模块 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/08-patrol.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **10.7.2 添加 pt_patrol_points 生成逻辑**
  - **输入**：pt_patrol_points mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **10.7.3 添加 pt_patrol_paths 生成逻辑**
  - **输入**：pt_patrol_paths mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **10.7.4 添加 pt_patrol_items 生成逻辑**
  - **输入**：pt_patrol_items mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **10.7.5 添加 pt_patrol_plans 生成逻辑**
  - **输入**：pt_patrol_plans mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **10.7.6 添加 pt_patrol_tasks 生成逻辑**
  - **输入**：pt_patrol_tasks mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **10.7.7 添加 pt_patrol_task_details 生成逻辑**
  - **输入**：pt_patrol_task_details mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

#### 10.8 Patrol 模块测试验证

- [ ] **10.8.1 运行 patrol 模块 SQL 生成命令**
  - **输入**：seed-sql/08-patrol.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module patrol`
  - **验证**：命令执行成功，无错误

- [ ] **10.8.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 6 个表的 INSERT 语句
  - **验证**：所有表都有对应的 INSERT 语句

- [ ] **10.8.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求（50-100 条）

- [ ] **10.8.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录，外键关联正确

- [ ] **10.8.5 记录 patrol 模块测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `patrol-test-report.md`
  - **内容**：记录测试结果和问题
  - **验证**：文件已创建

### 11. Repairs 模块 (7 个表)

#### 11.1 rp_repair_types 表数据准备

- [ ] **11.1.1 读取 rp_repair_types 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **11.1.2 分析报修类型的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解报修类型的业务含义
  - **内容**：了解报修类型信息
  - **验证**：能够说明报修类型用途

- [ ] **11.1.3 创建 rp_repair_types mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **11.1.4 编写 rp_repair_types 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的报修类型数据
  - **验证**：数据量符合设计要求

- [ ] **11.1.5 验证 rp_repair_types mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 11.2 rp_repair_settings 表数据准备

- [ ] **11.2.1 读取 rp_repair_settings 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **11.2.2 分析报修设置的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解报修设置的业

### 12. Report 模块 (12 个表)

#### 12.1 rpt_data_statistics 表数据准备

- [ ] **12.1.1 读取 rpt_data_statistics 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.1.2 分析数据统计的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解数据统计的业务含义
  - **内容**：了解数据统计信息
  - **验证**：能够说明数据统计用途

- [ ] **12.1.3 创建 rpt_data_statistics mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.1.4 编写 rpt_data_statistics 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的数据统计数据
  - **验证**：数据量符合设计要求

- [ ] **12.1.5 验证 rpt_data_statistics mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 12.2 rpt_expense_summaries 表数据准备

- [ ] **12.2.1 读取 rpt_expense_summaries 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.2.2 分析费用汇总的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解费用汇总的业务含义
  - **内容**：了解费用汇总信息
  - **验证**：能够说明费用汇总用途

- [ ] **12.2.3 创建 rpt_expense_summaries mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.2.4 编写 rpt_expense_summaries 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的费用汇总数据
  - **验证**：数据量符合设计要求

- [ ] **12.2.5 验证 rpt_expense_summaries mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.3 rpt_statement_expenses 表数据准备

- [ ] **12.3.1 读取 rpt_statement_expenses 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.3.2 分析账单费用的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解账单费用的业务含义
  - **内容**：了解账单费用信息
  - **验证**：能够说明账单费用用途

- [ ] **12.3.3 创建 rpt_statement_expenses mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.3.4 编写 rpt_statement_expenses 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的账单费用数据
  - **验证**：数据量符合设计要求

- [ ] **12.3.5 验证 rpt_statement_expenses mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.4 rpt_payment_details 表数据准备

- [ ] **12.4.1 读取 rpt_payment_details 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.4.2 分析缴费明细的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解缴费明细的业务含义
  - **内容**：了解缴费明细信息
  - **验证**：能够说明缴费明细用途

- [ ] **12.4.3 创建 rpt_payment_details mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.4.4 编写 rpt_payment_details 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的缴费明细数据
  - **验证**：数据量符合设计要求

- [ ] **12.4.5 验证 rpt_payment_details mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.5 rpt_owner_payment_details 表数据准备

- [ ] **12.5.1 读取 rpt_owner_payment_details 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.5.2 分析业主缴费明细的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解业主缴费明细的业务含义
  - **内容**：了解业主缴费明细信息
  - **验证**：能够说明业主缴费明细用途

- [ ] **12.5.3 创建 rpt_owner_payment_details mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.5.4 编写 rpt_owner_payment_details 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的业主缴费明细数据
  - **验证**：数据量符合设计要求

- [ ] **12.5.5 验证 rpt_owner_payment_details mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.6 rpt_deposit_reports 表数据准备

- [ ] **12.6.1 读取 rpt_deposit_reports 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.6.2 分析押金报表的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解押金报表的业务含义
  - **内容**：了解押金报表信息
  - **验证**：能够说明押金报表用途

- [ ] **12.6.3 创建 rpt_deposit_reports mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.6.4 编写 rpt_deposit_reports 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的押金报表数据
  - **验证**：数据量符合设计要求

- [ ] **12.6.5 验证 rpt_deposit_reports mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.7 rpt_outstanding_fees 表数据准备

- [ ] **12.7.1 读取 rpt_outstanding_fees 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.7.2 分析欠费报表的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解欠费报表的业务含义
  - **内容**：了解欠费报表信息
  - **验证**：能够说明欠费报表用途

- [ ] **12.7.3 创建 rpt_outstanding_fees mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.7.4 编写 rpt_outstanding_fees 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的欠费报表数据
  - **验证**：数据量符合设计要求

- [ ] **12.7.5 验证 rpt_outstanding_fees mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.8 rpt_no_charge_houses 表数据准备

- [ ] **12.8.1 读取 rpt_no_charge_houses 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.8.2 分析未收费房屋的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解未收费房屋的业务含义
  - **内容**：了解未收费房屋信息
  - **验证**：能够说明未收费房屋用途

- [ ] **12.8.3 创建 rpt_no_charge_houses mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.8.4 编写 rpt_no_charge_houses 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的未收费房屋数据
  - **验证**：数据量符合设计要求

- [ ] **12.8.5 验证 rpt_no_charge_houses mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.9 rpt_fee_reminders 表数据准备

- [ ] **12.9.1 读取 rpt_fee_reminders 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.9.2 分析费用提醒的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解费用提醒的业务含义
  - **内容**：了解费用提醒信息
  - **验证**：能够说明费用提醒用途

- [ ] **12.9.3 创建 rpt_fee_reminders mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.9.4 编写 rpt_fee_reminders 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的费用提醒数据
  - **验证**：数据量符合设计要求

- [ ] **12.9.5 验证 rpt_fee_reminders mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.10 rpt_repair_reports 表数据准备

- [ ] **12.10.1 读取 rpt_repair_reports 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.10.2 分析报修报表的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解报修报表的业务含义
  - **内容**：了解报修报表信息
  - **验证**：能够说明报修报表用途

- [ ] **12.10.3 创建 rpt_repair_reports mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.10.4 编写 rpt_repair_reports 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的报修报表数据
  - **验证**：数据量符合设计要求

- [ ] **12.10.5 验证 rpt_repair_reports mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.11 rpt_repair_summaries 表数据准备

- [ ] **12.11.1 读取 rpt_repair_summaries 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.11.2 分析报修汇总的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解报修汇总的业务含义
  - **内容**：了解报修汇总信息
  - **验证**：能够说明报修汇总用途

- [ ] **12.11.3 创建 rpt_repair_summaries mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.11.4 编写 rpt_repair_summaries 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的报修汇总数据
  - **验证**：数据量符合设计要求

- [ ] **12.11.5 验证 rpt_repair_summaries mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.12 rpt_patrol_reports 表数据准备

- [ ] **12.12.1 读取 rpt_patrol_reports 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **12.12.2 分析巡检报表的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解巡检报表的业务含义
  - **内容**：了解巡检报表信息
  - **验证**：能够说明巡检报表用途

- [ ] **12.12.3 创建 rpt_patrol_reports mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **12.12.4 编写 rpt_patrol_reports 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的巡检报表数据
  - **验证**：数据量符合设计要求

- [ ] **12.12.5 验证 rpt_patrol_reports mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 12.13 seed-sql/10-report.ts 模块集成

- [ ] **12.13.1 导入所有 report 模块 mock 数据**
  - **输入**：所有 report 模块 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql/10-report.ts 中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **12.13.2 添加 rpt_data_statistics 生成逻辑**
  - **输入**：rpt_data_statistics mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.3 添加 rpt_expense_summaries 生成逻辑**
  - **输入**：rpt_expense_summaries mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.4 添加 rpt_statement_expenses 生成逻辑**
  - **输入**：rpt_statement_expenses mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.5 添加 rpt_payment_details 生成逻辑**
  - **输入**：rpt_payment_details mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.6 添加 rpt_owner_payment_details 生成逻辑**
  - **输入**：rpt_owner_payment_details mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.7 添加 rpt_deposit_reports 生成逻辑**
  - **输入**：rpt_deposit_reports mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.8 添加 rpt_outstanding_fees 生成逻辑**
  - **输入**：rpt_outstanding_fees mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.9 添加 rpt_no_charge_houses 生成逻辑**
  - **输入**：rpt_no_charge_houses mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.10 添加 rpt_fee_reminders 生成逻辑**
  - **输入**：rpt_fee_reminders mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.11 添加 rpt_repair_reports 生成逻辑**
  - **输入**：rpt_repair_reports mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.12 添加 rpt_repair_summaries 生成逻辑**
  - **输入**：rpt_repair_summaries mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **12.13.13 添加 rpt_patrol_reports 生成逻辑**
  - **输入**：rpt_patrol_reports mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

#### 12.14 Report 模块测试验证

- [ ] **12.14.1 运行 report 模块 SQL 生成命令**
  - **输入**：seed-sql/10-report.ts 模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module report`
  - **验证**：命令执行成功，无错误

- [ ] **12.14.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 12 个表的 INSERT 语句
  - **验证**：所有表都有对应的 INSERT 语句

- [ ] **12.14.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求（100-200 条）

- [ ] **12.14.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录，外键关联正确

- [ ] **12.14.5 记录 report 模块测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `report-test-report.md`
  - **内容**：记录测试结果和问题
  - **验证**：文件已创建

### 13. 认证模块 (3 个表)

#### 13.1 auth_roles 表数据准备

- [ ] **13.1.1 读取 auth_roles 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **13.1.2 分析认证角色的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解认证角色的业务含义
  - **内容**：了解认证角色信息
  - **验证**：能够说明认证角色用途

- [ ] **13.1.3 创建 auth_roles mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **13.1.4 编写 auth_roles 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的认证角色数据
  - **验证**：数据量符合设计要求

- [ ] **13.1.5 验证 auth_roles mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性
  - **验证**：所有字段符合 schema 定义

#### 13.2 auth_user_mapping 表数据准备

- [ ] **13.2.1 读取 auth_user_mapping 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **13.2.2 分析用户映射的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解用户映射的业务含义
  - **内容**：了解用户映射信息
  - **验证**：能够说明用户映射用途

- [ ] **13.2.3 创建 auth_user_mapping mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **13.2.4 编写 auth_user_mapping 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的用户映射数据
  - **验证**：数据量符合设计要求

- [ ] **13.2.5 验证 auth_user_mapping mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 13.3 auth_user_roles 表数据准备

- [ ] **13.3.1 读取 auth_user_roles 表结构**
  - **输入**：读取 schema 文件
  - **输出**：理解表字段定义
  - **内容**：分析 Drizzle 表定义
  - **验证**：能够列出所有字段

- [ ] **13.3.2 分析用户角色的业务场景**
  - **输入**：参考现有 mock 数据
  - **输出**：理解用户角色的业务含义
  - **内容**：了解用户角色信息
  - **验证**：能够说明用户角色用途

- [ ] **13.3.3 创建 auth_user_roles mock 数据文件**
  - **输入**：表结构和业务场景
  - **输出**：创建 mock 数据文件
  - **内容**：编写 mock 数据数组
  - **验证**：文件存在且包含数据

- [ ] **13.3.4 编写 auth_user_roles 数据内容**
  - **输入**：mock 数据文件
  - **输出**：完整的 mock 数据
  - **内容**：编写具体的用户角色数据
  - **验证**：数据量符合设计要求

- [ ] **13.3.5 验证 auth_user_roles mock 数据格式**
  - **输入**：完整的 mock 数据
  - **输出**：验证报告
  - **内容**：检查字段完整性和外键关联
  - **验证**：所有字段符合 schema 定义

#### 13.4 seed-sql 认证模块集成

- [ ] **13.4.1 导入认证模块 mock 数据**
  - **输入**：所有认证模块 mock-data.ts 文件
  - **输出**：导入语句
  - **内容**：在 seed-sql 认证模块中导入所有 mock 数据
  - **验证**：无导入错误

- [ ] **13.4.2 添加 auth_roles 生成逻辑**
  - **输入**：auth_roles mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **13.4.3 添加 auth_user_mapping 生成逻辑**
  - **输入**：auth_user_mapping mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

- [ ] **13.4.4 添加 auth_user_roles 生成逻辑**
  - **输入**：auth_user_roles mock 数据
  - **输出**：INSERT SQL 生成逻辑
  - **内容**：使用 IdMapRegistry.register() 注册 ID，生成 SQL
  - **验证**：生成的 SQL 语句正确

#### 13.5 认证模块测试验证

- [ ] **13.5.1 运行认证模块 SQL 生成命令**
  - **输入**：seed-sql 认证模块
  - **输出**：生成的 SQL 文件
  - **内容**：运行 `pnpm run generate-seed-sql --module auth`
  - **验证**：命令执行成功，无错误

- [ ] **13.5.2 检查生成的 SQL 内容**
  - **输入**：生成的 SQL 文件
  - **输出**：SQL 内容分析报告
  - **内容**：检查是否包含所有 3 个表的 INSERT 语句
  - **验证**：所有表都有对应的 INSERT 语句

- [ ] **13.5.3 验证数据量**
  - **输入**：SQL 文件
  - **输出**：数据量统计
  - **内容**：统计每个表的数据量
  - **验证**：数据量符合设计要求

- [ ] **13.5.4 验证外键关系**
  - **输入**：SQL 文件
  - **输出**：外键验证报告
  - **内容**：检查外键引用是否正确
  - **验证**：无孤立记录，外键关联正确

- [ ] **13.5.5 记录认证模块测试结果**
  - **输入**：测试验证结果
  - **输出**：创建 `auth-test-report.md`
  - **内容**：记录测试结果和问题
  - **验证**：文件已创建

### 14. 集成测试与验证

- **输入**：所有 seed-sql 模块
- **输出**：完整的 SQL 文件
- **内容**：运行 `pnpm run generate-seed-sql` 生成所有模块的 SQL
- **验证**：SQL 文件生成成功

- [ ] **14.1.2 备份现有数据（如有）**
  - **输入**：Neon 数据库当前状态
  - **输出**：数据库备份
  - **内容**：如有现有数据，先进行备份
  - **验证**：备份完成

- [ ] **14.1.3 执行 SQL 到数据库**
  - **输入**：生成的 SQL 文件
  - **输出**：数据库执行结果
  - **内容**：执行 SQL 文件到 Neon 数据库
  - **验证**：执行成功，无错误

- [ ] **14.2.1 验证所有表都有数据**
  - **输入**：数据库查询
  - **输出**：数据量统计报告
  - **内容**：对 94 个表运行 COUNT 查询
  - **验证**：所有表都有数据

- [ ] **14.2.2 验证外键完整性**
  - **输入**：外键验证查询
  - **输出**：外键完整性报告
  - **内容**：检查所有外键关系是否正确
  - **验证**：无孤立记录

- [ ] **14.3.1 启动前端开发服务器**
  - **输入**：前端代码
  - **输出**：运行中的开发服务器
  - **内容**：运行 `pnpm dev` 启动前端
  - **验证**：服务器启动成功

- [ ] **14.3.2 测试数据展示**
  - **输入**：前端页面
  - **输出**：测试结果报告
  - **内容**：测试各模块页面数据展示是否正常
  - **验证**：页面显示正确数据

- [ ] **14.3.3 测试分页功能**
  - **输入**：列表页面
  - **输出**：分页测试报告
  - **内容**：测试分页、筛选、排序功能
  - **验证**：功能正常

- [ ] **14.4.1 更新 neon-db-list 技能文档**
  - **输入**：数据库表信息
  - **输出**：更新的技能文档
  - **内容**：更新 `.claude/skills/neon-db-list/SKILL.md`
  - **验证**：文档更新成功
