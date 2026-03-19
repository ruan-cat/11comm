# Seed 系统重构计划

> 创建日期: 2026-03-19
> 状态: 已完成（代码重构完成，待运行时验证）

## 概述

彻底重构 Neon 数据库 seed 系统：删除全部 mock-data 和旧 seed-sql 中间层，建立基于 Drizzle ORM 直接插入的 Direct Seed 架构。

## 核心变更

- **旧架构**: mock-data.ts(108 个) → seed-sql/_.ts(11 个模块,字段映射+枚举转换) → drizzle/seed/_.sql → Neon DB
- **新架构**: seed/modules/\*.seed.ts(直接使用 Insert 类型) → runner.ts(TRUNCATE CASCADE + 按序插入) → Neon DB

## 两个命令

| 命令       | 行为                                                         | 适用场景                   |
| ---------- | ------------------------------------------------------------ | -------------------------- |
| `db:seed`  | TRUNCATE 全部数据 → 重新填充                                 | 改了 seed 数据，表结构没变 |
| `db:reset` | DROP 全部表 → 清除迁移历史 → 从 schema 重推表结构 → 填充数据 | 改了 schema，想从零开始    |

## 实施阶段

### Phase 1: 构建新 Seed 基础设施 ✅

- [x] `apps/admin/server/db/seed/helpers.ts` — sid(), defineSeed(), SeedModule 接口
- [x] `apps/admin/server/db/seed/runner.ts` — TRUNCATE CASCADE + 拓扑排序 + 按序执行
- [x] `apps/admin/server/db/seed/index.ts` — 入口脚本，支持 --reset 参数
- [x] `apps/admin/server/db/seed/modules/_registry.ts` — 模块注册表

### Phase 2: 迁移 Seed 数据（11 个模块） ✅

- [x] `dev.seed.ts` — 开发环境基础数据
- [x] `community.seed.ts` — 社区、公告、装修登记等
- [x] `setting.seed.ts` — 组织、员工、角色、权限、班次等
- [x] `house-property.seed.ts` — 房屋、业主、楼栋等
- [x] `operation.seed.ts` — 商户、活动等
- [x] `contract.seed.ts` — 合同
- [x] `parking.seed.ts` — 停车场、车位、车卡
- [x] `expense.seed.ts` — 费项、账单
- [x] `patrol.seed.ts` — 巡检路线、任务
- [x] `repairs.seed.ts` — 报修工单
- [x] `report.seed.ts` — 报表

### Phase 3: 删除旧文件 ✅

- [x] 删除 `apps/admin/server/api/**/mock-data.ts`（108 个）
- [x] 删除 `apps/admin/server/db/seed-sql/` 整个目录
- [x] 删除 `apps/admin/drizzle/seed/*.sql`
- [x] 删除 `apps/admin/scripts/generate-seed-sql.ts`
- [x] 删除 `apps/admin/scripts/run-seed-sql.ts`
- [x] 更新 `apps/admin/package.json` scripts

### Phase 4a: 更新 Skills 文档 ✅

- [x] 重写 `.claude/skills/schema-and-seed-guardian/SKILL.md` Seed 部分
- [x] 更新 `.claude/skills/schema-change-sync/SKILL.md` 第 7 步
- [x] 更新 `.claude/skills/neon-db-query/SKILL.md` 描述
- [x] 更新 `.claude/skills/nitro-api-development/SKILL.md` 删除 mock 引用
- [x] 删除 `.claude/skills/nitro-api-development/references/mock-mode.md`
- [x] 删除 `.claude/skills/nitro-api-development/references/mock-to-neon-migration.md`
- [x] 删除 `.claude/commands/migrate-static-data-to-nitro-query.md`

### Phase 4b: 更新项目文档 ✅

- [x] 更新 `CLAUDE.md` seed 相关描述
- [x] 更新 `AGENTS.md` 同步
- [x] 重写 `apps/admin/src/docs/guides/seed-commands.md`
- [x] 新建 `apps/admin/src/docs/guides/schema-workflow.md`

### Phase 5: 验证 ✅

- [x] Lint 检查 — 无错误
- [x] mock-data 引用检查 — 零残留
- [x] 文件完整性检查 — 15 个新文件全部就位
- [ ] `pnpm db:reset` 核弹级重置验证 — 需运行时验证
- [ ] `pnpm db:seed` 数据重填验证 — 需运行时验证

## 新 Seed 模块编写模式

```typescript
// modules/community.seed.ts
import type { NewCmCommunity } from "@01s-11comm/type";
import { cmCommunities } from "@01s-11comm/type";
import { defineSeed, sid } from "../helpers";

export default defineSeed({
	name: "community",
	dependencies: [],
	async seed(db) {
		await db.insert(cmCommunities).values([
			{
				id: sid("community", "sunshine"),
				name: "阳光花园",
				address: "建设路88号",
				status: "enabled",
			},
		]);
	},
});
```

## 关键设计决策

1. **TRUNCATE CASCADE** — 一次清全部，永远不会有 key 冲突
2. **sid()** — 确定性 UUID，相同 (scope,key) 永远生成相同 UUID
3. **直接 Insert 类型** — 改 schema 后 TypeScript 编译器直接报错
4. **consola** — 替代 console 做日志输出
5. **无 SQL 文件中间层** — 直接 Drizzle ORM insert
