# Schema → 迁移 → Seed 工作流指南

> 创建日期: 2026-03-19
> 当前口径: 数据库 Schema、迁移、Seed 与 Nitro 运维入口统一收敛到 `apps/api`。

## 概述

本指南描述从修改数据库 Schema 到迁移和种子数据维护的现行工作流。`apps/admin/server/**` 只作为 legacy source 或历史兼容参考，不再作为当前 DB、Nitro 或 seed 运维入口。

## 工作流图

```plain
修改 Schema (apps/type)
    ↓
生成迁移 (pnpm -F @01s-11comm/api db:generate)
    ↓
审查 SQL (apps/api/drizzle/**)
    ↓
执行受控迁移 (pnpm -F @01s-11comm/api db:migrate)
    ↓
按需维护 apps/api seed 入口
    ↓
只读预检 (pnpm -F @01s-11comm/api run db:seed:dry-run)
```

## 场景 1：修改现有表字段

1. 修改 `apps/type/src/business/{domain}/{module}/schema.ts`。
2. 运行 `pnpm -F @01s-11comm/api db:generate` 生成迁移文件。
3. 审查 `apps/api/drizzle/**` 中生成的 SQL。
4. 运行 `pnpm -F @01s-11comm/api db:migrate` 执行受控迁移。
5. 如需 seed 预检，运行 `pnpm -F @01s-11comm/api run db:seed:dry-run`。

## 场景 2：新增一张表

1. 在 `apps/type/src/business/{domain}/{module}/schema.ts` 中定义新表。
2. 遵循 Trinity Pattern：Drizzle Table + Zod Schemas + TypeScript Types。
3. 确保导出链完整：`schema.ts` → `index.ts` → `business/index.ts`。
4. 运行 `pnpm -F @01s-11comm/api db:generate` 生成迁移。
5. 审查生成 SQL 后运行 `pnpm -F @01s-11comm/api db:migrate`。
6. 如需要种子数据，优先在 `apps/api/server/db/seed/**` 的现行边界内维护。
7. 更新 `.claude/skills/neon-db-query/SKILL.md` 的表清单。

## 场景 3：大幅重构表结构

当改动较大，例如重命名表、合并表或拆分表时：

1. 完成 schema 修改。
2. 从 `apps/api` 生成迁移并人工审查 SQL 与风险。
3. 使用 `pnpm -F @01s-11comm/api db:migrate` 执行受控迁移。
4. 禁止把 admin legacy reset/seed 当作长期 schema 运维入口。

## 关键文件位置

| 用途               | 路径                                                 |
| ------------------ | ---------------------------------------------------- |
| Schema 定义        | `apps/type/src/business/{domain}/{module}/schema.ts` |
| Drizzle 配置       | `apps/api/drizzle.config.ts`                         |
| 迁移文件           | `apps/api/drizzle/`                                  |
| 现行 Seed 入口     | `apps/api/server/db/seed/index.ts`                   |
| legacy seed source | `apps/admin/server/db/seed/**`，仅作历史兼容参考     |

## 注意事项

1. **永远先改 Schema，再生成迁移**：迁移文件由 `apps/api` 的 Drizzle 配置读取 `apps/type`。
2. **Seed 不再走 admin 权威入口**：admin 旧 seed 只能描述为 legacy source。
3. **先审查 SQL 再迁移**：不要跳过 `apps/api/drizzle/**` 的人工审查。
4. **参考 schema-change-sync 技能**：确保改表后全项目同步更新。
