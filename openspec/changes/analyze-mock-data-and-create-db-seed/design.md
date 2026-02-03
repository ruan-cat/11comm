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

**方案选择**：

采用**方案 C: SQL 导入方案**，使用 Drizzle ORM 的 `.toSQL()` 方法生成原始 SQL 文件。

## Goals / Non-Goals

**Goals:**

- 创建 `generate-seed-sql.ts` 脚本，使用 Drizzle 的 `.toSQL()` 方法生成 SQL INSERT 语句
- 在 `drizzle/seed/` 目录下生成分模块的 SQL 文件
- 建立模块化的 SQL 生成函数结构，每个业务模块一个文件
- 复用现有 mock-data.ts 中的数据
- 正确处理表之间的外键依赖，按正确顺序生成 SQL
- 实现数据字段的映射转换逻辑
- 使用预生成的固定 UUID 确保外键引用的一致性
- 提供 `pnpm db:seed` 命令执行 SQL 文件导入
- 支持增量生成（只生成特定模块的 SQL）
- 支持 `--clean` 参数在导入前清空现有数据
- 生成的 SQL 文件纳入 Git 版本控制

**Non-Goals:**

- 不使用 drizzle-seed 包生成随机数据
- 不需要运行时连接数据库来生成 SQL
- 不修改现有的 mock-data.ts 文件结构
- 不修改现有的数据库 schema 定义
- 不实现增量更新或数据同步功能

## Decisions

### 1. 文件组织结构

**决策**: 采用分模块 SQL 文件的目录结构

```plain
apps/admin/server/db/
├── generate-seed-sql.ts    # SQL 生成主入口脚本
├── run-seed-sql.ts         # SQL 执行脚本
└── seed-sql/
    ├── index.ts            # 模块导出入口
    ├── utils.ts            # 公共工具函数（枚举映射、日期转换、SQL 转义等）
    ├── types.ts            # 类型定义
    ├── id-map.ts           # ID 映射表管理
    ├── community.ts        # 社区管理 SQL 生成
    ├── setting.ts          # 设置管理 SQL 生成
    ├── patrol.ts           # 巡检管理 SQL 生成
    ├── house-property.ts   # 房产管理 SQL 生成
    ├── contract.ts         # 合同管理 SQL 生成
    ├── expense.ts          # 费用管理 SQL 生成
    ├── parking.ts          # 停车管理 SQL 生成
    ├── repairs.ts          # 报修管理 SQL 生成
    ├── report.ts           # 报表管理 SQL 生成
    ├── operation.ts        # 运营团队 SQL 生成
    └── dev.ts              # 开发团队 SQL 生成

apps/admin/drizzle/
├── 0000_smiling_vampiro.sql   # 现有 migration
├── meta/                       # drizzle-kit 元数据
└── seed/                       # 种子数据目录（Git 版本控制）
    ├── 00-community.sql       # 按执行顺序编号
    ├── 01-setting.sql
    ├── 02-house-property.sql
    ├── 03-patrol.sql
    ├── 04-contract.sql
    ├── 05-expense.sql
    ├── 06-parking.sql
    ├── 07-repairs.sql
    ├── 08-report.sql
    ├── 09-operation.sql
    ├── 10-dev.sql
    └── _clean.sql             # 清理脚本（按逆序删除）
```

**理由**:

- 分模块文件便于增量生成和 Git diff 审查
- 文件编号前缀确保执行顺序
- 与现有 migration 文件共存于 `drizzle/` 目录

### 2. SQL 生成核心技术

**决策**: 使用 Drizzle ORM 的 `.toSQL()` 方法

```typescript
import { db } from "../index";
import { cmCommunities } from "../schemas/community";

// 构建 INSERT 语句并转换为 SQL
const insertQuery = db.insert(cmCommunities).values([
	{
		name: "阳光小区",
		code: "YG001",
		address: "福州市鼓楼区xxx",
		status: "enabled",
	},
]);

// 获取原始 SQL 和参数
const { sql, params } = insertQuery.toSQL();
// sql: 'INSERT INTO "cm_communities" ("name", "code", "address", "status") VALUES ($1, $2, $3, $4)'
// params: ['阳光小区', 'YG001', '福州市鼓楼区xxx', 'enabled']

// 将参数化 SQL 转换为完整 SQL（用于 seed 文件）
function toFullSql(sql: string, params: unknown[]): string {
	let result = sql;
	params.forEach((param, index) => {
		const value = typeof param === "string" ? `'${escapeSql(param)}'` : param === null ? "NULL" : String(param);
		result = result.replace(`$${index + 1}`, value);
	});
	return result;
}
```

**理由**: 利用 Drizzle ORM 的类型安全能力，确保生成的 SQL 与 schema 定义一致

### 3. 主键 ID 处理策略

**决策**: 使用预生成的固定 UUID 映射表

```typescript
// seed-sql/id-map.ts

import { v5 as uuidv5 } from "uuid";

/** 命名空间 UUID，用于生成确定性 UUID */
const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

/** 根据 mock ID 和表名生成确定性 UUID */
export function generateUuid(tableName: string, mockId: string): string {
	return uuidv5(`${tableName}:${mockId}`, NAMESPACE);
}

/** ID 映射注册表 */
export class IdMapRegistry {
	private map = new Map<string, string>();

	/** 注册 mock ID 到 UUID 的映射 */
	register(tableName: string, mockId: string): string {
		const uuid = generateUuid(tableName, mockId);
		this.map.set(`${tableName}:${mockId}`, uuid);
		return uuid;
	}

	/** 查找 UUID */
	get(tableName: string, mockId: string): string | null {
		return this.map.get(`${tableName}:${mockId}`) ?? null;
	}
}
```

**理由**:

- 确定性 UUID 保证每次生成的 SQL 完全一致（无 Git diff）
- 跨模块外键引用可通过 ID 映射表查找
- 不依赖数据库的 `gen_random_uuid()` 函数，SQL 可预览和调试

### 4. 数据插入顺序策略

**决策**: 按外键依赖关系分层生成 SQL

**生成层级与文件编号**:

| 编号 |      模块      |              包含的表              |           依赖            |
| :--: | :------------: | :--------------------------------: | :-----------------------: |
|  00  |   community    |           cmCommunities            |            无             |
|  01  |    setting     | smOrganizations, smRoles, smShifts |            无             |
|  02  | house-property |     hpOwners, hpReserveVenues      |            无             |
|  03  |     patrol     |  ptPatrolPlans, ptPatrolPaths...   |         community         |
|  04  |    contract    |           ctContracts...           | community, house-property |
|  05  |    expense     |           exExpenses...            | community, house-property |
|  06  |    parking     |         pkParkingSpaces...         |         community         |
|  07  |    repairs     |         rpRepairOrders...          |         community         |
|  08  |     report     |           rptReports...            |          多模块           |
|  09  |   operation    |          opOperations...           |            无             |
|  10  |      dev       |             dvDevs...              |            无             |

**理由**: 确保 SQL 按正确顺序执行，外键约束不会报错

### 5. 字段映射转换方案

**决策**: 创建统一的转换工具函数

```typescript
// seed-sql/utils.ts

/** 状态值映射：中文 -> 英文枚举 */
export const statusMap: Record<string, string> = {
	启用: "enabled",
	禁用: "disabled",
	operating: "enabled",
	disabled: "disabled",
	maintenance: "enabled",
	preparing: "enabled",
};

/** 性别值映射 */
export const genderMap: Record<string, string> = {
	男: "male",
	女: "female",
};

/** 审核状态映射 */
export const auditStatusMap: Record<string, string> = {
	待审核: "pending",
	已通过: "approved",
	已拒绝: "rejected",
};

/** SQL 字符串转义 */
export function escapeSql(str: string): string {
	return str.replace(/'/g, "''");
}

/** 日期字符串转换为 SQL 格式 */
export function toSqlTimestamp(dateStr: string): string {
	return `'${dateStr}'::timestamp`;
}

/** 将参数化 SQL 转换为完整 SQL */
export function toFullSql(sql: string, params: unknown[]): string {
	let result = sql;
	params.forEach((param, index) => {
		let value: string;
		if (param === null || param === undefined) {
			value = "NULL";
		} else if (typeof param === "string") {
			value = `'${escapeSql(param)}'`;
		} else if (param instanceof Date) {
			value = `'${param.toISOString()}'::timestamp`;
		} else {
			value = String(param);
		}
		result = result.replace(`$${index + 1}`, value);
	});
	return result;
}
```

**理由**: 集中管理映射逻辑，确保 SQL 语法正确

### 6. 增量生成策略

**决策**: 支持 `--module` 参数，按模块名过滤生成

```bash
# 生成全部模块（默认行为）
pnpm db:generate-seed

# 生成指定模块
pnpm db:generate-seed --module community
pnpm db:generate-seed --module community,patrol,setting

# 列出可用模块
pnpm db:generate-seed --list-modules
```

**依赖检查策略**: 报错提示依赖缺失

- 当用户只生成 `patrol` 模块时，如果 `00-community.sql` 文件不存在
- 系统 SHALL 输出错误：`Error: patrol 依赖 community 模块，请先生成 community`
- 用户需要手动确保依赖模块已生成

**理由**: 简单可靠，让用户明确了解模块依赖关系

### 7. 清理功能策略

**决策**: 支持 `--clean` 参数，执行全量清理

```bash
# 只执行清理
pnpm db:seed --clean-only

# 清理后重新导入全部数据
pnpm db:seed --clean

# 清理后导入指定模块
pnpm db:seed --clean --module community,patrol
```

**清理脚本** (`_clean.sql`):

```sql
-- =============================================
-- 数据库清理脚本 - 按外键依赖逆序删除
-- 警告：此操作将删除所有种子数据！
-- =============================================

BEGIN;

-- 使用 TRUNCATE CASCADE 快速清理
TRUNCATE TABLE pt_patrol_task_details CASCADE;
TRUNCATE TABLE pt_patrol_tasks CASCADE;
TRUNCATE TABLE pt_patrol_items CASCADE;
TRUNCATE TABLE pt_patrol_points CASCADE;
TRUNCATE TABLE pt_patrol_paths CASCADE;
TRUNCATE TABLE pt_patrol_plans CASCADE;
-- ... 更多表，按依赖逆序
TRUNCATE TABLE cm_communities CASCADE;

COMMIT;
```

**清理范围**: 全量清理

- `--clean` 始终清理所有表，然后导入指定模块
- 不支持按模块清理（复杂度高，易出错）

**理由**: 简单可靠，避免部分清理导致的数据不一致

### 8. Git 版本控制策略

**决策**: 生成的 SQL 文件纳入 Git 版本控制

**不包含时间戳**:

- SQL 文件中不包含生成时间戳
- 只有数据变化时才产生 Git diff
- 避免无意义的提交

**SQL 文件头部**:

```sql
-- =============================================
-- 模块: community
-- 说明: 社区管理模块种子数据
-- =============================================

BEGIN;

-- 小区信息表
INSERT INTO cm_communities (...) VALUES (...);

COMMIT;
```

**理由**: 便于代码审查，只有实际数据变化才产生 diff

### 9. 命令行脚本配置

**决策**: 在 package.json 中配置完整的命令

```json
{
	"scripts": {
		"db:generate-seed": "npx tsx server/db/generate-seed-sql.ts",
		"db:seed": "npx tsx server/db/run-seed-sql.ts"
	}
}
```

**generate-seed-sql.ts 参数**:

- `--module <name>`: 只生成指定模块（可逗号分隔多个）
- `--list-modules`: 列出所有可用模块

**run-seed-sql.ts 参数**:

- `--clean`: 清理后重新导入
- `--clean-only`: 只执行清理，不导入数据
- `--module <name>`: 只导入指定模块（可逗号分隔多个）

**理由**: 分离生成和执行，便于调试和代码审查

## Risks / Trade-offs

### 已识别的风险

|                    风险                    | 严重性 |                        缓解措施                         |
| :----------------------------------------: | :----: | :-----------------------------------------------------: |
|    Mock 数据字段与数据库字段不完全匹配     |   中   | 编写详细的字段映射逻辑，对缺失字段使用合理默认值或 NULL |
|                SQL 注入风险                |   高   |         使用 `escapeSql()` 函数转义所有字符串值         |
|            外键 ID 引用处理复杂            |   中   |    使用确定性 UUID 生成函数，基于 mock ID 和表名生成    |
|            生成的 SQL 文件过大             |   低   |        分模块生成多个 SQL 文件，单个文件不会太大        |
|          更新 mock 数据需重新生成          |   低   |        这是一次性生成的设计特点，适合初始化场景         |
|        Mock 数据中的日期格式不统一         |   中   |          使用健壮的日期解析函数，支持多种格式           |
|  Mock 数据的 orgId 格式不一致（如 "2-1"）  |   高   |     需要特殊处理树形结构 ID，建立完整的父子 ID 映射     |
| 部分 mock 数据缺少对应的 mock-data.ts 文件 |   中   |     生成前验证 mock 数据是否存在，缺失时跳过并警告      |

### 新发现的潜在问题

#### 1. 树形结构 ID 映射问题

**问题描述**:

在 `staff-info/mock-data.ts` 中发现：

```typescript
{
  id: "1",
  orgId: "2-1",   // 这是树形结构的 ID 格式
  orgName: "客服中心",
}
```

但数据库的 `smOrganizations` 表使用 UUID 作为主键。

**影响**:

- 需要建立 `"2-1"` 到实际 UUID 的映射
- 组织架构可能需要先插入父节点再插入子节点

**缓解措施**:

- 在 `setting.ts` 模块中特殊处理组织架构的树形 ID
- 使用 `generateUuid("sm_organizations", "2-1")` 生成确定性 UUID

#### 2. 字段名不一致问题

**问题描述**:

| Mock 数据字段 |  数据库字段   |       说明       |
| :-----------: | :-----------: | :--------------: |
|   `address`   | `homeAddress` | 员工表字段名不同 |
|   `orgName`   |     (无)      | 冗余字段，不入库 |
| `createTime`  | `created_at`  | 时间戳字段名不同 |
| `updateTime`  | `updated_at`  | 时间戳字段名不同 |

**缓解措施**:

- 在每个模块的转换函数中显式处理字段映射
- 忽略冗余字段（如 `orgName`）

#### 3. 部分表可能缺少对应的 mock 数据

**问题描述**:

108 个 mock-data.ts 文件可能不覆盖所有 schema 表。

**缓解措施**:

- 生成前扫描 mock 文件，列出缺失的表
- 缺失的表跳过并在日志中警告
- 后续可按需补充 mock 数据

## Migration Plan

1. 在 `apps/admin/server/db/` 目录下创建 `seed-sql/` 子目录
2. 创建 `seed-sql/utils.ts` 公共工具文件（SQL 转义、枚举映射等）
3. 创建 `seed-sql/types.ts` 类型定义文件
4. 创建 `seed-sql/id-map.ts` ID 映射管理文件
5. 创建 `drizzle/seed/` 目录
6. 按依赖层级顺序创建各模块的 SQL 生成文件
7. 创建 `generate-seed-sql.ts` 主入口文件（支持 `--module` 和 `--list-modules`）
8. 创建 `run-seed-sql.ts` SQL 执行脚本（支持 `--clean` 和 `--clean-only`）
9. 在 `package.json` 中配置脚本命令
10. 运行 `pnpm db:generate-seed` 生成 SQL 文件
11. 将生成的 SQL 文件提交到 Git
12. 运行 `pnpm db:seed` 执行导入并验证

## Open Questions

~~1. 是否需要支持增量生成（只生成特定模块的 SQL）？~~
**已解决**: 支持 `--module` 参数

~~2. 生成的 SQL 文件是否应该纳入 git 版本控制？~~
**已解决**: 纳入 Git 版本控制，不包含时间戳

~~3. 是否需要添加 `--clean` 参数支持在导入前清空现有数据？~~
**已解决**: 支持 `--clean` 和 `--clean-only` 参数，执行全量清理
