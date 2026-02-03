## Why

项目当前拥有 108 个 `mock-data.ts` 文件，提供了丰富的模拟业务数据，但 `server/db/seed.ts` 文件尚未实现有意义的数据填充功能。这导致 `db:seed` 命令无法正常运行，开发者无法快速初始化数据库以进行开发和测试。本变更旨在复用现有的 mock 数据，构建模块化的数据库种子脚本，实现对 Neon PostgreSQL 数据库的批量数据写入能力。

## What Changes

- 创建模块化的 `server/db/seed.ts` 主入口文件，统一协调各模块的数据填充
- 为每个业务模块创建独立的 seed 子模块（按 schema 文件组织）：
  - `seed/community.ts` - 社区管理数据
  - `seed/patrol.ts` - 巡检管理数据
  - `seed/setting.ts` - 设置管理数据（组织架构、员工信息、角色权限等）
  - `seed/house-property.ts` - 房产管理数据
  - `seed/contract.ts` - 合同管理数据
  - `seed/expense.ts` - 费用管理数据
  - `seed/parking.ts` - 停车管理数据
  - `seed/repairs.ts` - 报修管理数据
  - `seed/report.ts` - 报表管理数据
  - `seed/operation.ts` - 运营团队数据
  - `seed/dev.ts` - 开发团队数据
- 建立 mock 数据与数据库表字段的映射转换逻辑
- 处理表之间的外键依赖关系，确保正确的插入顺序
- 提供可选的数据清理功能（清空现有数据后重新填充）

## Capabilities

### New Capabilities

- `db-seed-orchestration`: 数据库种子脚本的主入口和模块协调能力，负责加载环境变量、建立数据库连接、按依赖顺序调用各模块的 seed 函数
- `mock-data-transformation`: 将前端 mock 数据（TypeScript 对象）转换为数据库表结构所需的格式，处理字段名映射、类型转换、枚举值映射等
- `seed-module-pattern`: 定义各业务模块 seed 子文件的统一编写模式，包括数据导入、转换、插入的标准流程

### Modified Capabilities

（无需修改现有规范）

## Impact

**受影响的代码**：

- `apps/admin/server/db/seed.ts` - 新增或重写
- `apps/admin/server/db/seed/*.ts` - 新增模块化 seed 文件目录

**依赖关系**：

- 依赖现有的 108 个 `apps/admin/server/api/**/mock-data.ts` 文件作为数据源
- 依赖现有的 `apps/admin/server/db/schemas/*.ts` 表定义
- 依赖 `@neondatabase/serverless` 和 `drizzle-orm` 库

**运行环境**：

- 需要配置 `DATABASE_URL` 环境变量
- 通过 `pnpm db:seed` 命令触发执行

**数据安全**：

- seed 脚本默认仅用于开发/测试环境
- 需要明确的数据清理策略，避免生产环境误操作
