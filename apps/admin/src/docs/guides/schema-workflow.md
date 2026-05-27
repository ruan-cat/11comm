# Schema → 迁移 → Seed 工作流指南

> 创建日期: 2026-03-19

## 概述

本指南描述从修改数据库 Schema 到数据就绪的完整工作流。

## 工作流图

```plain
修改 Schema (apps/type)
    ↓
生成迁移 (pnpm -F @01s-11comm/api db:generate)
    ↓
执行受控迁移 (pnpm -F @01s-11comm/api db:migrate)
    ↓
按需维护 legacy Seed 数据 (修改 apps/admin/server/db/seed/modules/*.seed.ts)
    ↓
按 legacy 边界填充数据 (pnpm db:seed)
```

## 场景 1：修改现有表的字段

1. 修改 `apps/type/src/business/{domain}/{module}/schema.ts`
2. 运行 `pnpm -F @01s-11comm/api db:generate` 生成迁移文件
3. 审查生成的 `apps/api/drizzle/**` SQL，再运行 `pnpm -F @01s-11comm/api db:migrate` 执行受控迁移
4. TypeScript 编译器会提示 seed 模块中需要修改的地方
5. 如仍需要维护旧 seed source，修改对应的 `apps/admin/server/db/seed/modules/*.seed.ts`
6. 按 legacy 边界运行 `pnpm db:seed` 重新填充数据

## 场景 2：新增一张表

1. 在 `apps/type/src/business/{domain}/{module}/schema.ts` 中定义新表
2. 遵循 Trinity Pattern：Drizzle Table + Zod Schemas + TypeScript Types
3. 确保导出链完整（schema.ts → index.ts → business/index.ts）
4. 运行 `pnpm -F @01s-11comm/api db:generate` 生成迁移
5. 审查生成 SQL 后运行 `pnpm -F @01s-11comm/api db:migrate`
6. 在对应的 `apps/admin/server/db/seed/modules/*.seed.ts` 中添加 legacy seed 数据
7. 如果是全新领域，创建新 `.seed.ts` 文件并在 `_registry.ts` 注册
8. 按 legacy 边界运行 `pnpm db:seed` 验证
9. 更新 `.claude/skills/neon-db-query/SKILL.md` 的表清单

## 场景 3：大幅度重构表结构

当改动较大（如重命名表、合并/拆分表）时：

1. 完成 schema 修改
2. 从 `apps/api` 生成迁移并人工审查 SQL 与风险
3. 仅在明确 legacy seed 维护场景下运行 `pnpm db:reset`，该命令不再作为长期 schema 运维入口

## 关键文件位置

| 用途                 | 路径                                                        |
| -------------------- | ----------------------------------------------------------- |
| Schema 定义          | `apps/type/src/business/{domain}/{module}/schema.ts`        |
| Drizzle 配置         | `apps/api/drizzle.config.ts`                                |
| 迁移文件             | `apps/api/drizzle/`                                         |
| legacy Seed 模块     | `apps/admin/server/db/seed/modules/*.seed.ts`               |
| legacy Seed 基础设施 | `apps/admin/server/db/seed/helpers.ts, runner.ts, index.ts` |

## 注意事项

1. **永远先改 Schema，再改 Seed** — Seed 文件依赖 Schema 的类型定义
2. **legacy Seed 边界** — `db:seed` 会清空全部数据再重填，只能在明确旧 seed source 维护场景中使用
3. **确定性 UUID** — `sid()` 保证多次运行结果一致
4. **参考 schema-change-sync 技能** — 确保改表后全项目同步更新
