## Context

本项目是基于 vue-pure-admin 的智慧社区管理系统（11comm），采用 pnpm monorepo 架构。后端使用 Nitro v3 框架，数据库选用 Neon Serverless PostgreSQL，ORM 使用 Drizzle ORM。

**当前状态：**

- `apps/type/src/business` 目录已定义 97+ 个业务类型
- `apps/admin/server/api` 目录已实现 92+ 个 Nitro API 端点
- `apps/admin/server/db/schema.ts` 为空，仅包含注释模板
- `db:generate` 命令因缺少表定义而无法使用

**约束条件：**

- 必须兼容 Neon Serverless PostgreSQL
- 必须使用 Drizzle ORM 语法
- 字段命名需与现有 TypeScript 类型保持一致
- 需支持现有 API 接口的数据结构

## Goals / Non-Goals

**Goals:**

1. 定义完整的数据库 schema，使 `db:generate` 命令可正常工作
2. 按业务模块扁平化拆分 schema 文件，提升可维护性
3. 建立 TypeScript 业务类型与数据库表结构的对应关系
4. 提供统一的通用字段（id, createdAt, updatedAt, remark）
5. 支持软删除机制（deletedAt 字段）
6. 定义合理的索引和外键约束

**Non-Goals:**

1. 不涉及数据迁移脚本的编写（由 Drizzle Kit 自动生成）
2. 不涉及 Nitro API 接口的重构
3. 不涉及前端代码的修改
4. 不实现复杂的数据库触发器或存储过程
5. 不包含数据初始化种子脚本

## Decisions

### 1. 文件组织结构

**决策：** 在 `apps/admin/server/db/schemas/` 目录下按业务模块创建独立的 schema 文件。

**备选方案：**

- A) 单一 `schema.ts` 文件包含所有表定义
- B) 按业务模块拆分为多个文件 ✅ 选择

**理由：** 项目有 60+ 个表定义，单一文件将超过 3000 行代码，难以维护。按模块拆分后每个文件约 200-400 行，更易于团队协作和代码审查。

**目录结构：**

```plain
apps/admin/server/db/
├── index.ts              # 数据库连接导出
├── schema.ts             # 统一导出入口
└── schemas/
    ├── common.ts         # 公共枚举和辅助函数
    ├── community.ts      # 社区管理
    ├── house-property.ts # 房产管理
    ├── contract.ts       # 合同管理
    ├── expense.ts        # 费用管理
    ├── parking.ts        # 停车管理
    ├── patrol.ts         # 巡检管理
    ├── repairs.ts        # 报修管理
    ├── report.ts         # 报表管理
    ├── setting.ts        # 设置管理
    ├── operation.ts      # 运营团队
    └── dev.ts            # 开发团队
```

### 2. 主键策略

**决策：** 使用 UUID 作为主键。

**备选方案：**

- A) 自增序列号 (serial)
- B) UUID v4 ✅ 选择
- C) ULID

**理由：**

- UUID 更适合分布式系统，支持客户端生成
- 与现有 TypeScript 类型中 `id: string` 定义一致
- Neon Serverless 环境下避免序列号的并发问题

**实现：**

```typescript
import { uuid } from "drizzle-orm/pg-core";

id: uuid("id").defaultRandom().primaryKey();
```

### 3. 时间戳字段

**决策：** 所有表统一包含 `createdAt` 和 `updatedAt` 字段。

**实现：**

```typescript
import { timestamp } from "drizzle-orm/pg-core";

createdAt: timestamp("created_at").notNull().defaultNow(),
updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date())
```

### 4. 软删除机制

**决策：** 核心业务表支持软删除，使用 `deletedAt` 字段。

**适用范围：**

- 业主信息、合同、费用记录等核心数据表
- 配置类、日志类表不需要软删除

**实现：**

```typescript
deletedAt: timestamp("deleted_at");
```

### 5. 字段命名约定

**决策：** 数据库列名使用 snake_case，TypeScript 属性使用 camelCase。

**实现：**

```typescript
// 数据库列名: contact_phone
// TypeScript 属性: contactPhone
contactPhone: varchar("contact_phone", { length: 20 });
```

Drizzle ORM 会自动处理命名映射。

### 6. 枚举类型处理

**决策：** 使用 PostgreSQL 原生枚举类型处理固定选项字段。

**备选方案：**

- A) 使用 varchar 存储枚举值
- B) 使用 PostgreSQL 原生枚举 ✅ 选择
- C) 使用单独的枚举表

**理由：** PostgreSQL 原生枚举提供类型安全，查询性能更好，且 Drizzle ORM 支持良好。

**实现：**

```typescript
import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["enabled", "disabled"]);
export const genderEnum = pgEnum("gender", ["male", "female"]);
```

### 7. 表命名规范

**决策：** 表名使用 snake_case 复数形式，按模块添加前缀。

**命名格式：** `{module}_{entity}s`

**示例：**

|   模块   | 前缀 |                      示例表名                       |
| :------: | :--: | :-------------------------------------------------: |
| 社区管理 | cm\_ |             cm_communities, cm_notices              |
| 房产管理 | hp\_ |                hp_houses, hp_owners                 |
| 合同管理 | ct\_ |             ct_contracts, ct_templates              |
| 费用管理 | ex\_ |               ex_charges, ex_payments               |
| 停车管理 | pk\_ | pk_parking_lots, pk_carports, pk_parking_structures |
| 巡检管理 | pt\_ |          pt_patrol_tasks, pt_patrol_points          |
| 报修管理 | rp\_ |         rp_repair_orders, rp_return_visits          |
| 设置管理 | sm\_ |                 sm_staff, sm_roles                  |
| 运营团队 | op\_ |             op_merchants, op_companies              |
| 开发团队 | dt\_ |                dt_configs, dt_menus                 |

### 8. 索引策略

**决策：** 为常用查询字段创建索引。

**索引规则：**

1. 主键自动创建唯一索引
2. 外键字段创建普通索引
3. 状态字段创建普通索引
4. 时间字段创建索引（用于排序和范围查询）
5. 常用查询条件字段创建索引

**实现：**

```typescript
import { index } from "drizzle-orm/pg-core";

// 在表定义中
(table) => ({
	statusIdx: index("idx_status").on(table.status),
	createdAtIdx: index("idx_created_at").on(table.createdAt),
});
```

### 9. 外键约束

**决策：** 定义外键关系，使用 `ON DELETE` 和 `ON UPDATE` 级联策略。

**级联策略：**

- 核心关联（如业主-房屋）：`ON DELETE RESTRICT`
- 软关联（如操作人）：`ON DELETE SET NULL`
- 依赖关联（如合同附件）：`ON DELETE CASCADE`

**实现：**

```typescript
import { references } from "drizzle-orm/pg-core";

communityId: uuid("community_id").references(() => communities.id, { onDelete: "restrict" });
```

### 10. 公共辅助函数

**决策：** 创建公共辅助函数简化表定义。

**实现 (`schemas/common.ts`)：**

````typescript
import { timestamp, uuid, text } from "drizzle-orm/pg-core";

/** 通用主键字段 */
export const primaryId = () => uuid("id").defaultRandom().primaryKey();

/** 通用时间戳字段 */
export const timestamps = {
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
};

/** 软删除字段 */
export const softDelete = {
	deletedAt: timestamp("deleted_at"),
};

/** 备注字段 */
export const remarkField = () => text("remark");

### 11. 补丁：新增表定义

**pk_parking_structures (车位结构图表):**
用于存储停车场或车位区域的结构布局图（如 SVG/JSON 数据），对应前端 `parkingSpaceStructureDiagram` 路由。

```typescript
/** 车位结构图表 */
export const pkParkingStructures = pgTable(
	"pk_parking_structures",
	{
		id: primaryId(),
		/** 关联停车场 ID */
		parkingLotId: uuid("parking_lot_id").references(() => pkParkingLots.id).notNull(),
		/** 区域/楼层名称 (B1, B2, A区) */
		regionName: varchar("region_name", { length: 50 }).notNull(),
		/** 结构图数据 (JSON/SVG内容) */
		structureData: text("structure_data"),
		/** 排序号 */
		sortOrder: integer("sort_order").default(0),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("pk_parking_structures_parking_lot_id_idx").on(table.parkingLotId),
	],
);
````

```plain

## Risks / Trade-offs

### 风险

|           风险            | 影响程度 |                   缓解措施                    |
| :-----------------------: | :------: | :-------------------------------------------: |
|  表结构与现有类型不匹配   |    高    | 严格参照 `apps/type` 中的类型定义，逐字段对照 |
| 字段遗漏导致 API 无法工作 |    高    |       对照 API mock 数据验证字段完整性        |
|   索引过多影响写入性能    |    中    |           仅为高频查询字段创建索引            |
| 外键约束导致数据操作失败  |    中    |        合理设置级联策略，测试删除场景         |
|       枚举值不完整        |    低    |    参照 `business-options.ts` 中的选项定义    |

### Trade-offs

|      决策       |           优势           |         劣势         |
| :-------------: | :----------------------: | :------------------: |
|    UUID 主键    | 分布式友好，客户端可生成 |    索引略大于整数    |
|   模块化文件    |      易于维护和协作      |   需要统一导出管理   |
| PostgreSQL 枚举 |    类型安全，查询高效    |  修改枚举值需要迁移  |
|     软删除      |        数据可恢复        | 查询需要额外过滤条件 |
|    表名前缀     |       命名空间清晰       |       表名略长       |

## Migration Plan

### 1. 实施步骤

1. 创建 `schemas/common.ts` 公共模块
2. 按业务模块依次创建 schema 文件
3. 更新 `schema.ts` 统一导出
4. 运行 `pnpm db:generate` 生成迁移文件
5. 运行 `pnpm db:push` 应用到数据库

### 2. 验证步骤

1. 执行 `pnpm db:generate` 确认无报错
2. 检查生成的 SQL 迁移文件
3. 在开发环境运行 `pnpm db:studio` 查看表结构
4. 测试主要 API 接口的数据库操作

### 3. 回滚策略

- Drizzle Kit 支持 `db:drop` 命令删除迁移
- 可通过 git revert 回滚 schema 文件变更
- Neon 支持数据库分支，可在分支上测试后合并

## Open Questions

1. **报表模块是否需要独立的汇总表？**
   - 报表数据可能来自多表关联查询，是否需要物化视图或汇总表待确定

2. **多租户隔离策略？**
   - 当前设计假设单租户，若需支持多租户需增加 tenant_id 字段

3. **审计日志表是否需要？**
   - 是否需要记录数据变更历史（创建人、修改人、操作记录）

4. **附件存储策略？**
   - 附件 URL 存储在数据库，实际文件存储位置（OSS/本地）待确定
```
