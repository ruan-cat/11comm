## ADDED Requirements

### Requirement: SQL 生成主入口文件

系统 SHALL 提供 `apps/admin/server/db/generate-seed-sql.ts` 作为 SQL 生成的主入口文件。

#### Scenario: 成功生成完整的 SQL 文件

- **WHEN** 开发者运行 `pnpm db:generate-seed` 命令
- **THEN** 系统读取所有 mock-data.ts 文件中的数据
- **AND** 使用 Drizzle ORM 的 `.toSQL()` 方法生成 INSERT 语句
- **AND** 在 `apps/admin/drizzle/seed/` 目录下输出分模块的 SQL 文件

#### Scenario: 生成的 SQL 包含事务包装

- **WHEN** 生成 SQL 文件
- **THEN** 每个模块的 SQL 文件 SHALL 以 `BEGIN;` 开始
- **AND** 以 `COMMIT;` 结束
- **AND** 确保所有 INSERT 语句在事务内执行

### Requirement: 分模块 SQL 文件输出

系统 SHALL 按模块生成独立的 SQL 文件，文件名使用编号前缀确保执行顺序。

#### Scenario: 按依赖顺序编号文件

- **WHEN** 生成 SQL 文件
- **THEN** 系统 SHALL 按以下顺序生成编号文件：
  - `00-community.sql` - 社区管理
  - `01-setting.sql` - 设置管理
  - `02-house-property.sql` - 房产管理
  - `03-patrol.sql` - 巡检管理
  - `04-contract.sql` - 合同管理
  - `05-expense.sql` - 费用管理
  - `06-parking.sql` - 停车管理
  - `07-repairs.sql` - 报修管理
  - `08-report.sql` - 报表管理
  - `09-operation.sql` - 运营团队
  - `10-dev.sql` - 开发团队
  - `_clean.sql` - 清理脚本

#### Scenario: SQL 文件头部注释

- **WHEN** 生成模块 SQL 文件
- **THEN** 文件顶部 SHALL 包含模块说明注释
- **AND** 不包含生成时间戳（避免无意义的 Git diff）

### Requirement: 使用 Drizzle ORM 的 toSQL 方法

系统 SHALL 使用 Drizzle ORM 的 `.toSQL()` 方法将 TypeScript INSERT 语句转换为原始 SQL。

#### Scenario: 转换 INSERT 语句为 SQL

- **WHEN** 构建 Drizzle insert 查询 `db.insert(table).values(data)`
- **THEN** 系统 SHALL 调用 `.toSQL()` 获取参数化 SQL 和参数数组
- **AND** 使用 `toFullSql()` 函数将参数替换回 SQL 中

#### Scenario: 处理多行批量插入

- **WHEN** 需要插入多条记录
- **THEN** 系统 SHALL 使用 `.values([...records])` 批量构建
- **AND** 生成单条多值的 INSERT 语句

### Requirement: 主键 UUID 生成策略

系统 SHALL 使用确定性 UUID 确保外键引用的一致性和 SQL 文件的可复现性。

#### Scenario: 为每条 mock 记录生成确定性 UUID

- **WHEN** 处理 mock 数据中的记录
- **THEN** 系统 SHALL 使用 `uuid` 包的 `v5` 方法，基于表名和 mock ID 生成确定性 UUID
- **AND** 将映射关系保存在 ID 映射表中

#### Scenario: 外键字段使用映射的 UUID

- **WHEN** 某条记录需要引用其他表的记录
- **THEN** 系统 SHALL 通过 mock ID 查找对应的 UUID
- **AND** 在 SQL 中使用该 UUID 作为外键值
- **AND** 如果找不到对应的 UUID，使用 NULL 值

### Requirement: 增量生成支持

系统 SHALL 支持通过 `--module` 参数只生成指定模块的 SQL。

#### Scenario: 生成指定模块

- **WHEN** 开发者运行 `pnpm db:generate-seed --module community`
- **THEN** 系统 SHALL 只生成 `00-community.sql` 文件
- **AND** 保留其他已存在的 SQL 文件不变

#### Scenario: 生成多个指定模块

- **WHEN** 开发者运行 `pnpm db:generate-seed --module community,patrol`
- **THEN** 系统 SHALL 只生成 `00-community.sql` 和 `03-patrol.sql` 文件

#### Scenario: 依赖缺失时报错

- **WHEN** 开发者只生成 `patrol` 模块
- **AND** `00-community.sql` 文件不存在
- **THEN** 系统 SHALL 输出错误：`Error: patrol 依赖 community 模块，请先生成 community`

#### Scenario: 列出可用模块

- **WHEN** 开发者运行 `pnpm db:generate-seed --list-modules`
- **THEN** 系统 SHALL 输出所有可用模块名称及其依赖关系

### Requirement: SQL 执行脚本

系统 SHALL 提供 `run-seed-sql.ts` 脚本执行生成的 SQL 文件。

#### Scenario: 连接数据库并执行 SQL

- **WHEN** 开发者运行 `pnpm db:seed` 命令
- **THEN** 系统 SHALL 按文件编号顺序读取 `drizzle/seed/*.sql` 文件
- **AND** 使用 Neon serverless 连接依次执行 SQL
- **AND** 输出执行结果和统计信息

#### Scenario: 导入指定模块

- **WHEN** 开发者运行 `pnpm db:seed --module community,patrol`
- **THEN** 系统 SHALL 只执行 `00-community.sql` 和 `03-patrol.sql` 文件

### Requirement: 数据清理功能

系统 SHALL 支持通过 `--clean` 参数在导入前清空现有数据。

#### Scenario: 清理后重新导入

- **WHEN** 开发者运行 `pnpm db:seed --clean`
- **THEN** 系统 SHALL 先执行 `_clean.sql` 脚本清理所有数据
- **AND** 然后按顺序导入全部 SQL 文件

#### Scenario: 只执行清理

- **WHEN** 开发者运行 `pnpm db:seed --clean-only`
- **THEN** 系统 SHALL 只执行 `_clean.sql` 脚本
- **AND** 不导入任何数据

#### Scenario: 清理脚本内容

- **WHEN** 生成 `_clean.sql` 文件
- **THEN** 系统 SHALL 按外键依赖的逆序生成 TRUNCATE CASCADE 语句
- **AND** 包装在事务中（BEGIN/COMMIT）

### Requirement: Git 版本控制

生成的 SQL 文件 SHALL 纳入 Git 版本控制。

#### Scenario: SQL 文件不包含时间戳

- **WHEN** 生成 SQL 文件
- **THEN** 文件内容 SHALL 不包含生成时间戳
- **AND** 只有数据变化时才产生 Git diff

#### Scenario: 文件存放位置

- **WHEN** 生成 SQL 文件
- **THEN** 文件 SHALL 存放在 `apps/admin/drizzle/seed/` 目录
- **AND** 该目录不在 `.gitignore` 中
