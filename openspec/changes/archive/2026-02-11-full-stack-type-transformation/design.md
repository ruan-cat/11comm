## Context

根据 `2026-02-06` 的最终评估报告，我们确定了在 Monorepo 架构下实现全栈类型统一的最佳路径。当前架构中，Database Schema (Drizzle) 位于 `apps/admin` 后端，而共享类型位于 `apps/type`。这种分离导致了同步困难和代码冗余。

## Goals

1.  **单一数据源 (SSOT)**: 确保 Database Table, Zod Runtime Schema, 和 TypeScript Type 全部源自同一个文件定义。
2.  **原地改造 (In-Place Transformation)**: 直接升级 `apps/type` 项目，保留其现有的包名和引用关系，避免创建新的 `packages/shared` 带来不必要的 Monorepo 结构变动。
3.  **业务内聚 (Business Cohesion)**: Schema 定义必须下沉到具体的业务目录 (`src/business/**/schema.ts`)，而不是集中在顶层的 `db` 文件夹。
4.  **平滑迁移 (Zero-Downtime Migration)**: 使用影子迁移策略，确保迁移过程中随时可以构建和运行。

## Non-Goals

1.  **tRPC**: 明确**不引入** tRPC。根据分析报告，tRPC 对现有 Nitro + Axios 架构侵入性过高。我们将采用 "Nitro + Zod" 的轻量级方案达到 80% 的 tRPC 效果。
2.  **Monorepo 重构**: 不调整 `apps/` vs `packages/` 的顶层结构。

## Decisions

### 1. 架构模式：三位一体 Schema (The Trinity Schema)

每个业务实体的定义的 `schema.ts` 文件必须严格包含三个部分：

- **Part A (DB)**: `const table = pgTable(...)`
- **Part B (Zod)**: `const insertSchema = createInsertSchema(...)`
- **Part C (Type)**: `type Model = z.infer<typeof ...>`

拒绝将 DB 定义与 Zod 定义分离在不同文件的做法，以保证修改的原子性。

### 2. 目录结构：业务路径优先 (Business Path First)

引用 `2026-02-06` 报告的修正决策：**否定** `src/schemas` 集中式存放的方案。

**Decision**:
Schema 文件必须存放在 `apps/type/src/business/<domain>/<module>/schema.ts`。
这确保了 Schema 与该业务模块的其他常量、辅助函数物理在一起，符合领域驱动设计 (DDD)。

### 3. 迁移策略：影子迁移 (Shadow Migration)

为了避免 "Stop the World"式的重构，我们将：

1.  **Duplicate**: 在 `apps/type` 中复制 Drizzle 表定义。
2.  **Co-exist**: 此时 `admin` 仍使用旧定义，`type` 拥有新定义。
3.  **Switch**: 修改 `admin` 的 `drizzle.config.ts` 和 `db/index.ts` 指向 `type`。
4.  **Prune**: 删除 `admin` 中的旧定义。

### 4. 依赖管理

`apps/type` 将被视为同构库 (Isomorphic Library)。

- **Dependencies**: `drizzle-orm`, `zod`, `drizzle-zod` 必须添加到 `dependencies` 字段（非 `devDependencies`）。
- **Build**: 确保 `package.json` 的 `exports` 或 `main` 字段正确指向源码 (TS) 或编译产物 (JS/DTS)，在此 monorepo 中，主要依赖 Vite/TS 去解析源码。

### 5. drizzle-zod 集成策略：混合模式 (Hybrid Pattern)

> **Decision Date**: 2026-02-11
> **背景**: 在试点迁移 (Phase 2) 中发现 drizzle-zod 的类型系统与标准 Zod 存在兼容性问题。

**问题**: `createInsertSchema()` 返回的是 drizzle-zod 内部的特殊 ZodObject 变体。对其链式调用 `.partial().extend()` 后，生成的类型与标准 `z.ZodTypeAny` 约束不兼容，无法通过 TypeScript 编译。

**被否决的方案**:

1. ~~使用 `as unknown as z.ZodTypeAny` 类型断言~~ — 属于代码坏味道，掩盖真实类型不安全。
2. ~~完全放弃 drizzle-zod~~ — 丧失 Insert/Select Schema 自动推导能力。
3. ~~降级 drizzle-zod 版本~~ — 旧版本缺少函数回调等新特性。

**Decision — 混合模式 (Hybrid Pattern)**:

- **Insert Schema**: 使用 `createInsertSchema()` 自动生成 — 利用 drizzle-zod 的自动推导和类型安全。
- **Select Schema**: 使用 `createSelectSchema()` 自动生成 — 保持与数据库字段的一致性。
- **Update Schema**: 手动使用 `z.object()` 定义 — 完全的类型安全，无需断言。
- **Select/Insert Types**: 使用 Drizzle 的 `$inferSelect` / `$inferInsert` 推导。
- **Update Types**: 使用 `z.infer<typeof updateSchema>` 从手动 Schema 推导。

**优势**:

1. Insert/Select 仍享受 drizzle-zod 的自动推导（字段类型、约束自动映射）。
2. Update Schema 完全类型安全，无需任何断言。
3. 所有 Schema 在运行时均可正常 `.parse()` / `.safeParse()`。
4. 后续 drizzle-zod 修复兼容性问题后，可无缝回迁。

## Risks & Mitigations

- **Risk**: 前端引入 `drizzle-orm` 可能导致打包错误（如 Node.js polyfill 问题）。
  - **Mitigation**: 只使用 `drizzle-orm/pg-core` 等纯 SQL 构建模块，严禁在 `schema.ts` 中引入 `drizzle-orm/node-postgres` 或数据库连接池代码。
- **Risk**: Date 对象序列化问题。
  - **Mitigation**: 在 Zod Schema 中使用 `z.preprocess` 或手动定义的 DTO Schema 来处理 API 返回的 JSON 字符串化后的日期字段。
- **Risk**: drizzle-zod 返回的 ZodObject 变体与标准 Zod 类型系统不完全兼容。
  - **Mitigation**: 采用混合模式 (Hybrid Pattern)。Insert/Select 使用 drizzle-zod 自动生成，Update 手动使用 `z.object()` 定义。详见 Decision 5 和 `specs/schema-standard/spec.md` Section 5。
