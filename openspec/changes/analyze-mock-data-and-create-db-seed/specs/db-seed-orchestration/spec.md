## ADDED Requirements

### Requirement: Seed 主入口文件提供统一的执行入口

系统 SHALL 提供 `apps/admin/server/db/seed.ts` 作为数据库填充的主入口文件，该文件负责协调所有模块的数据填充流程。

#### Scenario: 成功执行完整的数据填充

- **WHEN** 开发者运行 `pnpm db:seed` 命令
- **THEN** 系统按照依赖顺序依次调用各模块的 seed 函数
- **AND** 在控制台输出每个模块的填充进度和结果
- **AND** 所有模块填充完成后输出总体统计信息

#### Scenario: 环境变量未配置时快速失败

- **WHEN** `DATABASE_URL` 环境变量未设置
- **THEN** 系统 SHALL 立即终止执行
- **AND** 输出明确的错误提示信息

### Requirement: 支持加载环境变量

系统 SHALL 使用 `@dotenvx/dotenvx` 包自动加载 `.env` 文件中的环境变量，确保数据库连接字符串可用。

#### Scenario: 自动加载本地环境变量

- **WHEN** 项目根目录存在 `.env` 文件
- **THEN** 系统 SHALL 在建立数据库连接前自动加载该文件中的环境变量

### Requirement: 按依赖顺序执行各模块 seed 函数

系统 SHALL 按照表之间的外键依赖关系，确定正确的模块执行顺序。

#### Scenario: 外键依赖表在被依赖表之后填充

- **WHEN** 表 A 有外键引用表 B
- **THEN** 系统 SHALL 确保表 B 的数据先于表 A 填充

#### Scenario: 模块执行顺序符合分层策略

- **WHEN** 执行数据填充
- **THEN** 系统 SHALL 按以下顺序执行模块：
  1. community (小区基础数据)
  2. setting (组织架构、员工、角色等)
  3. house-property (房产、业主等)
  4. patrol (巡检计划、任务等)
  5. 其他依赖上述模块的模块

### Requirement: 提供可选的数据清理功能

系统 SHALL 提供命令行参数或环境变量，允许在填充前清空现有数据。

#### Scenario: 使用 --clean 参数清理数据

- **WHEN** 开发者运行 `pnpm db:seed --clean`
- **THEN** 系统 SHALL 在插入新数据前删除各表的现有记录
- **AND** 按照外键依赖的逆序删除数据

#### Scenario: 默认不清理现有数据

- **WHEN** 开发者运行 `pnpm db:seed` 不带任何参数
- **THEN** 系统 SHALL 直接插入新数据，不删除现有记录

### Requirement: 输出详细的执行日志

系统 SHALL 在控制台输出清晰的执行日志，包括进度、成功/失败状态和统计信息。

#### Scenario: 输出模块级别的进度信息

- **WHEN** 开始填充某个模块
- **THEN** 系统 SHALL 输出该模块的名称和预计记录数

#### Scenario: 输出表级别的统计信息

- **WHEN** 某个表填充完成
- **THEN** 系统 SHALL 输出该表成功插入的记录数

#### Scenario: 输出最终统计汇总

- **WHEN** 所有模块填充完成
- **THEN** 系统 SHALL 输出总共填充的表数量和记录总数
