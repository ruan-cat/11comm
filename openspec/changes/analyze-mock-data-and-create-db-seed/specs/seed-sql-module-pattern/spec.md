## ADDED Requirements

### Requirement: 模块 SQL 生成文件导出标准函数

每个业务模块的 SQL 生成文件 SHALL 导出一个生成 SQL 语句的函数，遵循统一的函数签名。

#### Scenario: 导出符合标准签名的生成函数

- **WHEN** 创建模块 SQL 生成文件（如 `seed-sql/patrol.ts`）
- **THEN** 该文件 SHALL 导出名为 `generate<ModuleName>Sql` 的函数
- **AND** 函数签名为 `(idMap: IdMapRegistry) => SqlStatement[]`

#### Scenario: 返回 SQL 语句数组

- **WHEN** 模块 SQL 生成函数执行完成
- **THEN** 函数 SHALL 返回包含以下字段的对象数组：
  - `table`: 表名
  - `sql`: INSERT SQL 语句
  - `recordCount`: 插入记录数

### Requirement: 模块配置定义

每个模块 SHALL 在 `seed-sql/index.ts` 中定义其配置信息，包括编号、名称和依赖关系。

#### Scenario: 定义模块配置

- **WHEN** 注册模块
- **THEN** 系统 SHALL 定义以下配置：
  - `id`: 模块编号（如 "00", "01"）
  - `name`: 模块名称（如 "community", "patrol"）
  - `displayName`: 模块显示名称（如 "社区管理"）
  - `dependencies`: 依赖的模块名称数组
  - `generator`: SQL 生成函数引用

#### Scenario: 模块配置示例

- **WHEN** 定义 patrol 模块配置
- **THEN** 配置 SHALL 为：
  ```typescript
  {
    id: "03",
    name: "patrol",
    displayName: "巡检管理",
    dependencies: ["community"],
    generator: generatePatrolSql
  }
  ```

### Requirement: 模块内按表依赖顺序生成

模块 SQL 生成函数 SHALL 在内部按照表之间的外键依赖关系，确定正确的 SQL 生成顺序。

#### Scenario: 父表 SQL 先于子表

- **WHEN** 巡检模块生成 SQL
- **THEN** 系统 SHALL 按以下顺序生成表的 INSERT 语句：
  1. `pt_patrol_plans`（巡检计划）
  2. `pt_patrol_paths`（巡检路线，依赖计划）
  3. `pt_patrol_points`（巡检点，依赖路线）
  4. `pt_patrol_items`（巡检项目，依赖巡检点）
  5. `pt_patrol_tasks`（巡检任务，依赖计划）
  6. `pt_patrol_task_details`（任务明细，依赖任务和巡检点）

### Requirement: 从 mock-data.ts 导入数据

模块 SQL 生成文件 SHALL 从对应的 `mock-data.ts` 文件导入模拟数据。

#### Scenario: 正确导入 mock 数据

- **WHEN** 编写 `seed-sql/patrol.ts` 模块
- **THEN** 系统 SHALL 从 `../../api/property-manage/patrol-manage/*/mock-data.ts` 导入各表的模拟数据

#### Scenario: 处理缺失的 mock 数据

- **WHEN** mock-data.ts 文件不存在
- **THEN** 系统 SHALL 跳过该表
- **AND** 在控制台输出警告：`⚠️ 未找到 <表名> 的 mock 数据，跳过`

### Requirement: 使用 Drizzle toSQL 方法生成 SQL

模块 SQL 生成函数 SHALL 使用 Drizzle ORM 的 `.toSQL()` 方法生成类型安全的 SQL。

#### Scenario: 构建并转换 INSERT 语句

- **WHEN** 需要为表生成 INSERT SQL
- **THEN** 系统 SHALL 使用 `db.insert(table).values(data).toSQL()` 获取参数化 SQL
- **AND** 使用 `toFullSql()` 将参数替换为实际值

#### Scenario: 批量生成多行 INSERT

- **WHEN** 表有超过 1 条记录需要插入
- **THEN** 系统 SHALL 使用 `.values([...records])` 批量构建
- **AND** 生成单条包含多个 VALUES 的 INSERT 语句

### Requirement: 处理跨模块的外键依赖

模块 SQL 生成函数 SHALL 能够引用其他模块已注册的记录 UUID。

#### Scenario: 引用其他模块的记录 UUID

- **WHEN** 巡检计划表需要引用小区表的 communityId
- **THEN** 系统 SHALL 通过 idMap 查找之前注册的小区记录 UUID
- **AND** 如果找不到对应的 UUID，使用 NULL 值

#### Scenario: 处理树形结构 ID

- **WHEN** mock 数据中包含树形结构 ID（如 orgId: "2-1"）
- **THEN** 系统 SHALL 使用 `generateUuid("table_name", "2-1")` 生成确定性 UUID
- **AND** 在父节点 ID 映射中查找 parentId

### Requirement: 输出表级别的生成日志

模块 SQL 生成函数 SHALL 在生成每个表的 SQL 时输出日志信息。

#### Scenario: 输出表 SQL 生成开始日志

- **WHEN** 开始为某个表生成 SQL
- **THEN** 系统 SHALL 输出 "正在生成 <表名> SQL..."

#### Scenario: 输出表 SQL 生成完成日志

- **WHEN** 表 SQL 生成完成
- **THEN** 系统 SHALL 输出 "✅ 已生成 <表名> SQL，共 N 条记录"

### Requirement: 错误处理和快速失败

模块 SQL 生成函数 SHALL 在遇到错误时立即终止并抛出异常。

#### Scenario: 数据转换失败时抛出异常

- **WHEN** mock 数据无法正确转换为数据库格式
- **THEN** 系统 SHALL 捕获错误并输出详细的错误信息
- **AND** 抛出异常终止当前模块的执行

#### Scenario: 错误信息包含上下文

- **WHEN** 发生错误
- **THEN** 错误信息 SHALL 包含：
  - 出错的表名
  - 出错的记录索引或 mock ID
  - 原始错误消息

### Requirement: 模块入口文件统一导出

系统 SHALL 提供 `seed-sql/index.ts` 文件，统一导出所有模块的 SQL 生成函数和配置。

#### Scenario: 导出所有模块函数

- **WHEN** 主入口文件需要调用各模块
- **THEN** 可以通过 `import { generateCommunitySql, generatePatrolSql, ... } from './seed-sql'` 一次性导入所有函数

#### Scenario: 导出模块配置列表

- **WHEN** 主入口文件需要获取模块列表
- **THEN** 可以通过 `import { moduleConfigs } from './seed-sql'` 获取所有模块配置
- **AND** 配置按 id 排序，确保正确的执行顺序
