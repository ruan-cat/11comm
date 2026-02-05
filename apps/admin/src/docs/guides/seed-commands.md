# 种子数据命令使用指南

本文档详细说明 `db:generate-seed` 和 `db:seed` 命令的使用方法，帮助开发者正确生成和导入测试数据。

## 1. 概述

种子数据系统用于将 mock 数据转换为可执行的 SQL 文件，并导入到 Neon PostgreSQL 数据库中。

### 1.1. 命令简介

|          命令           |                 说明                  |
| :---------------------: | :-----------------------------------: |
| `pnpm db:generate-seed` | 生成种子 SQL 文件（从 mock 数据生成） |
|     `pnpm db:seed`      |        执行 SQL 文件导入数据库        |

### 1.2. 文件位置

- **生成脚本**: `apps/admin/scripts/generate-seed-sql.ts`
- **执行脚本**: `apps/admin/scripts/run-seed-sql.ts`
- **模块定义**: `apps/admin/server/db/seed-sql/`
- **生成的 SQL 文件**: `apps/admin/drizzle/seed/`

## 2. `db:generate-seed` 命令

此命令将 mock 数据转换为 SQL INSERT 语句，保存到 `drizzle/seed/` 目录。

### 2.1. 基本用法

```bash
# 生成全部模块的种子 SQL
pnpm db:generate-seed
```

### 2.2. 命令参数

#### `--list-modules`

显示可用模块列表及其依赖关系。

```bash
pnpm db:generate-seed --list-modules
```

输出示例：

```log
📋 可用模块列表:

  [00-dev] dev             - 开发配置基础数据
  [01-community] community       - 社区管理基础数据
  [02-setting] setting         - 系统设置与组织架构 (依赖: 01-community)
  [03-house-property] house-property  - 房产与业主数据 (依赖: 01-community)
  [04-operation] operation       - 运营管理数据 (依赖: 01-community)
  [05-contract] contract        - 合同管理数据 (依赖: 03-house-property)
  [06-parking] parking         - 停车管理数据 (依赖: 03-house-property)
  [07-expense] expense         - 费用管理数据 (依赖: 06-parking, 05-contract)
  [08-patrol] patrol          - 巡检管理数据 (依赖: 03-house-property, 02-setting)
  [09-repairs] repairs         - 报修管理数据 (依赖: 03-house-property, 02-setting)
  [10-report] report          - 报表中心数据 (依赖: 07-expense)
```

#### `--module=<name>`

只生成指定模块的 SQL 文件。支持使用模块名称或 ID。

```bash
# 使用模块名称
pnpm db:generate-seed --module=community

# 使用模块 ID
pnpm db:generate-seed --module=01-community
```

**注意**: 如果指定模块依赖其他模块，系统会检查依赖模块的 SQL 文件是否存在，不存在则报错提示。

### 2.3. 生成的文件

生成成功后，会在 `apps/admin/drizzle/seed/` 目录下创建以下文件：

|         文件名          |        说明        |
| :---------------------: | :----------------: |
|      `00-dev.sql`       |  开发配置基础数据  |
|   `01-community.sql`    |  社区管理基础数据  |
|    `02-setting.sql`     | 系统设置与组织架构 |
| `03-house-property.sql` |   房产与业主数据   |
|   `04-operation.sql`    |    运营管理数据    |
|    `05-contract.sql`    |    合同管理数据    |
|    `06-parking.sql`     |    停车管理数据    |
|    `07-expense.sql`     |    费用管理数据    |
|     `08-patrol.sql`     |    巡检管理数据    |
|    `09-repairs.sql`     |    报修管理数据    |
|     `10-report.sql`     |    报表中心数据    |
|      `_clean.sql`       |      清理脚本      |

### 2.4. SQL 文件格式

生成的 SQL 文件格式如下：

```sql
-- Module: 01-community (社区管理基础数据)

BEGIN;

-- Table: cm_communities (5 records)
INSERT INTO "cm_communities" (...) VALUES (...);

-- Table: cm_notices (10 records)
INSERT INTO "cm_notices" (...) VALUES (...);

COMMIT;
```

特点：

- 使用事务包装 (`BEGIN` / `COMMIT`)
- 包含表名和记录数注释
- 不包含时间戳（避免无意义的 Git diff）

## 3. `db:seed` 命令

此命令执行 `drizzle/seed/` 目录下的 SQL 文件，将数据导入数据库。

### 3.1. 基本用法

```bash
# 导入全部种子数据
pnpm db:seed
```

### 3.2. 命令参数

#### `--clean`

在导入数据前先清理（TRUNCATE）相关表。

```bash
pnpm db:seed --clean
```

#### `--clean-only`

只执行清理操作，不导入数据。

```bash
pnpm db:seed --clean-only
```

#### `--module=<name>`

只导入指定模块的数据。支持使用模块名称或文件名。

```bash
# 导入单个模块
pnpm db:seed --module=community

# 导入多个模块（逗号分隔）
pnpm db:seed --module=community,setting
```

### 3.3. 执行顺序

SQL 文件按文件名的数字前缀顺序执行（00、01、02...），确保依赖关系正确。

## 4. 模块依赖关系

种子数据模块之间存在依赖关系，必须按正确顺序生成和导入。

```plain
Layer 0 (无依赖):
├── 00-dev          # 开发配置
└── 01-community    # 社区管理

Layer 1 (依赖 Layer 0):
├── 02-setting         # 依赖 community
├── 03-house-property  # 依赖 community
└── 04-operation       # 依赖 community

Layer 2 (依赖 Layer 1):
├── 05-contract  # 依赖 house-property
└── 06-parking   # 依赖 house-property

Layer 3 (依赖 Layer 2):
├── 07-expense   # 依赖 parking, contract
├── 08-patrol    # 依赖 house-property, setting
└── 09-repairs   # 依赖 house-property, setting

Layer 4 (依赖 Layer 3):
└── 10-report    # 依赖 expense
```

## 5. 常见使用场景

### 5.1. 初始化开发环境

```bash
# 1. 确保数据库表结构已创建
pnpm db:push

# 2. 生成全部种子 SQL
pnpm db:generate-seed

# 3. 导入种子数据
pnpm db:seed
```

### 5.2. 重置数据库数据

```bash
# 清理并重新导入全部数据
pnpm db:seed --clean
```

### 5.3. 只更新特定模块数据

```bash
# 1. 重新生成特定模块
pnpm db:generate-seed --module=community

# 2. 导入特定模块
pnpm db:seed --module=community
```

### 5.4. 查看可用模块

```bash
pnpm db:generate-seed --list-modules
```

## 6. 注意事项

### 6.1. 环境变量

执行数据库命令前，请确保已配置数据库连接环境变量：

```bash
# 从 Vercel 拉取环境变量
pnpm env:pull
```

或手动创建 `.env.vercel.local` 文件：

```env
DATABASE_URL=postgresql://...
```

### 6.2. 依赖检查

生成单个模块时，系统会自动检查依赖模块的 SQL 文件是否存在：

```log
❌ 错误: 模块 [setting] 依赖 [01-community] 模块，但文件 01-community.sql 不存在
   请先生成依赖模块: pnpm db:generate-seed --module=01-community
```

### 6.3. 事务安全

每个 SQL 文件都使用事务包装，如果某条语句失败，整个文件的更改会回滚。

### 6.4. ID 一致性

种子数据使用确定性 UUID (v5)，相同的输入数据总是生成相同的 UUID，确保：

- 多次生成的 SQL 文件内容一致
- 外键引用在不同模块间保持正确

## 7. 故障排除

### 7.1. 模块未找到

```log
❌ 未找到模块: xxx
```

解决：使用 `--list-modules` 查看可用模块名称。

### 7.2. 依赖文件不存在

```log
❌ 错误: 模块 [xxx] 依赖 [yyy] 模块，但文件 yyy.sql 不存在
```

解决：先生成依赖模块，或一次性生成全部模块。

### 7.3. 数据库连接失败

```log
❌ 执行失败: xxx.sql
```

解决：检查 `DATABASE_URL` 环境变量是否正确配置。

## 8. 相关文档

- [数据库 Schema 设计](../reports/2026-02-03-analyze-mock-data-and-create-db-seed-inspection.md)
- [Drizzle ORM 官方文档](https://orm.drizzle.team/)
- [Neon 数据库文档](https://neon.tech/docs)
