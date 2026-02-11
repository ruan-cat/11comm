# Proposal: Resolve Type Transformation Conflicts (解决类型改造冲突)

## Why (背景与动机)

最近的“全栈类型改造 (Full Stack Type Transformation)”计划揭示了项目处于一种严重的“人格分裂”状态。我们面临着旧的“静态类型库”方法（手动接口，`noEmit: true`）与目标的“同构运行时库”方法（Zod + Drizzle，单一数据源）之间的根本冲突。

主要冲突存在于：

1.  **Philosophy (哲学)**：旧规范强制手动定义类型，而新架构要求自动推导。
2.  **Hardcoded Paths (硬编码路径)**：文档和 Skills 指向 `apps/admin/server/db/schemas`（旧位置），阻碍了向 `apps/type/src/business`（新位置）的迁移。
3.  **Operational Commands (操作指令)**：主要的迁移指令（`migrate-static-data-to-nitro-query`）积极地生成旧的静态代码，破坏了改造进程。
4.  **Infrastructure (基础设施)**：`apps/type` 被配置为纯静态库，使得无法运行新的 Schema 代码。

这些冲突必须在实际代码重构**之前**解决（“消毒/Sanitized”），否则 Agent 会被相互矛盾的指令困扰，导致迁移失败。

## What Changes (变更内容)

本变更实施了 `apps/admin/src/docs/reports/2026-02-06-full-stack-type-transformation-conflict-analysis.md` 中的“全面修正计划”。

我们将：

1.  **Deprecate/Archive (废弃/归档)**：推崇旧模式的冲突文档和规范。
2.  **Rewrite (重写)**：关键的操作指令（`migrate-static-data-to-nitro-query`），使其符合新的“Schema First”工作流。
3.  **Correct (修正)**：全局 Skills（`neon-db-list`, `schema-and-seed-guardian`）和 Configs（`drizzle.config.ts`, `package.json`）中的硬编码路径。
4.  **Upgrade (升级)**：`apps/type` 基础设施以支持运行时代码执行（dependencies, tsconfig）。
5.  **Clean (清理)**：冲突的内部报告，建立单一事实来源 (Single Source of Truth)。

## Capabilities (能力变更)

### New Capabilities (新增能力)

- `doc-sanitation`：清理并标记废弃文档，防止 Agent 产生幻觉。
- `infra-upgrade`：升级项目配置文件以支持新的全栈类型架构。

### Modified Capabilities (修改的能力)

- `migrate-static-data-to-nitro-query`：分步指南将更新，指示生成 Zod Schemas 而不是手动 Interfaces。
- `neon-db-list`：该 Skill 将更新为在 `apps/type/src/business/**/schema.ts` 中查找 Schema。
- `schema-and-seed-guardian`：该 Skill 将更新为指向新的 Schema 位置并应用新规则。
- `type-project-organization`：该 Skill 将更新以支持运行时 Schema 导出。

## Impact (影响范围)

- **Documentation**：`docs` 和 `.claude` 中的多个 `.md` 文件将被修改或重命名。
- **Configuration**：`apps/type/package.json`, `apps/type/tsconfig.json`, `apps/admin/drizzle.config.ts`, `apps/admin/server/db/index.ts` 将被修改。
- **Commands**：`/migrate-static-data-to-nitro-query` 的行为将发生根本性变化。
- **Agent Behavior**：未来的 Agent 运行将正确地在 `apps/type` 中查找 Schemas 并生成运行时代码。
