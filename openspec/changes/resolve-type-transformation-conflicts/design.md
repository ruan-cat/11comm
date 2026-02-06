# Design: Resolve Type Transformation Conflicts (解决类型改造冲突)

## Context (背景)

本项目正转型为 "Full Stack Type"（全栈类型）架构。一份冲突分析报告 (`2026-02-06-full-stack-type-transformation-conflict-analysis.md`) 指出，我们当前的文档、Skills 和操作指令正在积极强制执行 _相反_ 的模式（静态类型）。这造成了 Agent 困惑和回退的高风险。

## Goals (目标)

1.  **Sanitize Documentation (文档清洗)**：将过时的文档标记为 `[DEPRECATED]` 并指向新的单一事实来源。
2.  **Correct Operational Knowledge (纠正操作知识)**：更新与 `migrate` 和 `seed` 相关的 Skills 和指令，教导 Agent 新的 "Schema First" 工作流。
3.  **Prepare Infrastructure (基础设施准备)**：将 `apps/type` 从静态库升级为具运行时能力的库（仅配置）。
4.  **Eliminate Hardcoded Paths (消除硬编码路径)**：更新全局 Skills (`neon-db-list`) 以反映新的业务路径结构。

## Non-Goals (非目标)

1.  **Migration Implementation (迁移实施)**：移动实际的 Schema 文件超出本范围。这通过 `full-stack-type-transformation` 变更来处理。
2.  **Code Refactoring (代码重构)**：修改现有的 API Handlers 或 Seed 脚本超出本范围（除非为了解决配置冲突而严格必要）。

## Decisions (决策)

### 1. Deprecation Strategy: "Soft Delete" (废弃策略："软删除")

我们不会立即删除旧的 spec 文件以保留上下文。相反，我们将在冲突文件上添加显眼的 **Header Warning (头部警告)**：
`> **[DEPRECATED]** This document is superseded by`openspec/changes/full-stack-type-transformation/design.md`. Do not use.`

需要废弃的文件：

- `openspec/specs/type-system/spec.md`
- `openspec/specs/business-type-migration/spec.md`
- `openspec/specs/db-schema-core/spec.md`
- `apps/admin/src/docs/reports/2026-02-05-full-stack-type-transformation-assessment.md`

### 2. Command Rewrite: `migrate-static-data-to-nitro-query` (指令重写)

当前的指令指示生成 `interface`。我们将重写它，指示生成 `Zod Schema` + `drizzle-zod`。这对 Agent 的“肌肉记忆”是一个关键的语义变更。

### 3. Infrastructure Prep (基础设施准备)

我们将立即修改 `apps/type/package.json` 和 `tsconfig.json`。

- **Why**：这是安全的，因为 `apps/type` 目前在运行时未被使用。现在的准备工作解除了下一个变更实施阶段的阻塞。
- **Change**：移除 `noEmit`，添加 `drizzle-orm`, `zod`。

### 4. Drizzle Config Deferral (Drizzle 配置推迟)

**决策**：我们在本变更中**不会**修改 `apps/admin/drizzle.config.ts`。

- **Reason**：在 Schema 移动之前更改配置指向 `apps/type` 会破坏 `pnpm db:generate`。
- **Constraint**：此修正是委托给 `full-stack-type-transformation` 变更来处理，该变更将处理原子移动。

### 5. Seed Script Import Correction (种子脚本导入修正)

**决策**：我们将批量更新 `apps/admin/server/db/seed-sql/*.ts` 以修复导入。

- **Why**：基础设施升级（任务 3）可能会因为 `apps/type` 的 TypeScript 解析变更而导致构建问题。主动修复这些导入（即使指向可能暂时损坏的路径或使用相对路径）可确保构建系统保持稳定。
- **Note**：这是本变更中允许的**唯一**代码修改。

## Risks / Trade-offs (风险/权衡)

- **Risk**：如果 Agent 忽略头部，可能仍会读取废弃文件。
  - **Mitigation**：我们将验证 `CLAUDE.md` 明确优先考虑新设计。
- **Risk**：`apps/type` 变更可能影响构建管道？
  - **Mitigation**：它是一个独立的工作区。只要 `admin` 还没有从中导入运行时代码（目前没有），它就是安全的。

## Implementation Details (实施细节)

### Skill Updates (Skill 更新)

- `neon-db-list/SKILL.md`：更新 regex/paths 以查阅 `apps/type/src/business`。
- `schema-and-seed-guardian/SKILL.md`：更新指令为 "Modify Schemas in `apps/type`"。

### Spec Updates (Spec 更新)

- 创建 `specs/doc-sanitation/spec.md` 以追踪废弃项。
- 创建 `specs/infra-prep/spec.md` 用于 `apps/type` 配置。
- 创建 `specs/command-correction/spec.md` 用于 `migrate` 指令。
