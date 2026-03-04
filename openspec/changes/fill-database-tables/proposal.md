## Why

项目定义了 94 个数据库表，但 Neon 数据库当前为空（迁移未运行）。这导致开发环境无法进行功能测试，前端页面显示为空，无法验证业务逻辑。需要为所有表填充 mock 数据以支持开发和测试。

## What Changes

- 扩展现有的 11 个 seed-sql 模块，为 94 个数据库表添加 mock 数据生成逻辑
- 为缺少 mock-data.ts 的表创建 mock 数据文件
- 确保 `generate-seed-sql.ts` 脚本能够为所有表生成完整的 SQL
- 保持现有的模块依赖关系和外键关联处理机制

## Capabilities

### New Capabilities

- `dev-module-seed-data`: 开发配置模块（9 个表）的 mock 数据生成
- `community-module-seed-data`: 社区管理模块（6 个表）的 mock 数据生成
- `setting-module-seed-data`: 系统设置模块（13 个表）的 mock 数据生成
- `house-property-module-seed-data`: 房产管理模块（11 个表）的 mock 数据生成
- `operation-module-seed-data`: 运营管理模块（9 个表）的 mock 数据生成
- `contract-module-seed-data`: 合同管理模块（11 个表）的 mock 数据生成
- `parking-module-seed-data`: 停车管理模块（5 个表）的 mock 数据生成
- `expense-module-seed-data`: 费用管理模块（16 个表）的 mock 数据生成
- `patrol-module-seed-data`: 巡检管理模块（6 个表）的 mock 数据生成
- `repairs-module-seed-data`: 报修管理模块（7 个表）的 mock 数据生成
- `report-module-seed-data`: 报表中心模块（12 个表）的 mock 数据生成

### Modified Capabilities

<!-- 无现有能力需要修改 -->

## Impact

**受影响的代码**:

- `apps/admin/server/db/seed-sql/` - 11 个 seed 模块文件
- `apps/admin/server/api/*/mock-data.ts` - 需要创建缺失的 mock 数据文件
- `apps/admin/scripts/generate-seed-sql.ts` - 脚本本身无需修改，但会生成更多 SQL

**受影响的系统**:

- Neon PostgreSQL 数据库 - 将填充约 1000-2000 条测试数据
- 前端页面 - 将能够展示真实的测试数据

**依赖关系**:

- 需要先运行数据库迁移（`pnpm db:migrate`）创建表结构
- 需要遵循现有的 IdMapRegistry 外键关联机制
- 需要按照模块依赖顺序生成数据（00-dev → 01-community → ... → 10-report）
