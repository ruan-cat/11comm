## Why

当前 `apps/admin/server/db/schema.ts` 文件为空，仅包含注释和 TODO 标记。这导致 admin 项目的 `db:generate` 命令无法使用，因为 Drizzle Kit 需要至少一个表定义才能生成数据库迁移 SQL。项目已经完成了大量业务类型定义和 Nitro API 接口设计，但缺少对应的数据库持久化层，阻碍了后端功能的完整实现。

## What Changes

- **新增数据库表定义**：根据 `apps/type/src/business` 目录下的业务类型定义，在 `apps/admin/server/db` 目录下创建对应的 Drizzle ORM 表定义
- **扁平化文件组织**：按业务模块拆分 schema 文件，避免单个 `schema.ts` 文件过长，提升可维护性
- **修复 db:generate 命令**：提供完整的表定义使 Drizzle Kit 迁移命令可正常工作
- **建立类型与数据库的对应关系**：确保 TypeScript 业务类型与数据库表结构保持一致

## Capabilities

### New Capabilities

- `db-schema-core`: 核心数据库 schema 基础设施，包括公共类型、枚举定义、schema 入口文件组织
- `db-schema-community`: 社区管理模块数据库表（小区信息、公告、业务受理、房屋装修等）
- `db-schema-house-property`: 房产管理模块数据库表（房屋、业主账户、业主成员、发票、场地预约等）
- `db-schema-contract`: 合同管理模块数据库表（甲方、乙方、合同模板、条款、附件、变更、归档等）
- `db-schema-expense`: 费用管理模块数据库表（收费项、缴费记录、折扣、表计抄读、退费审核等）
- `db-schema-parking`: 停车管理模块数据库表（停车场、车位、业主车辆、车位申请等）
- `db-schema-patrol`: 巡检管理模块数据库表（巡检计划、路线、巡检点、巡检任务、巡检项目等）
- `db-schema-repairs`: 报修管理模块数据库表（报修工单、回访记录、报修设置等）
- `db-schema-report`: 报表管理模块数据库表（费用汇总、押金报表、缴费明细等报表相关表）
- `db-schema-setting`: 设置管理模块数据库表（员工信息、角色权限、组织架构、排班设置、系统配置等）
- `db-schema-operation`: 运营团队模块数据库表（商户信息、物业公司、报表配置等）
- `db-schema-dev`: 开发团队模块数据库表（配置中心、字典管理、菜单管理等）

### Modified Capabilities

无需修改现有规格，这是全新的数据库层初始化。

## Impact

**受影响的代码和文件：**

|             影响范围             |                  说明                  |
| :------------------------------: | :------------------------------------: |
| `apps/admin/server/db/schema.ts` |       从空文件变更为统一导出入口       |
| `apps/admin/server/db/schemas/`  | 新增目录，存放按模块拆分的 schema 文件 |
|  `apps/admin/drizzle.config.ts`  |      可能需要调整 schema 路径配置      |
| `apps/admin/server/api/**/*.ts`  |   Nitro 接口将能够使用真实数据库操作   |

**依赖关系：**

|            依赖            |  版本   |         用途         |
| :------------------------: | :-----: | :------------------: |
|       `drizzle-orm`        | ^0.38.4 |       ORM 框架       |
| `@neondatabase/serverless` | ^0.10.4 | Neon PostgreSQL 驱动 |
|       `drizzle-kit`        | ^0.30.6 |       迁移工具       |

**数据库表结构设计原则：**

1. 所有表统一使用 `id` 作为主键（UUID 或序列号）
2. 所有表包含 `createdAt` 和 `updatedAt` 时间戳字段
3. 支持软删除的表包含 `deletedAt` 字段
4. 外键关系明确定义，支持级联操作
5. 字段命名采用 snake_case（数据库列）与 camelCase（TypeScript）的映射
6. 枚举类型使用 PostgreSQL 原生枚举或字符串约束
