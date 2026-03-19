# 数据库 Seed 命令指南

> 更新日期: 2026-03-19

## 概述

项目使用 Direct Seed 架构管理数据库种子数据。Seed 模块直接使用 Drizzle ORM 的 Insert 类型定义数据，通过 `db.insert()` 直接插入数据库，无中间 SQL 文件层。

## 命令

### `pnpm db:seed` — 数据重填

在现有数据库结构上重新填充数据：

1. TRUNCATE CASCADE 清空全部表数据
2. 按依赖顺序逐模块插入数据

适用场景：修改了 seed 数据内容，但表结构没有变化。

### `pnpm db:reset` — 核弹级重置

从零重建整个数据库：

1. DROP 全部表（DROP SCHEMA public CASCADE）
2. 清除本地迁移历史
3. 从 schema 重新推送表结构（drizzle-kit push）
4. 填充全部种子数据

适用场景：修改了 schema 表结构，想要完全从零开始。

## 文件结构

```plain
apps/admin/server/db/seed/
├── index.ts              # 入口脚本，支持 --reset 参数
├── runner.ts             # 执行引擎：TRUNCATE + 拓扑排序 + 按序执行
├── helpers.ts            # sid() 确定性UUID、defineSeed() 类型工具
└── modules/
    ├── _registry.ts      # 模块注册表
    ├── dev.seed.ts       # 开发环境基础数据
    ├── community.seed.ts # 社区管理
    ├── setting.seed.ts   # 组织/角色/权限/班次
    ├── house-property.seed.ts  # 房屋/业主
    ├── operation.seed.ts # 运营/商户
    ├── contract.seed.ts  # 合同
    ├── parking.seed.ts   # 停车
    ├── expense.seed.ts   # 费用
    ├── patrol.seed.ts    # 巡检
    ├── repairs.seed.ts   # 报修
    └── report.seed.ts    # 报表
```

## 模块依赖层级

```plain
Layer 0: dev, community
Layer 1: setting, house-property, operation
Layer 2: contract, parking
Layer 3: expense, patrol, repairs
Layer 4: report
```

Runner 会自动按依赖顺序执行，无需手动管理。

## 新增表的 Seed 数据流程

1. 在 `apps/type` 中定义 schema（Trinity Pattern）
2. 运行 `pnpm -F @01s-11comm/type db:generate` 生成迁移
3. 运行 `pnpm db:push` 或 `pnpm db:migrate` 推送到数据库
4. 在对应的 `.seed.ts` 模块中添加 `db.insert(table).values([...])`
5. 运行 `pnpm db:seed` 验证

如果是全新领域，创建新的 `.seed.ts` 文件并在 `_registry.ts` 中注册。

## Seed 模块编写模式

```typescript
import { someTable } from "@01s-11comm/type";
import { defineSeed, sid } from "../helpers";

export default defineSeed({
	name: "module-name",
	dependencies: ["dependency-module"],
	async seed(db) {
		await db.insert(someTable).values([
			{
				id: sid("scope", "key"),
				name: "数据名称",
				status: "enabled",
			},
		]);
	},
});
```

### 关键约定

- **sid(scope, key)**: 确定性 UUID，相同参数永远生成相同 ID
- **跨模块引用**: 使用相同的 `sid()` 调用确保外键一致
- **枚举值**: 直接使用英文值（`"enabled"` 而非中文）
- **类型安全**: 数据直接使用 Drizzle Insert 类型，改 schema 后编译器自动报错
