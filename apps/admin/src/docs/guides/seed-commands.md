# 数据库 Seed 命令指南

> 更新日期: 2026-03-19
> 当前口径: Seed 命令统一通过 `@01s-11comm/api` 执行。

## 概述

项目历史上使用过 `apps/admin/server/db/seed/**` 的 Direct Seed 架构。当前数据库 schema 迁移、Neon 运维和 seed CLI 已经迁到 `apps/api`。本文只记录现行 `apps/api` 命令；admin 旧 seed 只能作为 legacy source 或历史兼容参考，不再作为现行运维入口。

## 现行命令

### `pnpm -F @01s-11comm/api run db:seed:dry-run`

只读预检，不会写入数据库。用于确认 seed CLI、数据库 URL 解析和包入口是否可用。

```bash
pnpm -F @01s-11comm/api run db:seed:dry-run
```

### `pnpm -F @01s-11comm/api run db:seed`

调用 `apps/api/server/db/seed/index.ts`。当前实现默认 fail-closed：未显式满足 live seed 条件时不会写库，避免误把历史 admin seed 当作生产运维入口。

```bash
pnpm -F @01s-11comm/api run db:seed
```

## 文件结构

```plain
apps/api/server/db/seed/
└── index.ts              # apps/api seed CLI 入口，支持 --dry-run 等受控模式
```

历史兼容参考：

```plain
apps/admin/server/db/seed/**  # legacy source，仅用于历史对照，不作为现行入口
```

## 新增表的 Seed 数据流程

1. 在 `apps/type` 中定义 schema（Trinity Pattern）。
2. 运行 `pnpm -F @01s-11comm/api db:generate` 生成迁移。
3. 审查 `apps/api/drizzle/**` 中生成的 SQL。
4. 运行 `pnpm -F @01s-11comm/api db:migrate` 执行受控迁移。
5. 如需 seed 预检，运行 `pnpm -F @01s-11comm/api run db:seed:dry-run`。
6. 如需新增真实 seed 写入逻辑，必须落在 `apps/api/server/db/seed/**`，并保持 fail-closed 或显式执行开关。

## 关键约定

- **入口归属**：现行 seed CLI 属于 `@01s-11comm/api`。
- **数据库 URL**：由 `apps/api` 解析 `comm_admin_11__DATABASE_URL`、`NITRO_DATABASE_URL`、`DATABASE_URL` 等环境变量。
- **admin legacy 边界**：`apps/admin/server/db/seed/**` 不再用于新迁移、生产 schema 修复、readiness 或 drift 诊断。
- **破坏性操作**：不要使用 admin 旧 reset/seed 作为长期 DB 运维方式。
