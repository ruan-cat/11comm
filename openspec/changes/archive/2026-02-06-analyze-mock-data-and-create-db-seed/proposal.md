## Why

项目当前拥有 108 个 `mock-data.ts` 文件，提供了丰富的模拟业务数据，但 `server/db/seed.ts` 文件尚未实现有意义的数据填充功能。这导致 `db:seed` 命令无法正常运行，开发者无法快速初始化数据库以进行开发和测试。

**方案选择**：经过对比分析（详见 `apps/admin/src/docs/reports/2026-02-03-neon-drizzle-database-seed-solutions.md`），选择**方案 C: SQL 导入方案**，使用 Drizzle ORM 的 `.toSQL()` 方法将 mock 数据转换为原始 SQL 文件，实现一次性生成、永久复用的数据库初始化能力。

## What Changes

- 创建 `server/db/generate-seed-sql.ts` 脚本，使用 Drizzle ORM 的 `.toSQL()` 方法生成 SQL INSERT 语句
- 在 `drizzle/` 目录下生成 `seed.sql` 文件，包含所有 mock 数据的 INSERT 语句
- 为每个业务模块创建独立的 SQL 生成函数（按 schema 文件组织）：
  - `seed-sql/community.ts` - 社区管理数据 SQL 生成
  - `seed-sql/patrol.ts` - 巡检管理数据 SQL 生成
  - `seed-sql/setting.ts` - 设置管理数据 SQL 生成
  - `seed-sql/house-property.ts` - 房产管理数据 SQL 生成
  - 其他模块...
- 建立 mock 数据与数据库表字段的映射转换逻辑
- 处理表之间的外键依赖关系，确保正确的 SQL 语句顺序
- 使用 PostgreSQL 的 `gen_random_uuid()` 函数生成主键 ID
- 使用 CTE (Common Table Expressions) 处理跨表外键引用

## Capabilities

### New Capabilities

- `sql-seed-generation`: SQL 种子文件生成能力，使用 Drizzle ORM 的 `.toSQL()` 方法将 TypeScript 对象转换为原始 SQL INSERT 语句
- `mock-data-transformation`: 将前端 mock 数据（TypeScript 对象）转换为数据库表结构所需的格式，处理字段名映射、类型转换、枚举值映射等
- `seed-sql-module-pattern`: 定义各业务模块 SQL 生成子文件的统一编写模式

### Modified Capabilities

（无需修改现有规范）

## Impact

**受影响的代码**：

- `apps/admin/server/db/generate-seed-sql.ts` - 新增 SQL 生成脚本
- `apps/admin/server/db/seed-sql/*.ts` - 新增模块化 SQL 生成函数目录
- `apps/admin/drizzle/seed.sql` - 新增生成的 SQL 文件

**依赖关系**：

- 依赖现有的 108 个 `apps/admin/server/api/**/mock-data.ts` 文件作为数据源
- 依赖现有的 `apps/admin/server/db/schemas/*.ts` 表定义
- 依赖 `drizzle-orm` 库（使用 `.toSQL()` 方法）

**运行环境**：

- `pnpm db:generate-seed` - 生成 `drizzle/seed.sql` 文件
- `pnpm db:seed` - 使用 drizzle-kit 或 psql 执行 SQL 文件导入数据

**优势**：

- 一次生成，永久使用
- 不需要运行时连接数据库
- SQL 文件可版本控制和代码审查
- 可直接在 Neon Console 中执行
