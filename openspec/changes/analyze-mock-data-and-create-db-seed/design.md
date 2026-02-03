## Context

本项目是一个基于 Vue3 + Nitro 的物业管理后台系统，使用 Neon PostgreSQL 作为数据库，Drizzle ORM 作为数据访问层。

**当前状态**：

- 项目拥有 108 个 `mock-data.ts` 文件，分布在 `apps/admin/server/api` 目录下
- 数据库 schema 已完整定义在 `apps/admin/server/db/schemas/` 目录下，包含 11 个模块
- `server/db/seed.ts` 文件尚未实现有意义的数据填充功能
- `db:seed` 命令无法正常运行

**约束条件**：

- 必须复用现有的 mock 数据，避免重复编写测试数据
- 需要处理表之间的外键依赖关系
- Mock 数据的字段名与数据库字段名存在差异，需要映射转换
- 部分 mock 数据使用中文枚举值（如"启用"/"禁用"），数据库使用英文枚举值

## Goals / Non-Goals

**Goals:**

- 创建可执行的 `seed.ts` 主入口文件，支持通过 `pnpm db:seed` 命令运行
- 建立模块化的 seed 子文件结构，每个业务模块一个文件
- 复用现有 mock-data.ts 中的数据
- 正确处理表之间的外键依赖，按正确顺序插入数据
- 实现数据字段的映射转换逻辑
- 提供数据清理功能（可选删除现有数据后重新填充）

**Non-Goals:**

- 不生成随机数据或使用 Faker.js 等库
- 不修改现有的 mock-data.ts 文件结构
- 不修改现有的数据库 schema 定义
- 不实现增量更新或数据同步功能
- 不支持生产环境数据填充

## Decisions

### 1. 文件组织结构

**决策**: 采用按 schema 模块划分的目录结构

```plain
apps/admin/server/db/
├── seed.ts              # 主入口文件
└── seed/
    ├── index.ts         # 模块导出入口
    ├── utils.ts         # 公共工具函数（枚举映射、日期转换等）
    ├── community.ts     # 社区管理数据填充
    ├── setting.ts       # 设置管理数据填充
    ├── patrol.ts        # 巡检管理数据填充
    ├── house-property.ts # 房产管理数据填充
    ├── contract.ts      # 合同管理数据填充
    ├── expense.ts       # 费用管理数据填充
    ├── parking.ts       # 停车管理数据填充
    ├── repairs.ts       # 报修管理数据填充
    ├── report.ts        # 报表管理数据填充
    ├── operation.ts     # 运营团队数据填充
    └── dev.ts           # 开发团队数据填充
```

**理由**: 与现有的 `schemas/` 目录结构保持一致，便于维护和查找

### 2. 数据插入顺序策略

**决策**: 按外键依赖关系分层插入

**插入层级**:

1. **第一层（无外键依赖）**: `cmCommunities`, `smOrganizations`, `hpOwners`, `hpReserveVenues`, `hpSiteManagements`, `hpOwnersCommittees`, `smRoles`, `smPermissions`, `smShifts`, `smSchedulingSettings`, `smSystemConfigs`, `smRegisterProtocols`, `smInitializeCells`
2. **第二层（依赖第一层）**: `smStaff`, `cmNotices`, `cmBuildingStructures`, `hpHouses`, `smRolePermissions`, `smDataPermissions`
3. **第三层（依赖第二层）**: `hpOwnerMembers`, `hpOwnerAccounts`, `hpInvoiceTitles`, `smStaffRoles`, `smWorkingSchedules`, `ptPatrolPlans`
4. **第四层及以后**: 其他具有更深层依赖的表

**理由**: 确保外键约束不会在插入时报错

### 3. 字段映射转换方案

**决策**: 创建统一的转换工具函数

```typescript
// seed/utils.ts

/** 状态值映射：中文 -> 英文枚举 */
export const statusMap = {
	启用: "enabled",
	禁用: "disabled",
} as const;

/** 性别值映射 */
export const genderMap = {
	男: "male",
	女: "female",
} as const;

/** 审核状态映射 */
export const auditStatusMap = {
	待审核: "pending",
	已通过: "approved",
	已拒绝: "rejected",
} as const;

/** 日期字符串转换 */
export function parseDate(dateStr: string): Date | null;

/** 时间戳字符串转换 */
export function parseTimestamp(timestampStr: string): Date | null;
```

**理由**: 集中管理映射逻辑，避免各模块重复代码

### 4. 主键 ID 处理策略

**决策**: 不使用 mock 数据中的字符串 ID，让数据库自动生成 UUID

**处理方式**:

- 插入时不传入 `id` 字段，使用 Drizzle schema 的 `defaultRandom()` 自动生成
- 使用 `.returning()` 获取插入后的记录（包含生成的 ID）
- 建立 mock ID 到真实 ID 的映射表，供后续外键引用

**理由**: 保持数据一致性，避免 UUID 格式冲突

### 5. 错误处理策略

**决策**: 采用快速失败 + 详细日志

```typescript
try {
	// 插入操作
} catch (error) {
	console.error(`❌ 填充 ${tableName} 失败:`, error);
	process.exit(1);
}
```

**理由**: 开发环境下，快速发现问题比容错更重要

## Risks / Trade-offs

|                 风险                 |                     缓解措施                     |
| :----------------------------------: | :----------------------------------------------: |
| Mock 数据字段与数据库字段不完全匹配  | 编写详细的字段映射逻辑，对缺失字段使用合理默认值 |
| 部分 mock 数据可能包含无效的外键引用 |      在插入前验证外键存在性，或使用 null 值      |
|       大量数据插入可能导致超时       |            分批插入，每批 100 条记录             |
|     重复运行 seed 会导致数据重复     |     提供可选的清理功能，在插入前删除现有数据     |
|     Mock 数据中的日期格式不统一      |       使用健壮的日期解析函数，支持多种格式       |

## Migration Plan

1. 在 `apps/admin/server/db/` 目录下创建 `seed/` 子目录
2. 创建 `seed/utils.ts` 公共工具文件
3. 按依赖层级顺序创建各模块的 seed 文件
4. 创建 `seed.ts` 主入口文件
5. 在 `package.json` 中配置 `db:seed` 脚本命令
6. 测试运行并验证数据插入结果

## Open Questions

1. 是否需要支持部分模块的单独填充？（例如只填充巡检模块）
2. 是否需要添加环境检查，防止在生产环境误执行？
3. 批量插入的每批数量应设为多少？（当前建议 100 条）
