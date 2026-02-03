## ADDED Requirements

### Requirement: 模块 seed 文件导出标准函数

每个业务模块的 seed 文件 SHALL 导出一个异步的 seed 函数，遵循统一的函数签名。

#### Scenario: 导出符合标准签名的 seed 函数

- **WHEN** 创建模块 seed 文件（如 `seed/patrol.ts`）
- **THEN** 该文件 SHALL 导出名为 `seed<ModuleName>` 的异步函数
- **AND** 函数签名为 `(db: DrizzleDB, idMap: IdMapRegistry) => Promise<SeedResult>`

#### Scenario: 返回统一的结果对象

- **WHEN** 模块 seed 函数执行完成
- **THEN** 函数 SHALL 返回包含以下字段的对象：
  - `module`: 模块名称
  - `tables`: 填充的表列表
  - `totalRecords`: 总插入记录数

### Requirement: 模块内按表依赖顺序填充

模块 seed 函数 SHALL 在内部按照表之间的外键依赖关系，确定正确的填充顺序。

#### Scenario: 父表先于子表填充

- **WHEN** 巡检模块执行填充
- **THEN** 系统 SHALL 按以下顺序填充表：
  1. `pt_patrol_plans`（巡检计划）
  2. `pt_patrol_paths`（巡检路线，依赖计划）
  3. `pt_patrol_points`（巡检点，依赖路线）
  4. `pt_patrol_items`（巡检项目，依赖巡检点）
  5. `pt_patrol_tasks`（巡检任务，依赖计划）
  6. `pt_patrol_task_details`（任务明细，依赖任务和巡检点）

### Requirement: 从 mock-data.ts 导入数据

模块 seed 文件 SHALL 从对应的 `mock-data.ts` 文件导入模拟数据。

#### Scenario: 正确导入 mock 数据

- **WHEN** 编写 `seed/patrol.ts` 模块
- **THEN** 系统 SHALL 从 `../../api/property-manage/patrol-manage/*/mock-data.ts` 导入各表的模拟数据

### Requirement: 使用批量插入优化性能

模块 seed 函数 SHALL 使用 Drizzle ORM 的批量插入功能，一次插入多条记录。

#### Scenario: 批量插入数据

- **WHEN** 表有超过 1 条记录需要插入
- **THEN** 系统 SHALL 使用 `db.insert(table).values([...records])` 批量插入
- **AND** 每批最多 100 条记录

#### Scenario: 使用 returning 获取插入结果

- **WHEN** 执行批量插入
- **THEN** 系统 SHALL 使用 `.returning()` 获取插入后的完整记录
- **AND** 将返回的记录用于更新 ID 映射表

### Requirement: 处理跨模块的外键依赖

模块 seed 函数 SHALL 能够引用其他模块已插入记录的 ID。

#### Scenario: 引用其他模块的记录 ID

- **WHEN** 巡检计划表需要引用小区表的 communityId
- **THEN** 系统 SHALL 通过 idMap 查找之前插入的小区记录 ID
- **AND** 如果找不到对应的 ID，使用 null 值或跳过该字段

### Requirement: 输出表级别的填充日志

模块 seed 函数 SHALL 在填充每个表时输出日志信息。

#### Scenario: 输出表填充开始日志

- **WHEN** 开始填充某个表
- **THEN** 系统 SHALL 输出 "正在填充 <表名>..."

#### Scenario: 输出表填充完成日志

- **WHEN** 表填充完成
- **THEN** 系统 SHALL 输出 "✅ 已填充 <表名>，共 N 条记录"

### Requirement: 错误处理和快速失败

模块 seed 函数 SHALL 在遇到错误时立即终止并抛出异常。

#### Scenario: 插入失败时抛出异常

- **WHEN** 数据库插入操作失败
- **THEN** 系统 SHALL 捕获错误并输出详细的错误信息
- **AND** 抛出异常终止当前模块的执行

#### Scenario: 错误信息包含上下文

- **WHEN** 发生错误
- **THEN** 错误信息 SHALL 包含：
  - 出错的表名
  - 出错的记录索引或 ID
  - 原始错误消息

### Requirement: 模块入口文件统一导出

系统 SHALL 提供 `seed/index.ts` 文件，统一导出所有模块的 seed 函数。

#### Scenario: 导出所有模块函数

- **WHEN** 主入口文件需要调用各模块
- **THEN** 可以通过 `import { seedCommunity, seedPatrol, ... } from './seed'` 一次性导入所有函数
