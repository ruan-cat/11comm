# 指令修正规范 (Command Correction Specification)

## ADDED Requirements (新增需求)

### Requirement: Schema-First Migration Command (Schema 优先迁移指令)

`migrate-static-data-to-nitro-query` 指令必须指导 Agent 纯粹生成 Zod Schemas 和 Drizzle Tables，而不是 TypeScript Interfaces。

#### Scenario: Step 1 Instruction Update (第一步指令更新)

- **WHEN** 执行迁移指令的 Step 1 时
- **THEN** 指令必须是 "创建包含 `pgTable` 和 `createInsertSchema` 的 `schema.ts`"
- **AND** 指令绝不能是 "创建包含 `interface` 的 `types.ts`"

### Requirement: CLAUDE.md Memory Update (CLAUDE.md 记忆更新)

AI 的核心记忆文件必须更新以反映新的 "Schema First" 原则。

#### Scenario: Deprecate Section 4.1 (废弃 4.1 章节)

- **WHEN** 读取 `CLAUDE.md` 第 4.1 节 (禁止修改规则) 时
- **THEN** 它必须明确豁免 "Full Stack Type Transformation" 相关活动
- **OR** 它必须重写以支持 "Refactoring" (重构)

#### Scenario: Define Apps/Type (定义 Apps/Type)

- **WHEN** 读取 `CLAUDE.md` 定义部分时
- **THEN** `apps/type` 的描述必须更新为 "Isomorphic Schema Library" (同构 Schema 库)
