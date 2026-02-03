# 2026-02-03 Neon + Drizzle 数据库初始化方案探索报告

## 1. 背景

项目当前拥有 108 个 `mock-data.ts` 文件，提供了丰富的模拟业务数据。为了实现 Neon PostgreSQL 数据库的初始化，需要选择合适的技术方案。

本报告对比分析了多种可行的数据库初始化方案，供技术决策参考。

## 2. 当前规范审查

### 2.1. 已创建的变更

变更名称：`analyze-mock-data-and-create-db-seed`

位置：`openspec/changes/analyze-mock-data-and-create-db-seed/`

### 2.2. 规范优点

|       优点       |                说明                |
| :--------------: | :--------------------------------: |
|  模块化设计合理  | 与现有 `schemas/` 目录结构保持一致 |
| 外键依赖处理正确 |     分层插入策略确保数据完整性     |
| 字段映射考虑全面 | 覆盖枚举值转换、日期解析、ID 映射  |

### 2.3. 潜在问题

```plain
┌─────────────────────────────────────────────────────────────────┐
│                      当前方案的复杂性                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   108 个 mock-data.ts ──┬──► 11 个 seed 模块 ──► seed.ts       │
│                         │                                       │
│   需要处理：            │                                       │
│   • 字段名映射          │   工作量估计：                        │
│   • 枚举值转换          │   • 44 个任务                         │
│   • ID 映射管理         │   • 大量重复的转换代码                │
│   • 外键依赖顺序        │   • 维护成本高                        │
│                         │                                       │
└─────────────────────────────────────────────────────────────────┘
```

## 3. 可选方案对比

### 3.1. 方案总览

|       方案        |              核心思路               | 工作量 | 维护成本 | 数据真实感 |
| :---------------: | :---------------------------------: | :----: | :------: | :--------: |
|   A: 手写 Seed    |       复用现有 mock 数据入库        |   高   |    高    |     高     |
|  B: drizzle-seed  |     使用官方包自动生成种子数据      |   低   |    低    |     中     |
|    C: SQL 导入    | 一次性生成 SQL 文件，直接导入数据库 |   中   |    低    |     高     |
| D: Neon Branching |   利用 Neon 分支特性管理测试数据    |   低   |   极低   |     高     |

### 3.2. 方案 A: 手写 Seed 脚本（当前规范）

**核心思路**：复用现有的 108 个 `mock-data.ts` 文件，编写转换代码将数据插入数据库。

**代码示例**：

```typescript
import { mockStaffInfoData } from "../../api/.../mock-data";
import { smStaff } from "../schemas/setting";

export async function seedSetting(db, idMap) {
	const staffData = mockStaffInfoData.map((item) => ({
		employeeNumber: item.employeeNumber,
		name: item.name,
		gender: genderMap[item.gender], // 中文 -> 英文枚举
		position: item.position,
		email: item.email,
		phone: item.phone,
		homeAddress: item.address, // 字段名映射
		orgId: idMap.get("org", item.orgId), // ID 映射
	}));

	await db.insert(smStaff).values(staffData);
}
```

**优势**：

- 完全控制插入的数据内容
- 复用现有 mock 数据，保持一致性
- 数据具有业务语义，便于测试

**劣势**：

- 需要为每个表编写映射代码
- 工作量大（44 个任务）
- mock 数据结构变化时需要同步更新 seed 代码

### 3.3. 方案 B: drizzle-seed 官方包

**核心思路**：使用 Drizzle 官方提供的 `drizzle-seed` 包，通过声明式配置自动生成种子数据。

**代码示例**：

```typescript
import { seed } from "drizzle-seed";
import * as schema from "./schema";

await seed(db, schema).refine((funcs) => ({
	smStaff: {
		count: 20,
		columns: {
			name: funcs.fullName(),
			gender: funcs.valuesFromArray({ values: ["male", "female"] }),
			position: funcs.jobTitle(),
			email: funcs.email(),
			phone: funcs.phoneNumber({ template: "1##########" }),
		},
	},
	ptPatrolTasks: {
		count: 30,
		with: {
			details: [3, 5, 8], // 每个任务自动关联 3-8 个明细
		},
	},
}));
```

**优势**：

- 代码量极少，配置简洁
- 自动处理外键依赖关系
- 自动生成符合类型约束的数据
- 官方维护，与 Drizzle ORM 完美集成

**劣势**：

- 生成的是随机数据，不是现有的 mock 数据
- 需要安装额外依赖 `drizzle-seed`
- 数据不够"真实"（格式正确但缺乏业务语义）

**安装方式**：

```bash
pnpm add drizzle-seed
```

### 3.4. 方案 C: SQL 导入方案

**核心思路**：将 mock 数据一次性转换为 SQL INSERT 语句，通过 `drizzle-kit` 或 `psql` 直接导入。

**代码示例**：

```sql
-- seed.sql
INSERT INTO cm_communities (id, name, code, address, status) VALUES
  (gen_random_uuid(), '阳光花园小区', 'YG001', '北京市朝阳区xxx', 'enabled'),
  (gen_random_uuid(), '翠苑小区', 'CY001', '北京市海淀区xxx', 'enabled');

INSERT INTO sm_staff (id, employee_number, name, gender, position) VALUES
  (gen_random_uuid(), 'EMP001', '张三', 'male', '物业经理'),
  (gen_random_uuid(), 'EMP002', '李四', 'female', '客服主管');
```

**执行方式**：

```bash
psql $DATABASE_URL -f seed.sql
```

**优势**：

- 一次生成，永久使用
- 不需要运行时依赖
- 可以版本控制 SQL 文件

**劣势**：

- 外键 ID 处理困难（需要使用 CTE 或分步执行）
- SQL 文件可能很大
- 更新数据需要重新生成整个文件

### 3.5. 方案 D: Neon Branching + 快照

**核心思路**：利用 Neon 的分支特性，在一个分支上填充数据作为模板，需要时 fork 新分支。

**工作流程图**：

```plain
┌─────────────────────────────────────────────────────────────────┐
│                    Neon Branching 工作流                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   main branch ───────────────────────────────────────────►     │
│        │                                                        │
│        │ 一次性手动/脚本填充数据                                  │
│        ▼                                                        │
│   seed-template branch (包含所有测试数据)                        │
│        │                                                        │
│        ├──► dev-alice (fork from seed-template)                │
│        ├──► dev-bob (fork from seed-template)                  │
│        └──► staging (fork from seed-template)                  │
│                                                                 │
│   每个开发者获得独立的、预填充的数据库！                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**优势**：

- 零代码维护
- 开发者可以任意修改数据，不影响他人
- 利用 Neon 的分支特性，几乎瞬时创建
- 分支数据可以随时重置到初始状态

**劣势**：

- 需要先创建并填充 seed-template 分支
- 需要 Neon 付费功能（免费版分支数量有限）
- 不适合 CI/CD 环境的自动化测试

## 4. 混合方案建议

考虑到项目实际情况（已有 108 个 mock 文件，需要快速初始化），建议采用**混合方案**：

```plain
┌─────────────────────────────────────────────────────────────────┐
│                        推荐的混合方案                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  第一阶段：简化版手写 Seed + drizzle-seed 辅助                    │
│  ════════════════════════════════════════════                   │
│                                                                 │
│  1. 核心业务数据：手写 seed（保持数据一致性）                       │
│     • cm_communities (小区) ← 其他表都依赖它                     │
│     • sm_organizations, sm_staff (组织架构)                     │
│     • hp_owners (业主信息)                                      │
│                                                                 │
│  2. 衍生/测试数据：使用 drizzle-seed 生成                         │
│     • pt_patrol_* (巡检相关，数据量大)                           │
│     • cm_notices (公告)                                         │
│     • 其他非核心模块                                             │
│                                                                 │
│  预期效果：                                                      │
│  • 减少 70% 的手写代码量                                         │
│  • 保持核心数据的"真实感"                                        │
│  • 快速生成大量测试数据                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.1. 分层策略

|  层级  |          包含内容          |    初始化方式     |           理由           |
| :----: | :------------------------: | :---------------: | :----------------------: |
| 第一层 |    小区、组织架构、员工    |  手写 seed 脚本   | 核心基础数据，需要一致性 |
| 第二层 |       业主、房屋信息       |  手写 seed 脚本   |       业务关键数据       |
| 第三层 | 巡检、报修、合同等业务数据 | drizzle-seed 生成 |   数据量大，格式要求低   |
| 第四层 |    报表、配置等辅助数据    |   可选/按需填充   |        非必需数据        |

## 5. 当前规范优化建议

如果决定继续使用**手写 Seed 方案**，建议以下优化：

### 5.1. 简化映射逻辑

创建通用的转换函数，自动处理常见的字段映射：

```typescript
// seed/utils.ts
export function transformMockData<T, R>(data: T[], mapping: Record<keyof R, keyof T | ((item: T) => any)>): R[] {
	return data.map((item) => {
		const result = {} as R;
		for (const [targetKey, sourceKeyOrFn] of Object.entries(mapping)) {
			if (typeof sourceKeyOrFn === "function") {
				result[targetKey] = sourceKeyOrFn(item);
			} else {
				result[targetKey] = item[sourceKeyOrFn];
			}
		}
		return result;
	});
}
```

### 5.2. 减少模块数量

不需要为每个 schema 模块都创建单独的 seed 文件。可以合并为：

- `seed-core.ts` - 小区、组织、员工、业主（核心基础数据）
- `seed-business.ts` - 巡检、报修、合同等业务数据

### 5.3. 优先级排序

不需要一次填充所有 108 个 mock 文件。建议分阶段：

|   阶段   |         内容         | 优先级 |
| :------: | :------------------: | :----: |
| 必须填充 | 小区、组织架构、员工 |   高   |
| 常用数据 |   业主、房屋、巡检   |   中   |
| 按需添加 |     其他模块数据     |   低   |

## 6. 待确认问题

在最终确定方案前，需要明确以下问题：

1. **数据的"真实感"有多重要？**
   - 如果只是开发测试，使用 drizzle-seed 生成的随机数据是否可接受？

2. **108 个 mock 文件是否都需要入库？**
   - 还是只需要其中一部分核心数据？

3. **是否有 Neon 付费账号？**
   - 如果有，Branching 方案可能是最省力的选择。

4. **seed 功能的使用频率如何？**
   - 一次性初始化 → 方案 C 或 D 更合适
   - 频繁重置数据库 → 方案 A 或 B 更灵活

## 7. 最终决策

**选定方案：方案 C - SQL 导入方案（使用 Drizzle toSQL）**

### 7.1. 决策理由

1. **一次性生成，永久复用**：SQL 文件生成后可版本控制，不需要频繁维护
2. **利用 Drizzle 类型安全**：使用 `.toSQL()` 方法确保生成的 SQL 与 schema 一致
3. **复用现有 mock 数据**：保持数据的"真实感"和业务语义
4. **便于代码审查**：生成的 SQL 文件可以直接审查和验证

### 7.2. 技术实现要点

```typescript
// 核心技术：使用 Drizzle ORM 的 .toSQL() 方法
import { db } from "../index";
import { cmCommunities } from "../schemas/community";

const insertQuery = db.insert(cmCommunities).values([...mockData]);
const { sql, params } = insertQuery.toSQL();

// 将参数化 SQL 转换为完整 SQL
function toFullSql(sql: string, params: unknown[]): string {
	let result = sql;
	params.forEach((param, index) => {
		const value = typeof param === "string" ? `'${escapeSql(param)}'` : param === null ? "NULL" : String(param);
		result = result.replace(`$${index + 1}`, value);
	});
	return result;
}
```

### 7.3. 已更新的 OpenSpec 文档

- `proposal.md` - 更新为方案 C 的描述
- `design.md` - 完整的 SQL 生成方案设计
- `specs/sql-seed-generation/spec.md` - SQL 生成规范
- `specs/mock-data-transformation/spec.md` - 数据转换规范
- `specs/seed-sql-module-pattern/spec.md` - 模块编写模式规范
- `tasks.md` - 更新为 SQL 生成相关的任务列表（共 48 个任务）

## 8. 参考资源

- [Drizzle ORM toSQL 方法文档](https://orm.drizzle.team/docs/goodies#print-sql-query-with-tosql-method)
- [Drizzle Seed 官方文档](https://orm.drizzle.team/docs/seed-overview)
- [Neon Branching 文档](https://neon.tech/docs/introduction/branching)
- [Neon + Drizzle 迁移指南](https://neon.com/guides/drizzle-migrations)
